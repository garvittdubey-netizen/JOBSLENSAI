import { NextResponse } from "next/server"
import { getCollection, COLLECTIONS } from "@/services/mongodb"
import { ObjectId } from "mongodb"
import type { ParsedResumeData } from "@/services/gemini"

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

// GET /api/resume - Get all resumes for the demo user
export async function GET() {
  try {
    // Demo mode: bypass authentication
    const userId = DEMO_USER_ID
    const resumesCollection = await getCollection<ResumeDocument>(COLLECTIONS.RESUMES)

    const resumes = await resumesCollection
      .find({ userId })
      .sort({ uploadedAt: -1 })
      .toArray()

    // Transform MongoDB documents to API response format
    const transformedResumes = resumes.map((resume) => ({
      id: resume._id?.toString(),
      fileName: resume.fileName,
      uploadedAt: resume.uploadedAt,
      fileSize: resume.fileSize,
      mimeType: resume.mimeType,
      parsedData: resume.parsedData,
      wordCount: resume.wordCount,
      pageCount: resume.pageCount,
    }))

    return NextResponse.json({
      success: true,
      data: transformedResumes,
    })
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch resumes" },
      { status: 500 }
    )
  }
}

// DELETE /api/resume - Delete all resumes for the demo user
export async function DELETE() {
  try {
    // Demo mode: bypass authentication
    const userId = DEMO_USER_ID
    const resumesCollection = await getCollection<ResumeDocument>(COLLECTIONS.RESUMES)

    const result = await resumesCollection.deleteMany({ userId })

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} resume(s)`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error deleting resumes:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete resumes" },
      { status: 500 }
    )
  }
}
