"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const enabled = process.env.NEXT_PUBLIC_ANNOUNCEMENT_ENABLED === "true"
  const text = process.env.NEXT_PUBLIC_ANNOUNCEMENT_TEXT || ""
  const linkUrl = process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINK_URL || ""
  const linkText = process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINK_TEXT || ""
  const announcementId = process.env.NEXT_PUBLIC_ANNOUNCEMENT_ID || "default"

  useEffect(() => {
    setIsMounted(true)
    
    if (!enabled || !text) {
      return
    }

    // Check if user has dismissed this announcement
    const dismissedKey = `announcement-dismissed-${announcementId}`
    const wasDismissed = localStorage.getItem(dismissedKey) === "true"

    if (!wasDismissed) {
      setIsVisible(true)
    }
  }, [enabled, text, announcementId])

  // Add padding-top to body when banner is visible (mobile only)
  useEffect(() => {
    if (!isMounted || !isVisible) {
      document.body.classList.remove("has-announcement-banner")
      return
    }

    document.body.classList.add("has-announcement-banner")
    
    return () => {
      document.body.classList.remove("has-announcement-banner")
    }
  }, [isMounted, isVisible])

  const handleDismiss = () => {
    const dismissedKey = `announcement-dismissed-${announcementId}`
    localStorage.setItem(dismissedKey, "true")
    setIsVisible(false)
  }

  // Don't render anything if not enabled, no text, or not mounted (SSR)
  if (!enabled || !text || !isMounted) {
    return null
  }

  // Don't render if not visible (but keep mounted for animation)
  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        "animate-in fade-in slide-in-from-top duration-300"
      )}
    >
      <div className="container mx-auto px-3 md:px-4">
        <Alert className="border-0 rounded-none bg-transparent py-1.5 md:py-2.5">
          <AlertDescription className="flex items-center justify-center gap-2 md:gap-4 w-full">
            <div className="text-xs md:text-sm text-center flex-1 min-w-0">
              {text}
              {linkUrl && linkText && (
                <>
                  {" "}
                  <Link
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline underline-offset-2 text-primary hover:text-primary/80 transition-colors"
                    onClick={(e) => {
                      // Prevent dismiss when clicking the link
                      e.stopPropagation()
                    }}
                  >
                    {linkText}
                    <ExternalLink className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-md p-0.5 md:p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}