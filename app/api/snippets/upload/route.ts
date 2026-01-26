import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { hashPassword } from '@/lib/password'
import { generateSnippetId, type RegistryItemJson } from '@/lib/snippets'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { registryJson, password } = body as {
      registryJson: RegistryItemJson
      password?: string
    }

    // Always generate ID server-side (no custom IDs allowed)
    const id = generateSnippetId()

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
      source: 'web',
      file_count: registryJson.files.length,
      is_protected: !!password,
    })

    // Return response with generated ID and blob info
    return NextResponse.json({
      id, // Server-generated ID for client redirect
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
        track('snippet_create_error', {
          source: 'web',
          error_type: 'size_limit',
          status_code: 413,
        })
        return NextResponse.json(
          { error: 'Content too large' },
          { status: 413 }
        )
      }

      if (message.includes('content type') || message.includes('type')) {
        track('snippet_create_error', {
          source: 'web',
          error_type: 'content_type',
          status_code: 415,
        })
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 415 }
        )
      }

      if (message.includes('permission') || message.includes('forbidden')) {
        track('snippet_create_error', {
          source: 'web',
          error_type: 'permission',
          status_code: 403,
        })
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        )
      }
    }

    track('snippet_create_error', {
      source: 'web',
      error_type: 'unknown',
      status_code: 400,
    })
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
