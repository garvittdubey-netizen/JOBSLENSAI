import type { Job, JobSearchParams, JobSearchResponse, JobMatch, ResumeData } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Generic fetch wrapper with error handling
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  let lastError: Error | null = null
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error as Error
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  throw lastError || new Error("Request failed after retries")
}

// Job Search API
export async function searchJobs(params: JobSearchParams): Promise<Job[]> {
  const searchParams = new URLSearchParams()
  
  searchParams.set("query", params.query)
  if (params.location) searchParams.set("location", params.location)
  if (params.page) searchParams.set("page", params.page.toString())
  if (params.date_posted) searchParams.set("date_posted", params.date_posted)
  if (params.remote_jobs_only) searchParams.set("remote_jobs_only", "true")
  if (params.employment_types) searchParams.set("employment_types", params.employment_types)

  try {
    const response = await fetchWithRetry<JobSearchResponse>(
      `${API_BASE_URL}/api/jobs/search?${searchParams.toString()}`
    )
    return response.data || []
  } catch (error) {
    console.error("Job search failed:", error)
    // Return mock data for development
    return getMockJobs()
  }
}

// Job matching algorithm
export function matchJobsWithResume(jobs: Job[], resume: ResumeData): JobMatch[] {
  return jobs.map(job => {
    const { matchingSkills, missingSkills, skillScore } = calculateSkillMatch(job, resume)
    const experienceMatch = calculateExperienceMatch(job, resume)
    const locationMatch = calculateLocationMatch(job, resume)

    const overallScore = Math.round(
      skillScore * 0.5 + experienceMatch * 0.3 + locationMatch * 0.2
    )

    return {
      job,
      overallScore,
      matchingSkills,
      missingSkills,
      experienceMatch,
      locationMatch,
    }
  }).sort((a, b) => b.overallScore - a.overallScore)
}

function calculateSkillMatch(job: Job, resume: ResumeData) {
  const resumeSkills = resume.skills.map(s => s.toLowerCase())
  const jobSkills = extractJobSkills(job)

  const matchingSkills = jobSkills.filter(skill =>
    resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
  )
  const missingSkills = jobSkills.filter(skill =>
    !resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
  )

  const skillScore = jobSkills.length > 0
    ? Math.round((matchingSkills.length / jobSkills.length) * 100)
    : 50

  return { matchingSkills, missingSkills, skillScore }
}

function extractJobSkills(job: Job): string[] {
  const skills: string[] = []
  
  if (job.job_required_skills) {
    skills.push(...job.job_required_skills)
  }
  
  // Extract skills from description (common tech keywords)
  const techKeywords = [
    "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js",
    "Python", "Java", "C++", "Go", "Rust", "Ruby", "PHP",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD",
    "SQL", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST API",
    "Git", "Agile", "Scrum", "TDD", "DevOps", "Machine Learning"
  ]
  
  const descLower = job.job_description.toLowerCase()
  techKeywords.forEach(keyword => {
    if (descLower.includes(keyword.toLowerCase()) && !skills.includes(keyword)) {
      skills.push(keyword)
    }
  })

  return skills.slice(0, 15)
}

function calculateExperienceMatch(job: Job, resume: ResumeData): number {
  // Simple experience calculation based on resume
  const totalYears = resume.experience.reduce((acc, exp) => {
    const start = parseInt(exp.startDate) || 2020
    const end = exp.endDate === "Present" ? new Date().getFullYear() : parseInt(exp.endDate) || 2024
    return acc + (end - start)
  }, 0)

  if (job.job_required_experience?.no_experience_required) return 100
  
  const requiredMonths = job.job_required_experience?.required_experience_in_months || 24
  const userMonths = totalYears * 12
  
  return Math.min(100, Math.round((userMonths / requiredMonths) * 100))
}

