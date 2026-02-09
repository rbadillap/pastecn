/**
 * Snippets SDK
 *
 * Modular SDK for snippets operations.
 * Re-exports all public APIs from submodules.
 */

// Types
export type {
  SnippetType,
  RegistryType,
  RegistryItemJson,
  SnippetFile,
  SnippetMetadataFile,
  SnippetMetadata,
  Snippet,
  CreateSnippetInput,
  CreateSnippetResult,
  ApiError,
  ApiErrorCode,
  ExpirationOption,
} from './types'
export { API_ERROR_CODES } from './types'

// Read operations
export {
  getSnippet,
  getSnippetMetadata,
  getSnippetPasswordHash,
  snippetExists,
  isExpired,
  getSnippetExpirationStatus,
} from './read'

// Create operations
export {
  createSnippet,
  generateSnippetId,
  CreateSnippetError,
} from './create'

// Auth utilities
export type { BearerAuthResult } from './auth'
export {
  verifyBearerAuth,
  createUnlockSession,
  verifyUnlockSession,
  getSessionDurationSeconds,
  getUnlockCookieName,
  getClientIp,
} from './auth'
