"use client"

import { useState, useRef } from "react"
import { ChevronDown, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Kbd } from "./ui/kbd"

type RegistryType = "file" | "component" | "hook" | "lib"

const registryTypes: { 
  value: RegistryType
  label: string
  prefix: string
  placeholder: string
  registryType: string 
}[] = [
  { value: "file", label: "File", prefix: "~/", placeholder: "AGENTS.md", registryType: "registry:file" },
  { value: "component", label: "Component", prefix: "components/", placeholder: "code-preview.tsx", registryType: "registry:component" },
  { value: "hook", label: "Hook", prefix: "hooks/", placeholder: "use-copy-to-clipboard.ts", registryType: "registry:hook" },
  { value: "lib", label: "Lib", prefix: "lib/", placeholder: "fetcher.ts", registryType: "registry:lib" },
]

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function getNameFromPath(path: string): string {
  const filename = path.split('/').pop() || path
  return filename.replace(/\.[^/.]+$/, '')
}

interface RegistryItemJson {
  $schema: string
  name: string
  type: string
  files: {
    path: string
    type: string
    content: string
    target?: string
  }[]
}

export function RegistryPastebin() {
  const [code, setCode] = useState("")
  const [registryType, setRegistryType] = useState<RegistryType>("file")
  const [fileName, setFileName] = useState("")
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)
  const [generatedJson, setGeneratedJson] = useState<RegistryItemJson | null>(null)
  const [copied, setCopied] = useState(false)
  const typeMenuRef = useRef<HTMLDivElement>(null)

  const currentType = registryTypes.find((t) => t.value === registryType)!

  const handleCreate = () => {
    if (!code.trim()) return

    const id = generateId()
    const defaultFileName = `snippet-${id}.ts`
    const finalFileName = fileName.trim() || defaultFileName
    
    // Build full path based on type
    const fullPath = registryType === "file" 
      ? finalFileName 
      : `${currentType.prefix}${finalFileName}`
    
    const name = getNameFromPath(finalFileName)

    const json: RegistryItemJson = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type: currentType.registryType,
      files: [
        {
          path: fullPath,
          type: currentType.registryType,
          content: code,
          ...(registryType === "file" && { target: `~/${finalFileName}` }),
        },
      ],
    }

    setGeneratedJson(json)
  }

  const handleCopyJson = async () => {
    if (!generatedJson) return
    await navigator.clipboard.writeText(JSON.stringify(generatedJson, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setGeneratedJson(null)
    setCode("")
    setFileName("")
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

          {!generatedJson ? (
            /* Editor Container - Unified */
            <div className="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-muted/30">
              {/* Textarea */}
              <div className="relative flex-1 min-h-[300px] md:min-h-[400px]">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`// Paste your code here...`}
                  className="w-full h-full min-h-[300px] md:min-h-[400px] bg-transparent p-4 font-mono text-base md:text-sm resize-none focus:outline-none placeholder:text-muted-foreground/50 border-0"
                  spellCheck={false}
                  autoFocus
                />
              </div>

              {/* Action Bar */}
              <div className="flex flex-col gap-2 p-2 bg-muted/50 border-t border-border md:flex-row md:items-center">
                {/* Row 1: Type + Input */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Type Selector Dropdown */}
                  <div className="relative shrink-0" ref={typeMenuRef}>
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
                  <InputGroup
                    className="flex items-center flex-1 min-w-0"
                  >
                    <InputGroupAddon>
                      {currentType.prefix}
                    </InputGroupAddon>
                    <InputGroupInput
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder={currentType.placeholder}
                      className="h-8 font-mono text-sm border-border min-w-0 rounded-r-none"
                    />
                  </InputGroup>
                </div>

                {/* Row 2 on mobile, inline on desktop: Create Button */}
                <Button 
                  onClick={handleCreate} 
                  disabled={!code.trim()} 
                  className="w-full md:w-auto md:shrink-0 md:px-4 group hover:bg-primary"
                >
                  Create
                  <Kbd className="bg-primary text-primary-foreground group-hover:bg-primary/90">⏎</Kbd>
                </Button>
              </div>
            </div>
          ) : (
            /* Generated JSON Preview */
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Generated Registry JSON</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyJson}>
                    {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                    {copied ? "Copied" : "Copy JSON"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Create another
                  </Button>
                </div>
              </div>
              <div className="flex-1 border border-border rounded-lg overflow-hidden bg-muted/30">
                <pre className="p-4 font-mono text-sm overflow-auto max-h-[500px]">
                  {JSON.stringify(generatedJson, null, 2)}
                </pre>
              </div>
            </div>
          )}
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
