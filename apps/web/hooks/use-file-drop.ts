"use client"

import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from "react"
import {
  registryTypes,
  EXTENSION_TO_LANGUAGE,
  SUPPORTED_EXTENSIONS,
  type LanguageType,
  type RegistryType,
} from "@/lib/registry"
import { toast } from "@pastecn/ui/hooks/use-toast"

const MAX_FILE_SIZE = 500 * 1024 // 500KB per file

export interface ParsedFile {
  fileName: string
  code: string
  language: LanguageType
  registryType: RegistryType
}

interface UseFileDropOptions {
  onFiles: (files: ParsedFile[]) => void
}

interface ResolvedFile {
  relativePath: string
  file: File
}

function getExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".")
  return lastDot === -1 ? "" : fileName.slice(lastDot).toLowerCase()
}

function inferLanguage(fileName: string): LanguageType {
  return EXTENSION_TO_LANGUAGE[getExtension(fileName)] ?? "plaintext"
}

function inferRegistryType(relativePath: string): RegistryType {
  const lower = relativePath.toLowerCase()
  const name = lower.split("/").pop() ?? lower
  if (name.startsWith("use-") || lower.includes("hooks/")) return "hook"
  if (lower.includes("components/")) return "component"
  if (lower.includes("lib/") || lower.includes("utils/")) return "lib"
  return "file"
}

// Strip the leading directory that matches the inferred registry type prefix
// e.g. "hooks/use-file-drop.ts" with type "hook" (prefix "hooks/") → "use-file-drop.ts"
//      "components/ui/button.tsx" with type "component" (prefix "components/") → "ui/button.tsx"
function stripRegistryPrefix(relativePath: string, registryType: RegistryType): string {
  const prefix = registryTypes.find((t) => t.value === registryType)?.prefix
  if (!prefix || prefix === "~/") return relativePath
  const lower = relativePath.toLowerCase()
  if (lower.startsWith(prefix.toLowerCase())) {
    return relativePath.slice(prefix.length)
  }
  return relativePath
}

function isBinary(content: string): boolean {
  return content.slice(0, 512).includes("\x00")
}

// Recursively read a FileSystemEntry and collect all files with relative paths
function readEntry(entry: FileSystemEntry, basePath: string): Promise<ResolvedFile[]> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      (entry as FileSystemFileEntry).file(
        (file) => resolve([{ relativePath: basePath + file.name, file }]),
        () => resolve([]) // skip on error
      )
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader()
      const allEntries: FileSystemEntry[] = []

      // readEntries returns batches of max ~100 entries, must call until empty
      const readBatch = () => {
        reader.readEntries(
          (entries) => {
            if (entries.length === 0) {
              Promise.all(
                allEntries.map((e) => readEntry(e, basePath + entry.name + "/"))
              ).then((results) => resolve(results.flat()))
            } else {
              allEntries.push(...entries)
              readBatch()
            }
          },
          () => resolve([]) // skip on error
        )
      }
      readBatch()
    } else {
      resolve([])
    }
  })
}

// Extract files from a drop event, handling both files and directories
async function resolveDropItems(dataTransfer: DataTransfer): Promise<ResolvedFile[]> {
  const items = dataTransfer.items
  const entries: FileSystemEntry[] = []

  // Try to get entries (supports directories)
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item) continue
    const entry = item.webkitGetAsEntry?.()
    if (entry) entries.push(entry)
  }

  if (entries.length > 0) {
    const results = await Promise.all(entries.map((e) => readEntry(e, "")))
    return results.flat()
  }

  // Fallback: plain files (no directory support)
  return Array.from(dataTransfer.files).map((file) => ({
    relativePath: file.name,
    file,
  }))
}

export function useFileDrop({ onFiles }: UseFileDropOptions) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const processResolvedFiles = useCallback(async (resolvedFiles: ResolvedFile[]) => {
    const parsed: ParsedFile[] = []
    const skipped: { name: string; reason: string }[] = []

    const promises = resolvedFiles.map(async ({ relativePath, file }) => {
      const ext = getExtension(file.name)

      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        skipped.push({ name: relativePath, reason: "unsupported type" })
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        skipped.push({ name: relativePath, reason: "exceeds 500KB" })
        return
      }

      try {
        const content = await file.text()

        if (isBinary(content)) {
          skipped.push({ name: relativePath, reason: "binary file" })
          return
        }

        const type = inferRegistryType(relativePath)

        parsed.push({
          fileName: stripRegistryPrefix(relativePath, type),
          code: content,
          language: inferLanguage(file.name),
          registryType: type,
        })
      } catch {
        skipped.push({ name: relativePath, reason: "read error" })
      }
    })

    await Promise.all(promises)

    if (parsed.length > 0) {
      onFiles(parsed)
    }

    if (skipped.length > 0) {
      toast({
        title: `${skipped.length} file${skipped.length > 1 ? "s" : ""} skipped`,
        description: skipped.map((s) => `${s.name}: ${s.reason}`).join(", "),
        duration: 5000,
      })
    }
  }, [onFiles])

  // Process files from the <input> file picker (no directory support here)
  const processFileList = useCallback(async (fileList: FileList) => {
    const resolved: ResolvedFile[] = Array.from(fileList).map((file) => ({
      relativePath: file.name,
      file,
    }))
    await processResolvedFiles(resolved)
  }, [processResolvedFiles])

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    dragCounterRef.current++
    if (dragCounterRef.current === 1) {
      setIsDragging(true)
    }
  }, [])

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
  }, [])

  const onDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault()
    dragCounterRef.current = 0
    setIsDragging(false)

    const resolved = await resolveDropItems(e.dataTransfer)
    if (resolved.length > 0) {
      await processResolvedFiles(resolved)
    }
  }, [processResolvedFiles])

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(e.target.files)
      e.target.value = "" // reset so the same files can be re-selected
    }
  }, [processFileList])

  const getRootProps = useCallback(() => ({
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
  }), [onDragEnter, onDragLeave, onDragOver, onDrop])

  const getInputProps = useCallback(() => ({
    ref: inputRef,
    type: "file" as const,
    multiple: true,
    accept: SUPPORTED_EXTENSIONS.join(","),
    onChange: onInputChange,
    className: "hidden",
    tabIndex: -1,
  }), [onInputChange])

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    isDragging,
    getRootProps,
    getInputProps,
    openFilePicker,
  }
}
