import { notFound } from "next/navigation"
import { getSnippet } from "@/lib/snippets"
import { CodePreview } from "@/components/code-preview"
import { SnippetView } from "@/components/snippet-view"

interface SnippetPageProps {
  params: Promise<{ id: string }>
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const { id } = await params
  const snippet = await getSnippet(id)

  if (!snippet) {
    notFound()
  }

  const codePreview = <CodePreview code={snippet.content} language={snippet.meta.language} />

  return <SnippetView snippet={snippet} codePreview={codePreview} />
}
