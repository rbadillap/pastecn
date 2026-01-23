import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { getSnippet } from '@/lib/snippets'

const JWT_SECRET = process.env.UNLOCK_SESSION_SECRET || 'dev-secret-change-in-production'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * Verify unlock session token
 */
function verifyUnlockSession(token: string, snippetId: string): boolean {
  try {
    const decoded = verify(token, JWT_SECRET) as any
    return decoded.snippetId === snippetId && decoded.type === 'unlock'
  } catch {
    return false
  }
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
  const sessionToken = cookieStore.get(`unlock_${id}`)?.value

  if (!sessionToken || !verifyUnlockSession(sessionToken, id)) {
    return NextResponse.json(
      { error: 'Unauthorized - valid session required' },
      { status: 401 }
    )
  }

  // Fetch full snippet (authorized)
  const snippet = await getSnippet(id)

  if (!snippet) {
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

  return NextResponse.json({ content }, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  })
}
