import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import { Icons } from "@/components/icon"
import { TerminalCode } from "@/components/terminal-code"
import type { Metadata } from "next"

export const cache = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "What is pastecn? — pastecn",
  description: "Turn any code into a shareable shadcn registry URL. No setup, no hosting, no friction.",
  openGraph: {
    title: "What is pastecn? — pastecn",
    description: "Turn any code into a shareable shadcn registry URL. No setup, no hosting, no friction.",
    url: `${siteUrl}/blog/what-is-pastecn`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "What is pastecn?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is pastecn? — pastecn",
    description: "Turn any code into a shareable shadcn registry URL. No setup, no hosting, no friction.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog/what-is-pastecn`,
  },
}

export default function WhatIsPastecnPost() {
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
            What is pastecn?
          </h1>
          <p className="text-lg text-muted-foreground">
            Turn any code into a shareable shadcn registry URL. No setup, no hosting, no friction.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section>
            <p className="text-muted-foreground leading-relaxed text-base">
              <strong>pastecn</strong> is a tool that converts code snippets into shadcn/ui-compatible registry endpoints.
              You paste code, we generate a URL. Anyone with that URL can install your code directly
              using the shadcn CLI — no repository setup, no configuration files, no deployment pipeline.
            </p>
          </section>

          {/* The Problem Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">The problem it solves</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sharing reusable React components usually means one of two paths:
            </p>
            <div className="space-y-3 pl-4 border-l-2 border-border">
              <div>
                <p className="text-foreground font-medium mb-1">Publish an npm package</p>
                <p className="text-sm text-muted-foreground">
                  Overhead: versioning, CI/CD, maintenance, discoverability. Great for libraries,
                  overkill for one-off components.
                </p>
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">Copy-paste in a message</p>
                <p className="text-sm text-muted-foreground">
                  Fast but fragile. Formatting breaks, dependencies get missed, and the recipient
                  has to manually integrate it.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              <strong>pastecn</strong> sits in between. It gives you the distribution benefits of a registry without
              the setup cost of maintaining one.
            </p>
          </section>

          {/* How it Works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Paste your code</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Open <strong>pastecn</strong> and paste your component, hook, utility, or any file.
                      The editor supports syntax highlighting for common languages.
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
                    <h3 className="font-semibold text-foreground">Choose the type</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Select whether your code is a component, hook, lib utility, or a generic file.
                      This tells shadcn where to place it in the user&apos;s project structure.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                      <div className="bg-muted/50 rounded px-3 py-2">
                        <span className="font-mono text-primary">component</span>
                        <span className="text-muted-foreground"> → components/</span>
                      </div>
                      <div className="bg-muted/50 rounded px-3 py-2">
                        <span className="font-mono text-primary">hook</span>
                        <span className="text-muted-foreground"> → hooks/</span>
                      </div>
                      <div className="bg-muted/50 rounded px-3 py-2">
                        <span className="font-mono text-primary">lib</span>
                        <span className="text-muted-foreground"> → lib/</span>
                      </div>
                      <div className="bg-muted/50 rounded px-3 py-2">
                        <span className="font-mono text-primary">file</span>
                        <span className="text-muted-foreground"> → custom path</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Get your URL</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Click Create. We generate a unique ID, wrap your code in the shadcn registry format,
                      and store it. You get back a URL and install command.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Installation Example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Installing a paste</h2>
            <p className="text-muted-foreground leading-relaxed">
              Anyone can install your code using the shadcn CLI. They run one command and
              the component lands in the right place, with proper formatting intact.
            </p>

            <TerminalCode command="npx shadcn@latest add @pastecn/abc123" />

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Namespace shorthand</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">@pastecn/</code> prefix
                    is a registry namespace recognized by shadcn CLI. You can also use the full URL
                    if needed: <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">https://pastecn.com/r/abc123</code>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What You Get Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">What you get</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">Instant distribution</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    No git repo, no npm publish, no hosting setup. Paste and share immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">CLI-native installation</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Recipients use the official shadcn tooling they already know. No new tools to learn.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">Immutable snapshots</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Each paste is permanent and unchanging. No version conflicts or breaking updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground mb-1">Preview before installing</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every paste has a preview page with syntax highlighting so recipients can review
                    the code before running the install command.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">When to use <strong>pastecn</strong></h2>
            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Quick handoffs.</span>
                  <span className="text-muted-foreground"> Sharing a component with a teammate without creating a PR.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Public examples.</span>
                  <span className="text-muted-foreground"> Posting a working component in Discord, Twitter, or documentation.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">One-off utilities.</span>
                  <span className="text-muted-foreground"> Distributing helper functions that don&apos;t warrant a full package.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Testing registries.</span>
                  <span className="text-muted-foreground"> Prototyping before building a full registry infrastructure.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Final Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Built for speed</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>pastecn</strong> removes the ceremony around code distribution. No accounts, no setup, no waiting.
              You have code to share, you paste it, you get a URL. The rest is handled by tooling
              developers already use.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              It&apos;s infrastructure that gets out of your way.
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Try <strong>pastecn</strong> now
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
