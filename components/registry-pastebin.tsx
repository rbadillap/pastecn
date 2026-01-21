"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronDown, Loader2, Code2 } from "lucide-react"
import { upload } from "@vercel/blob/client"
import { nanoid } from "nanoid"
import { track } from "@vercel/analytics/react"
import { validatePath } from "@/lib/validation"
import { Icons } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupButton,
  InputGroupText,
  InputGroupInput
} from "./ui/input-group"
import { Kbd } from "./ui/kbd"

type RegistryType = "file" | "component" | "hook" | "lib"

type LanguageType =
  | "typescript"
  | "javascript"
  | "tsx"
  | "jsx"
  | "json"
  | "markdown"
  | "css"
  | "plaintext"

const languages: { value: LanguageType; label: string; extensions: string[] }[] = [
  { value: "typescript", label: "TypeScript", extensions: [".ts"] },
  { value: "tsx", label: "TSX", extensions: [".tsx"] },
  { value: "javascript", label: "JavaScript", extensions: [".js", ".mjs", ".cjs"] },
  { value: "jsx", label: "JSX", extensions: [".jsx"] },
  { value: "json", label: "JSON", extensions: [".json"] },
  { value: "markdown", label: "Markdown", extensions: [".md", ".mdx"] },
  { value: "css", label: "CSS", extensions: [".css"] },
  { value: "plaintext", label: "Plain Text", extensions: [".txt"] },
]

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
  return nanoid(8)
}

function getNameFromPath(path: string): string {
  const filename = path.split('/').pop() || path
  return filename.replace(/\.[^/.]+$/, '')
}

