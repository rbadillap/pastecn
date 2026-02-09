/**
 * Snippets SDK - Authentication Utilities
 *
 * Consolidated JWT and Bearer auth for snippets.
 * Supports both Bearer token (CLI/API) and session-based (webapp) authentication.
 */

import { sign, verify } from 'jsonwebtoken'
import { verifyPassword } from '../password'
import { getSnippetPasswordHash } from './read'

// JWT secret for unlock sessions
const JWT_SECRET = process.env.UNLOCK_SESSION_SECRET || 'dev-secret-change-in-production'

// Session duration in hours (default: 24)
const SESSION_DURATION_HOURS = parseInt(process.env.UNLOCK_SESSION_DURATION_HOURS || '24', 10)

/**
 * Result of Bearer auth verification
 */
export interface BearerAuthResult {
  success: boolean
  error?: 'NO_AUTH_HEADER' | 'INVALID_PASSWORD' | 'NO_PASSWORD_HASH'
}

/**
 * Verify Bearer token authentication for API access
 *
 * Used by shadcn CLI and API v1 endpoints.
 * Extracts password from Authorization: Bearer <password> header.
 *
 * @param request - The HTTP request
 * @param snippetId - The snippet ID to verify against
 * @returns BearerAuthResult with success status and optional error
 */
export async function verifyBearerAuth(
  request: Request,
  snippetId: string
): Promise<BearerAuthResult> {
  const authHeader = request.headers.get('Authorization')
  const password = authHeader?.replace('Bearer ', '').trim()

  if (!password) {
    return { success: false, error: 'NO_AUTH_HEADER' }
  }

  const hash = await getSnippetPasswordHash(snippetId)

  if (!hash) {
    // This shouldn't happen if isProtected was true
    console.error(`Protected snippet ${snippetId} has no password hash`)
    return { success: false, error: 'NO_PASSWORD_HASH' }
  }

  const valid = await verifyPassword(password, hash)

  if (!valid) {
    return { success: false, error: 'INVALID_PASSWORD' }
  }

  return { success: true }
}

/**
 * Create a JWT session token for unlocked snippet
 *
 * Used by webapp to maintain session after password verification.
 * Token expires after configured duration (default: 24 hours).
 *
 * @param snippetId - The snippet ID
 * @returns JWT session token
 */
export function createUnlockSession(snippetId: string): string {
  return sign(
    { snippetId, type: 'unlock' },
    JWT_SECRET,
    { expiresIn: `${SESSION_DURATION_HOURS}h` }
  )
}

/**
 * Verify unlock session token
 *
 * Used by webapp to check if user has valid session for a snippet.
 *
 * @param token - JWT session token
 * @param snippetId - The snippet ID to verify against
 * @returns true if valid, false otherwise
 */
export function verifyUnlockSession(token: string, snippetId: string): boolean {
  try {
    const decoded = verify(token, JWT_SECRET) as {
      snippetId: string
      type: string
    }
    return decoded.snippetId === snippetId && decoded.type === 'unlock'
  } catch {
    return false
  }
}

/**
 * Get session duration in seconds (for cookie maxAge)
 */
export function getSessionDurationSeconds(): number {
  return SESSION_DURATION_HOURS * 60 * 60
}

/**
 * Get the cookie name for an unlock session
 *
 * @param snippetId - The snippet ID
 * @returns Cookie name in format "unlock_{id}"
 */
export function getUnlockCookieName(snippetId: string): string {
  return `unlock_${snippetId}`
}

/**
 * Extract client IP address from request headers
 *
 * Vercel provides this in x-real-ip or x-forwarded-for
 *
 * @param request - The HTTP request
 * @returns Client IP address or 'unknown'
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIp || 'unknown'
}
