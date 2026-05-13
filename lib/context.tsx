"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { useResumeStore } from "@/store"
import type { ReactNode } from "react"

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

// Hook to access app-level state (for backward compatibility)
export function useApp() {
  const resumeData = useResumeStore((state) => state.resumeData)
  const setResumeData = useResumeStore((state) => state.setResumeData)
  const isAnalyzing = useResumeStore((state) => state.isAnalyzing)

  return {
    resumeData,
    setResumeData,
    isAnalyzing,
  }
}
