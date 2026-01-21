import { redirect } from "next/navigation"
import { getSnippet } from "@/lib/snippets"
import { SnippetView } from "@/components/snippet-view"
import { CodePreview } from "@/components/code-preview"
import type { Metadata } from "next"

interface SnippetPageProps {
  params: Promise<{ id: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

// Cache this page indefinitely since snippets are immutable
export const revalidate = false
export const dynamic = 'force-static'

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

export default async function SnippetPage({ params }: SnippetPageProps) {
  const { id } = await params
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

  return <SnippetView snippet={snippet} codePreviews={codePreviews} />
}
