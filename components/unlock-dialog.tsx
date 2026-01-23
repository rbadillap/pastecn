'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LockIcon } from 'lucide-react'

interface UnlockDialogProps {
  snippetId: string
  snippetName: string
}

export function UnlockDialog({ snippetId, snippetName }: UnlockDialogProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

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
        const { token } = await response.json()
        // Store token in sessionStorage (cleared when tab closes)
        sessionStorage.setItem(`unlock_${snippetId}`, token)
        // Reload page to show unlocked content
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to unlock snippet')
        setIsUnlocking(false)
      }
    } catch (error) {
      setError('Network error. Please try again.')
      setIsUnlocking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password && !isUnlocking) {
      handleUnlock()
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <LockIcon className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <DialogTitle>Password Required</DialogTitle>
          </div>
          <DialogDescription>
            This snippet is protected. Enter the password to view &ldquo;{snippetName}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={isUnlocking}
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            disabled={isUnlocking}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnlock}
            disabled={!password || isUnlocking}
          >
            {isUnlocking ? 'Unlocking...' : 'Unlock'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
