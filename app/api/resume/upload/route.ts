import { NextRequest, NextResponse } from "next/server"
import { getCollection, COLLECTIONS } from "@/services/mongodb"
import { parseFile, calculateFileHash, validateFile } from "@/services/file-parser"
import { parseResumeWithGemini, type ParsedResumeData } from "@/services/gemini"
import { ObjectId } from "mongodb"

export const maxDuration = 60 // Allow up to 60 seconds for processing

// Demo mode: Use a constant user ID instead of session auth
const DEMO_USER_ID = "demo-user"

interface ResumeDocument {
  _id?: ObjectId
  userId: string
  fileName: string
  fileHash: string
  mimeType: string
  fileSize: number
  uploadedAt: Date
  parsedData: ParsedResumeData
  rawText: string
  wordCount?: number
  pageCount?: number
}

export async function POST(request: NextRequest) {
  try {
    // Demo mode: bypass authentication
    const userId = DEMO_USER_ID

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile({
      size: file.size,
      type: file.type,
      name: file.name,
    })

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Calculate file hash for deduplication
    const fileHash = calculateFileHash(buffer)

    // Check for existing resume with same hash for this user
    const resumesCollection = await getCollection<ResumeDocument>(COLLECTIONS.RESUMES)
    const existingResume = await resumesCollection.findOne({
      userId,
      fileHash,
    })

    if (existingResume) {
      // Return existing parsed data instead of re-processing
      return NextResponse.json({
        success: true,
        data: {
          id: existingResume._id?.toString(),
          fileName: existingResume.fileName,
          uploadedAt: existingResume.uploadedAt,
          parsedData: existingResume.parsedData,
          cached: true,
        },
        message: "Resume already processed. Returning cached data.",
      })
    }

    // Parse the file to extract text
    const parseResult = await parseFile(buffer, file.type)

    if (!parseResult.success || !parseResult.text) {
      return NextResponse.json(
        { success: false, error: parseResult.error || "Failed to extract text from file" },
        { status: 422 }
      )
    }

    // Parse resume with Gemini AI
    const geminiResult = await parseResumeWithGemini(parseResult.text)

    if (!geminiResult.success || !geminiResult.data) {
      return NextResponse.json(
        { success: false, error: geminiResult.error || "Failed to parse resume with AI" },
        { status: 422 }
      )
    }

    // Store in database
    const resumeDocument: ResumeDocument = {
      userId,
      fileName: file.name,
      fileHash,
      mimeType: file.type,
      fileSize: file.size,
      uploadedAt: new Date(),
      parsedData: geminiResult.data,
      rawText: parseResult.text,
      wordCount: parseResult.wordCount,
      pageCount: parseResult.pageCount,
    }

    const insertResult = await resumesCollection.insertOne(resumeDocument)

    return NextResponse.json({
      success: true,
      data: {
        id: insertResult.insertedId.toString(),
        fileName: file.name,
        uploadedAt: resumeDocument.uploadedAt,
        parsedData: geminiResult.data,
        cached: false,
      },
      message: "Resume uploaded and parsed successfully",
    })
  } catch (error) {
    console.error("Resume upload error:", error)
    const message = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      { success: false, error: `Failed to process resume: ${message}` },
      { status: 500 }
    )
  }
}
