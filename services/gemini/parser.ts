import { GoogleGenerativeAI } from "@google/generative-ai"
import type { GeminiParseResult, ParsedResumeData } from "./types"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY environment variable is not set. Resume parsing will fail.")
}

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
}

const requestTimestamps: number[] = []

function checkRateLimit(): boolean {
  const now = Date.now()
  // Remove timestamps older than the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT.windowMs) {
    requestTimestamps.shift()
  }
  return requestTimestamps.length < RATE_LIMIT.maxRequests
}

function recordRequest(): void {
  requestTimestamps.push(Date.now())
}

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const RESUME_PARSING_PROMPT = `You are an expert resume parser and ATS (Applicant Tracking System) analyzer. Parse the following resume text and extract structured information.

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations.

Extract the following information and return as JSON:

{
  "contact": {
    "name": "Full name",
    "email": "Email address",
    "phone": "Phone number (optional)",
    "location": "City, State/Country (optional)",
    "linkedin": "LinkedIn URL (optional)",
    "github": "GitHub URL (optional)",
    "portfolio": "Portfolio/Website URL (optional)"
  },
  "summary": "Professional summary or objective (if present)",
  "skills": ["Array of all technical and soft skills mentioned"],
  "technologies": ["Array of specific technologies, frameworks, tools, and programming languages"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "location": "Location (optional)",
      "startDate": "Start date (format: MMM YYYY or YYYY)",
      "endDate": "End date or 'Present'",
      "description": ["Array of bullet points describing responsibilities and achievements"],
      "skills": ["Skills used in this role"]
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School/University name",
      "graduationDate": "Graduation date",
      "gpa": "GPA if mentioned (optional)",
      "fieldOfStudy": "Major/Field of study (optional)",
      "achievements": ["Honors, awards, relevant coursework (optional)"]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description",
      "technologies": ["Technologies used"],
      "url": "Project URL if available (optional)",
      "startDate": "Start date (optional)",
      "endDate": "End date (optional)"
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "date": "Date obtained (optional)",
      "expiryDate": "Expiry date if applicable (optional)",
      "credentialId": "Credential ID (optional)",
      "url": "Verification URL (optional)"
    }
  ],
  "languages": ["Spoken languages if mentioned"],
  "atsScore": 0-100 score based on ATS compatibility,
  "atsIssues": ["List of ATS compatibility issues found"],
  "suggestions": ["List of improvement suggestions for the resume"]
}

ATS Scoring Criteria:
- Clear section headings (+10)
- Contact information present (+15)
- Quantified achievements in experience (+15)
- Keywords matching common job requirements (+15)
- Proper date formatting (+10)
- No graphics/tables/complex formatting issues (+10)
- Skills section with relevant keywords (+15)
- Education section complete (+10)

Deduct points for:
- Missing contact information (-15)
- Vague job descriptions without metrics (-10)
- Gaps in employment without explanation (-5)
- Inconsistent date formats (-5)
- Missing skills section (-10)
- Typos or grammatical errors (-5 per issue, max -15)

Resume Text:
`

export async function parseResumeWithGemini(resumeText: string): Promise<GeminiParseResult> {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      error: "GEMINI_API_KEY is not configured",
    }
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return {
      success: false,
      error: "Resume text is too short or empty",
    }
  }

  // Check rate limit
  if (!checkRateLimit()) {
    return {
      success: false,
      error: "Rate limit exceeded. Please try again in a minute.",
    }
  }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      recordRequest()

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

      const result = await model.generateContent(RESUME_PARSING_PROMPT + resumeText)
      const response = await result.response
      const text = response.text()

      // Clean the response - remove markdown code blocks if present
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7)
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3)
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3)
      }
      cleanedText = cleanedText.trim()

      // Parse JSON response
      const parsedData: ParsedResumeData = JSON.parse(cleanedText)

      // Validate required fields
      if (!parsedData.contact || !parsedData.contact.name) {
        return {
          success: false,
          error: "Failed to extract contact information from resume",
          rawResponse: text,
        }
      }

      // Ensure arrays are initialized
      parsedData.skills = parsedData.skills || []
      parsedData.technologies = parsedData.technologies || []
      parsedData.experience = parsedData.experience || []
      parsedData.education = parsedData.education || []
      parsedData.projects = parsedData.projects || []
      parsedData.certifications = parsedData.certifications || []
      parsedData.atsIssues = parsedData.atsIssues || []
      parsedData.suggestions = parsedData.suggestions || []
      parsedData.atsScore = typeof parsedData.atsScore === "number" ? parsedData.atsScore : 70

      return {
        success: true,
        data: parsedData,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.error(`Gemini parsing attempt ${attempt} failed:`, lastError.message)

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt) // Exponential backoff
      }
    }
  }

  return {
    success: false,
    error: `Failed to parse resume after ${MAX_RETRIES} attempts: ${lastError?.message}`,
  }
}
