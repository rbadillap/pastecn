import Link from "next/link"
import { Button } from "@pastecn/ui/components/button"
import { ArrowRight, Upload, FolderOpen, FileCode, Zap, MousePointerClick } from "lucide-react"
import type { Metadata } from "next"

export const cache = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "Drag & Drop Upload — pastecn",
  description: "Drag files or entire folders into pastecn to create multi-file snippets instantly. Language, type, and paths are auto-detected.",
  keywords: ["drag and drop", "file upload", "multi-file snippets", "shadcn", "folder upload", "code sharing"],
  openGraph: {
    title: "Drag & Drop Upload — pastecn",
    description: "Drag files or entire folders into pastecn to create multi-file snippets instantly. Language, type, and paths are auto-detected.",
    url: `${siteUrl}/blog/drag-drop-upload`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Drag & Drop Upload",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drag & Drop Upload — pastecn",
    description: "Drag files or entire folders into pastecn to create multi-file snippets instantly. Language, type, and paths are auto-detected.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog/drag-drop-upload`,
  },
}

export default function DragDropUploadPost() {
  return (
    <main className="min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Blog
          </Link>
          <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide">Feature Announcement</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Drag & Drop Upload
          </h1>
          <p className="text-lg text-muted-foreground">
            Drag files or entire folders from your computer to create multi-file snippets instantly. No more copy-pasting one file at a time.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base">
              Creating multi-file snippets used to mean adding files one by one, typing filenames, pasting code,
              and manually selecting the language and type for each. That workflow is gone.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Now you can drag files or folders directly from Finder, Explorer, or any file manager into the
              pastecn editor. Everything is auto-detected: filename, language, registry type, and relative paths.
            </p>
          </section>

          {/* How it works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Drag from your file manager</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Select files or folders in Finder, Explorer, or any file manager and drag them into the
                      pastecn editor. A drop zone overlay appears to confirm.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Everything is auto-detected</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Language is inferred from file extensions. Registry type is inferred from the path:
                      files in <code className="text-xs bg-muted px-1 py-0.5 rounded">hooks/</code> become hooks,
                      files in <code className="text-xs bg-muted px-1 py-0.5 rounded">components/</code> become components,
                      and so on.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Create the snippet</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Review the files, adjust anything if needed, and hit Create Snippet. You get a shareable
                      registry URL that preserves your file structure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Features</h2>

            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Folder support</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Drop entire folders and pastecn recursively reads all files inside, preserving the
                  directory structure as relative paths.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Smart detection</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Language is inferred from extensions (.ts, .tsx, .css, .json, and more).
                  Registry type is inferred from path conventions: hooks/, components/, lib/.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <MousePointerClick className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">File picker fallback</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Prefer clicking? The Upload Files button opens your native file picker.
                  Same auto-detection, different input method.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Unsupported files handled</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Binary files, images, and unsupported extensions are automatically skipped with a
                  notification. Only text files that pastecn supports are added.
                </p>
              </div>
            </div>
          </section>

          {/* Supported file types */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Supported file types</h2>
            <p className="text-muted-foreground leading-relaxed">
              The following extensions are recognized and auto-detected:
            </p>

            <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-border bg-muted/50">
                <span className="text-xs font-mono text-muted-foreground">Extensions</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { ext: ".ts", lang: "TypeScript" },
                    { ext: ".tsx", lang: "TSX" },
                    { ext: ".js", lang: "JavaScript" },
                    { ext: ".jsx", lang: "JSX" },
                    { ext: ".json", lang: "JSON" },
                    { ext: ".md", lang: "Markdown" },
                    { ext: ".css", lang: "CSS" },
                    { ext: ".txt", lang: "Plain Text" },
                  ].map(({ ext, lang }) => (
                    <div key={ext} className="flex items-center gap-2">
                      <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">{ext}</code>
                      <span className="text-xs text-muted-foreground">{lang}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Files larger than 500 KB are skipped to keep snippets fast and lightweight.
            </p>
          </section>

          {/* Path inference */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Path-based type inference</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you drop a folder, pastecn uses the file path to automatically set the registry type.
              The matching prefix is stripped from the filename to avoid duplication.
            </p>

            <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-border bg-muted/50">
                <span className="text-xs font-mono text-muted-foreground">Examples</span>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { path: "hooks/use-counter.ts", type: "Hook", filename: "use-counter.ts" },
                  { path: "components/ui/button.tsx", type: "Component", filename: "ui/button.tsx" },
                  { path: "lib/fetcher.ts", type: "Lib", filename: "fetcher.ts" },
                  { path: "README.md", type: "File", filename: "README.md" },
                ].map(({ path, type, filename }) => (
                  <div key={path} className="flex items-center gap-3 text-sm">
                    <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono flex-shrink-0">{path}</code>
                    <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">
                      type: <span className="text-foreground font-medium">{type}</span>, file: <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">{filename}</code>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Use cases</h2>
            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Share a component with its hooks.</span>
                  <span className="text-muted-foreground"> Drop a folder with components and hooks together. Paths and types are preserved.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Share a design system block.</span>
                  <span className="text-muted-foreground"> Drop multiple related files and create a registry block that installs with a single command.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Quick prototyping.</span>
                  <span className="text-muted-foreground"> Drag utility files from a project into pastecn to share a working setup with a teammate.</span>
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Upload className="mr-2 h-4 w-4" />
              Try It Now
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href="https://github.com/rbadillap/pastecn" target="_blank" rel="noopener noreferrer">
              Star us on GitHub
            </a>
          </Button>
        </div>
      </article>
    </main>
  )
}
