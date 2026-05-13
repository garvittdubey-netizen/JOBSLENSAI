"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthStore, useBookmarkStore, useJobStore, useSettingsStore } from "@/store"
import type { Job } from "./types"

// Auth Hook
export function useAuth() {
  const { user, isLoading, isLoggedIn, login, logout, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
  }
}

// Bookmarks Hook
export function useBookmarks() {
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarkStore()
  
  const toggleBookmark = useCallback((job: Job): boolean => {
    if (isBookmarked(job.job_id)) {
      removeBookmark(job.job_id)
      return false
    } else {
      addBookmark(job)
      return true
    }
  }, [isBookmarked, addBookmark, removeBookmark])

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    bookmarkCount: bookmarks.length,
  }
}

// Jobs Hook
export function useJobs() {
  const { jobs, isLoading, error, searchJobs, clearJobs } = useJobStore()
  
  return {
    jobs,
    isLoading,
    error,
    searchJobs,
    clearJobs,
  }
}

// Settings Hook
export function useSettings() {
  const settings = useSettingsStore()
  
  return {
    theme: settings.theme,
    setTheme: settings.setTheme,
    language: settings.language,
    setLanguage: settings.setLanguage,
    notifications: settings.notifications,
    toggleNotifications: settings.toggleNotifications,
  }
}

// Media Query Hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    const listener = () => setMatches(media.matches)
    listener()
    
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

// Mobile Detection Hook
export function useMobile(): boolean {
  return useMediaQuery("(max-width: 768px)")
}

// Local Storage Hook with SSR support
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  return [storedValue, setValue]
}

// Debounce Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Previous Value Hook
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value)
  const [previous, setPrevious] = useState<T | undefined>(undefined)

  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}
