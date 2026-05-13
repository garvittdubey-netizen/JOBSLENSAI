import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getCollection, COLLECTIONS } from "@/services/mongodb"
import { ObjectId } from "mongodb"
import type { ParsedResumeData } from "@/services/gemini"

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

// GET /api/resume/[id] - Get a specific resume by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid resume ID" },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const resumesCollection = await getCollection<ResumeDocument>(COLLECTIONS.RESUMES)

    const resume = await resumesCollection.findOne({
      _id: new ObjectId(id),
      userId,
    })

    if (!resume) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resume._id?.toString(),
        fileName: resume.fileName,
        uploadedAt: resume.uploadedAt,
        fileSize: resume.fileSize,
        mimeType: resume.mimeType,
        parsedData: resume.parsedData,
        rawText: resume.rawText,
        wordCount: resume.wordCount,
        pageCount: resume.pageCount,
      },
    })
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch resume" },
      { status: 500 }
    )
  }
}

// DELETE /api/resume/[id] - Delete a specific resume by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid resume ID" },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const resumesCollection = await getCollection<ResumeDocument>(COLLECTIONS.RESUMES)

    const result = await resumesCollection.deleteOne({
      _id: new ObjectId(id),
      userId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Resume not found or already deleted" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete resume" },
      { status: 500 }
    )
  }
}
