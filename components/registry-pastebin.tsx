"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronDown, Loader2, Code2, Plus, Lock, RefreshCw, Copy, Check } from "lucide-react"
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

// ID generation moved to server-side only for security

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

export function RegistryPastebin() {
  const router = useRouter()

  // Use localStorage draft persistence
  const [draftData, setDraftData, clearDraft, hasDraft] = useLocalStorageDraft<DraftData>(
    {
      files: [{ id: nanoid(), code: "", fileName: "", language: "plaintext", registryType: "file" }],
      snippetName: ""
    },
    {
      key: "pastecn:draft",
      version: 2, // Incremented to clear old drafts with incorrect defaults
      debounceMs: 500,
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    }
  )

  // Create compatibility helpers
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

  // Password protection state
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordCopied, setPasswordCopied] = useState(false)

  // Show toast when draft is restored
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

  // Auto-generate password when protection is enabled
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
      // Multi-file: block name required, all files must have content and filename
      if (!snippetName.trim()) return false

      for (const file of files) {
        if (!file.code.trim() || !file.fileName.trim()) return false
      }
    } else {
      // Single-file: only code required
      if (!files[0].code.trim()) return false
    }

    return true
  }

  const handleCreate = async () => {
    const isMultiFile = files.length > 1

    // Validation
    if (isMultiFile) {
      // Multi-file: all filenames required
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
      // Single-file: code required, filename optional
      if (!files[0].code.trim()) {
        setError('Code is required')
        return
      }
    }

    setIsUploading(true)
    setError(null)

    // AUTO-DETECT: Use block for multi-file, otherwise use the file's registryType
    const parentType = isMultiFile ? "block" : files[0].registryType

    // Build registry JSON (ID generated server-side)
    const buildRegistryJson = (): RegistryItemJson => {
      const extension = getExtensionFromLanguage(files[0].language)

      let name: string
      if (isMultiFile) {
        name = snippetName.trim()
      } else {
        const defaultFileName = `snippet${extension}`
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

          const defaultFileName = `snippet${getExtensionFromLanguage(file.language)}`
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

    try {
      const registryJson = buildRegistryJson()

      // Upload - ID generated server-side
      const response = await fetch('/api/snippets/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registryJson,
          password: passwordProtected ? password : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const { id, password: returnedPassword } = await response.json()

      // Collect analytics data
      const fileTypes = [...new Set(files.map(f => f.registryType))]
      const languages = [...new Set(files.map(f => f.language))]

      track('snippet_created', {
        source: 'web',
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

      // Show password toast if protected
      if (passwordProtected && returnedPassword) {
        toast({
          title: "Password-protected snippet created",
          description: "Save your password - you'll need it to view the snippet.",
          duration: 6000,
        })
      }

      // Clear draft after successful upload
      clearDraft()

      // Redirect using server-generated ID
      router.push(`/p/${id}`)
    } catch (error: any) {
      track('snippet_creation_error', {
        error_type: 'upload_failed',
      })
      setError('Failed to upload snippet. Please try again.')
    } finally {
      setIsUploading(false)
    }
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

          {/* File Editors */}
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
                    {/* Language + Type Selector (Top Bar) */}
                    <InputGroupAddon align="block-start" className="border-b">
                      <div className="flex items-center gap-4 w-full">
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

                    {/* Filename Input */}
                    <InputGroupAddon align="block-end" className="border-t">
                      <div className="flex items-center gap-2 w-full">
                        <InputGroupText className="hidden md:flex text-xs text-muted-foreground">
                          Save as
                        </InputGroupText>
                        <InputGroupText className="text-xs">
                          {fileTypeConfig.prefix}
                        </InputGroupText>
                        <InputGroupInput
                          value={file.fileName}
                          onChange={(e) => updateFile(file.id, { fileName: e.target.value })}
                          placeholder={
                            files.length > 1
                              ? "filename.tsx (required)"
                              : fileTypeConfig.placeholder
                          }
                          className="font-mono text-sm"
                          disabled={isUploading}
                          required={files.length > 1}
                        />
                      </div>
                    </InputGroupAddon>
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
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/docs/api" className="text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
          </nav>
        </div>
      </footer>

      {/* Clear Draft Confirmation Dialog */}
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
