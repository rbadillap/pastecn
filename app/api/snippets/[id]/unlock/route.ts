import { NextResponse } from 'next/server'
import { checkRateLimit } from '@vercel/firewall'
import { verifyPassword } from '@/lib/password'
import { getSnippetPasswordHash } from '@/lib/snippets'
import { sign } from 'jsonwebtoken'

// JWT secret for unlock sessions (use environment variable in production)
const JWT_SECRET = process.env.UNLOCK_SESSION_SECRET || 'dev-secret-change-in-production'

// Session duration in hours (default: 24)
const SESSION_DURATION_HOURS = parseInt(process.env.UNLOCK_SESSION_DURATION_HOURS || '24', 10)

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * Get client IP address from request headers
 * Vercel provides this in x-real-ip or x-forwarded-for
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIp || 'unknown'
}

/**
 * Create a JWT session token for unlocked snippet
 * Expires after configured duration (default: 24 hours)
 */
function createUnlockSession(snippetId: string): string {
  return sign(
    { snippetId, type: 'unlock' },
    JWT_SECRET,
    { expiresIn: `${SESSION_DURATION_HOURS}h` }
  )
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Vercel Rate Limiting (configured in dashboard)
    // 5 attempts per 15 minutes per IP per snippet
    const clientIp = getClientIp(request)
    const { rateLimited } = await checkRateLimit('unlock-snippet', {
      request,
      rateLimitKey: `${id}:${clientIp}`,
    })

    if (rateLimited) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }

    // Get password hash from snippet
    const hash = await getSnippetPasswordHash(id)

    if (!hash) {
      return NextResponse.json(
        { error: 'Snippet not found or not protected' },
        { status: 404 }
      )
    }

    // Verify password
    const valid = await verifyPassword(password, hash)

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate session token
    const token = createUnlockSession(id)

    // Set HTTP-only cookie (expires after configured duration)
    const response = NextResponse.json({
      success: true,
      token,
    })

    response.cookies.set(`unlock_${id}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_HOURS * 60 * 60, // Convert hours to seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error unlocking snippet:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
