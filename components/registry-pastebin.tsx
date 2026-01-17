"use client"

import { useState } from "react"
import { Check, Copy, Terminal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type RegistryType = "file" | "component" | "hook" | "lib"

const registryTypes: { value: RegistryType; label: string; prefix: string; placeholder: string }[] = [
  { value: "file", label: "File", prefix: "~/", placeholder: "AGENTS.md" },
  { value: "component", label: "Component", prefix: "components/ui/", placeholder: "magic-card.tsx" },
  { value: "hook", label: "Hook", prefix: "hooks/", placeholder: "use-copy-to-clipboard.ts" },
  { value: "lib", label: "Lib", prefix: "lib/", placeholder: "fetcher.ts" },
]

export function RegistryPastebin() {
  const [code, setCode] = useState("")
  const [registryType, setRegistryType] = useState<RegistryType>("file")
  const [fileName, setFileName] = useState("")
  const [isCreated, setIsCreated] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)

  const generatedId = "a7x9k2m"
  const registryUrl = `https://r.shadcn.com/${generatedId}`
  const npxCommand = `npx shadcn@latest add ${registryUrl}`

  const currentType = registryTypes.find((t) => t.value === registryType)!
  const targetPath = fileName ? `${currentType.prefix}${fileName}` : `${currentType.prefix}snippet-${generatedId}.tsx`

  const hasContent = code.trim().length > 0

  const handleCreate = () => {
    if (code.trim()) {
      window.location.href = `/r/${generatedId}`
    }
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(registryUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(npxCommand)
    setCopiedCommand(true)
    setTimeout(() => setCopiedCommand(false), 3000)
  }

  const handleReset = () => {
    setCode("")
    setRegistryType("file")
    setFileName("")
    setIsCreated(false)
    setOptionsOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 pt-12 md:pt-20 pb-8 flex flex-col">
        {!isCreated ? (
          /* Input State */
          <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 text-balance tracking-tight">
                Paste. Create. Share.
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">Turn any file into a registry URL</p>
            </div>

            <div className="relative flex-1 min-h-[300px] md:min-h-[400px] mb-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your code here...`}
                className="w-full h-full min-h-[300px] md:min-h-[400px] bg-muted/30 border border-border rounded-lg p-4 font-mono text-base md:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
                spellCheck={false}
                autoFocus
              />
            </div>

            <Collapsible open={optionsOpen || hasContent} onOpenChange={setOptionsOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex items-center justify-between py-3 text-sm text-muted-foreground hover:text-foreground transition-colors ${hasContent ? "pointer-events-none" : ""}`}
                >
                  <span>Options</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${optionsOpen || hasContent ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pb-4">
                {/* Type selector */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">Type</label>
                  <div className="grid grid-cols-4 p-1 bg-muted rounded-lg w-full">
                    {registryTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setRegistryType(type.value)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                          registryType === type.value
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Path input */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                    Install path
                  </label>
                  <div className="flex items-stretch">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-md">
                      <span className="font-mono text-sm text-muted-foreground">{currentType.prefix}</span>
                    </div>
                    <Input
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder={currentType.placeholder}
                      className="rounded-l-none font-mono text-base md:text-sm"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Create Button */}
            <div className="mt-2">
              <Button onClick={handleCreate} disabled={!code.trim()} className="w-full h-12 text-base font-medium">
                Create
              </Button>
            </div>
          </div>
        ) : (
          /* Output State */
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
            {/* Success Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-foreground">Ready to install</span>
              </div>
            </div>

            <div className="mb-4 text-center">
              <span className="text-xs text-muted-foreground">Installs to </span>
              <code className="text-xs font-mono text-foreground">{targetPath}</code>
            </div>

            {/* NPX Command */}
            <div className="mb-4">
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Install Command
              </label>
              <div className="flex items-center gap-2 bg-foreground text-background border border-border rounded-lg p-4">
                <Terminal className="h-4 w-4 shrink-0 opacity-70" />
                <code className="flex-1 font-mono text-sm truncate">{npxCommand}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyCommand}
                  className="shrink-0 h-8 w-8 hover:bg-background/20 text-background"
                >
                  {copiedCommand ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copiedCommand && (
                <p className="text-xs text-muted-foreground mt-2 text-center">Copied. Ready to share.</p>
              )}
            </div>

            {/* URL Output */}
            <div className="mb-8">
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">Registry URL</label>
              <div className="flex items-center gap-2 bg-muted border border-border rounded-lg p-3">
                <code className="flex-1 font-mono text-sm text-foreground truncate">{registryUrl}</code>
                <Button variant="ghost" size="icon" onClick={handleCopyUrl} className="shrink-0 h-8 w-8">
                  {copiedUrl ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Create Another */}
            <Button variant="outline" onClick={handleReset} className="w-full h-12 bg-transparent">
              Paste another
            </Button>
          </div>
        )}
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
