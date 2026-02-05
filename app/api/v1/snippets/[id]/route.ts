import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { validateSnippetId } from '@/lib/validation'
import {
  getSnippet,
  getSnippetMetadata,
  getSnippetExpirationStatus,
  verifyBearerAuth,
  API_ERROR_CODES,
  type ApiError,
} from '@/lib/snippets'

interface RouteContext {
  params: Promise<{ id: string }>
}

// Dynamic route since we need to check authentication headers
export const dynamic = 'force-dynamic'

/**
 * GET /api/v1/snippets/{id}
 *
 * Read a snippet (Bearer token required if protected).
 *
 * Request:
 * GET /api/v1/snippets/abc123
 * Authorization: Bearer <password>  // if protected
 *
 * Response 200:
 * {
 *   "id": "abc123",
 *   "name": "my-component",
 *   "type": "component",
 *   "files": [{ "path": "...", "content": "...", "language": "tsx" }],
 *   "meta": { "primaryLanguage": "tsx", "fileCount": 1 },
 *   "isProtected": false
 * }
 */
export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params

  // Validate ID format
  if (!id || !validateSnippetId(id)) {
    const apiError: ApiError = {
      code: API_ERROR_CODES.INVALID_ID,
      message: 'Invalid snippet ID format',
    }

    track('snippet_get_error', {
      source: 'api',
      error_code: API_ERROR_CODES.INVALID_ID,
    })

    return NextResponse.json(apiError, { status: 400 })
  }

  // Check if snippet exists and expiration status
  const expirationStatus = await getSnippetExpirationStatus(id)

  if (!expirationStatus.exists) {
    const apiError: ApiError = {
      code: API_ERROR_CODES.NOT_FOUND,
      message: 'Snippet not found',
    }

    track('snippet_get_error', {
      source: 'api',
      error_code: API_ERROR_CODES.NOT_FOUND,
    })

    return NextResponse.json(apiError, { status: 404 })
  }

  if (expirationStatus.expired) {
    const apiError: ApiError = {
      code: API_ERROR_CODES.EXPIRED,
      message: 'This snippet has expired and is no longer available.',
    }

    track('snippet_get_error', {
      source: 'api',
      error_code: API_ERROR_CODES.EXPIRED,
    })

    return NextResponse.json(apiError, { status: 404 })
  }

  // Get metadata to check if protected
  const metadata = await getSnippetMetadata(id)

  if (!metadata) {
    const apiError: ApiError = {
      code: API_ERROR_CODES.NOT_FOUND,
      message: 'Snippet not found',
    }

    track('snippet_get_error', {
      source: 'api',
      error_code: API_ERROR_CODES.NOT_FOUND,
    })

    return NextResponse.json(apiError, { status: 404 })
  }

  // If protected, verify Bearer auth
  if (metadata.isProtected) {
    const authResult = await verifyBearerAuth(request, id)

    if (!authResult.success) {
      if (authResult.error === 'NO_AUTH_HEADER') {
        const apiError: ApiError = {
          code: API_ERROR_CODES.AUTH_REQUIRED,
          message: 'This snippet is password-protected. Provide Authorization: Bearer <password> header.',
        }

        track('snippet_unauthorized', {
          source: 'api',
          reason: 'no_auth_header',
        })

        return NextResponse.json(apiError, {
          status: 401,
          headers: { 'WWW-Authenticate': 'Bearer realm="pastecn"' },
        })
      }

      const apiError: ApiError = {
        code: API_ERROR_CODES.INVALID_PASSWORD,
        message: 'Invalid password',
      }

      track('snippet_unauthorized', {
        source: 'api',
        reason: 'invalid_password',
      })

      return NextResponse.json(apiError, { status: 401 })
    }
  }

  // Get full snippet with content
  const snippet = await getSnippet(id)

  if (!snippet) {
    const apiError: ApiError = {
      code: API_ERROR_CODES.NOT_FOUND,
      message: 'Snippet not found',
    }

    return NextResponse.json(apiError, { status: 404 })
  }

  track('snippet_accessed', {
    source: 'api',
    file_count: snippet.files.length,
    is_protected: snippet.isProtected,
  })

  return NextResponse.json(snippet, {
    headers: {
      'Content-Type': 'application/json',
      // Protected snippets use private cache, public ones are immutable
      'Cache-Control': snippet.isProtected
        ? 'private, no-store'
        : 'public, max-age=31536000, immutable',
    },
  })
}
