// Types for registry snippets
export interface Snippet {
  id: string
  name: string
  type: "file" | "component" | "hook" | "lib"
  target: string
  content: string
  meta: {
    language: string
  }
}

// Hardcoded data - will be replaced with DB query later
const snippets: Record<string, Snippet> = {
  a7x9k2m: {
    id: "a7x9k2m",
    name: "button.tsx",
    type: "component",
    target: "components/ui/button.tsx",
    content: `"use client"

import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import type { MouseEvent } from "react"

import { cn } from "@/lib/utils"

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
}: MagicCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-xl border bg-background",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate\`
            radial-gradient(
              \${gradientSize}px circle at \${mouseX}px \${mouseY}px,
              \${gradientColor},
              transparent 80%
            )
          \`,
        }}
      />
      {children}
    </div>
  )
}`,
    meta: {
      language: "tsx",
    },
  },
}

export async function getSnippet(id: string): Promise<Snippet | null> {
  // Simulating async DB call - replace with real query later
  return snippets[id] || null
}
