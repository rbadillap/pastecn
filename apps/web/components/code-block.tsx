import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  language?: string
}

export async function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    theme: "github-dark",
  })

  return (
    <div
      className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:!text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
