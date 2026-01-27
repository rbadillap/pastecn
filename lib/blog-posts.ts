export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  category: string
  image?: string
  sticky?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-sdk",
    title: "Introducing @pastecn/ai-sdk",
    description: "AI SDK tools for creating and reading pastecn snippets directly from your AI agents",
    date: "2025-01-27",
    category: "Feature Announcement",
  },
  {
    slug: "password-protected-snippets",
    title: "Password-Protected Snippets",
    description: "Share code with selective access. Auto-generated passwords, enterprise security, seamless CLI integration.",
    date: "2025-01-23",
    category: "Feature Announcement",
    image: "/opengraph-image.jpg"
  },
  {
    slug: "what-is-pastecn",
    title: "What is pastecn?",
    description: "Turn any code into a shareable shadcn registry URL. No setup, no hosting, no friction.",
    date: "2025-01-21",
    category: "Introduction",
    image: "/opengraph-image.jpg",
    sticky: true
  },
  {
    slug: "understanding-shadcn-registry-blocks",
    title: "Understanding shadcn Registry Blocks",
    description: "Learn about registry:block and how to share complex multi-file components with pastecn.",
    date: "2025-01-20",
    category: "Guide",
    image: "/opengraph-image.jpg"
  },
  {
    slug: "how-to-create-shadcn-registry-url",
    title: "How to Create a shadcn Registry URL in 5 Seconds",
    description: "Skip the repo setup. Paste your component, get a registry URL, share it instantly.",
    date: "2025-01-15",
    category: "Tutorial",
    image: "/opengraph-image.jpg"
  }
]

export function getBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => {
    // Sticky posts always come first
    if (a.sticky && !b.sticky) return -1
    if (!a.sticky && b.sticky) return 1

    // Otherwise sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}
