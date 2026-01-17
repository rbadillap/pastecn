"use client"

import type React from "react"
import { useState } from "react"
import { Check, Copy, Terminal, Plus } from "lucide-react"
import type { Snippet } from "@/lib/snippets"

interface SnippetViewProps {
  snippet: Snippet
  codePreview: React.ReactNode
}

export function SnippetView({ snippet, codePreview }: SnippetViewProps) {
  const [copiedCommand, setCopiedCommand] = useState(false)

  const registryUrl = `https://r.shadcn.com/${snippet.id}`
  const npxCommand = `npx shadcn@latest add ${registryUrl}`

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(npxCommand)
    setCopiedCommand(true)
    setTimeout(() => setCopiedCommand(false), 3000)
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Dashed Top Fade Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="flex-1 container mx-auto px-4 pt-6 md:pt-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <nav className="mb-8">
            <a
              href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-muted-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create yours</span>
            </a>
          </nav>

          {/* File path */}
          <div className="mb-3 text-center">
            <code className="font-mono text-sm text-muted-foreground">{snippet.target}</code>
          </div>

          {/* Code Preview */}
          <div className="mb-6">{codePreview}</div>

          {/* NPX Command - Main CTA */}
          <div>
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
    </div>
  )
}
