"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Copy, Terminal, Plus, Link as LinkIcon } from "lucide-react"
import { track } from "@vercel/analytics/react"
import type { Snippet } from "@/lib/snippets"

interface SnippetViewProps {
  snippet: Snippet
  codePreview: React.ReactNode
}

export function SnippetView({ snippet, codePreview }: SnippetViewProps) {
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const registryUrl = `https://pastecn.com/r/${snippet.id}`
  const previewUrl = `https://pastecn.com/p/${snippet.id}`
  const npxCommand = `npx shadcn@latest add ${registryUrl}.json`

  // Track snippet view on mount
  useEffect(() => {
    track('snippet_viewed', {
      snippet_id: snippet.id,
      snippet_type: snippet.type,
      language: snippet.meta.language,
      content_length: snippet.content.length,
    })
  }, [snippet.id, snippet.type, snippet.meta.language, snippet.content.length])

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(npxCommand)
    setCopiedCommand(true)
    setTimeout(() => setCopiedCommand(false), 3000)
    track('command_copied', {
      snippet_id: snippet.id,
      snippet_type: snippet.type,
    })
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(previewUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 3000)
    track('preview_url_copied', {
      snippet_id: snippet.id,
      snippet_type: snippet.type,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-4 pt-6 md:pt-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <nav className="mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create yours</span>
            </a>
          </nav>

          {/* Path del archivo */}
          <div className="mb-3 text-center">
            <code className="font-mono text-sm text-muted-foreground">{snippet.target}</code>
          </div>

          {/* Code Preview */}
          <div className="mb-6">{codePreview}</div>

          {/* Preview URL */}
          <div className="mb-4">
            <label className="block text-xs text-muted-foreground mb-2">Preview URL</label>
            <button
              onClick={handleCopyUrl}
              className="w-full flex items-center gap-3 bg-muted border border-border rounded-lg p-3 hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <LinkIcon className="h-4 w-4 shrink-0 opacity-70" />
              <code className="flex-1 font-mono text-sm truncate text-left">{previewUrl}</code>
              {copiedUrl ? (
                <Check className="h-4 w-4 shrink-0 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 shrink-0 opacity-70" />
              )}
            </button>
            {copiedUrl && <p className="text-xs text-muted-foreground mt-2 text-center">URL copied!</p>}
          </div>

          {/* NPX Command */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Install Command</label>
            <button
              onClick={handleCopyCommand}
              className="w-full flex items-center gap-3 bg-foreground text-background border border-border rounded-lg p-4 hover:bg-foreground/90 transition-colors cursor-pointer"
            >
              <Terminal className="h-4 w-4 shrink-0 opacity-70" />
              <code className="flex-1 font-mono text-sm truncate text-left">{npxCommand}</code>
              {copiedCommand ? (
                <Check className="h-4 w-4 shrink-0 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 shrink-0 opacity-70" />
              )}
            </button>
            {copiedCommand && <p className="text-xs text-muted-foreground mt-2 text-center">Copied. Ready to share.</p>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Compatible with{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              shadcn/ui
            </a>{" "}
            registry format
          </p>
        </div>
      </footer>
    </div>
  )
}
