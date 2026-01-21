"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Copy, Plus, Link as LinkIcon, FileJson } from "lucide-react"
import { track } from "@vercel/analytics/react"
import type { Snippet } from "@/lib/snippets"
import { TerminalCodeRoot, TerminalCodeHeader, TerminalCodeCommand } from "@/components/terminal-code"

interface SnippetViewProps {
  snippet: Snippet
  codePreviews: { id: number; preview: React.ReactNode }[]
}

export function SnippetView({ snippet, codePreviews }: SnippetViewProps) {
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedRegistryUrl, setCopiedRegistryUrl] = useState(false)

  const registryUrl = `https://pastecn.com/r/${snippet.id}`
  const previewUrl = `https://pastecn.com/p/${snippet.id}`
  const npxCommand = `npx shadcn@latest add @pastecn/${snippet.id}`

  // Track snippet view on mount
  useEffect(() => {
    track('snippet_viewed', {
      snippet_id: snippet.id,
      snippet_type: snippet.type,
      language: snippet.meta.primaryLanguage,
      content_length: snippet.files.reduce((sum, f) => sum + f.content.length, 0),
      file_count: snippet.files.length,
    })
  }, [snippet.id, snippet.type, snippet.meta.primaryLanguage, snippet.files])

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

  const handleCopyRegistryUrl = async () => {
    await navigator.clipboard.writeText(registryUrl)
    setCopiedRegistryUrl(true)
    setTimeout(() => setCopiedRegistryUrl(false), 3000)
    track('registry_url_copied', {
      snippet_id: snippet.id,
      snippet_type: snippet.type,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-4 pt-12 md:pt-20 pb-8">
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

          {/* Block badge */}
          {snippet.type === 'block' && (
            <div className="mb-2 text-center">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Registry Block
              </span>
            </div>
          )}

          {/* File paths */}
          <div className="mb-3 text-center">
            {snippet.files.length === 1 ? (
              <code className="font-mono text-sm text-muted-foreground">
                {snippet.files[0].target}
              </code>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-2">
                  {snippet.files.length} files
                </p>
                {snippet.files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-2">
                    <code className="font-mono text-xs text-muted-foreground">
                      {file.target}
                    </code>
                    <span className="text-xs text-primary">
                      ({file.type})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Code Previews - render all files */}
          <div className="space-y-4 mb-6">
            {snippet.files.map((file, idx) => (
              <div key={idx}>
                {snippet.files.length > 1 && (
                  <div className="mb-2 text-xs text-muted-foreground font-mono">
                    {file.path}
                  </div>
                )}
                {codePreviews[idx]?.preview}
              </div>
            ))}
          </div>

          {/* Install Command - Primary action */}
          <div className="mb-6">
            <label className="block text-xs text-muted-foreground mb-2">Install Command</label>
            <button
              onClick={handleCopyCommand}
              className="w-full group relative hover:opacity-90 transition-opacity"
            >
              <TerminalCodeRoot className="relative">
                <TerminalCodeHeader title="terminal" />
                <div className="flex items-center gap-2">
                  <TerminalCodeCommand>{npxCommand}</TerminalCodeCommand>
                  {copiedCommand ? (
                    <Check className="h-4 w-4 shrink-0 text-green-400 absolute right-4 top-[52px]" />
                  ) : (
                    <Copy className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity absolute right-4 top-[52px]" />
                  )}
                </div>
              </TerminalCodeRoot>
            </button>
          </div>

          {/* URLs Grid - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preview URL */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Preview URL</label>
              <button
                onClick={handleCopyUrl}
                className="w-full group relative hover:opacity-90 transition-opacity"
              >
                <TerminalCodeRoot className="bg-muted border-border relative">
                  <TerminalCodeHeader title="preview">
                    <LinkIcon className="h-3 w-3 ml-auto opacity-50" />
                  </TerminalCodeHeader>
                  <div className="flex items-center gap-2">
                    <TerminalCodeCommand showPrompt={false} className="text-foreground truncate">
                      {previewUrl}
                    </TerminalCodeCommand>
                    {copiedUrl ? (
                      <Check className="h-4 w-4 shrink-0 text-green-600 absolute right-4 top-[52px]" />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity absolute right-4 top-[52px]" />
                    )}
                  </div>
                </TerminalCodeRoot>
              </button>
            </div>

            {/* Raw JSON URL */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Raw JSON</label>
              <button
                onClick={handleCopyRegistryUrl}
                className="w-full group relative hover:opacity-90 transition-opacity"
              >
                <TerminalCodeRoot className="bg-muted border-border relative">
                  <TerminalCodeHeader title="registry">
                    <FileJson className="h-3 w-3 ml-auto opacity-50" />
                  </TerminalCodeHeader>
                  <div className="flex items-center gap-2">
                    <TerminalCodeCommand showPrompt={false} className="text-foreground truncate">
                      {registryUrl}
                    </TerminalCodeCommand>
                    {copiedRegistryUrl ? (
                      <Check className="h-4 w-4 shrink-0 text-green-600 absolute right-4 top-[52px]" />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity absolute right-4 top-[52px]" />
                    )}
                  </div>
                </TerminalCodeRoot>
              </button>
            </div>
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
