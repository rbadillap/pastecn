import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Shield, Terminal, KeyRound } from "lucide-react"
import { TerminalCode } from "@/components/terminal-code"
import type { Metadata } from "next"

export const cache = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "Password-Protected Snippets — pastecn",
  description: "Share code with selective access. Auto-generated passwords, enterprise security, seamless CLI integration. Control who sees your components.",
  keywords: ["password protection", "private code sharing", "shadcn CLI auth", "secure component distribution", "team code sharing"],
  openGraph: {
    title: "Password-Protected Snippets — pastecn",
    description: "Share code with selective access. Auto-generated passwords, enterprise security, seamless CLI integration. Control who sees your components.",
    url: `${siteUrl}/blog/password-protected-snippets`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Password-Protected Snippets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Password-Protected Snippets — pastecn",
    description: "Share code with selective access. Auto-generated passwords, enterprise security, seamless CLI integration.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog/password-protected-snippets`,
  },
}

export default function PasswordProtectedSnippetsPost() {
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
            Password-Protected Snippets
          </h1>
          <p className="text-lg text-muted-foreground">
            Share code with selective access. Auto-generated passwords, enterprise security, seamless CLI integration.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base">
              Not all code should be public. Internal utilities, client deliverables, preview components —
              these need controlled distribution without the overhead of private repositories.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Password protection for pastecn snippets lets you share code with specific people while
              keeping it off public search results and away from unintended viewers.
            </p>
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
                    <h3 className="font-semibold text-foreground">Toggle password protection</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When creating a snippet, enable the "Password Protection" toggle. A secure 16-character
                      password is generated automatically.
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
                    <h3 className="font-semibold text-foreground">Copy and share</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The password is shown once during creation. Copy it and share it securely with your
                      intended audience. You can regenerate a different password if needed.
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
                    <h3 className="font-semibold text-foreground">Access with password</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Recipients can immediately see the snippet URL and metadata. To view the code content,
                      they enter the password in the inline lock container, or configure authentication in
                      their project for CLI installation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Web Access */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Web access</h2>
            <p className="text-muted-foreground leading-relaxed">
              When someone visits a protected snippet URL, they immediately see the snippet metadata (URL,
              CLI command, file names) but the code content is locked. Each file shows a password input to
              unlock inline. Sessions last until the browser tab closes.
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">components/my-component.tsx</span>
                </div>
                <span className="text-xs text-muted-foreground">TSX · 142 lines</span>
              </div>

              <div className="border border-amber-200 dark:border-amber-900 rounded-lg p-6 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Lock className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Protected Content</p>
                    <p className="text-xs text-muted-foreground">Enter password to view code</p>
                  </div>
                  <div className="w-full max-w-xs space-y-2">
                    <div className="h-9 bg-background border border-border rounded px-3 flex items-center">
                      <span className="text-xs text-muted-foreground font-mono">••••••••••••••••</span>
                    </div>
                    <div className="h-9 px-4 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs font-medium">
                      Unlock Code
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CLI Integration */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">CLI integration</h2>
            <p className="text-muted-foreground leading-relaxed">
              Protected snippets work seamlessly with shadcn CLI. Configure authentication once in your project
              and install components normally.
            </p>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Step 1: Add password to environment</p>
              <TerminalCode command="# .env.local
PASTE_PASSWORD=a7B3mK9pXv2nQr4t" />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Step 2: Configure registry authentication</p>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-foreground">
{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@pastecn": {
      "url": "https://pastecn.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer \${PASTE_PASSWORD}"
      }
    }
  }
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Step 3: Install as usual</p>
              <TerminalCode command="npx shadcn@latest add @pastecn/abc123" />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Terminal className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Standard authentication</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This follows the official shadcn CLI registry authentication specification. The same pattern
                    works for any custom registry that requires authentication.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Use cases</h2>
            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Internal team utilities.</span>
                  <span className="text-muted-foreground"> Share components within your organization without making them publicly discoverable.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Client deliverables.</span>
                  <span className="text-muted-foreground"> Provide custom components to clients with controlled access.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Preview releases.</span>
                  <span className="text-muted-foreground"> Share pre-release components with selected testers before public announcement.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Sensitive examples.</span>
                  <span className="text-muted-foreground"> Protect snippets containing configuration examples or internal patterns.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Educational content.</span>
                  <span className="text-muted-foreground"> Distribute course materials or premium examples to paid students.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Security details</h2>
            <p className="text-muted-foreground leading-relaxed">
              Password protection is designed with security as a first-class concern.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <KeyRound className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Bcrypt password hashing</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Passwords are hashed using bcrypt with cost factor 10. No plaintext passwords are stored or logged.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Rate limiting</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Brute force attacks are prevented via Vercel Firewall rate limiting. 5 unlock attempts per
                    snippet per IP address per 15 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Session management</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Web sessions use httpOnly cookies that expire after 24 hours. Sessions are cleared when the
                    browser tab closes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Backward Compatible */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Optional feature</h2>
            <p className="text-muted-foreground leading-relaxed">
              Password protection is completely optional. Existing snippets remain public and work exactly as before.
              Enable protection only when you need controlled access.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Public snippets continue to be cached aggressively for performance. Protected snippets use private
              cache control headers to prevent unauthorized caching.
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Try password protection now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    </main>
  )
}
