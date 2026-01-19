import { cache } from 'react'
import { head, BlobNotFoundError } from '@vercel/blob'

// Types for registry snippets
export interface Snippet {
  id: string
  name: string
  type: "file" | "component" | "hook" | "lib"
  target: string
  content: string
  meta: {
    language: string
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
    
    // Map Registry JSON to Snippet
    const file = json.files[0]
    const target = file.target || file.path
    const language = inferLanguage(target)
    const type = mapRegistryType(json.type)
    
    return {
      id,
      name: json.name,
      type,
      target,
      content: file.content,
      meta: {
        language,
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
