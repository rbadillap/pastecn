import { getSnippet } from "@/lib/snippets"
import { NextResponse } from "next/server"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id: rawId } = await params
  // Remove .json suffix if present (shadcn CLI may include it)
  const id = rawId.endsWith('.json') ? rawId.slice(0, -5) : rawId
  
  // Validate normalized ID is not empty
  if (!id) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  const snippet = await getSnippet(id)

  if (!snippet) {
    return NextResponse.redirect(new URL('/', request.url))
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
