"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Copy, Plus, Link as LinkIcon, FileJson, Terminal, ChevronDown } from "lucide-react"
import { track } from "@vercel/analytics/react"
import type { Snippet, SnippetMetadata } from "@/lib/snippets"
import { LockedCodeContainer } from "@/components/locked-code-container"
import { TerminalCodeRoot, TerminalCodeHeader, TerminalCodeCommand } from "@/components/terminal-code"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SnippetViewProps {
  snippet: Snippet | SnippetMetadata
  codePreviews: { id: number; preview: React.ReactNode }[]
  isLocked: boolean
}

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export function SnippetView({ snippet, codePreviews, isLocked }: SnippetViewProps) {
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedRegistryUrl, setCopiedRegistryUrl] = useState(false)
  const [packageManager, setPackageManager] = useState<PackageManager>('npm')
  const [isUnlocked, setIsUnlocked] = useState(!isLocked)
  const [fileContents, setFileContents] = useState<Record<string, string>>({})

  const registryUrl = `https://pastecn.com/r/${snippet.id}`
  const previewUrl = `https://pastecn.com/p/${snippet.id}`

  const getInstallCommand = (pm: PackageManager) => {
    const commands = {
      npm: `npx shadcn@latest add @pastecn/${snippet.id}`,
      pnpm: `pnpm dlx shadcn@latest add @pastecn/${snippet.id}`,
      yarn: `yarn dlx shadcn@latest add @pastecn/${snippet.id}`,
      bun: `bunx --bun shadcn@latest add @pastecn/${snippet.id}`,
    }
    return commands[pm]
  }

  const installCommand = getInstallCommand(packageManager)

  const handleUnlockSuccess = async () => {
    // Fetch content from API
    const response = await fetch(`/api/snippets/${snippet.id}/content`)
    if (response.ok) {
      const data = await response.json()
      const contentsMap = data.content.reduce((acc: Record<string, string>, file: { path: string; content: string }) => {
        acc[file.path] = file.content
        return acc
      }, {})
      setFileContents(contentsMap)
      setIsUnlocked(true)
    }
  }

  // Track snippet view on mount
  useEffect(() => {
    track('snippet_viewed', {
      source: 'web',
      snippet_type: snippet.type,
      language: snippet.meta.primaryLanguage,
      content_length: isUnlocked && 'files' in snippet && snippet.files.every((f: any) => 'content' in f)
        ? snippet.files.reduce((sum: number, f: any) => sum + f.content.length, 0)
        : 0,
      file_count: snippet.files.length,
    })
  }, [snippet.type, snippet.meta.primaryLanguage, snippet.files, isUnlocked])

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopiedCommand(true)
    setTimeout(() => setCopiedCommand(false), 3000)
    track('command_copied', {
      source: 'web',
      snippet_type: snippet.type,
      package_manager: packageManager,
    })
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(previewUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 3000)
    track('preview_url_copied', {
      source: 'web',
      snippet_type: snippet.type,
    })
  }

  const handleCopyRegistryUrl = async () => {
    await navigator.clipboard.writeText(registryUrl)
    setCopiedRegistryUrl(true)
    setTimeout(() => setCopiedRegistryUrl(false), 3000)
    track('registry_url_copied', {
      source: 'web',
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

          {/* Code Previews - render all files */}
          {snippet.files.length === 1 ? (
            <TerminalCodeRoot className="mb-6 bg-muted border-border">
              <TerminalCodeHeader title={snippet.files[0].path} />
              {isUnlocked ? (
                <div className="[&_>div]:!border-none [&_>div]:!rounded-none [&_pre]:!bg-transparent">
                  {codePreviews[0]?.preview || (
                    <div className="overflow-hidden rounded-lg border border-border bg-background">
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code>{fileContents[snippet.files[0].path] || ''}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <LockedCodeContainer
                  snippetId={snippet.id}
                  fileName={snippet.files[0].path}
                  onUnlockSuccess={handleUnlockSuccess}
                />
              )}
            </TerminalCodeRoot>
          ) : (
            <TerminalCodeRoot className="mb-6 bg-muted border-border">
              <Tabs defaultValue="0">
                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-border">
                  <Terminal className="w-4 h-4 text-neutral-400" />
                  <TabsList className="h-auto p-0 bg-transparent">
                    {snippet.files.map((file, idx) => {
                      const basename = file.path.split(/[/\\]/).pop() || file.path
                      return (
                        <TabsTrigger key={idx} value={String(idx)} className="text-xs">
                          {basename}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>
                {snippet.files.map((file, idx) => (
                  <TabsContent key={idx} value={String(idx)} className="mt-0">
                    <div className="mb-2 text-xs text-muted-foreground font-mono">
                      {file.path}
                    </div>
                    {isUnlocked ? (
                      <div className="[&_>div]:!border-none [&_>div]:!rounded-none [&_pre]:!bg-transparent">
                        {codePreviews[idx]?.preview || (
                          <div className="overflow-hidden rounded-lg border border-border bg-background">
                            <pre className="p-4 text-sm overflow-x-auto">
                              <code>{fileContents[file.path] || ''}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <LockedCodeContainer
                        snippetId={snippet.id}
                        fileName={file.path}
                        onUnlockSuccess={handleUnlockSuccess}
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </TerminalCodeRoot>
          )}

          {/* Install Command - Primary action */}
          <div className="mb-6">
            <div className="w-full group relative">
              <TerminalCodeRoot className="relative">
                {/* Custom header with dropdown */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
                  <Terminal className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-400 font-mono">terminal</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-100 transition-colors">
                      {packageManager}
                      <ChevronDown className="w-3 h-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPackageManager('npm')}>
                        npm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPackageManager('pnpm')}>
                        pnpm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPackageManager('yarn')}>
                        yarn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPackageManager('bun')}>
                        bun
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <button
                  onClick={handleCopyCommand}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <TerminalCodeCommand>{installCommand}</TerminalCodeCommand>
                    {copiedCommand ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 absolute right-4 top-[52px]" />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0 text-neutral-400 opacity-70 group-hover:opacity-100 transition-opacity absolute right-4 top-[52px]" />
                    )}
                  </div>
                </button>
              </TerminalCodeRoot>
            </div>

            {/* Compact URL links */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 mt-4 text-xs text-muted-foreground">
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-2 hover:text-foreground transition-colors w-fit group"
              >
                <LinkIcon className="h-3 w-3" />
                <span>Preview:</span>
                <code className="font-mono">pastecn.com/p/{snippet.id}</code>
                {copiedUrl ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
              <button
                onClick={handleCopyRegistryUrl}
                className="flex items-center gap-2 hover:text-foreground transition-colors w-fit group"
              >
                <FileJson className="h-3 w-3" />
                <span>JSON:</span>
                <code className="font-mono">pastecn.com/r/{snippet.id}</code>
                {copiedRegistryUrl ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                )}
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
