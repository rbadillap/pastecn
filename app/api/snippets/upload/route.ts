import { put, head, BlobNotFoundError } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { validateSnippetId } from '@/lib/validation'
import { hashPassword } from '@/lib/password'
import type { RegistryItemJson } from '@/lib/snippets'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, registryJson, password } = body as {
      id: string
      registryJson: RegistryItemJson
      password?: string
    }

    // Validate ID format
    if (!validateSnippetId(id)) {
      track('upload_error', {
        error_type: 'invalid_id',
        status_code: 400,
      })
      return NextResponse.json(
        { error: 'Invalid snippet ID format' },
        { status: 400 }
      )
    }

    // Check if blob already exists
    try {
      await head(`snippets/${id}.json`)
      // Blob exists - return 409
      track('upload_error', {
        error_type: 'id_collision',
        status_code: 409,
      })
      return NextResponse.json(
        { error: 'ID collision - blob already exists' },
        { status: 409 }
      )
    } catch (error) {
      if (!(error instanceof BlobNotFoundError)) {
        throw error // Re-throw unexpected errors
      }
      // Blob doesn't exist - proceed with upload
    }

    // Hash password if provided and add to meta
    if (password) {
      const hash = await hashPassword(password)
      registryJson.meta = {
        ...registryJson.meta,
        passwordHash: hash,
      }
    }

    // Upload to Vercel Blob
    const blob = await put(`snippets/${id}.json`, JSON.stringify(registryJson), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })

    track('snippet_created', {
      snippet_id: id,
      file_count: registryJson.files.length,
      is_protected: !!password,
    })

    // Return response with blob info and plaintext password (only once)
    return NextResponse.json({
      blob: {
        url: blob.url,
        pathname: blob.pathname,
      },
      ...(password && { password }), // Return plaintext password for user to copy
    })
  } catch (error) {
    // Detect Vercel Blob errors and return semantic status codes
    if (error instanceof Error) {
      const message = error.message.toLowerCase()

      if (message.includes('size') || message.includes('too large')) {
        track('upload_error', {
          error_type: 'size_limit',
          status_code: 413,
        })
        return NextResponse.json(
          { error: 'Content too large' },
          { status: 413 }
        )
      }

      if (message.includes('content type') || message.includes('type')) {
        track('upload_error', {
          error_type: 'content_type',
          status_code: 415,
        })
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 415 }
        )
      }

      if (message.includes('permission') || message.includes('forbidden')) {
        track('upload_error', {
          error_type: 'permission',
          status_code: 403,
        })
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        )
      }
    }

    track('upload_error', {
      error_type: 'unknown',
      status_code: 400,
    })
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
