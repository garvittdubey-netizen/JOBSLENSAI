import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  User,
  Job,
  ResumeData,
  UserSettings,
  Experience,
  Education,
  ContactInfo,
  Project,
  Certification,
} from "@/lib/types"

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
  resumes: ResumeData[]
  isAnalyzing: boolean
  isLoading: boolean
  uploadProgress: number
  error: string | null
  uploadResume: (file: File) => Promise<boolean>
  fetchResumes: () => Promise<void>
  fetchResumeById: (id: string) => Promise<void>
  deleteResume: (id: string) => Promise<boolean>
  setResumeData: (data: ResumeData | null) => void
  setAnalyzing: (analyzing: boolean) => void
  setUploadProgress: (progress: number) => void
  clearResume: () => void
  clearError: () => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumeData: null,
      resumes: [],
      isAnalyzing: false,
      isLoading: false,
      uploadProgress: 0,
      error: null,

      uploadResume: async (file: File) => {
        set({ isAnalyzing: true, uploadProgress: 10, error: null })

        try {
          const formData = new FormData()
          formData.append("file", file)

          set({ uploadProgress: 30 })

          const response = await fetch("/api/resume/upload", {
            method: "POST",
            body: formData,
          })

          set({ uploadProgress: 70 })

          const result = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to upload resume")
          }

          // Transform API response to ResumeData format
          const parsedData = result.data.parsedData
          const resumeData: ResumeData = {
            id: result.data.id,
            fileName: result.data.fileName,
            uploadedAt: new Date(result.data.uploadedAt),
            skills: parsedData.skills || [],
            technologies: parsedData.technologies || [],
            experience: parsedData.experience || [],
            education: parsedData.education || [],
            contact: parsedData.contact || { name: "", email: "" },
            summary: parsedData.summary,
            projects: parsedData.projects || [],
            certifications: parsedData.certifications || [],
            languages: parsedData.languages,
            atsScore: parsedData.atsScore || 0,
            atsIssues: parsedData.atsIssues || [],
            suggestions: parsedData.suggestions || [],
          }

          set({
            resumeData,
            resumes: [resumeData, ...get().resumes.filter((r) => r.id !== resumeData.id)],
            isAnalyzing: false,
            uploadProgress: 100,
          })

          return true
        } catch (error) {
          const message = error instanceof Error ? error.message : "Upload failed"
          set({ error: message, isAnalyzing: false, uploadProgress: 0 })
          return false
        }
      },

      fetchResumes: async () => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch("/api/resume")
          const result = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch resumes")
          }

          // Transform API response to ResumeData format
          const resumes: ResumeData[] = (result.data || []).map((item: Record<string, unknown>) => {
            const parsedData = item.parsedData as Record<string, unknown> || {}
            return {
              id: item.id as string,
              fileName: item.fileName as string,
              uploadedAt: new Date(item.uploadedAt as string),
              skills: (parsedData.skills as string[]) || [],
              technologies: (parsedData.technologies as string[]) || [],
              experience: (parsedData.experience as Experience[]) || [],
              education: (parsedData.education as Education[]) || [],
              contact: (parsedData.contact as ContactInfo) || { name: "", email: "" },
              summary: parsedData.summary as string | undefined,
              projects: (parsedData.projects as Project[]) || [],
              certifications: (parsedData.certifications as Certification[]) || [],
              languages: parsedData.languages as string[] | undefined,
              atsScore: (parsedData.atsScore as number) || 0,
              atsIssues: (parsedData.atsIssues as string[]) || [],
              suggestions: (parsedData.suggestions as string[]) || [],
              wordCount: item.wordCount as number | undefined,
              pageCount: item.pageCount as number | undefined,
            }
          })

          set({
            resumes,
            resumeData: resumes[0] || null,
            isLoading: false,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to fetch resumes"
          set({ error: message, isLoading: false })
        }
      },

      fetchResumeById: async (id: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`/api/resume/${id}`)
          const result = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch resume")
          }

          const item = result.data
          const parsedData = item.parsedData || {}
          const resumeData: ResumeData = {
            id: item.id,
            fileName: item.fileName,
            uploadedAt: new Date(item.uploadedAt),
            skills: parsedData.skills || [],
            technologies: parsedData.technologies || [],
            experience: parsedData.experience || [],
            education: parsedData.education || [],
            contact: parsedData.contact || { name: "", email: "" },
            summary: parsedData.summary,
            rawText: item.rawText,
            projects: parsedData.projects || [],
            certifications: parsedData.certifications || [],
            languages: parsedData.languages,
            atsScore: parsedData.atsScore || 0,
            atsIssues: parsedData.atsIssues || [],
            suggestions: parsedData.suggestions || [],
            wordCount: item.wordCount,
            pageCount: item.pageCount,
          }

          set({ resumeData, isLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to fetch resume"
          set({ error: message, isLoading: false })
        }
      },

      deleteResume: async (id: string) => {
        try {
          const response = await fetch(`/api/resume/${id}`, { method: "DELETE" })
          const result = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to delete resume")
          }

          set((state) => ({
            resumes: state.resumes.filter((r) => r.id !== id),
            resumeData: state.resumeData?.id === id ? null : state.resumeData,
          }))

          return true
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to delete resume"
          set({ error: message })
          return false
        }
      },

      setResumeData: (data) => set({ resumeData: data }),
      setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      clearResume: () => set({ resumeData: null, uploadProgress: 0, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "resume-storage",
      partialize: (state) => ({ resumeData: state.resumeData, resumes: state.resumes }),
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
