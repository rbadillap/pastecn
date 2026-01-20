import { getSnippet } from "@/lib/snippets"
import { validateSnippetId } from "@/lib/validation"
import { NextResponse } from "next/server"

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
    return NextResponse.json(
      { error: 'Snippet not found' },
      { status: 404 }
    )
  }
  
  const snippet = await getSnippet(id)

  if (!snippet) {
    return NextResponse.json(
      { error: 'Snippet not found' },
      { status: 404 }
    )
  }

  // Convert Snippet back to Registry JSON format for shadcn CLI
  // For files, snippet.target contains "~/filename", but path should be just "filename"
  // For other types, snippet.target contains the full path (e.g., "components/ui/file.tsx")
  const path = snippet.type === "file" && snippet.target.startsWith("~/")
    ? snippet.target.slice(2) // Remove "~/" prefix
    : snippet.target
  
  const registryJson = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: snippet.name,
    type: `registry:${snippet.type}`,
    files: [
      {
        path,
        type: `registry:${snippet.type}`,
        content: snippet.content,
        ...(snippet.type === "file" && { target: snippet.target }),
      },
    ],
  }

  return NextResponse.json(registryJson, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
