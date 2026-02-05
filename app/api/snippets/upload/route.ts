import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { hashPassword } from '@/lib/password'
import { generateSnippetId, type RegistryItemJson, type ExpirationOption } from '@/lib/snippets'

/**
 * Calculate expiration timestamp from option
 */
function calculateExpiresAt(expiresIn: ExpirationOption): string | undefined {
  if (expiresIn === 'never') return undefined

  const durations: Record<string, number> = {
    '10s': 10 * 1000, // Local testing only
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }

  return new Date(Date.now() + durations[expiresIn]).toISOString()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { registryJson, password, expiresIn } = body as {
      registryJson: RegistryItemJson
      password?: string
      expiresIn?: ExpirationOption
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

    // Set expiration if provided
    if (expiresIn && expiresIn !== 'never') {
      const expiresAt = calculateExpiresAt(expiresIn)
      if (expiresAt) {
        registryJson.meta = {
          ...registryJson.meta,
          expiresAt,
        }
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
      expires_in: expiresIn || 'never',
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
