"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { track } from "@vercel/analytics/react"

interface DraftState<T> {
  version: number
  timestamp: number
  data: T
}

interface UseLocalStorageDraftOptions<T> {
  key: string
  version: number
  debounceMs?: number
  maxAge?: number
}

/**
 * Custom hook for persisting draft data to localStorage with debouncing and SSR safety
 *
 * @param initialValue - The initial value to use if no draft exists
 * @param options - Configuration options
 * @returns [value, setValue, clearDraft, hasDraft]
 */
export function useLocalStorageDraft<T>(
  initialValue: T,
  options: UseLocalStorageDraftOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void, boolean] {
  const {
    key,
    version,
    debounceMs = 500,
    maxAge = 7 * 24 * 60 * 60 * 1000, // 7 days
  } = options

  // SSR-safe pattern: track if component is mounted
  const [isMounted, setIsMounted] = useState(false)
  const [value, setValue] = useState<T>(initialValue)
  const [hasDraft, setHasDraft] = useState(false)

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitializedRef = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)

    try {
      const storedValue = localStorage.getItem(key)

      if (!storedValue) {
        isInitializedRef.current = true
        return
      }

      const parsed = JSON.parse(storedValue) as DraftState<T>

      // Validate version
      if (parsed.version !== version) {
        localStorage.removeItem(key)
        track('draft_load_error', { error: 'version_mismatch' })
        isInitializedRef.current = true
        return
      }

      // Check staleness
      const age = Date.now() - parsed.timestamp
      if (maxAge && age > maxAge) {
        localStorage.removeItem(key)
        track('draft_expired', { age_ms: age })
        isInitializedRef.current = true
        return
      }

      // Valid draft found
      setValue(parsed.data)
      setHasDraft(true)
      isInitializedRef.current = true
    } catch (error) {
      // Handle JSON parse errors or other errors
      localStorage.removeItem(key)
      track('draft_load_error', {
        error: error instanceof Error ? error.message : 'unknown'
      })
      isInitializedRef.current = true
    }
  }, [key, version, maxAge])

  // Debounced save to localStorage
  useEffect(() => {
    // Don't save during initial load
    if (!isMounted || !isInitializedRef.current) {
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const draftState: DraftState<T> = {
          version,
          timestamp: Date.now(),
          data: value,
        }

        localStorage.setItem(key, JSON.stringify(draftState))
      } catch (error) {
        // Handle QuotaExceededError (localStorage full)
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          track('draft_quota_exceeded')
          return
        }

        // Handle SecurityError (localStorage disabled/private mode)
        if (error instanceof Error && error.name === 'SecurityError') {
          track('draft_save_error', { error: 'security_error' })
          return
        }

        // Other errors
        track('draft_save_error', {
          error: error instanceof Error ? error.message : 'unknown'
        })
      }
    }, debounceMs)

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [value, key, version, debounceMs, isMounted])

  // Clear draft function
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setHasDraft(false)
    } catch (error) {
      // Silent fail - not critical
      track('draft_clear_error', {
        error: error instanceof Error ? error.message : 'unknown'
      })
    }
  }, [key])

  return [value, setValue, clearDraft, hasDraft]
}
