import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Job, JobMatch, ResumeData, UserSettings } from "@/lib/types"

// Auth Store
interface AuthStore {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isLoggedIn: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || "Login failed")
          }

          const data = await response.json()
          set({ user: data.user, isLoggedIn: true, isLoading: false })
          return true
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          return false
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || "Registration failed")
          }

          const data = await response.json()
          set({ user: data.user, isLoggedIn: true, isLoading: false })
          return true
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, isLoggedIn: false })
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
      },

      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch("/api/auth/me")
          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isLoggedIn: true })
          } else {
            set({ user: null, isLoggedIn: false })
          }
        } catch {
          set({ user: null, isLoggedIn: false })
        } finally {
          set({ isLoading: false })
        }
      },

      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setError: (error) => set({ error }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
)

// Bookmark Store
interface BookmarkStore {
  bookmarks: Job[]
  addBookmark: (job: Job) => void
  removeBookmark: (jobId: string) => void
  isBookmarked: (jobId: string) => boolean
  clearBookmarks: () => void
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (job) => {
        const { bookmarks } = get()
        if (!bookmarks.find((b) => b.job_id === job.job_id)) {
          set({ bookmarks: [...bookmarks, job] })
          // Sync with server (fire and forget)
          fetch("/api/bookmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId: job.job_id, job }),
          }).catch(() => {})
        }
      },

      removeBookmark: (jobId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.job_id !== jobId),
        }))
        // Sync with server (fire and forget)
        fetch(`/api/bookmarks/${jobId}`, { method: "DELETE" }).catch(() => {})
      },

      isBookmarked: (jobId) => {
        return get().bookmarks.some((b) => b.job_id === jobId)
      },

      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: "bookmarks-storage",
    }
  )
)

// Job Store
interface JobStore {
  jobs: JobMatch[]
  isLoading: boolean
  error: string | null
  filters: {
    query: string
    location: string
    remote: boolean
    employmentTypes: string[]
  }
  searchJobs: (query?: string, location?: string) => Promise<void>
  setFilters: (filters: Partial<JobStore["filters"]>) => void
  clearJobs: () => void
}

export const useJobStore = create<JobStore>()((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  filters: {
    query: "",
    location: "",
    remote: false,
    employmentTypes: [],
  },

  searchJobs: async (query, location) => {
    const { filters } = get()
    const searchQuery = query ?? (filters.query || "Software Engineer")
    const searchLocation = location ?? filters.location

    set({ isLoading: true, error: null })

    try {
      const params = new URLSearchParams({ query: searchQuery })
      if (searchLocation) params.set("location", searchLocation)
      if (filters.remote) params.set("remote_jobs_only", "true")

      const response = await fetch(`/api/jobs/search?${params}`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      set({ jobs: data.jobs || [], isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  clearJobs: () => set({ jobs: [], error: null }),
}))

// Resume Store
interface ResumeStore {
  resumeData: ResumeData | null
  isAnalyzing: boolean
  uploadProgress: number
  setResumeData: (data: ResumeData | null) => void
  setAnalyzing: (analyzing: boolean) => void
  setUploadProgress: (progress: number) => void
  clearResume: () => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: null,
      isAnalyzing: false,
      uploadProgress: 0,

      setResumeData: (data) => set({ resumeData: data }),
      setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      clearResume: () => set({ resumeData: null, uploadProgress: 0 }),
    }),
    {
      name: "resume-storage",
      partialize: (state) => ({ resumeData: state.resumeData }),
    }
  )
)

// Settings Store
interface SettingsStore extends UserSettings {
  setTheme: (theme: UserSettings["theme"]) => void
  setLanguage: (language: string) => void
  toggleNotifications: () => void
  setSettings: (settings: Partial<UserSettings>) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      userId: "",
      theme: "system",
      language: "en",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      emailNotifications: true,
      pushNotifications: false,
      jobAlerts: true,
      weeklyDigest: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () =>
        set((state) => ({ emailNotifications: !state.emailNotifications })),
      setSettings: (settings) => set(settings),
    }),
    {
      name: "settings-storage",
    }
  )
)

// Notification Store
interface NotificationStore {
  notifications: Array<{
    id: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: Date
  }>
  unreadCount: number
  addNotification: (notification: Omit<NotificationStore["notifications"][0], "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Math.random().toString(36).slice(2),
          read: false,
          createdAt: new Date(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "notifications-storage",
    }
  )
)
