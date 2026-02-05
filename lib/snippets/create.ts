/**
 * Snippets SDK - Create Operations
 *
 * Functions for creating snippets in Vercel Blob storage.
 */

import { put, head, BlobNotFoundError } from '@vercel/blob'
import { nanoid } from 'nanoid'
import { hashPassword } from '../password'
import { validateSnippetId, validatePath } from '../validation'
import type {
  CreateSnippetInput,
  CreateSnippetResult,
  RegistryItemJson,
  ApiErrorCode,
  ExpirationOption,
} from './types'
import { API_ERROR_CODES } from './types'

/**
 * Error thrown by createSnippet with specific error code
 */
export class CreateSnippetError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string
  ) {
    super(message)
    this.name = 'CreateSnippetError'
  }
}

/**
 * Generate a unique snippet ID (8 characters)
 */
export function generateSnippetId(): string {
  return nanoid(8)
}

/**
 * Map user-friendly type to registry type
 */
function toRegistryType(type: string): string {
  return `registry:${type}`
}

/**
 * Calculate expiration timestamp from option
 */
function calculateExpiresAt(expiresIn: ExpirationOption): string | undefined {
  if (expiresIn === 'never') return undefined

  const durations: Record<string, number> = {
    '10s': 10 * 1000, // Local testing only
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }

  return new Date(Date.now() + durations[expiresIn]).toISOString()
}

/**
 * Validate input files
 */
function validateFiles(
  files: CreateSnippetInput['files']
): { valid: true } | { valid: false; error: string } {
  if (!files || files.length === 0) {
    return { valid: false, error: 'At least one file is required' }
  }

  for (const file of files) {
    if (!file.path || typeof file.path !== 'string') {
      return { valid: false, error: 'Each file must have a path' }
    }

    if (!validatePath(file.path)) {
      return { valid: false, error: `Invalid path: ${file.path}` }
    }

    if (file.target && !validatePath(file.target)) {
      return { valid: false, error: `Invalid target path: ${file.target}` }
    }

    if (typeof file.content !== 'string') {
      return { valid: false, error: `File ${file.path} must have string content` }
    }
  }

  return { valid: true }
}

/**
 * Create a new snippet
 *
 * @param input - CreateSnippetInput with snippet data
 * @returns CreateSnippetResult with URLs and optional password
 * @throws CreateSnippetError if validation fails or ID collision
 */
export async function createSnippet(input: CreateSnippetInput): Promise<CreateSnippetResult> {
  const { name, type, files, password, expiresIn } = input

  // Always generate ID server-side (no custom IDs allowed)
  const id = generateSnippetId()

  // Validate name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CreateSnippetError(API_ERROR_CODES.VALIDATION_ERROR, 'Name is required')
  }

  // Validate type
  const validTypes = ['file', 'component', 'hook', 'lib', 'block']
  if (!validTypes.includes(type)) {
    throw new CreateSnippetError(
      API_ERROR_CODES.VALIDATION_ERROR,
      `Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}`
    )
  }

  // Validate files
  const fileValidation = validateFiles(files)
  if (!fileValidation.valid) {
    throw new CreateSnippetError(API_ERROR_CODES.VALIDATION_ERROR, fileValidation.error)
  }

  // Check if blob already exists
  try {
    await head(`snippets/${id}.json`)
    // Blob exists - throw collision error
    throw new CreateSnippetError(API_ERROR_CODES.ID_COLLISION, 'ID already exists')
  } catch (error) {
    if (error instanceof CreateSnippetError) {
      throw error
    }
    if (!(error instanceof BlobNotFoundError)) {
      throw error
    }
    // Blob doesn't exist - proceed
  }

  // Build registry JSON
  const registryType = toRegistryType(type)
  const registryJson: RegistryItemJson = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: registryType,
    files: files.map((file) => ({
      path: file.path,
      type: registryType,
      content: file.content,
      ...(file.target && { target: file.target }),
    })),
  }

  // Hash password if provided
  if (password) {
    const hash = await hashPassword(password)
    registryJson.meta = {
      ...registryJson.meta,
      passwordHash: hash,
    }
  }

  // Set expiration if provided
  if (expiresIn && expiresIn !== 'never') {
    const expiresAt = calculateExpiresAt(expiresIn)
    if (expiresAt) {
      registryJson.meta = {
        ...registryJson.meta,
        expiresAt,
      }
    }
  }

  // Upload to Vercel Blob
  await put(`snippets/${id}.json`, JSON.stringify(registryJson), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })

  // Build URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pastecn.com'

  return {
    id,
    url: `${baseUrl}/p/${id}`,
    registryUrl: `${baseUrl}/r/${id}`,
    ...(password && { password }),
  }
}
