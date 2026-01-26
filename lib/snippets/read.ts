/**
 * Snippets SDK - Read Operations
 *
 * Functions for reading snippets from Vercel Blob storage.
 * Uses React.cache() for per-request deduplication.
 */

import { cache } from 'react'
import { head, BlobNotFoundError } from '@vercel/blob'
import { validateRegistryJson } from '../validation'
import type {
  RegistryItemJson,
  Snippet,
  SnippetMetadata,
  SnippetFile,
  SnippetMetadataFile,
  SnippetType,
} from './types'

/**
 * Map registry type string to SnippetType
 */
function mapRegistryType(registryType: string): SnippetType {
  const mapping: Record<string, SnippetType> = {
    'registry:file': 'file',
    'registry:component': 'component',
    'registry:hook': 'hook',
    'registry:lib': 'lib',
    'registry:block': 'block',
  }
  return mapping[registryType] || 'file'
}

/**
 * Map registry type to file type (blocks map to file for individual files)
 */
function mapRegistryTypeToFileType(registryType: string): SnippetFile['type'] {
  const mapping: Record<string, SnippetFile['type']> = {
    'registry:file': 'file',
    'registry:component': 'component',
    'registry:hook': 'hook',
    'registry:lib': 'lib',
    'registry:block': 'file', // Blocks map to file type for individual files
  }
  return mapping[registryType] || 'file'
}

/**
 * Infer language from file path extension
 */
function inferLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  const mapping: Record<string, string> = {
    tsx: 'tsx',
    ts: 'ts',
    jsx: 'jsx',
    js: 'js',
    md: 'markdown',
  }
  return mapping[ext] || 'text'
}

/**
 * Fetch raw registry JSON from blob storage
 * Internal helper used by other read functions
 */
async function fetchRegistryJson(id: string): Promise<RegistryItemJson | null> {
  try {
    const metadata = await head(`snippets/${id}.json`)

    const response = await fetch(metadata.url, {
      cache: 'force-cache',
      next: {
        revalidate: false, // Never revalidate (immutable)
        tags: [`snippet-${id}`], // Tag for manual invalidation if needed
      },
    })

    if (!response.ok) {
      return null
    }

    const json: RegistryItemJson = await response.json()

    // Validate registry JSON structure and paths
    if (!validateRegistryJson(json)) {
      console.error('Invalid registry JSON structure or unsafe paths for snippet:', id)
      return null
    }

    return json
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return null
    }
    console.error('Error fetching snippet:', error)
    return null
  }
}

/**
 * Get full snippet with content
 *
 * Uses React.cache() for per-request deduplication.
 * This ensures getSnippet is only called once per request even if
 * both generateMetadata and the page component call it.
 *
 * @param id - Snippet ID
 * @returns Full snippet with content, or null if not found
 */
export const getSnippet = cache(async (id: string): Promise<Snippet | null> => {
  const json = await fetchRegistryJson(id)

  if (!json) {
    return null
  }

  // Map Registry JSON to Snippet
  const type = mapRegistryType(json.type)
  const files: SnippetFile[] = json.files.map((file) => {
    const target = file.target || file.path
    const language = inferLanguage(target)
    const fileType = mapRegistryTypeToFileType(file.type)

    return {
      path: file.path,
      content: file.content,
      target,
      language,
      type: fileType,
    }
  })

  return {
    id,
    name: json.name,
    type,
    files,
    meta: {
      primaryLanguage: files[0]?.language || 'text',
      fileCount: files.length,
    },
    isProtected: !!json.meta?.passwordHash,
  }
})

/**
 * Get snippet metadata without content (safe for unauthenticated access)
 *
 * Use this for protected snippets when user is not authenticated.
 * Content is never included in the response.
 *
 * @param id - Snippet ID
 * @returns Snippet metadata without content, or null if not found
 */
export const getSnippetMetadata = cache(async (id: string): Promise<SnippetMetadata | null> => {
  const json = await fetchRegistryJson(id)

  if (!json) {
    return null
  }

  // Map Registry JSON to SnippetMetadata (NO content field)
  const type = mapRegistryType(json.type)
  const files: SnippetMetadataFile[] = json.files.map((file) => {
    const target = file.target || file.path
    const language = inferLanguage(target)
    const fileType = mapRegistryTypeToFileType(file.type)

    return {
      path: file.path,
      target,
      language,
      type: fileType,
      // NO content field - this is critical for security
    }
  })

  return {
    id,
    name: json.name,
    type,
    files,
    meta: {
      primaryLanguage: files[0]?.language || 'text',
      fileCount: files.length,
    },
    isProtected: !!json.meta?.passwordHash,
  }
})

/**
 * Get password hash for a snippet (server-side only)
 *
 * NEVER expose this function to client or include hash in client responses.
 * Used only for password verification in API routes.
 *
 * @param id - Snippet ID
 * @returns Password hash or null if not found/not protected
 */
export async function getSnippetPasswordHash(id: string): Promise<string | null> {
  const json = await fetchRegistryJson(id)

  if (!json) {
    return null
  }

  return json.meta?.passwordHash || null
}

/**
 * Check if a snippet exists (without fetching full content)
 *
 * @param id - Snippet ID
 * @returns true if exists, false otherwise
 */
export async function snippetExists(id: string): Promise<boolean> {
  try {
    await head(`snippets/${id}.json`)
    return true
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return false
    }
    throw error
  }
}
