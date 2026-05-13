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

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function ResumeUploader() {
  const router = useRouter()
  const { uploadResume, uploadProgress, isAnalyzing, error: storeError, clearError } = useResumeStore()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const error = localError || storeError

  const validateFile = (file: File): string | null => {
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."))
    const isValidType = ACCEPTED_FILE_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension)
    
    if (!isValidType) {
      return "Please upload a PDF, DOCX, or TXT document"
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB"
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
    setLocalError(null)
    clearError()

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const validationError = validateFile(droppedFile)
      if (validationError) {
        setLocalError(validationError)
        return
      }
      setFile(droppedFile)
    }
  }, [clearError])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null)
    clearError()
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validationError = validateFile(selectedFile)
      if (validationError) {
        setLocalError(validationError)
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLocalError(null)
    clearError()

    const success = await uploadResume(file)

    if (success) {
      setIsComplete(true)
      toast.success("Resume analyzed successfully!", {
        description: "Your resume has been parsed and analyzed by AI.",
      })

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard/resume")
      }, 1500)
    } else {
      toast.error("Upload failed", {
        description: storeError || "Please try again or use a different file.",
      })
    }
  }

  const resetUpload = () => {
    setFile(null)
    setLocalError(null)
    clearError()
    setIsComplete(false)
  }

  const isUploading = isAnalyzing && uploadProgress < 100 && uploadProgress > 0 && uploadProgress < 70
  const isAnalyzingAI = isAnalyzing && uploadProgress >= 70 && uploadProgress < 100

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
                  accept=".pdf,.docx,.txt"
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
                    Supports PDF, DOCX, TXT (max 10MB)
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
                    <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                    {!isAnalyzing && !isComplete && (
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

                    {isAnalyzingAI && (
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
                          Extracting skills, experience, and qualifications with Gemini AI
                        </p>
                      </motion.div>
                    )}

                    {isComplete && (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          Analysis Complete!
                        </h3>
                        <p className="text-muted-foreground">
                          Redirecting to your resume dashboard...
                        </p>
                      </motion.div>
                    )}

                    {error && !isAnalyzing && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
                          <XCircle className="w-8 h-8 text-destructive" />
                        </div>
                        <p className="text-destructive text-sm">{error}</p>
                        <Button
                          onClick={resetUpload}
                          variant="outline"
                          className="rounded-xl"
                        >
                          Try Again
                        </Button>
                      </motion.div>
                    )}

                    {!isAnalyzing && !isComplete && !error && (
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
                          Analyze Resume with AI
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4">
                          Powered by Gemini 2.0 Flash - Your data is encrypted and secure
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
