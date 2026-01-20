"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronDown, Loader2 } from "lucide-react"
import { upload } from "@vercel/blob/client"
import { nanoid } from "nanoid"
import { validatePath } from "@/lib/validation"
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
  // Generate short secure ID using nanoid (8 characters)
  // nanoid uses secure crypto by default
  return nanoid(8)
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
  const router = useRouter()
  const [code, setCode] = useState("")
  const [registryType, setRegistryType] = useState<RegistryType>("file")
  const [fileName, setFileName] = useState("")
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPathInvalid, setIsPathInvalid] = useState(false)
  const typeMenuRef = useRef<HTMLDivElement>(null)

  const currentType = registryTypes.find((t) => t.value === registryType)!

  const validatePaths = (): boolean => {
    // If fileName is empty, we'll use a default when creating, so validation passes
    if (!fileName.trim()) {
      setIsPathInvalid(false)
      return true
    }
    
    const finalFileName = fileName.trim()
    const fullPath = registryType === "file" 
      ? finalFileName 
      : `${currentType.prefix}${finalFileName}`
    const target = registryType === "file" ? `~/${finalFileName}` : null
    
    const isValid = validatePath(finalFileName) && 
                    validatePath(fullPath) && 
                    (target ? validatePath(target) : true)
    
    setIsPathInvalid(!isValid)
    return isValid
  }

  const handleCreate = async () => {
    if (!code.trim()) return
    
    // Validate paths before proceeding
    if (!validatePaths()) {
      setIsUploading(false)
      return
    }
    
    setIsUploading(true)
    setError(null)
    
    let id = generateId()
    let retries = 0
    const maxRetries = 3
    
    while (retries < maxRetries) {
      try {
        // Build JSON using existing inline logic
        const defaultFileName = `snippet-${id}.ts`
        const finalFileName = fileName.trim() || defaultFileName
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
        
        const file = new File(
          [JSON.stringify(json, null, 2)],
          `snippets/${id}.json`,
          { type: 'application/json' }
        )
        
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/snippets/upload',
        })
        
        // Success - redirect to preview page
        router.push(`/p/${id}`)
        return
      } catch (error: any) {
        // Check if it's a 409 collision
        const isCollision = error?.response?.status === 409 || 
                           error?.message?.includes('collision') ||
                           error?.status === 409
        
        if (isCollision) {
          retries++
          if (retries < maxRetries) {
            id = generateId() // Generate new ID and retry
            continue
          }
          setError('Failed to create snippet after multiple attempts. Please try again.')
        } else {
          setError('Failed to upload snippet. Please try again.')
          setIsUploading(false)
          return
        }
      }
    }
    
    setIsUploading(false)
  }

  const handleReset = () => {
    setCode("")
    setFileName("")
    setError(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 pt-12 md:pt-20 pb-8 flex flex-col">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-6xl font-semibold mb-2 text-balance  font-brand text-primary/80">
              Paste. Create. Share.
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Turn any file into a registry URL</p>
          </div>

          {/* Editor Container - Unified */}
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
                disabled={isUploading}
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
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onChange={(e) => {
                      const newValue = e.target.value
                      setFileName(newValue)
                      // Validar en tiempo real mientras escribe
                      if (newValue.trim()) {
                        // Validar inmediatamente
                        const finalFileName = newValue.trim()
                        const fullPath = registryType === "file" 
                          ? finalFileName 
                          : `${currentType.prefix}${finalFileName}`
                        const target = registryType === "file" ? `~/${finalFileName}` : null
                        
                        const isValid = validatePath(finalFileName) && 
                                        validatePath(fullPath) && 
                                        (target ? validatePath(target) : true)
                        
                        setIsPathInvalid(!isValid)
                      } else {
                        // Si está vacío, resetear el estado
                        setIsPathInvalid(false)
                      }
                    }}
                    placeholder={currentType.placeholder}
                    className="h-8 font-mono text-sm min-w-0"
                    aria-invalid={isPathInvalid}
                    disabled={isUploading}
                  />
                </InputGroup>
              </div>

              {/* Row 2 on mobile, inline on desktop: Create Button */}
              <Button 
                onClick={handleCreate} 
                disabled={!code.trim() || isUploading || isPathInvalid}
                className="w-full md:w-auto md:shrink-0 md:px-4 group hover:bg-primary"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create
                    <Kbd className="bg-primary text-primary-foreground group-hover:bg-primary/90">⏎</Kbd>
                  </>
                )}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-2 pb-2">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Compatible with{" "}
            <a
              href="https://ui.shadcn.com?utm_source=pastecn&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              shadcn/ui
            </a>{" "}
            registry format
          </p>
          <nav className="flex items-center gap-4 text-xs">
            <Link href="/use-cases/shadcn-registry-urls" className="text-muted-foreground hover:text-foreground transition-colors">
              Use Case
            </Link>
            <Link href="/blog/how-to-create-shadcn-registry-url" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
