import Link from "next/link"
import { Button } from "@pastecn/ui/components/button"
import { ArrowRight, Download, Keyboard, Settings, Share2, FileCode, Link as LinkIcon } from "lucide-react"
import { Icons } from "@/components/icon"
import type { Metadata } from "next"

export const cache = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "VS Code Extension — pastecn",
  description: "Turn any code into shareable shadcn registry URLs. Paste code, get a URL, share it instantly.",
  keywords: ["vscode extension", "code sharing", "snippets", "shadcn", "visual studio code", "ide integration"],
  openGraph: {
    title: "VS Code Extension — pastecn",
    description: "Turn any code into shareable shadcn registry URLs. Paste code, get a URL, share it instantly.",
    url: `${siteUrl}/blog/vscode-extension`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "VS Code Extension",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VS Code Extension — pastecn",
    description: "Turn any code into shareable shadcn registry URLs. Paste code, get a URL, share it instantly.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog/vscode-extension`,
  },
}

export default function VSCodeExtensionPost() {
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
            VS Code Extension
          </h1>
          <p className="text-lg text-muted-foreground">
            Share code snippets directly from your editor. Select code, press a shortcut, and get a shareable URL.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base">
              The pastecn VS Code extension brings code sharing directly into your editor workflow. No need to
              copy code to a browser, select a language, and configure options separately.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Select code, trigger the command, and the extension creates a snippet and copies the URL to your
              clipboard. Your code is immediately shareable as a shadcn-compatible registry URL.
            </p>

            {/* Demo Video */}
            <div className="rounded-lg border border-border overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
              >
                <source src="/blog/vscode-extension/vscode-web.mp4" type="video/mp4" />
              </video>
            </div>
          </section>

          {/* Installation */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>

            <div className="space-y-8">
              {/* Marketplace buttons */}
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href="https://marketplace.visualstudio.com/items?itemName=pastecn.pastecn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#007ACC] text-white shrink-0">
                    <Icons.vscode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">VS Code Marketplace</p>
                    <p className="text-xs text-muted-foreground">For VS Code</p>
                  </div>
                </a>
                <a
                  href="https://open-vsx.org/extension/pastecn/pastecn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#c160ef] text-white shrink-0">
                    <Icons.openvsx className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Open VSX Registry</p>
                    <p className="text-xs text-muted-foreground">For VSCodium & alternatives</p>
                  </div>
                </a>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">From VS Code Marketplace</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Open VS Code, go to Extensions (Cmd+Shift+X / Ctrl+Shift+X), search for &quot;pastecn&quot;,
                      and click Install.
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
                    <h3 className="font-semibold text-foreground">From Open VSX (for VSCodium)</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The extension is also published to Open VSX for VSCodium and other VS Code alternatives.
                      Search for &quot;pastecn&quot; in your editor&apos;s extension marketplace.
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
                    <h3 className="font-semibold text-foreground">From VSIX file</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Download the .vsix file from the GitHub releases page, then install via the command palette:
                      &quot;Extensions: Install from VSIX...&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
            <p className="text-muted-foreground leading-relaxed">
              Three commands to share code in different ways, all accessible via command palette or keyboard shortcuts.
            </p>

            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Share Selection</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select code in the editor and share just the selection. Perfect for sharing specific functions,
                  components, or code blocks without the surrounding context.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Share File</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share the entire active file. Useful when you want to share complete components, utilities,
                  or configuration files.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Open Snippet</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a snippet URL or ID to open it in your browser. Quick access to view shared snippets
                  without leaving VS Code.
                </p>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Keyboard shortcuts</h2>
            <p className="text-muted-foreground leading-relaxed">
              The extension includes a default keyboard shortcut for the most common action. You can customize
              shortcuts in VS Code's keyboard settings.
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Share Selection</p>
                    <p className="text-sm text-muted-foreground">Share the currently selected code</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">Cmd</kbd>
                  <span className="text-muted-foreground">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">Alt</kbd>
                  <span className="text-muted-foreground">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">S</kbd>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                On Windows/Linux: Ctrl+Alt+S
              </p>
            </div>
          </section>

          {/* Context Menu */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Context menu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Right-click on selected code to access the "pastecn: Share Selection" option directly from the
              editor context menu. This appears only when text is selected.
            </p>

            <div className="rounded-lg border border-border overflow-hidden">
              <img
                src="/blog/vscode-extension/context-menu.png"
                alt="pastecn context menu in VS Code"
                className="w-full"
              />
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Select code</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Highlight the code you want to share. This can be a single line, a function, or any
                      arbitrary selection.
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
                    <h3 className="font-semibold text-foreground">Choose expiration</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A quick pick menu appears with expiration options: 1 hour, 24 hours, 7 days, 30 days,
                      or never expire.
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
                    <h3 className="font-semibold text-foreground">URL copied</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The snippet is created and the URL is automatically copied to your clipboard. A notification
                      appears with an option to open the snippet in your browser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>
            <p className="text-muted-foreground leading-relaxed">
              The extension can be configured through VS Code's settings. Access settings via Cmd+,
              (Ctrl+, on Windows/Linux) and search for "pastecn".
            </p>

            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground font-mono text-sm">pastecn.baseUrl</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Base URL for the pastecn instance. Default: https://pastecn.com
                </p>
                <p className="text-xs text-muted-foreground">
                  Use this setting if you're running a self-hosted pastecn instance.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground font-mono text-sm">pastecn.defaultExpiration</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Default expiration time for new snippets. Options: 1h, 24h, 7d, 30d, never
                </p>
                <p className="text-xs text-muted-foreground">
                  The quick pick will still appear, but this sets the pre-selected option.
                </p>
              </div>
            </div>
          </section>

          {/* Self-Hosted */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Self-hosted instances</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you're running your own pastecn instance, configure the extension to use your custom URL.
            </p>

            <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-border bg-muted/50">
                <span className="text-xs font-mono text-muted-foreground">settings.json</span>
              </div>
              <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto">
{`{
  "pastecn.baseUrl": "https://your-instance.com"
}`}
              </pre>
            </div>

            <p className="text-sm text-muted-foreground">
              All snippets created through the extension will be stored on your instance instead of pastecn.com.
            </p>
          </section>

          {/* Use Cases */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Use cases</h2>
            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Quick code reviews.</span>
                  <span className="text-muted-foreground"> Share a function or component for feedback without pushing to a branch.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Documentation examples.</span>
                  <span className="text-muted-foreground"> Share code snippets in documentation that can be installed via shadcn CLI.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Team collaboration.</span>
                  <span className="text-muted-foreground"> Share utility functions, hooks, or components with team members instantly.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Stack Overflow answers.</span>
                  <span className="text-muted-foreground"> Share runnable code examples that others can install directly into their projects.</span>
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href="https://marketplace.visualstudio.com/items?itemName=pastecn.pastecn" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Install Extension
            </a>
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
