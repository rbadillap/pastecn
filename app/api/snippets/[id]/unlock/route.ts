import { NextResponse } from 'next/server'
import { checkRateLimit } from '@vercel/firewall'
import { track } from '@vercel/analytics/server'
import { verifyPassword } from '@/lib/password'
import {
  getSnippetPasswordHash,
  createUnlockSession,
  getSessionDurationSeconds,
  getUnlockCookieName,
  getClientIp,
} from '@/lib/snippets'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const { password } = await request.json()

    if (!password) {
      track('unlock_error', {
        source: 'web',
        reason: 'missing_password',
        status_code: 400,
      })
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
      track('unlock_rate_limited', {
        source: 'web',
      })
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }

    // Get password hash from snippet
    const hash = await getSnippetPasswordHash(id)

    if (!hash) {
      track('unlock_error', {
        source: 'web',
        reason: 'not_found_or_not_protected',
        status_code: 404,
      })
      return NextResponse.json(
        { error: 'Snippet not found or not protected' },
        { status: 404 }
      )
    }

    // Verify password
    const valid = await verifyPassword(password, hash)

    if (!valid) {
      track('unlock_failed', {
        source: 'web',
        reason: 'invalid_password',
      })
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

    response.cookies.set(getUnlockCookieName(id), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getSessionDurationSeconds(),
      path: '/',
    })

    track('unlock_success', {
      source: 'web',
    })

    return response
  } catch (error) {
    console.error('Error unlocking snippet:', error)
    track('unlock_error', {
      source: 'web',
      reason: 'internal_error',
      status_code: 500,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
