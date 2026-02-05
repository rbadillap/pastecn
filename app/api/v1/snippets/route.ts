import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import {
  createSnippet,
  CreateSnippetError,
  API_ERROR_CODES,
  type CreateSnippetInput,
  type ApiError,
} from '@/lib/snippets'

/**
 * POST /api/v1/snippets
 *
 * Create a new snippet. ID is always generated server-side.
 *
 * Request body:
 * {
 *   "name": "my-component",
 *   "type": "component",      // file | component | hook | lib | block
 *   "files": [{
 *     "path": "components/my-component.tsx",
 *     "content": "export function..."
 *   }],
 *   "password": "optional",   // Enable password protection
 *   "expiresIn": "24h"        // Optional: 1h | 24h | 7d | 30d | never
 * }
 *
 * Response 201:
 * {
 *   "id": "xK9mN2pL",           // Server-generated (8 chars)
 *   "url": "https://pastecn.com/p/xK9mN2pL",
 *   "registryUrl": "https://pastecn.com/r/xK9mN2pL",
 *   "password": "generated-pw"  // Only if password enabled
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input: CreateSnippetInput = {
      name: body.name,
      type: body.type,
      files: body.files,
      password: body.password,
      expiresIn: body.expiresIn,
    }

    const result = await createSnippet(input)

    track('snippet_created', {
      source: 'api',
      file_count: input.files?.length || 0,
      is_protected: !!input.password,
      expires_in: input.expiresIn || 'never',
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof CreateSnippetError) {
      const statusMap: Record<string, number> = {
        [API_ERROR_CODES.VALIDATION_ERROR]: 400,
        [API_ERROR_CODES.INVALID_ID]: 400,
        [API_ERROR_CODES.ID_COLLISION]: 409,
      }

      const status = statusMap[error.code] || 400

      const apiError: ApiError = {
        code: error.code,
        message: error.message,
      }

      track('snippet_create_error', {
        source: 'api',
        error_code: error.code,
        status_code: status,
      })

      return NextResponse.json(apiError, { status })
    }

    // Handle Vercel Blob errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase()

      if (message.includes('size') || message.includes('too large')) {
        const apiError: ApiError = {
          code: API_ERROR_CODES.VALIDATION_ERROR,
          message: 'Content too large',
        }
        return NextResponse.json(apiError, { status: 413 })
      }
    }

    console.error('Error creating snippet:', error)

    const apiError: ApiError = {
      code: API_ERROR_CODES.INTERNAL_ERROR,
      message: 'Internal server error',
    }

    return NextResponse.json(apiError, { status: 500 })
  }
}
