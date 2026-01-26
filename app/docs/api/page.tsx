import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { TerminalCode } from "@/components/terminal-code"
import { CodePreview } from "@/components/code-preview"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "API Reference — pastecn",
  description: "Create and retrieve snippets programmatically with the pastecn API.",
  openGraph: {
    title: "API Reference — pastecn",
    description: "Create and retrieve snippets programmatically with the pastecn API.",
    url: `${siteUrl}/docs/api`,
    type: "article",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "pastecn API Reference",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "API Reference — pastecn",
    description: "Create and retrieve snippets programmatically with the pastecn API.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/docs/api`,
  },
}

const createSnippetRequest = `{
  "name": "my-component",
  "type": "component",
  "files": [
    {
      "path": "components/my-component.tsx",
      "content": "export function MyComponent() {\\n  return <div>Hello</div>\\n}"
    }
  ],
  "password": "optional-password"
}`

const createSnippetResponse = `{
  "id": "xK9mN2pL",
  "url": "https://pastecn.com/p/xK9mN2pL",
  "registryUrl": "https://pastecn.com/r/xK9mN2pL",
  "password": "generated-password"
}`

const getSnippetResponse = `{
  "id": "xK9mN2pL",
  "name": "my-component",
  "type": "component",
  "files": [
    {
      "path": "components/my-component.tsx",
      "content": "export function MyComponent() {...}",
      "language": "tsx"
    }
  ],
  "meta": {
    "primaryLanguage": "tsx",
    "fileCount": 1
  },
  "isProtected": false
}`

const errorResponse = `{
  "code": "NOT_FOUND",
  "message": "Snippet not found"
}`

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
          <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide">Documentation</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            API Reference
          </h1>
          <p className="text-lg text-muted-foreground">
            Create and retrieve snippets programmatically.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none space-y-12">

          {/* Base URL */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Base URL</h2>
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <code className="font-mono text-sm text-foreground">https://pastecn.com/api/v1</code>
            </div>
          </section>

          {/* Authentication */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Authentication</h2>
            <p className="text-muted-foreground leading-relaxed">
              Password-protected snippets require Bearer token authentication.
              Include the password in the <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">Authorization</code> header.
            </p>
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <code className="font-mono text-sm text-foreground">Authorization: Bearer {"<password>"}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Public snippets do not require authentication.
            </p>
          </section>

          {/* POST /snippets */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400">POST</span>
              <h2 className="text-2xl font-semibold tracking-tight">/snippets</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Create a new snippet. The ID is generated server-side.
            </p>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Request Body</h3>
              <CodePreview code={createSnippetRequest} language="json" maxLines={20} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Response</h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-green-500/10 text-green-600 dark:text-green-400">201 Created</span>
              </div>
              <CodePreview code={createSnippetResponse} language="json" maxLines={20} />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Example</h3>
              <TerminalCode command={`curl -X POST https://pastecn.com/api/v1/snippets \\
  -H "Content-Type: application/json" \\
  -d '{"name":"my-component","type":"component","files":[{"path":"components/button.tsx","content":"export const Button = () => <button>Click</button>"}]}'`} />
            </div>
          </section>

          {/* GET /snippets/{id} */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">GET</span>
              <h2 className="text-2xl font-semibold tracking-tight">/snippets/{"{id}"}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Retrieve a snippet by ID. Protected snippets require Bearer authentication.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Response</h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-green-500/10 text-green-600 dark:text-green-400">200 OK</span>
              </div>
              <CodePreview code={getSnippetResponse} language="json" maxLines={20} />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Example (Public Snippet)</h3>
              <TerminalCode command="curl https://pastecn.com/api/v1/snippets/xK9mN2pL" />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Example (Protected Snippet)</h3>
              <TerminalCode command={`curl https://pastecn.com/api/v1/snippets/xK9mN2pL \\
  -H "Authorization: Bearer your-password"`} />
            </div>
          </section>

          {/* Types */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Snippet Types</h2>
            <p className="text-muted-foreground leading-relaxed">
              The <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">type</code> field
              determines how the snippet is registered in the shadcn registry.
            </p>

            <div className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">file</code>
                  <p className="text-sm text-muted-foreground">
                    Miscellaneous files. Config files, types, or any other file.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">component</code>
                  <p className="text-sm text-muted-foreground">
                    React components. Single-file UI elements.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">hook</code>
                  <p className="text-sm text-muted-foreground">
                    React hooks. Custom state management or side effects.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0">lib</code>
                  <p className="text-sm text-muted-foreground">
                    Utility functions and helpers. Pure logic, no UI.
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                <div className="flex items-start gap-3">
                  <code className="font-mono text-sm text-primary shrink-0 font-semibold">block</code>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Complex components with multiple files.</span>{" "}
                    <span className="text-muted-foreground">
                      Combines components, hooks, utils, and types into a complete feature.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Error Codes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Error Codes</h2>
            <p className="text-muted-foreground leading-relaxed">
              All errors return a JSON response with a <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">code</code> and <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">message</code> field.
            </p>

            <CodePreview code={errorResponse} language="json" maxLines={10} />

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-medium text-foreground">Code</th>
                    <th className="text-left py-3 pr-4 font-medium text-foreground">HTTP</th>
                    <th className="text-left py-3 font-medium text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">VALIDATION_ERROR</code></td>
                    <td className="py-3 pr-4">400</td>
                    <td className="py-3">Invalid request body or parameters</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">INVALID_ID</code></td>
                    <td className="py-3 pr-4">400</td>
                    <td className="py-3">Snippet ID format is invalid</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">AUTH_REQUIRED</code></td>
                    <td className="py-3 pr-4">401</td>
                    <td className="py-3">Protected snippet requires Bearer token</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">INVALID_PASSWORD</code></td>
                    <td className="py-3 pr-4">401</td>
                    <td className="py-3">Bearer token does not match password</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">NOT_FOUND</code></td>
                    <td className="py-3 pr-4">404</td>
                    <td className="py-3">Snippet does not exist</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">ID_COLLISION</code></td>
                    <td className="py-3 pr-4">409</td>
                    <td className="py-3">Generated ID already exists (retry)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">RATE_LIMITED</code></td>
                    <td className="py-3 pr-4">429</td>
                    <td className="py-3">Too many requests</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">INTERNAL_ERROR</code></td>
                    <td className="py-3 pr-4">500</td>
                    <td className="py-3">Server error</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="pt-8 mt-12 border-t border-border">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              Create a snippet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    </main>
  )
}
