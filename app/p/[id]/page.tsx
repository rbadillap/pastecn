import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { getSnippet, getSnippetMetadata } from "@/lib/snippets"
import { SnippetView } from "@/components/snippet-view"
import { CodePreview } from "@/components/code-preview"
import type { Metadata } from "next"

// JWT secret (must match unlock route)
const JWT_SECRET = process.env.UNLOCK_SESSION_SECRET || 'dev-secret-change-in-production'

interface SnippetPageProps {
  params: Promise<{ id: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

// Dynamic route since we need to check authentication
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: SnippetPageProps): Promise<Metadata> {
  const { id } = await params
  const snippet = await getSnippet(id)

  if (!snippet) {
    return {
      title: "Snippet not found",
    }
  }

  const snippetUrl = `${siteUrl}/p/${id}`
  const snippetType = snippet.type.charAt(0).toUpperCase() + snippet.type.slice(1)
  const title = `${snippet.name} — ${snippetType}`
  const description = snippet.type === 'block'
    ? `View and install this block (${snippet.files.length} files) using shadcn CLI: npx shadcn@latest add ${siteUrl}/r/${id}`
    : snippet.files.length === 1
      ? `View and install this ${snippet.type} using shadcn CLI: npx shadcn@latest add ${siteUrl}/r/${id}`
      : `View and install this ${snippet.type} (${snippet.files.length} files) using shadcn CLI: npx shadcn@latest add ${siteUrl}/r/${id}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: snippetUrl,
      type: "website",
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: snippet.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image.jpg"],
    },
    alternates: {
      canonical: snippetUrl,
    },
  }
}

/**
 * Verify unlock session token
 */
function verifyUnlockSession(token: string, snippetId: string): boolean {
  try {
    const decoded = verify(token, JWT_SECRET) as any
    return decoded.snippetId === snippetId && decoded.type === 'unlock'
  } catch {
    return false
  }
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const { id } = await params

  // First, get metadata (always safe - no content)
  const metadata = await getSnippetMetadata(id)

  if (!metadata) {
    redirect('/')
  }

  // Check authentication for protected snippets
  let isAuthenticated = false
  if (metadata.isProtected) {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(`unlock_${id}`)?.value
    isAuthenticated = sessionToken ? verifyUnlockSession(sessionToken, id) : false
  }

  // For protected + unauthenticated: show metadata only (no content)
  if (metadata.isProtected && !isAuthenticated) {
    return (
      <SnippetView
        snippet={metadata}
        codePreviews={[]}
        isLocked={true}
      />
    )
  }

  // For authenticated or public: fetch full content
  const snippet = await getSnippet(id)

  if (!snippet) {
    redirect('/')
  }

  // Render all code previews (async Server Components)
  const codePreviews = await Promise.all(
    snippet.files.map(async (file, idx) => ({
      id: idx,
      preview: (
        <CodePreview
          code={file.content}
          language={file.language}
          maxLines={snippet.files.length === 1 ? 12 : 8}
        />
      )
    }))
  )

  return <SnippetView snippet={snippet} codePreviews={codePreviews} isLocked={false} />
}
