import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Icons } from "@/components/icon"
import { TerminalCode } from "@/components/terminal-code"
import type { Metadata } from "next"

export const cache = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "How to Create a shadcn Registry URL in 5 Seconds — pastecn",
  description: "Skip the repo setup. Paste your component, get a registry URL, share it instantly.",
  openGraph: {
    title: "How to Create a shadcn Registry URL in 5 Seconds — pastecn",
    description: "Skip the repo setup. Paste your component, get a registry URL, share it instantly.",
    url: `${siteUrl}/blog/how-to-create-shadcn-registry-url`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "How to Create a shadcn Registry URL in 5 Seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Create a shadcn Registry URL in 5 Seconds — pastecn",
    description: "Skip the repo setup. Paste your component, get a registry URL, share it instantly.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog/how-to-create-shadcn-registry-url`,
  },
}

export default function BlogPostRegistryUrl() {
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
            How to Create a shadcn Registry URL in 5 Seconds
          </h1>
          <p className="text-lg text-muted-foreground">
            Skip the repo setup. Paste your component, get a registry URL, share it instantly.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">
          <section>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You just built a component. Maybe it&apos;s a magic card with a hover effect,
              a custom hook for clipboard operations, or a utility function your team keeps copying between projects.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You want to share it. The shadcn way would be to create a registry — but that means
              setting up a repo, writing the registry JSON schema, hosting it, and maintaining it.
              For one component. That&apos;s friction you don&apos;t need.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Here&apos;s the fix</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>pastecn</strong> turns any code into a shadcn-compatible registry URL. No repo, no config, no hosting.
            </p>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">Paste your code</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Open <strong>pastecn</strong> and paste your component, hook, or utility directly into the editor.
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
                    <h3 className="font-semibold text-foreground">Set the type</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Choose whether it&apos;s a component, hook, lib, or generic file.
                      This determines where it gets installed in the user&apos;s project.
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
                    <h3 className="font-semibold text-foreground">Click Create</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You get a URL. That&apos;s it. The URL is a valid shadcn registry endpoint.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">What the recipient does</h2>
            <p className="text-muted-foreground leading-relaxed">
              Anyone with the snippet ID can install your component with one command:
            </p>

            <TerminalCode command="npx shadcn@latest add @pastecn/abc123" />

            <p className="text-muted-foreground leading-relaxed">
              The CLI handles everything — downloading the code, placing it in the right directory,
              and installing any dependencies. The person receiving your component doesn&apos;t need to
              know anything about registries.
            </p>
            <p className="text-muted-foreground text-sm italic">
              You can also use the full URL: <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">https://pastecn.com/r/abc123</code>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">When to use this</h2>
            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Social sharing.</span>
                  <span className="text-muted-foreground"> Posting a component in a tweet or Discord message.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Quick handoffs.</span>
                  <span className="text-muted-foreground"> Sending code to a teammate without PR overhead.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">One-off utilities.</span>
                  <span className="text-muted-foreground"> Distributing helper code that doesn&apos;t need a package.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Registry prototyping.</span>
                  <span className="text-muted-foreground"> Testing before committing to full infrastructure.</span>
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">What you&apos;re not getting</h2>
            <p className="text-muted-foreground leading-relaxed">
              This isn&apos;t a package manager. There&apos;s no versioning, no updates, no dependency resolution.
              Each paste is immutable — a snapshot of code at a moment in time.
              If you need those features, set up a proper registry.
              If you just need to share code fast, paste and go.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Paste your code
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href="https://github.com/ronny/pastecn" target="_blank" rel="noopener noreferrer">
              <Icons.github className="mr-2 h-4 w-4" />
              Star us on GitHub
            </a>
          </Button>
        </div>
      </article>
    </main>
  )
}
