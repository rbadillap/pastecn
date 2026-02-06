import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Trash2, Timer, Zap } from "lucide-react"
import { Icons } from "@/components/icon"
import { TerminalCode } from "@/components/terminal-code"
import type { Metadata } from "next"

export const cache = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "Link Expiration — pastecn",
  description: "Set automatic expiration times for snippets. Control snippet lifetime with flexible TTL options from 1 hour to never expire.",
  keywords: ["link expiration", "snippet TTL", "temporary code sharing", "auto-delete snippets", "time-limited sharing"],
  openGraph: {
    title: "Link Expiration — pastecn",
    description: "Set automatic expiration times for snippets. Control snippet lifetime with flexible TTL options from 1 hour to never expire.",
    url: `${siteUrl}/blog/link-expiration`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Link Expiration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Expiration — pastecn",
    description: "Set automatic expiration times for snippets. Control snippet lifetime with flexible TTL options from 1 hour to never expire.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog/link-expiration`,
  },
}

export default function LinkExpirationPost() {
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
            Link Expiration
          </h1>
          <p className="text-lg text-muted-foreground">
            Set automatic expiration times for snippets. Control snippet lifetime with flexible TTL options.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base">
              Not all code snippets need to live forever. Demo code, temporary examples, time-sensitive
              previews — these have a natural expiration date.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Link expiration for pastecn snippets lets you automatically clean up content after a specified
              time, keeping your shared links relevant and reducing digital clutter.
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
                    <h3 className="font-semibold text-foreground">Choose expiration time</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When creating a snippet, select an expiration option from the dropdown. Choose from
                      1 hour, 24 hours, 7 days, 30 days, or never expire.
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
                    <h3 className="font-semibold text-foreground">Create and share</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Create your snippet as usual. The expiration timer starts immediately. Share the URL
                      with your audience knowing it will automatically clean up when the time comes.
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
                    <h3 className="font-semibold text-foreground">Automatic cleanup</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When the expiration time arrives, the snippet becomes inaccessible. No manual deletion,
                      no leftover links — the system handles cleanup automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Expiration Options */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Expiration options</h2>
            <p className="text-muted-foreground leading-relaxed">
              Choose the lifetime that matches your use case. All times are measured from the moment
              of creation.
            </p>

            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">1 hour</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for quick code reviews, live debugging sessions, or temporary examples during meetings.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">24 hours</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ideal for daily standup examples, code samples in chat discussions, or next-day follow-ups.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">7 days</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Great for sprint-related code, weekly demos, or short-term collaboration with clients.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">30 days</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Suitable for monthly reports, extended project phases, or content with medium-term relevance.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Never expire</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The default option. Snippets remain accessible indefinitely for documentation, tutorials, or permanent references.
                </p>
              </div>
            </div>
          </section>

          {/* Expiration Visibility */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Expiration visibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              Snippets with expiration times display a countdown timer on their preview page. Viewers can
              see exactly when the content will become unavailable, helping them decide whether to install
              immediately or save the code locally.
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">components/my-component.tsx</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Expires in 6 hours</span>
                </div>
              </div>

              <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Timer className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Time-limited snippet</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This snippet will automatically expire on February 6, 2026 at 11:30 PM UTC.
                      Install now or save the code if you need it later.
                    </p>
                  </div>
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
                  <span className="font-medium">Demo code.</span>
                  <span className="text-muted-foreground"> Share examples during presentations that automatically clean up afterward.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Code review snippets.</span>
                  <span className="text-muted-foreground"> Share code fragments for quick feedback without permanent storage.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Time-sensitive previews.</span>
                  <span className="text-muted-foreground"> Share beta features or experimental code that has a limited testing window.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Temporary client work.</span>
                  <span className="text-muted-foreground"> Deliver code samples for project phases that won't need long-term access.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Privacy-conscious sharing.</span>
                  <span className="text-muted-foreground"> Minimize data retention by automatically removing snippets when no longer needed.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Combined with Password Protection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Combine with password protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              Link expiration works seamlessly with password protection. Create time-limited, password-protected
              snippets for maximum control over both access and lifetime.
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Double-layered security</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Protect sensitive code with a password <em>and</em> set an expiration time to ensure
                    it disappears after your project concludes. Perfect for client deliverables or
                    contractor work with defined end dates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Technical details</h2>
            <p className="text-muted-foreground leading-relaxed">
              Expiration is enforced at read time. When accessing an expired snippet, the system checks the
              expiration timestamp and returns a 410 Gone response if the deadline has passed.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Timestamp-based expiration</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Expiration times are stored as ISO 8601 timestamps in the snippet metadata. The system
                    compares the current time against this timestamp on every access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Immediate enforcement</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Expiration checks happen in real-time. The moment a snippet expires, it becomes
                    inaccessible. No delays, no grace periods.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">HTTP 410 Gone status</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Expired snippets return a 410 Gone status code, signaling that the resource existed
                    but is no longer available and will not return.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Default Behavior */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Optional feature</h2>
            <p className="text-muted-foreground leading-relaxed">
              Link expiration is completely optional. The default setting is "never expire" — existing
              snippets remain permanent, and new snippets default to permanent storage unless you
              explicitly choose an expiration time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You control the lifecycle of every snippet you create. Set expiration when you need it,
              skip it when you don't.
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Try link expiration now
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
