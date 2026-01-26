"use client"

import { useState } from "react"
import { RegistryPastebinV1 } from "@/components/registry-pastebin-v1-filename-top"
import { RegistryPastebinV2 } from "@/components/registry-pastebin-v2-filename-label"
import { RegistryPastebinV3 } from "@/components/registry-pastebin-v3-filename-styled"
import { Button } from "@/components/ui/button"

export default function TestVariantsPage() {
  const [activeVariant, setActiveVariant] = useState<1 | 2 | 3>(1)

  return (
    <div className="min-h-screen">
      {/* Variant Selector - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Select variant:</span>
          <div className="flex gap-2">
            <Button
              variant={activeVariant === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveVariant(1)}
            >
              V1: Filename Top
            </Button>
            <Button
              variant={activeVariant === 2 ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveVariant(2)}
            >
              V2: With Label
            </Button>
            <Button
              variant={activeVariant === 3 ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveVariant(3)}
            >
              V3: Styled Input
            </Button>
          </div>
        </div>
      </div>

      {/* Add top padding to account for fixed header */}
      <div className="pt-16">
        {activeVariant === 1 && <RegistryPastebinV1 />}
        {activeVariant === 2 && <RegistryPastebinV2 />}
        {activeVariant === 3 && <RegistryPastebinV3 />}
      </div>
    </div>
  )
}
