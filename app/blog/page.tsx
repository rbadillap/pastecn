import Link from "next/link"
import { getBlogPosts } from "@/lib/blog-posts"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  title: "Blog — pastecn",
  description: "Tutorials, updates, and insights about shadcn registry URLs and component sharing.",
  openGraph: {
    title: "Blog — pastecn",
    description: "Tutorials, updates, and insights about shadcn registry URLs and component sharing.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "pastecn Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — pastecn",
    description: "Tutorials, updates, and insights about shadcn registry URLs and component sharing.",
    images: ["/opengraph-image.jpg"],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        {/* Brand */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block text-xl font-semibold tracking-tight hover:text-primary transition-colors"
          >
            pastecn
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Tutorials, updates, and insights about shadcn registry URLs and component sharing.
          </p>
        </header>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {post.category}
                  </span>
                  <time className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                </div>

                <h2 className="text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.description}
                </p>

                <div className="flex items-center text-sm text-primary pt-2">
                  <span>Read more</span>
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  )
}
