import { getSnippet, verifyBearerAuth } from "@/lib/snippets"
import { validateSnippetId } from "@/lib/validation"
import { NextResponse } from "next/server"
import { track } from "@vercel/analytics/server"

interface RouteContext {
  params: Promise<{ id: string }>
}

// Dynamic route since we need to check authentication headers
export const dynamic = 'force-dynamic'

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
      source: 'web',
    })
    return NextResponse.json(
      { error: 'Snippet not found' },
      { status: 404 }
    )
  }
  
  const snippet = await getSnippet(id)

  if (!snippet) {
    track('registry_not_found', {
      source: 'web',
    })
    return NextResponse.json(
      { error: 'Snippet not found' },
      { status: 404 }
    )
  }

  // Check if snippet is password-protected
  if (snippet.isProtected) {
    const authResult = await verifyBearerAuth(request, id)

    if (!authResult.success) {
      if (authResult.error === 'NO_AUTH_HEADER') {
        track('registry_unauthorized', {
          source: 'web',
          reason: 'no_auth_header',
        })
        return NextResponse.json(
          {
            error: 'This snippet is password-protected',
            message: 'Configure authentication in your project',
            instructions: {
              step1: 'Get password from snippet creator',
              step2: 'Add to .env.local: PASTE_PASSWORD=your_password',
              step3: 'Configure in components.json:',
              example: {
                $schema: 'https://ui.shadcn.com/schema.json',
                registries: {
                  '@pastecn': {
                    url: 'https://pastecn.com/r/{name}.json',
                    headers: {
                      Authorization: 'Bearer ${PASTE_PASSWORD}'
                    }
                  }
                }
              }
            }
          },
          {
            status: 401,
            headers: { 'WWW-Authenticate': 'Bearer realm="pastecn"' }
          }
        )
      }

      if (authResult.error === 'NO_PASSWORD_HASH') {
        console.error(`Protected snippet ${id} has no password hash`)
        return NextResponse.json(
          { error: 'Snippet configuration error' },
          { status: 500 }
        )
      }

      track('registry_unauthorized', {
        source: 'web',
        reason: 'invalid_password',
      })
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Password valid - continue to serve snippet
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
    source: 'web',
    file_count: snippet.files.length,
    is_protected: snippet.isProtected,
  })

  return NextResponse.json(registryJson, {
    headers: {
      'Content-Type': 'application/json',
      // Protected snippets use private cache, public ones are immutable
      'Cache-Control': snippet.isProtected
        ? 'private, no-store'
        : 'public, max-age=31536000, immutable',
    },
  })
}
