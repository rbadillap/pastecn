import Link from "next/link"
import { Button } from "@pastecn/ui/components/button"
import { ArrowRight, Bot, Zap, Code2, Terminal } from "lucide-react"
import { Icons } from "@/components/icon"
import { CodeBlock } from "@/components/code-block"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "MCP Server: Connect Claude Desktop & Cursor — pastecn",
  description: "Native MCP support for pastecn. Connect Claude Desktop, Cursor, and any MCP-compatible client to create and retrieve snippets directly.",
  keywords: ["MCP", "Model Context Protocol", "Claude Desktop", "Cursor", "AI tools", "code sharing", "shadcn registry"],
  openGraph: {
    title: "MCP Server: Connect Claude Desktop & Cursor — pastecn",
    description: "Native MCP support for pastecn. Connect Claude Desktop, Cursor, and any MCP-compatible client to create and retrieve snippets.",
    url: `${siteUrl}/blog/mcp-server`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Server: Connect Claude Desktop & Cursor — pastecn",
    description: "Native MCP support for pastecn. Connect Claude Desktop, Cursor, and any MCP-compatible client.",
  },
  alternates: {
    canonical: `${siteUrl}/blog/mcp-server`,
  },
}

export default function McpServerPost() {
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
            MCP Server: Connect Claude Desktop & Cursor
          </h1>
          <p className="text-lg text-muted-foreground">
            Native MCP support for pastecn. Connect any MCP-compatible client to create and retrieve snippets directly.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base">
              Earlier this year, we introduced{" "}
              <Link href="/blog/ai-sdk" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                @pastecn/ai-sdk
              </Link>{" "}
              — tools that let AI agents create and retrieve snippets programmatically. Today, we&apos;re taking that
              integration to the next level with native MCP (Model Context Protocol) support.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              With MCP, Claude Desktop, Cursor, and any MCP-compatible client can now interact with pastecn directly —
              no SDK installation, no code changes, just a simple configuration.
            </p>
          </section>

          {/* What is MCP */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">What is MCP?</h2>
            <p className="text-muted-foreground leading-relaxed">
              The{" "}
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Model Context Protocol
              </a>{" "}
              is an open standard created by Anthropic that enables AI applications to connect with external tools
              and data sources through a unified interface.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Think of it as a universal plugin system for AI — instead of building custom integrations for each
              AI client, tools can expose a single MCP endpoint that works everywhere.
            </p>
          </section>

          {/* Configuration */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>

            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-5 border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Claude Desktop</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add this to your Claude Desktop configuration file at{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">~/Library/Application Support/Claude/claude_desktop_config.json</code>:
                </p>
                <CodeBlock
                  language="json"
                  code={`{
  "mcpServers": {
    "pastecn": {
      "url": "https://pastecn.com/mcp"
    }
  }
}`}
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-5 border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Cursor</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Go to Settings → MCP and add:
                </p>
                <CodeBlock
                  language="json"
                  code={`{
  "mcpServers": {
    "pastecn": {
      "url": "https://pastecn.com/mcp"
    }
  }
}`}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              After adding the configuration, restart your client. The pastecn tools will be available immediately.
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
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">getSnippet</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Retrieves a snippet from pastecn by ID. Returns the full snippet content including all files.
                  Supports password-protected snippets via the password parameter.
                </p>
              </div>
            </div>
          </section>

          {/* Connection to AI SDK */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Connection to AI SDK</h2>
            <p className="text-muted-foreground leading-relaxed">
              MCP and{" "}
              <Link href="/blog/ai-sdk" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                @pastecn/ai-sdk
              </Link>{" "}
              serve different use cases:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Bot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">MCP: For AI clients</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use MCP when you want Claude Desktop, Cursor, or other MCP clients to interact with pastecn.
                    Zero code required — just configure and go.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">AI SDK: For your own agents</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use @pastecn/ai-sdk when building custom agents with the Vercel AI SDK.
                    Full control over how your agents create and retrieve snippets.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Both options use the same underlying API and support all pastecn features including password protection
              and expiring snippets.
            </p>
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
