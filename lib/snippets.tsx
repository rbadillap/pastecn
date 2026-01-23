import { cache } from 'react'
import { head, BlobNotFoundError } from '@vercel/blob'
import { validateRegistryJson } from './validation'

// Registry JSON schema (per shadcn registry-item.json)
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
    [key: string]: any
    passwordHash?: string  // bcrypt hash, never exposed to client
  }
}

// Types for registry snippets
export interface SnippetFile {
  path: string
  content: string
  target: string
  language: string
  type: "file" | "component" | "hook" | "lib"
}

// Metadata-only file (no content)
export interface SnippetMetadataFile {
  path: string
  target: string
  language: string
  type: "file" | "component" | "hook" | "lib"
}

// Metadata-only version (no content) - safe for unauthenticated access
export interface SnippetMetadata {
  id: string
  name: string
  type: "file" | "component" | "hook" | "lib" | "block"
  files: SnippetMetadataFile[]
  meta: {
    primaryLanguage: string
    fileCount: number
  }
  isProtected: boolean
}

// Full snippet (includes content) - requires authentication for protected snippets
export interface Snippet extends Omit<SnippetMetadata, 'files'> {
  files: SnippetFile[]
}

// Use React.cache() for per-request deduplication
// This ensures getSnippet is only called once per request even if
// both generateMetadata and the page component call it
export const getSnippet = cache(async (id: string): Promise<Snippet | null> => {
  try {
    // Verify blob exists and get metadata (including URL)
    const metadata = await head(`snippets/${id}.json`)
    
    // Fetch blob content with aggressive cache (snippets are immutable)
    const response = await fetch(metadata.url, {
      cache: 'force-cache', // Cache in Next.js Data Cache
      next: {
        revalidate: false, // Never revalidate (immutable)
        tags: [`snippet-${id}`], // Tag for manual invalidation if needed
      },
    })
    
    if (!response.ok) {
      return null
    }
    
    const json: RegistryItemJson = await response.json()

    // Validate registry JSON structure and paths (prevents malformed or malicious snippets)
    if (!validateRegistryJson(json)) {
      console.error('Invalid registry JSON structure or unsafe paths for snippet:', id)
      return null
    }

    // Map Registry JSON to Snippet (support multi-file)
    const type = mapRegistryType(json.type)
    const files: SnippetFile[] = json.files.map((file: any) => {
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
      isProtected: !!json.meta?.passwordHash,  // Only expose boolean, never the hash
    }
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return null
    }
    console.error('Error fetching snippet:', error)
    return null
  }
})

/**
 * Get snippet metadata without content (safe for unauthenticated access)
 * Use this for protected snippets when user is not authenticated
 * Content is never included in the response
 */
export const getSnippetMetadata = cache(async (id: string): Promise<SnippetMetadata | null> => {
  try {
    // Verify blob exists and get metadata (including URL)
    const metadata = await head(`snippets/${id}.json`)

    // Fetch blob content with aggressive cache (snippets are immutable)
    const response = await fetch(metadata.url, {
      cache: 'force-cache', // Cache in Next.js Data Cache
      next: {
        revalidate: false, // Never revalidate (immutable)
        tags: [`snippet-${id}`], // Tag for manual invalidation if needed
      },
    })

    if (!response.ok) {
      return null
    }

    const json: RegistryItemJson = await response.json()

    // Validate registry JSON structure and paths (prevents malformed or malicious snippets)
    if (!validateRegistryJson(json)) {
      console.error('Invalid registry JSON structure or unsafe paths for snippet:', id)
      return null
    }

    // Map Registry JSON to SnippetMetadata (NO content field)
    const type = mapRegistryType(json.type)
    const files: SnippetMetadataFile[] = json.files.map((file: any) => {
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
      isProtected: !!json.meta?.passwordHash,  // Only expose boolean, never the hash
    }
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return null
    }
    console.error('Error fetching snippet metadata:', error)
    return null
  }
})

function mapRegistryType(registryType: string): Snippet['type'] {
  const mapping: Record<string, Snippet['type']> = {
    'registry:file': 'file',
    'registry:component': 'component',
    'registry:hook': 'hook',
    'registry:lib': 'lib',
    'registry:block': 'block',
  }
  return mapping[registryType] || 'file'
}

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

function inferLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  const mapping: Record<string, string> = {
    'tsx': 'tsx',
    'ts': 'ts',
    'jsx': 'jsx',
    'js': 'js',
    'md': 'markdown',
  }
  return mapping[ext] || 'text'
}

/**
 * Get password hash for a snippet (server-side only)
 * NEVER expose this function to client or include hash in client responses
 * Used only for password verification in API routes
 */
export async function getSnippetPasswordHash(id: string): Promise<string | null> {
  try {
    const metadata = await head(`snippets/${id}.json`)
    const response = await fetch(metadata.url, {
      cache: 'force-cache',
      next: {
        revalidate: false,
        tags: [`snippet-${id}`],
      },
    })

    if (!response.ok) {
      return null
    }

    const json: RegistryItemJson = await response.json()
    return json.meta?.passwordHash || null
  } catch (error) {
    console.error('Error fetching snippet password hash:', error)
    return null
  }
}
