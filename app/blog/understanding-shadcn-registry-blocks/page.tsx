import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Icons } from "@/components/icon"
import { TerminalCode } from "@/components/terminal-code"
import type { Metadata } from "next"

export const cache = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "Understanding shadcn Registry Blocks — pastecn",
  description: "Learn about registry:block and how to share complex multi-file components with pastecn.",
  openGraph: {
    title: "Understanding shadcn Registry Blocks — pastecn",
    description: "Learn about registry:block and how to share complex multi-file components with pastecn.",
    url: `${siteUrl}/blog/understanding-shadcn-registry-blocks`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Understanding shadcn Registry Blocks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Understanding shadcn Registry Blocks — pastecn",
    description: "Learn about registry:block and how to share complex multi-file components with pastecn.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog/understanding-shadcn-registry-blocks`,
  },
}

export default function RegistryBlocksPost() {
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
          <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide">Blog</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Understanding shadcn Registry Blocks
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn about <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm">registry:block</code> and how to share complex multi-file components with <strong>pastecn</strong>.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section>
            <p className="text-muted-foreground leading-relaxed">
              If you&apos;ve worked with shadcn/ui, you&apos;ve probably installed components using types like{" "}
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:component</code> or{" "}
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:hook</code>.
              But there&apos;s another type that&apos;s less talked about:{" "}
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:block</code>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Blocks are designed for complex components that span multiple files. Think complete features,
              not just single components. And now, <strong>pastecn</strong> supports them.
            </p>
          </section>

          {/* What is registry:block */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">What is <code className="font-mono text-lg bg-muted px-2 py-1 rounded">registry:block</code>?</h2>
            <p className="text-muted-foreground leading-relaxed">
              According to the{" "}
              <a
                href="https://ui.shadcn.com/docs/registry/registry-item-json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline hover:text-primary transition-colors"
              >
                official shadcn registry schema
              </a>, <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:block</code> is
              used for "complex components with multiple files."
            </p>
            <p className="text-muted-foreground leading-relaxed">
              While a <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:component</code> typically
              represents a single UI element, a block can include multiple components, hooks, utilities, types, and
              even styles — all packaged together as a cohesive unit.
            </p>
          </section>

          {/* Registry Types Comparison */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Registry types explained</h2>
            <p className="text-muted-foreground leading-relaxed">
              The shadcn registry supports{" "}
              <a
                href="https://ui.shadcn.com/docs/registry/registry-item-json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline hover:text-primary transition-colors"
              >
                several types
              </a>, each serving a different purpose:
            </p>

            <div className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">registry:ui</code>
                  <p className="text-sm text-muted-foreground">
                    Single-file UI components and primitives. The simplest form.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">registry:component</code>
                  <p className="text-sm text-muted-foreground">
                    Simple components. Usually one file, straightforward implementation.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">registry:hook</code>
                  <p className="text-sm text-muted-foreground">
                    React hooks. Custom state management or side effects.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">registry:lib</code>
                  <p className="text-sm text-muted-foreground">
                    Utility functions and helpers. Pure logic, no UI.
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0 font-semibold">registry:block</code>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Complex components with multiple files.</span>{" "}
                    <span className="text-muted-foreground">
                      Combines components, hooks, utils, and types into a complete feature.
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">registry:page</code>
                  <p className="text-sm text-muted-foreground">
                    Full page implementations or file-based routes.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">registry:file</code>
                  <p className="text-sm text-muted-foreground">
                    Miscellaneous files. Config files, types, anything else.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* When to use blocks */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">When to use blocks</h2>
            <p className="text-muted-foreground leading-relaxed">
              Use <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:block</code> when your
              component requires multiple related files to function as a complete unit.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">Authentication forms</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Login form component + validation hooks + auth utilities + type definitions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">Data tables</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Table component + column definitions + filter hooks + sorting utilities + pagination logic.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">Dashboard widgets</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Chart component + data fetching hook + formatting utilities + TypeScript interfaces.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">Form builders</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Form components + validation schemas + field components + submission handlers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* pastecn now supports blocks */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">pastecn now supports multiple files</h2>
            <p className="text-muted-foreground leading-relaxed">
              Previously, <strong>pastecn</strong> only supported single-file pastes. You could share a component,
              a hook, or a utility — but only one file at a time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Now, you can create <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:block</code> pastes
              with multiple files. Upload an entire feature, complete with all its dependencies, and share it as
              a single registry URL.
            </p>

            <img
              src="/blog/registry-blocks-editor.png"
              alt="pastecn editor with multiple files added showing registry:block type"
              className="rounded-lg border border-border"
            />
          </section>

          {/* How it works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">How it works in pastecn</h2>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Select registry:block as type</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      In the <strong>pastecn</strong> editor, choose <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">block</code> from
                      the registry type dropdown instead of component, hook, or lib.
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
                    <h3 className="font-semibold text-foreground">Add your files</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Click "Add File" to include each file your block needs. Specify the path
                      (e.g., <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">components/ui/button.tsx</code>)
                      and paste the code for each file.
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
                    <h3 className="font-semibold text-foreground">Create and share</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Click Create. You&apos;ll get a single registry URL that includes all files.
                      Anyone can install the entire block with one command.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Installation example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Installing a block</h2>
            <p className="text-muted-foreground leading-relaxed">
              From the recipient&apos;s perspective, installing a block is identical to installing
              a single-file component. The shadcn CLI handles everything:
            </p>

            <TerminalCode command="npx shadcn@latest add @pastecn/xyz789" />

            <p className="text-muted-foreground leading-relaxed text-sm">
              The CLI will download all files defined in the block and place them in the correct
              locations within the project structure. If the block has dependencies on other registry
              items, those will be resolved automatically.
            </p>
          </section>

          {/* Real-world example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Real-world example</h2>
            <p className="text-muted-foreground leading-relaxed">
              Let&apos;s say you built a custom command palette feature. It includes:
            </p>

            <div className="bg-muted/30 rounded-lg p-4 border border-border font-mono text-sm space-y-1">
              <div className="text-muted-foreground">components/</div>
              <div className="pl-4 text-foreground">command-palette.tsx</div>
              <div className="pl-4 text-foreground">command-list.tsx</div>
              <div className="pl-4 text-foreground">command-item.tsx</div>
              <div className="text-muted-foreground mt-3">hooks/</div>
              <div className="pl-4 text-foreground">use-command-state.ts</div>
              <div className="pl-4 text-foreground">use-keyboard-nav.ts</div>
              <div className="text-muted-foreground mt-3">lib/</div>
              <div className="pl-4 text-foreground">command-utils.ts</div>
              <div className="text-muted-foreground mt-3">types/</div>
              <div className="pl-4 text-foreground">command.ts</div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Instead of sharing eight separate files or bundling them into a zip, you create
              a single <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:block</code> paste
              on <strong>pastecn</strong>. One URL, eight files, zero friction.
            </p>
          </section>

          {/* Why this matters */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Why this matters</h2>
            <p className="text-muted-foreground leading-relaxed">
              Before <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">registry:block</code> support,
              sharing complex components meant:
            </p>
            <ul className="space-y-2 text-muted-foreground list-none">
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Creating a GitHub gist with multiple files</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Zipping files and uploading to cloud storage</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Writing installation instructions manually</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Hoping the recipient doesn&apos;t miss a file</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Now you paste, get a URL, and the shadcn CLI does the rest. The recipient gets
              everything in the right place, first try.
            </p>
          </section>

          {/* Final section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Start using blocks</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you&apos;ve been building complex components and wishing there was a better way to share them,
              blocks are your answer. They let you package entire features into a single, installable unit
              without the overhead of maintaining a full registry.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Paste your files, share the URL, and let shadcn handle the rest.
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Create a block
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href="https://github.com/rbadillap/pastecn" target="_blank" rel="noopener noreferrer">
              <Icons.github className="mr-2 h-4 w-4" />
              Star us on GitHub
            </a>
          </Button>
        </div>
      </article>
    </main>
  )
}
