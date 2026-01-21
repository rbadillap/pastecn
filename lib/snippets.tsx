import { cache } from 'react'
import { head, BlobNotFoundError } from '@vercel/blob'
import { validateRegistryJson } from './validation'

// Types for registry snippets
export interface SnippetFile {
  path: string
  content: string
  target: string
  language: string
  type: "file" | "component" | "hook" | "lib"
}

export interface Snippet {
  id: string
  name: string
  type: "file" | "component" | "hook" | "lib" | "block"
  files: SnippetFile[]
  meta: {
    primaryLanguage: string
    fileCount: number
  }
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
    
    const json = await response.json()
    
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
      const fileType = mapRegistryType(file.type)

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
    }
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return null
    }
    console.error('Error fetching snippet:', error)
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
