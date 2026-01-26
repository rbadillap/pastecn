"use client"

import * as React from "react"
import { useState } from "react"
import { Terminal, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface TerminalCodeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TerminalCodeRoot = React.forwardRef<HTMLDivElement, TerminalCodeRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-neutral-950 border-neutral-800 p-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TerminalCodeRoot.displayName = "TerminalCodeRoot"

interface TerminalCodeHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  title?: string
}

const TerminalCodeHeader = React.forwardRef<HTMLDivElement, TerminalCodeHeaderProps>(
  ({ className, children, title = "terminal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800",
          className
        )}
        {...props}
      >
        <Terminal className="w-4 h-4 text-neutral-400" />
        <span className="text-xs text-neutral-400 font-mono">{title}</span>
        {children}
      </div>
    )
  }
)
TerminalCodeHeader.displayName = "TerminalCodeHeader"

interface TerminalCodeCommandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  showPrompt?: boolean
}

const TerminalCodeCommand = React.forwardRef<HTMLDivElement, TerminalCodeCommandProps>(
  ({ className, children, showPrompt = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "font-mono text-sm text-neutral-100 flex items-start gap-2",
          className
        )}
        {...props}
      >
        {showPrompt && (
          <span className="text-neutral-500 select-none">$</span>
        )}
        <span className="flex-1 whitespace-pre-wrap">{children}</span>
      </div>
    )
  }
)
TerminalCodeCommand.displayName = "TerminalCodeCommand"

// Convenience wrapper component for simple usage
interface TerminalCodeProps {
  command: string
  title?: string
  className?: string
}

function TerminalCode({ command, title = "terminal", className }: TerminalCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TerminalCodeRoot className={cn("relative group", className)}>
      <TerminalCodeHeader title={title} />
      <TerminalCodeCommand>{command}</TerminalCodeCommand>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </TerminalCodeRoot>
  )
}

export {
  TerminalCode,
  TerminalCodeRoot,
  TerminalCodeHeader,
  TerminalCodeCommand,
}
