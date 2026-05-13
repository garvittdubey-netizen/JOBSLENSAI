import pdf from "pdf-parse"
import mammoth from "mammoth"
import crypto from "crypto"

export interface FileParseResult {
  success: boolean
  text?: string
  error?: string
  pageCount?: number
  wordCount?: number
}

/**
 * Calculate MD5 hash of file buffer for deduplication
 */
export function calculateFileHash(buffer: Buffer): string {
  return crypto.createHash("md5").update(buffer).digest("hex")
}

/**
 * Parse PDF file and extract text content
 */
export async function parsePDF(buffer: Buffer): Promise<FileParseResult> {
  try {
    const data = await pdf(buffer)
    
    if (!data.text || data.text.trim().length === 0) {
      return {
        success: false,
        error: "PDF appears to be empty or contains only images (no extractable text)",
      }
    }

    const text = cleanExtractedText(data.text)
    
    return {
      success: true,
      text,
      pageCount: data.numpages,
      wordCount: countWords(text),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error parsing PDF"
    return {
      success: false,
      error: `Failed to parse PDF: ${message}`,
    }
  }
}

/**
 * Parse DOCX file and extract text content
 */
export async function parseDOCX(buffer: Buffer): Promise<FileParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    
    if (!result.value || result.value.trim().length === 0) {
      return {
        success: false,
        error: "DOCX appears to be empty or contains no extractable text",
      }
    }

    const text = cleanExtractedText(result.value)

    // Log any warnings from mammoth
    if (result.messages && result.messages.length > 0) {
      console.warn("DOCX parsing warnings:", result.messages)
    }
    
    return {
      success: true,
      text,
      wordCount: countWords(text),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error parsing DOCX"
    return {
      success: false,
      error: `Failed to parse DOCX: ${message}`,
    }
  }
}

/**
 * Parse file based on MIME type
 */
export async function parseFile(
  buffer: Buffer,
  mimeType: string
): Promise<FileParseResult> {
  const normalizedType = mimeType.toLowerCase()

  if (normalizedType === "application/pdf") {
    return parsePDF(buffer)
  }

  if (
    normalizedType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    normalizedType === "application/docx"
  ) {
    return parseDOCX(buffer)
  }

  // Handle plain text files
  if (normalizedType === "text/plain") {
    try {
      const text = buffer.toString("utf-8")
      return {
        success: true,
        text: cleanExtractedText(text),
        wordCount: countWords(text),
      }
    } catch {
      return {
        success: false,
        error: "Failed to read text file",
      }
    }
  }

  return {
    success: false,
    error: `Unsupported file type: ${mimeType}. Supported types: PDF, DOCX, TXT`,
  }
}

/**
 * Clean extracted text by normalizing whitespace and removing artifacts
 */
function cleanExtractedText(text: string): string {
  return text
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Remove excessive whitespace while preserving paragraph breaks
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    // Remove common PDF artifacts
    .replace(/\f/g, "\n") // Form feed characters
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // Control characters
    // Trim each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

/**
 * Validate file size and type before processing
 */
export function validateFile(
  file: { size: number; type: string; name: string },
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    }
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]

  const allowedExtensions = [".pdf", ".docx", ".txt"]
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."))

  if (!allowedTypes.includes(file.type.toLowerCase()) && !allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: "Invalid file type. Supported formats: PDF, DOCX, TXT",
    }
  }

  return { valid: true }
}
