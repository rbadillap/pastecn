import { codeToHtml } from "shiki"

interface CodePreviewProps {
  code: string
  language: string
  maxLines?: number
}

export async function CodePreview({ code, language, maxLines = 12 }: CodePreviewProps) {
  const lines = code.split("\n")
  const truncated = lines.slice(0, maxLines).join("\n")
  const hasMore = lines.length > maxLines

  const html = await codeToHtml(truncated, {
    lang: language,
    theme: "github-light",
  })

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-lg border border-border bg-background [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:text-sm [&_code]:!text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {hasMore && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      )}
    </div>
  )
}
