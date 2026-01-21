import { getSnippet } from "@/lib/snippets"
import { validateSnippetId } from "@/lib/validation"
import { NextResponse } from "next/server"
import { track } from "@vercel/analytics/server"

interface RouteContext {
  params: Promise<{ id: string }>
}

// Mark as static since snippets are immutable
export const dynamic = 'force-static'
export const revalidate = false

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id: rawId } = await params
  // Remove .json suffix if present (shadcn CLI may include it)
  const id = rawId.endsWith('.json') ? rawId.slice(0, -5) : rawId
  
  // Validate normalized ID format
  if (!id || !validateSnippetId(id)) {
    track('registry_not_found', {
      snippet_id: id,
      normalized_id: rawId,
    })
    return NextResponse.json(
      { error: 'Snippet not found' },
      { status: 404 }
    )
  }
  
  const snippet = await getSnippet(id)

  if (!snippet) {
    track('registry_not_found', {
      snippet_id: id,
      normalized_id: rawId,
    })
    return NextResponse.json(
      { error: 'Snippet not found' },
      { status: 404 }
    )
  }

  // Convert Snippet back to Registry JSON format for shadcn CLI
  const registryJson = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: snippet.name,
    type: `registry:${snippet.type}`,
    files: snippet.files.map((file) => {
      const path = file.type === "file" && file.target.startsWith("~/")
        ? file.target.slice(2)
        : file.path

      return {
        path,
        type: `registry:${file.type}`,
        content: file.content,
        ...(file.type === "file" && { target: file.target }),
      }
    }),
  }

  // Track registry access
  track('registry_accessed', {
    snippet_id: id,
    file_count: snippet.files.length,
    user_agent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
  })

  return NextResponse.json(registryJson, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
