import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "How to Create a shadcn Registry URL in 5 Seconds — pastecn",
  description: "Skip the repo setup. Paste your component, get a registry URL, share it instantly.",
}

export default function BlogPostRegistryUrl() {
  return (
    <main className="min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
        {/* Header */}
        <header className="mb-12">
          <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide">Blog</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            How to Create a shadcn Registry URL in 5 Seconds
          </h1>
          <p className="text-lg text-muted-foreground">
            Skip the repo setup. Paste your component, get a registry URL, share it instantly.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          <section className="mb-10">
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

          <section className="mb-10">
            <h2 className="text-xl font-medium mb-4">Here&apos;s the fix</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              pastecn turns any code into a shadcn-compatible registry URL. No repo, no config, no hosting.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">1. Paste your code</h3>
                <p className="text-muted-foreground text-sm">
                  Open pastecn and paste your component, hook, or utility directly into the editor.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">2. Set the type</h3>
                <p className="text-muted-foreground text-sm">
                  Choose whether it&apos;s a component, hook, lib, or generic file.
                  This determines where it gets installed in the user&apos;s project.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">3. Click Create</h3>
                <p className="text-muted-foreground text-sm">
                  You get a URL. That&apos;s it. The URL is a valid shadcn registry endpoint.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-medium mb-4">What the recipient does</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Anyone with the URL can install your component with one command:
            </p>
            <div className="bg-muted-foreground/10 border border-primary/10 rounded-lg p-4 font-mono text-sm mb-4">
              npx shadcn@latest add https://pastecn.com/r/abc123
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The CLI handles everything — downloading the code, placing it in the right directory,
              and installing any dependencies. The person receiving your component doesn&apos;t need to
              know anything about registries.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-medium mb-4">When to use this</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Sharing a component in a tweet or Discord message</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Quick handoff to a teammate without PR overhead</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Distributing a one-off utility that doesn&apos;t need a package</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground">—</span>
                <span>Prototyping before committing to a full registry</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-medium mb-4">What you&apos;re not getting</h2>
            <p className="text-muted-foreground leading-relaxed">
              This isn&apos;t a package manager. There&apos;s no versioning, no updates, no dependency resolution.
              Each paste is immutable — a snapshot of code at a moment in time.
              If you need those features, set up a proper registry.
              If you just need to share code fast, paste and go.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-border">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Paste your code
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    </main>
  )
}
