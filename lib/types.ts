// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  error: string | null
}

// Resume and Profile Types
export interface Experience {
  title: string
  company: string
  location?: string
  startDate: string
  endDate: string
  description: string[]
  skills?: string[]
}

export interface Education {
  degree: string
  institution: string
  graduationDate: string
  gpa?: string
  fieldOfStudy?: string
  achievements?: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface Certification {
  name: string
  issuer: string
  date?: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface ContactInfo {
  name: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
}

export interface ResumeData {
  id: string
  userId?: string
  fileName: string
  uploadedAt: Date
  skills: string[]
  technologies: string[]
  experience: Experience[]
  education: Education[]
  contact: ContactInfo
  summary?: string
  rawText?: string
  matchScore?: number
  projects: Project[]
  certifications: Certification[]
  languages?: string[]
  atsScore: number
  atsIssues: string[]
  suggestions: string[]
  wordCount?: number
  pageCount?: number
}

// Job Types (JSearch API compatible)
export interface JobHighlights {
  Qualifications?: string[]
  Responsibilities?: string[]
  Benefits?: string[]
}

export interface Job {
  job_id: string
  job_title: string
  employer_name: string
  employer_logo?: string
  employer_website?: string
  job_employment_type: string
  job_apply_link?: string
  job_description: string
  job_is_remote: boolean
  job_posted_at_timestamp: number
  job_city?: string
  job_state?: string
  job_country?: string
  job_min_salary?: number
  job_max_salary?: number
  job_salary_currency?: string
  job_salary_period?: string
  job_highlights?: JobHighlights
  job_required_skills?: string[]
  job_required_experience?: {
    no_experience_required: boolean
    required_experience_in_months?: number
  }
}

export interface JobMatch {
  job: Job
  overallScore: number
  matchingSkills: string[]
  missingSkills: string[]
  experienceMatch: number
  locationMatch: number
}

// Search and Filter Types
export interface JobSearchParams {
  query: string
  location?: string
  page?: number
  num_pages?: number
  date_posted?: "all" | "today" | "3days" | "week" | "month"
  remote_jobs_only?: boolean
  employment_types?: string
  job_requirements?: string
}

export interface JobSearchResponse {
  status: string
  request_id: string
  data: Job[]
}

// Bookmark Types
export interface Bookmark {
  id: string
  userId: string
  jobId: string
  job: Job
  savedAt: Date
  notes?: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: "job_match" | "application_update" | "skill_suggestion" | "system"
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: Record<string, unknown>
}

// Settings Types
export interface UserSettings {
  userId: string
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  jobAlerts: boolean
  weeklyDigest: boolean
}

// Analytics Types
export interface DashboardStats {
  jobMatches: number
  matchScore: number
  skillsMatched: number
  profileViews: number
  savedJobs: number
  applicationsSubmitted: number
}

export interface SkillAnalysis {
  name: string
  proficiency: number
  demand: "Low" | "Medium" | "High" | "Very High"
  trending: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
