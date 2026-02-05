/**
 * Snippets SDK - Type Definitions
 *
 * Centralized interfaces for snippets operations.
 * Based on shadcn registry-item.json schema.
 */

// Valid snippet types aligned with shadcn registry
export type SnippetType = 'file' | 'component' | 'hook' | 'lib' | 'block'

// Expiration options for snippets
// '10s' is for local testing only
export type ExpirationOption = '10s' | '1h' | '24h' | '7d' | '30d' | 'never'

// Valid registry types (with registry: prefix)
export type RegistryType =
  | 'registry:file'
  | 'registry:component'
  | 'registry:hook'
  | 'registry:lib'
  | 'registry:block'

/**
 * Registry JSON schema (per shadcn registry-item.json)
 * This is the format stored in Vercel Blob
 */
export interface RegistryItemJson {
  $schema: string
  name: string
  type: string
  files: Array<{
    path: string
    type: string
    content: string
    target?: string
  }>
  meta?: {
    [key: string]: unknown
    passwordHash?: string // bcrypt hash, never exposed to client
    expiresAt?: string // ISO 8601 timestamp for expiration
  }
}

/**
 * Full snippet file with content
 */
export interface SnippetFile {
  path: string
  content: string
  target: string
  language: string
  type: 'file' | 'component' | 'hook' | 'lib'
}

/**
 * Metadata-only file (no content)
 * Safe for unauthenticated access to protected snippets
 */
export interface SnippetMetadataFile {
  path: string
  target: string
  language: string
  type: 'file' | 'component' | 'hook' | 'lib'
}

/**
 * Metadata-only version (no content) - safe for unauthenticated access
 */
export interface SnippetMetadata {
  id: string
  name: string
  type: SnippetType
  files: SnippetMetadataFile[]
  meta: {
    primaryLanguage: string
    fileCount: number
    expiresAt?: string // ISO 8601 timestamp, exposed for UI display
  }
  isProtected: boolean
}

/**
 * Full snippet (includes content) - requires authentication for protected snippets
 */
export interface Snippet extends Omit<SnippetMetadata, 'files'> {
  files: SnippetFile[]
}

/**
 * Input for creating a new snippet via API v1
 */
export interface CreateSnippetInput {
  name: string
  type: SnippetType
  files: Array<{
    path: string
    content: string
    target?: string
  }>
  password?: string
  expiresIn?: ExpirationOption
}

/**
 * Result from creating a snippet
 */
export interface CreateSnippetResult {
  id: string
  url: string
  registryUrl: string
  password?: string // Only returned if password was enabled
}

/**
 * API v1 error response
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * API v1 error codes
 */
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_ID: 'INVALID_ID',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  NOT_FOUND: 'NOT_FOUND',
  EXPIRED: 'EXPIRED',
  ID_COLLISION: 'ID_COLLISION',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]