function calculateLocationMatch(job: Job, resume: ResumeData): number {
  if (job.job_is_remote) return 100
  
  const userLocation = resume.contact.location?.toLowerCase() || ""
  const jobLocation = `${job.job_city || ""} ${job.job_state || ""}`.toLowerCase()
  
  if (userLocation && jobLocation) {
    if (userLocation.includes(job.job_city?.toLowerCase() || "xxx")) return 100
    if (userLocation.includes(job.job_state?.toLowerCase() || "xxx")) return 75
  }
  
  return 50
}

// Mock data for development
function getMockJobs(): Job[] {
  return [
    {
      job_id: "mock-1",
      job_title: "Senior Frontend Developer",
      employer_name: "Tech Corp",
      employer_logo: undefined,
      job_employment_type: "FULLTIME",
      job_apply_link: "https://example.com/apply",
      job_description: "We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern web technologies...",
      job_is_remote: true,
      job_posted_at_timestamp: Date.now() / 1000 - 7200,
      job_city: "San Francisco",
      job_state: "CA",
      job_country: "USA",
      job_min_salary: 150000,
      job_max_salary: 180000,
      job_required_skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
      job_highlights: {
        Qualifications: [
          "5+ years of frontend development experience",
          "Expert knowledge of React and TypeScript",
          "Experience with modern CSS and responsive design"
        ]
      }
    },
    {
      job_id: "mock-2",
      job_title: "Full Stack Engineer",
      employer_name: "StartupXYZ",
      employer_logo: undefined,
      job_employment_type: "FULLTIME",
      job_apply_link: "https://example.com/apply",
      job_description: "Join our team as a Full Stack Engineer working with Node.js, React, and PostgreSQL...",
      job_is_remote: true,
      job_posted_at_timestamp: Date.now() / 1000 - 18000,
      job_city: "New York",
      job_state: "NY",
      job_country: "USA",
      job_min_salary: 130000,
      job_max_salary: 160000,
      job_required_skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    },
    {
      job_id: "mock-3",
      job_title: "React Developer",
      employer_name: "Digital Agency",
      employer_logo: undefined,
      job_employment_type: "FULLTIME",
      job_apply_link: "https://example.com/apply",
      job_description: "Looking for a React Developer to build amazing user interfaces...",
      job_is_remote: false,
      job_posted_at_timestamp: Date.now() / 1000 - 86400,
      job_city: "Austin",
      job_state: "TX",
      job_country: "USA",
      job_min_salary: 120000,
      job_max_salary: 145000,
      job_required_skills: ["React", "JavaScript", "Redux", "CSS"],
    },
  ]
}

// Resume API
export async function uploadResume(file: File): Promise<ResumeData | null> {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch(`${API_BASE_URL}/api/resume/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")
    
    return await response.json()
  } catch (error) {
    console.error("Resume upload failed:", error)
    return null
  }
}

export async function analyzeResume(resumeId: string): Promise<ResumeData | null> {
  try {
    return await fetchWithRetry<ResumeData>(
      `${API_BASE_URL}/api/resume/${resumeId}/analyze`
    )
  } catch (error) {
    console.error("Resume analysis failed:", error)
    return null
  }
}

// User API
export async function getCurrentUser() {
  try {
    return await fetchWithRetry(`${API_BASE_URL}/api/auth/me`)
  } catch {
    return null
  }
}

export async function updateUserProfile(data: Record<string, unknown>) {
  return fetchWithRetry(`${API_BASE_URL}/api/user/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// Bookmarks API
export async function getBookmarks() {
  try {
    return await fetchWithRetry(`${API_BASE_URL}/api/bookmarks`)
  } catch {
    return []
  }
}

export async function addBookmark(jobId: string, job: Job) {
  return fetchWithRetry(`${API_BASE_URL}/api/bookmarks`, {
    method: "POST",
    body: JSON.stringify({ jobId, job }),
  })
}

export async function removeBookmark(jobId: string) {
  return fetchWithRetry(`${API_BASE_URL}/api/bookmarks/${jobId}`, {
    method: "DELETE",
  })
}
