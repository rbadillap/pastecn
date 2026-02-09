import { customAlphabet } from 'nanoid'
import bcrypt from 'bcryptjs'

// Custom alphabet excludes ambiguous characters: 0, O, I, l, 1
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
const generatePassword = customAlphabet(alphabet, 16)

/**
 * Generate a secure 16-character password
 * ~95 bits of entropy (52^16 possible combinations)
 * Excludes ambiguous characters for better readability
 */
export function createSnippetPassword(): string {
  return generatePassword()
}

/**
 * Hash a plaintext password using bcrypt with cost factor 10
 * Server-side only - never expose hash to client
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, 10)
}

/**
 * Verify a plaintext password against a bcrypt hash
 * Uses timing-safe comparison (bcrypt native)
 */
export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash)
}
