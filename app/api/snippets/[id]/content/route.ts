import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { track } from '@vercel/analytics/server'
import { getSnippet, verifyUnlockSession, getUnlockCookieName } from '@/lib/snippets'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/snippets/[id]/content
 *
 * Returns file content for authenticated users only.
 * Requires valid unlock session cookie.
 *
 * Security:
 * - Content is NEVER returned without authentication
 * - Private cache headers prevent caching
 * - Returns minimal payload (just content)
 */
export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params

  // Check authentication
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(getUnlockCookieName(id))?.value

  if (!sessionToken || !verifyUnlockSession(sessionToken, id)) {
    track('content_unauthorized', {
      source: 'web',
      reason: !sessionToken ? 'no_session' : 'invalid_session',
    })
    return NextResponse.json(
      { error: 'Unauthorized - valid session required' },
      { status: 401 }
    )
  }

  // Fetch full snippet (authorized)
  const snippet = await getSnippet(id)

  if (!snippet) {
    track('content_not_found', {
      source: 'web',
    })
    return NextResponse.json(
      { error: 'Snippet not found' },
      { status: 404 }
    )
  }

  // Return only content (file path → content mapping)
  const content = snippet.files.map(file => ({
    path: file.path,
    content: file.content,
  }))

  track('content_accessed', {
    source: 'web',
    file_count: snippet.files.length,
  })

  return NextResponse.json({ content }, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  })
}
