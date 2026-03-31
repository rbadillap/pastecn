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

export const languages: { value: LanguageType; label: string; extensions: string[] }[] = [
  { value: "typescript", label: "TypeScript", extensions: [".ts"] },
  { value: "tsx", label: "TSX", extensions: [".tsx"] },
  { value: "javascript", label: "JavaScript", extensions: [".js", ".mjs", ".cjs"] },
  { value: "jsx", label: "JSX", extensions: [".jsx"] },
  { value: "json", label: "JSON", extensions: [".json"] },
  { value: "markdown", label: "Markdown", extensions: [".md", ".mdx"] },
  { value: "css", label: "CSS", extensions: [".css"] },
  { value: "plaintext", label: "Plain Text", extensions: [".txt"] },
]

export const registryTypes: {
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

// Derived lookups
export const EXTENSION_TO_LANGUAGE: Record<string, LanguageType> = Object.fromEntries(
  languages.flatMap(({ value, extensions }) => extensions.map((ext) => [ext, value]))
) as Record<string, LanguageType>

export const SUPPORTED_EXTENSIONS = Object.keys(EXTENSION_TO_LANGUAGE)
