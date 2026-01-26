"use client"

/**
 * VARIANT 1: Filename moved to top bar alongside Type and Language
 * This makes the filename field more discoverable by placing it with other controls
 */

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronDown, Loader2, Code2, Plus, Lock, RefreshCw, Copy, Check, FileText } from "lucide-react"
import { upload } from "@vercel/blob/client"
import { nanoid } from "nanoid"
import { track } from "@vercel/analytics/react"
import { validatePath } from "@/lib/validation"
import { createSnippetPassword } from "@/lib/password"
import { Icons } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupButton,
  InputGroupText,
  InputGroupInput
} from "./ui/input-group"
import { Kbd } from "./ui/kbd"
import { useLocalStorageDraft } from "@/hooks/use-local-storage-draft"
import { toast } from "@/hooks/use-toast"
import { ClearDraftDialog } from "./clear-draft-dialog"

export type RegistryType = "file" | "component" | "hook" | "lib"

export type LanguageType =
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

interface FileInput {
  id: string
  code: string
  fileName: string
  language: LanguageType
  registryType: RegistryType
}

interface DraftData {
  files: FileInput[]
  snippetName: string
}

export function RegistryPastebinV1() {
  const router = useRouter()

  // Use localStorage draft persistence
  const [draftData, setDraftData, clearDraft, hasDraft] = useLocalStorageDraft<DraftData>(
    {
      files: [{ id: nanoid(), code: "", fileName: "", language: "plaintext", registryType: "file" }],
      snippetName: ""
    },
    {
      key: "pastecn:draft",
      version: 2,
      debounceMs: 500,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  )

  const files = draftData.files
  const snippetName = draftData.snippetName

  const setFiles = (newFiles: FileInput[] | ((prev: FileInput[]) => FileInput[])) => {
    setDraftData(prev => ({
      ...prev,
      files: typeof newFiles === 'function' ? newFiles(prev.files) : newFiles
    }))
  }

  const setSnippetName = (name: string) => {
    setDraftData(prev => ({ ...prev, snippetName: name }))
  }

  const [languageMenuOpen, setLanguageMenuOpen] = useState<string | false>(false)
  const [fileTypeMenuOpen, setFileTypeMenuOpen] = useState<string | false>(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showClearDraftDialog, setShowClearDraftDialog] = useState(false)

  const [passwordProtected, setPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordCopied, setPasswordCopied] = useState(false)

  useEffect(() => {
    if (hasDraft) {
      toast({
        title: "Draft restored",
        description: "Your previous work has been recovered.",
        duration: 4000,
      })

      track('draft_restored', {
        file_count: files.length,
        total_code_length: files.reduce((sum, f) => sum + f.code.length, 0)
      })
    }
  }, [hasDraft])

  useEffect(() => {
    if (passwordProtected && !password) {
      setPassword(createSnippetPassword())
    }
  }, [passwordProtected, password])

  const addFile = () => {
    const newFiles: FileInput[] = [...files, { id: nanoid(), code: "", fileName: "", language: "plaintext", registryType: "file" }]
    setFiles(newFiles)

    track('file_added', {
      total_files: newFiles.length,
      previous_count: files.length,
    })
  }

  const removeFile = (id: string) => {
    if (files.length > 1) {
      const newFiles = files.filter(f => f.id !== id)
      setFiles(newFiles)

      track('file_removed', {
        total_files: newFiles.length,
        previous_count: files.length,
        went_to_single_file: newFiles.length === 1,
      })
    }
  }

  const updateFile = (id: string, updates: Partial<FileInput>) => {
    setFiles(files.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const isFormValid = () => {
    const isMultiFile = files.length > 1

    if (isMultiFile) {
      if (!snippetName.trim()) return false

      for (const file of files) {
        if (!file.code.trim() || !file.fileName.trim()) return false
      }
    } else {
      if (!files[0].code.trim()) return false
    }

    return true
  }

  const handleCreate = async () => {
    const isMultiFile = files.length > 1

    if (isMultiFile) {
      if (!snippetName.trim()) {
        setError('Block name is required for multi-file blocks')
        return
      }

      for (const file of files) {
        if (!file.code.trim()) {
          setError('All files must have content')
          return
        }
        if (!file.fileName.trim()) {
          setError('All files must have a filename')
          return
        }
        if (!validatePath(file.fileName)) {
          setError(`Invalid filename: ${file.fileName}`)
          return
        }
      }
    } else {
      if (!files[0].code.trim()) {
        setError('Code is required')
        return
      }
    }

    setIsUploading(true)
    setError(null)

    const parentType = isMultiFile ? "block" : files[0].registryType

    let id = generateId()
    let retries = 0
    const maxRetries = 3

    const buildRegistryJson = (snippetId: string): RegistryItemJson => {
      const extension = getExtensionFromLanguage(files[0].language)

      let name: string
      if (isMultiFile) {
        name = snippetName.trim()
      } else {
        const defaultFileName = `snippet-${snippetId}${extension}`
        const finalFileName = files[0].fileName.trim() || defaultFileName
        name = getNameFromPath(finalFileName)
      }

      return {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name,
        type: `registry:${parentType}`,
        files: files.map(file => {
          const fileType = file.registryType
          const fileTypeConfig = registryTypes.find(t => t.value === fileType)!

          const defaultFileName = `snippet-${snippetId}${getExtensionFromLanguage(file.language)}`
          const finalFileName = file.fileName.trim() || defaultFileName
          const fullPath = fileType === "file"
            ? finalFileName
            : `${fileTypeConfig.prefix}${finalFileName}`

          return {
            path: fullPath,
            type: `registry:${fileType}`,
            content: file.code,
            ...(fileType === "file" && { target: `~/${finalFileName}` }),
          }
        }),
      }
    }

    while (retries < maxRetries) {
      try {
        const registryJson = buildRegistryJson(id)

        const response = await fetch('/api/snippets/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            registryJson,
            password: passwordProtected ? password : undefined,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const { blob: blobData, password: returnedPassword } = await response.json()

        const fileTypes = [...new Set(files.map(f => f.registryType))]
        const languages = [...new Set(files.map(f => f.language))]

        track('snippet_created', {
          registry_type: parentType,
          language: files[0].language,
          has_custom_filename: isMultiFile || !!files[0].fileName.trim(),
          code_length: files.reduce((sum, f) => sum + f.code.length, 0),
          file_count: files.length,
          is_multi_file: isMultiFile,
          is_protected: passwordProtected,
          file_types: JSON.stringify(fileTypes),
          file_types_count: fileTypes.length,
          has_mixed_types: fileTypes.length > 1,
          languages_used: JSON.stringify(languages),
          has_custom_block_name: isMultiFile && !!snippetName.trim(),
          all_files_have_custom_names: files.every(f => !!f.fileName.trim()),
        })

        if (passwordProtected && returnedPassword) {
          toast({
            title: "Password-protected snippet created",
            description: "Save your password - you'll need it to view the snippet.",
            duration: 6000,
          })
        }

        clearDraft()

        router.push(`/p/${id}`)
        return
      } catch (error: any) {
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
      <div className="flex-1 container mx-auto px-4 pt-12 md:pt-20 pb-8 flex flex-col">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-6xl font-semibold mb-2 text-balance font-brand text-primary/80">
              Paste. Create. Share.
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Turn any file into a registry URL</p>
            <p className="text-xs text-amber-600 mt-2">VARIANT 1: Filename in top bar</p>
          </div>

          <div className="space-y-4 flex-1">
            {files.map((file, idx) => {
              const isMultiFile = files.length > 1
              const fileTypeConfig = registryTypes.find(t => t.value === file.registryType)!

              return (
                <div key={file.id} className="flex flex-col">
                  {files.length > 1 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        File {idx + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={isUploading || files.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  <InputGroup className="flex-1 flex flex-col min-h-[300px]">
                    {/* VARIANT 1: Top Bar with Type, Language, AND Filename */}
                    <InputGroupAddon align="block-start" className="border-b">
                      <div className="flex flex-wrap items-center gap-4 w-full">
                        {/* Type selector */}
                        <div className="flex items-center gap-2">
                          <InputGroupText>
                            <Icons.shadcn className="h-4 w-4" />
                            <span className="text-xs hidden md:inline">Type:</span>
                          </InputGroupText>

                          <div className="relative">
                            <InputGroupButton
                              size="xs"
                              onClick={() => {
                                const newState = fileTypeMenuOpen === file.id ? false : file.id
                                setFileTypeMenuOpen(newState)
                              }}
                              disabled={isUploading}
                            >
                              {fileTypeConfig.label}
                              <ChevronDown className={`h-3 w-3 transition-transform ${fileTypeMenuOpen === file.id ? "rotate-180" : ""}`} />
                            </InputGroupButton>

                            {fileTypeMenuOpen === file.id && (
                              <div className="absolute top-full left-0 mt-1 py-1 bg-background border border-border rounded-md shadow-lg z-10 min-w-[140px]">
                                {registryTypes.map((type) => (
                                  <button
                                    key={type.value}
                                    onClick={() => {
                                      if (file.registryType !== type.value) {
                                        track('registry_type_changed', {
                                          from_type: file.registryType,
                                          to_type: type.value,
                                        })
                                      }
                                      updateFile(file.id, { registryType: type.value })
                                      setFileTypeMenuOpen(false)
                                    }}
                                    className={`w-full px-3 py-1.5 text-xs text-left hover:bg-accent transition-colors ${
                                      file.registryType === type.value ? "text-foreground font-medium" : "text-muted-foreground"
                                    }`}
                                  >
                                    {type.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Language selector */}
                        <div className="flex items-center gap-2">
                          <InputGroupText>
                            <Code2 className="h-4 w-4" />
                            <span className="text-xs hidden md:inline">Language:</span>
                          </InputGroupText>

                          <div className="relative">
                            <InputGroupButton
                              size="xs"
                              onClick={() => {
                                const newState = languageMenuOpen === file.id ? false : file.id
                                setLanguageMenuOpen(newState)
                              }}
                              disabled={isUploading}
                            >
                              {languages.find(l => l.value === file.language)?.label || languages.find(l => l.value === "plaintext")?.label}
                              <ChevronDown className={`h-3 w-3 transition-transform ${languageMenuOpen === file.id ? "rotate-180" : ""}`} />
                            </InputGroupButton>

                            {languageMenuOpen === file.id && (
                              <div className="absolute top-full left-0 mt-1 py-1 bg-background border border-border rounded-md shadow-lg z-10 min-w-[140px]">
                                {languages.map((lang) => (
                                  <button
                                    key={lang.value}
                                    onClick={() => {
                                      updateFile(file.id, { language: lang.value })
                                      setLanguageMenuOpen(false)
                                    }}
                                    className={`w-full px-3 py-1.5 text-xs text-left hover:bg-accent transition-colors ${
                                      file.language === lang.value ? "text-foreground font-medium" : "text-muted-foreground"
                                    }`}
                                  >
                                    {lang.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* FILENAME - Now in top bar */}
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                          <InputGroupText>
                            <FileText className="h-4 w-4" />
                            <span className="text-xs hidden md:inline">Filename:</span>
                          </InputGroupText>
                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-xs text-muted-foreground font-mono">{fileTypeConfig.prefix}</span>
                            <input
                              value={file.fileName}
                              onChange={(e) => updateFile(file.id, { fileName: e.target.value })}
                              placeholder={
                                files.length > 1
                                  ? "required"
                                  : fileTypeConfig.placeholder
                              }
                              className="flex-1 bg-transparent border-none outline-none font-mono text-sm placeholder:text-muted-foreground/50"
                              disabled={isUploading}
                              required={files.length > 1}
                            />
                          </div>
                        </div>
                      </div>
                    </InputGroupAddon>

                    {/* Code Textarea */}
                    <InputGroupTextarea
                      value={file.code}
                      onChange={(e) => updateFile(file.id, { code: e.target.value })}
                      placeholder="// Paste your code here..."
                      className="flex-1 font-mono text-sm min-h-[200px]"
                      spellCheck={false}
                      disabled={isUploading}
                    />
                  </InputGroup>
                </div>
              )
            })}
          </div>

          {/* Block Name + Add File button */}
          <div className="mt-4 flex items-center gap-2">
            {files.length > 1 && (
              <div className="flex-1">
                <InputGroup>
                  <InputGroupAddon>Block Name</InputGroupAddon>
                  <InputGroupInput
                    value={snippetName}
                    onChange={(e) => setSnippetName(e.target.value)}
                    placeholder="dashboard"
                    className="font-mono text-sm"
                    disabled={isUploading}
                    required
                  />
                </InputGroup>
              </div>
            )}
            {hasDraft && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearDraftDialog(true)}
                disabled={isUploading}
                className={files.length === 1 ? "ml-auto" : ""}
              >
                Clear Draft
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={addFile}
              disabled={isUploading}
              className={`hover:text-muted-foreground ${files.length === 1 && !hasDraft ? "ml-auto" : ""}`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add File
            </Button>
          </div>

          {/* Password Protection */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="password-protection" className="text-sm font-medium">
                  Password Protection (Optional)
                </Label>
              </div>
              <Switch
                id="password-protection"
                checked={passwordProtected}
                onCheckedChange={(checked) => {
                  setPasswordProtected(checked)
                  track('password_protection_toggled', {
                    enabled: checked,
                  })
                }}
                disabled={isUploading}
              />
            </div>

            {passwordProtected && (
              <div className="space-y-2 p-3 border rounded-md bg-amber-50 dark:bg-amber-950/20">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Save this password - you&apos;ll need it to view the snippet
                </p>
                <div className="flex gap-2">
                  <Input
                    value={password}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setPassword(createSnippetPassword())
                      setPasswordCopied(false)
                      track('password_regenerated')
                    }}
                    disabled={isUploading}
                    title="Generate new password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(password)
                      setPasswordCopied(true)
                      setTimeout(() => setPasswordCopied(false), 2000)
                      toast({
                        title: "Password copied",
                        description: "Keep it safe - you'll need it to access the snippet.",
                        duration: 3000,
                      })
                      track('password_copied')
                    }}
                    disabled={isUploading}
                    title="Copy password"
                  >
                    {passwordCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Create Button */}
          <div className="mt-4">
            <Button
              onClick={handleCreate}
              disabled={isUploading || !isFormValid()}
              className="w-full group hover:bg-primary"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  {files.length > 1 ? `Create Snippet (${files.length} files)` : 'Create Snippet'}
                  <Kbd className="bg-primary text-primary-foreground group-hover:bg-primary/90">⏎</Kbd>
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </div>

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
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </footer>

      <ClearDraftDialog
        open={showClearDraftDialog}
        onOpenChange={setShowClearDraftDialog}
        fileCount={files.length}
        onClearDraft={clearDraft}
        onResetDraftData={setDraftData}
      />
    </div>
  )
}
