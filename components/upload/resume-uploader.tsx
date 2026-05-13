"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  CloudUpload,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useResumeStore } from "@/store"
import { toast } from "sonner"
import type { ResumeData } from "@/lib/types"

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function ResumeUploader() {
  const router = useRouter()
  const { setResumeData, setUploadProgress, uploadProgress } = useResumeStore()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return "Please upload a PDF or Word document"
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB"
    }
    return null
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError(null)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const validationError = validateFile(droppedFile)
      if (validationError) {
        setError(validationError)
        return
      }
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validationError = validateFile(selectedFile)
      if (validationError) {
        setError(validationError)
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress (replace with actual upload)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      // Mock upload and analysis (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      clearInterval(progressInterval)
      setUploadProgress(100)

      setIsUploading(false)
      setIsAnalyzing(true)

      // Mock analysis (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock resume data (replace with actual API response)
      const mockResumeData: ResumeData = {
        id: `resume-${Date.now()}`,
        fileName: file.name,
        uploadedAt: new Date(),
        skills: [
          "JavaScript",
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "Python",
          "SQL",
          "AWS",
        ],
        experience: [
          {
            title: "Software Engineer",
            company: "Tech Company",
            location: "San Francisco, CA",
            startDate: "2021",
            endDate: "Present",
            description: ["Developed web applications using React and Node.js"],
            skills: ["React", "Node.js", "AWS"],
          },
        ],
        education: [
          {
            degree: "B.S. Computer Science",
            institution: "University",
            graduationDate: "2021",
          },
        ],
        contact: {
          name: "User",
          email: "user@example.com",
          location: "San Francisco, CA",
        },
        summary: "Experienced software engineer with expertise in web development",
        matchScore: 85,
      }

      setResumeData(mockResumeData)
      setAnalysisComplete(true)

      toast.success("Resume analyzed successfully!", {
        description: "We found 8 skills and matched your profile.",
      })

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err) {
      setError("Failed to upload resume. Please try again.")
      toast.error("Upload failed", {
        description: "Please try again or use a different file.",
      })
    } finally {
      setIsUploading(false)
      setIsAnalyzing(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setError(null)
    setUploadProgress(0)
    setAnalysisComplete(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="rounded-3xl border-2 border-dashed border-border overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {!file ? (
              // Drop Zone
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative p-12 transition-colors ${
                  isDragging
                    ? "bg-accent/10 border-accent"
                    : "hover:bg-secondary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />

                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
                    <CloudUpload className="w-10 h-10 text-muted-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    Drop your resume here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOC, DOCX (max 5MB)
                  </p>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-destructive text-sm flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      {error}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ) : (
              // Upload Progress / Analysis
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12"
              >
                <div className="text-center">
                  {/* File Info */}
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary mb-6">
                    <FileText className="w-5 h-5 text-accent" />
                    <span className="font-medium">{file.name}</span>
                    {!isUploading && !isAnalyzing && !analysisComplete && (
                      <button
                        onClick={resetUpload}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Status */}
                  <AnimatePresence mode="wait">
                    {isUploading && (
                      <motion.div
                        key="uploading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Upload className="w-5 h-5 text-accent animate-bounce" />
                          <span className="font-medium">Uploading...</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {uploadProgress}% complete
                        </p>
                      </motion.div>
                    )}

                    {isAnalyzing && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                          <span className="font-medium">AI is analyzing your resume...</span>
                        </div>
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
                        <p className="text-sm text-muted-foreground mt-4">
                          Extracting skills, experience, and qualifications
                        </p>
                      </motion.div>
                    )}

                    {analysisComplete && (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          Analysis Complete!
                        </h3>
                        <p className="text-muted-foreground">
                          Redirecting to your dashboard...
                        </p>
                      </motion.div>
                    )}

                    {!isUploading && !isAnalyzing && !analysisComplete && (
                      <motion.div
                        key="ready"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Button
                          onClick={handleUpload}
                          size="lg"
                          className="rounded-xl px-8"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Analyze Resume
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4">
                          Your data is encrypted and secure
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
