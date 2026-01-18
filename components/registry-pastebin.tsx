"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)
  const typeMenuRef = useRef<HTMLDivElement>(null)

  const generatedId = "a7x9k2m"
  const currentType = registryTypes.find((t) => t.value === registryType)!

  const handleCreate = () => {
    if (code.trim()) {
      window.location.href = `/r/${generatedId}`
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 pt-12 md:pt-20 pb-8 flex flex-col">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 text-balance tracking-tight">
              Paste. Create. Share.
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Turn any file into a registry URL</p>
          </div>

          {/* Editor Container - Unified */}
          <div className="flex-1 flex flex-col border border-border rounded-lg overflow-hidden">
            {/* Textarea */}
            <div className="relative flex-1 min-h-[300px] md:min-h-[400px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your code here...`}
                className="w-full h-full min-h-[300px] md:min-h-[400px] bg-muted/30 p-4 font-mono text-base md:text-sm resize-none focus:outline-none placeholder:text-muted-foreground/50 border-0"
                spellCheck={false}
                autoFocus
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 p-2 bg-muted/50 border-t border-border">
            {/* Type Selector Dropdown */}
            <div className="relative" ref={typeMenuRef}>
              <button
                onClick={() => setTypeMenuOpen(!typeMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md bg-background hover:bg-accent transition-colors"
              >
                {currentType.label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${typeMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              {typeMenuOpen && (
                <div className="absolute bottom-full left-0 mb-1 py-1 bg-background border border-border rounded-md shadow-lg z-10 min-w-[140px]">
                  {registryTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setRegistryType(type.value)
                        setTypeMenuOpen(false)
                      }}
                      className={`w-full px-3 py-1.5 text-sm text-left hover:bg-accent transition-colors ${
                        registryType === type.value ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Path Input */}
            <div className="flex items-center flex-1 min-w-0">
              <span className="px-2 py-1.5 text-sm font-mono text-muted-foreground bg-background border border-r-0 border-border rounded-l-md whitespace-nowrap">
                {currentType.prefix}
              </span>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={currentType.placeholder}
                className="rounded-l-none h-8 font-mono text-sm border-border min-w-0"
              />
            </div>

            {/* Create Button */}
            <Button 
              onClick={handleCreate} 
              disabled={!code.trim()} 
              size="sm"
              className="shrink-0 px-4"
            >
              Create
            </Button>
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
