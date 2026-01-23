'use client'

import { useState } from 'react'
import { Lock, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from '@/hooks/use-toast'

interface LockedCodeContainerProps {
  snippetId: string
  fileName: string
  onUnlockSuccess: () => void
}

export function LockedCodeContainer({
  snippetId,
  fileName,
  onUnlockSuccess
}: LockedCodeContainerProps) {
  const [password, setPassword] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleUnlock = async () => {
    setIsUnlocking(true)
    setError(null)

    try {
      const response = await fetch(`/api/snippets/${snippetId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        toast({
          title: 'Snippet unlocked',
          description: 'You can now view the code.',
          duration: 3000,
        })
        onUnlockSuccess()
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid password')
        setIsUnlocking(false)
      }
    } catch (error) {
      setError('Network error. Please try again.')
      setIsUnlocking(false)
    }
  }

  return (
    <div className="border border-amber-200 dark:border-amber-900 rounded-lg p-6 bg-amber-50/50 dark:bg-amber-950/20">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Lock className="h-6 w-6 text-amber-600 dark:text-amber-500" />
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-1">
            Protected Content
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter password to view <span className="font-mono">{fileName}</span>
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && password && !isUnlocking && handleUnlock()}
            disabled={isUnlocking}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            onClick={handleUnlock}
            disabled={!password || isUnlocking}
            className="w-full"
          >
            {isUnlocking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Unlocking...
              </>
            ) : (
              'Unlock Code'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