function getExtensionFromLanguage(lang: LanguageType): string {
  const langConfig = languages.find(l => l.value === lang)
  return langConfig?.extensions[0] || ".ts"
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
  const [language, setLanguage] = useState<LanguageType>("typescript")
  const [registryType, setRegistryType] = useState<RegistryType>("component")
  const [fileName, setFileName] = useState("")
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPathInvalid, setIsPathInvalid] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const typeMenuRef = useRef<HTMLDivElement>(null)

  const currentType = registryTypes.find((t) => t.value === registryType)!
  const currentLanguage = languages.find((l) => l.value === language)!

  const handleCreate = async () => {
    if (!code.trim()) return

    // Validate paths before proceeding
    if (fileName.trim()) {
      const finalFileName = fileName.trim()
      const fullPath = registryType === "file"
        ? finalFileName
        : `${currentType.prefix}${finalFileName}`
      const target = registryType === "file" ? `~/${finalFileName}` : null

      const isValid = validatePath(finalFileName) &&
                      validatePath(fullPath) &&
                      (target ? validatePath(target) : true)

      if (!isValid) {
        setIsPathInvalid(true)
        track('snippet_creation_error', {
          error_type: 'validation_error',
          retry_count: 0,
        })
        setError('Invalid file path. Please check your input.')
        return
      }
    }

    setIsUploading(true)
    setError(null)

    let id = generateId()
    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        // Generate filename based on user input or default
        const extension = getExtensionFromLanguage(language)
        const defaultFileName = `snippet-${id}${extension}`
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

        // Track successful snippet creation
        track('snippet_created', {
          registry_type: registryType,
          language: language,
          has_custom_filename: !!fileName.trim(),
          code_length: code.length,
          filename_length: finalFileName.length,
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
            id = generateId()
            continue
          }
          track('snippet_creation_error', {
            error_type: 'id_collision',
            retry_count: retries,
          })
          setError('Failed to create snippet after multiple attempts. Please try again.')
        } else {
          track('snippet_creation_error', {
            error_type: 'upload_failed',
            retry_count: retries,
          })
          setError('Failed to upload snippet. Please try again.')
          setIsUploading(false)
          return
        }
      }
    }

    setIsUploading(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 pt-12 md:pt-20 pb-8 flex flex-col">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-6xl font-semibold mb-2 text-balance font-brand text-primary/80">
              Paste. Create. Share.
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Turn any file into a registry URL</p>
          </div>

          {/* Editor Container with InputGroup */}
          <InputGroup className="flex-1 flex flex-col min-h-[400px] md:min-h-[500px]">
            {/* Top Controls - Language Selector */}
            <InputGroupAddon align="block-start" className="border-b">
              <div className="flex items-center gap-2 w-full">
                <InputGroupText>
                  <Code2 className="h-4 w-4" />
                  <span className="text-xs">Language:</span>
                </InputGroupText>

                <div className="relative" ref={languageMenuRef}>
                  <InputGroupButton
                    size="xs"
                    onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                    disabled={isUploading}
                  >
                    {currentLanguage.label}
                    <ChevronDown className={`h-3 w-3 transition-transform ${languageMenuOpen ? "rotate-180" : ""}`} />
                  </InputGroupButton>

                  {languageMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 py-1 bg-background border border-border rounded-md shadow-lg z-10 min-w-[140px]">
                      {languages.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => {
                            if (language !== lang.value) {
                              track('language_changed', {
                                from_language: language,
                                to_language: lang.value,
                              })
                            }
                            setLanguage(lang.value)
                            setLanguageMenuOpen(false)
                          }}
                          className={`w-full px-3 py-1.5 text-xs text-left hover:bg-accent transition-colors ${
                            language === lang.value ? "text-foreground font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </InputGroupAddon>

            {/* Textarea */}
            <InputGroupTextarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              className="flex-1 font-mono text-sm min-h-[300px] md:min-h-[400px]"
              spellCheck={false}
              disabled={isUploading}
            />

            {/* Bottom Controls - Type Selector */}
            <InputGroupAddon align="block-end" className="border-t">
              <div className="flex items-center gap-2 w-full">
                <InputGroupText className="text-xs">
                  <Icons.shadcn className="h-4 w-4" />
                  <span>Registry Type:</span>
                </InputGroupText>

                <div className="relative" ref={typeMenuRef}>
                  <InputGroupButton
                    size="xs"
                    onClick={() => setTypeMenuOpen(!typeMenuOpen)}
                    disabled={isUploading}
                  >
                    {currentType.label}
                    <ChevronDown className={`h-3 w-3 transition-transform ${typeMenuOpen ? "rotate-180" : ""}`} />
                  </InputGroupButton>

                  {typeMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-1 py-1 bg-background border border-border rounded-md shadow-lg z-10 min-w-[140px]">
                      {registryTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => {
                            if (registryType !== type.value) {
                              track('registry_type_changed', {
                                from_type: registryType,
                                to_type: type.value,
                              })
                            }
                            setRegistryType(type.value)
                            setTypeMenuOpen(false)
                          }}
                          className={`w-full px-3 py-1.5 text-xs text-left hover:bg-accent transition-colors ${
                            registryType === type.value ? "text-foreground font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <InputGroupText className="text-xs text-muted-foreground/60">
                  {currentType.prefix}
                </InputGroupText>
              </div>
            </InputGroupAddon>
          </InputGroup>

          {/* Path Input - Outside InputGroup */}
          <div className="mt-3 flex flex-col md:flex-row gap-2">
            <InputGroup className="flex-1">
              <InputGroupAddon>
                {currentType.prefix}
              </InputGroupAddon>
              <InputGroupInput
                value={fileName}
                onChange={(e) => {
                  const newValue = e.target.value
                  setFileName(newValue)
                  // Real-time validation
                  if (newValue.trim()) {
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
                    setIsPathInvalid(false)
                  }
                }}
                placeholder={currentType.placeholder}
                className="h-9 font-mono text-sm"
                aria-invalid={isPathInvalid}
                disabled={isUploading}
              />
            </InputGroup>

            <Button
              onClick={handleCreate}
              disabled={!code.trim() || isUploading || isPathInvalid}
              className="w-full md:w-auto group hover:bg-primary"
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
            <div className="mt-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </div>

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
