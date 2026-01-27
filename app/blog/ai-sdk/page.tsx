import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Sparkles, Code2, Share2 } from "lucide-react"
import { Icons } from "@/components/icon"
import { TerminalCode } from "@/components/terminal-code"
import { CodeBlock } from "@/components/code-block"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "Introducing @pastecn/ai-sdk — pastecn",
  description: "AI SDK tools for creating and reading pastecn snippets directly from your AI agents. Let your agents share code seamlessly.",
  keywords: ["AI SDK", "Vercel AI SDK", "AI tools", "code sharing", "LLM tools", "agent tools", "shadcn registry"],
  openGraph: {
    title: "Introducing @pastecn/ai-sdk — pastecn",
    description: "AI SDK tools for creating and reading pastecn snippets directly from your AI agents.",
    url: `${siteUrl}/blog/ai-sdk`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing @pastecn/ai-sdk — pastecn",
    description: "AI SDK tools for creating and reading pastecn snippets directly from your AI agents.",
  },
  alternates: {
    canonical: `${siteUrl}/blog/ai-sdk`,
  },
}

export default function AiSdkPost() {
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
            Introducing @pastecn/ai-sdk
          </h1>
          <p className="text-lg text-muted-foreground">
            AI SDK tools for creating and reading pastecn snippets directly from your AI agents.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base">
              AI agents are becoming the primary interface for code generation. Whether you&apos;re building
              a coding assistant, a component generator, or an automated workflow, your agents need a way
              to share the code they create.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">@pastecn/ai-sdk</code> provides
              ready-to-use tools for the Vercel AI SDK that let your agents create and retrieve pastecn
              snippets programmatically.
            </p>
          </section>

          {/* Installation */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Install directly into your project using the shadcn CLI:
            </p>
            <TerminalCode command="pnpx shadcn@latest add @pastecn/ai-sdk" />
            <p className="text-sm text-muted-foreground">
              This copies <code className="bg-muted px-1 py-0.5 rounded">tools/pastecn.ts</code> to your
              project and installs the required dependencies (<code className="bg-muted px-1 py-0.5 rounded">ai</code>,{" "}
              <code className="bg-muted px-1 py-0.5 rounded">zod</code>).
            </p>
          </section>

          {/* Available Tools */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Available tools</h2>

            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-5 border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">createSnippet</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Creates a code snippet on pastecn and returns a shareable URL. Supports multiple files,
                  different snippet types (component, hook, lib, block, file), and optional password protection.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-5 border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">getSnippet</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Retrieves a snippet from pastecn by ID. Returns the full snippet content including all files.
                  Supports password-protected snippets via the password parameter.
                </p>
              </div>
            </div>
          </section>

          {/* Usage Example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Usage example</h2>
            <p className="text-muted-foreground leading-relaxed">
              Here&apos;s how to use the tools with the Vercel AI SDK:
            </p>

            <CodeBlock
              language="typescript"
              code={`import { createSnippet, getSnippet } from "@/tools/pastecn";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "Create a React button component and save it to pastecn",
  tools: {
    createSnippet: createSnippet(),
    getSnippet: getSnippet(),
  },
});`}
            />

            <p className="text-sm text-muted-foreground">
              The agent will automatically call <code className="bg-muted px-1 py-0.5 rounded">createSnippet</code> with
              the appropriate parameters and return the shareable URL.
            </p>
          </section>

          {/* Use Cases */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Use cases</h2>
            <div className="grid gap-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Coding assistants.</span>
                  <span className="text-muted-foreground"> Let your AI generate components and share them via pastecn URLs.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Component generators.</span>
                  <span className="text-muted-foreground"> Build tools that create shadcn-compatible components and distribute them instantly.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Code review bots.</span>
                  <span className="text-muted-foreground"> Retrieve snippets for analysis and create improved versions.</span>
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Automated workflows.</span>
                  <span className="text-muted-foreground"> Integrate snippet creation into CI/CD pipelines or automation tools.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Configuration */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>
            <p className="text-muted-foreground leading-relaxed">
              Both tools accept an optional <code className="bg-muted px-1 py-0.5 rounded">baseUrl</code> parameter
              for self-hosted instances or development:
            </p>

            <CodeBlock
              language="typescript"
              code={`// Use a custom instance
const tools = {
  createSnippet: createSnippet({
    baseUrl: "https://my-pastecn.example.com"
  }),
  getSnippet: getSnippet({
    baseUrl: "https://my-pastecn.example.com"
  }),
};`}
            />
          </section>

          {/* Why pastecn */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Why pastecn for AI agents?</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Bot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">No authentication required</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Agents can create public snippets without API keys or OAuth flows.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Instant distribution</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Generated code becomes immediately installable via <code className="bg-muted px-1 py-0.5 rounded">shadcn add</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Code2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Multi-file support</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create complex components with multiple files, styles, and utilities in a single snippet.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Try pastecn now
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
