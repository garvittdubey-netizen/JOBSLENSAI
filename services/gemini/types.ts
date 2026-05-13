// Gemini Resume Parsing Types

export interface ParsedProject {
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface ParsedCertification {
  name: string
  issuer: string
  date?: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface ParsedExperience {
  title: string
  company: string
  location?: string
  startDate: string
  endDate: string
  description: string[]
  skills?: string[]
}

export interface ParsedEducation {
  degree: string
  institution: string
  graduationDate: string
  gpa?: string
  fieldOfStudy?: string
  achievements?: string[]
}

export interface ParsedContact {
  name: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
}

export interface ParsedResumeData {
  contact: ParsedContact
  summary?: string
  skills: string[]
  technologies: string[]
  experience: ParsedExperience[]
  education: ParsedEducation[]
  projects: ParsedProject[]
  certifications: ParsedCertification[]
  languages?: string[]
  atsScore: number
  atsIssues: string[]
  suggestions: string[]
}

export interface GeminiParseResult {
  success: boolean
  data?: ParsedResumeData
  error?: string
  rawResponse?: string
}
