"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useResumeStore } from "@/store"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Upload,
  Calendar,
  Building,
  FolderGit2,
  Award,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Languages,
  FileText,
  Loader2,
} from "lucide-react"

function formatDate(date: Date | string | undefined): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function ResumeViewerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No Resume Uploaded</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Upload your resume to get AI-powered insights, skill extraction, and ATS score analysis.
      </p>
      <Link href="/upload">
        <Button size="lg" className="rounded-xl gap-2">
          <Upload className="h-5 w-5" />
          Upload Resume
        </Button>
      </Link>
    </div>
  )
}

export function ResumeViewer() {
  const { resumeData, isLoading, fetchResumes, error } = useResumeStore()

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  if (isLoading) {
    return <ResumeViewerSkeleton />
  }

  if (!resumeData) {
    return <EmptyState />
  }

  const { contact, summary, skills, technologies, experience, education, projects, certifications, atsScore, atsIssues, suggestions, languages, fileName, uploadedAt } = resumeData

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Uploaded on {formatDate(uploadedAt)}</span>
          <span>|</span>
          <span className="truncate max-w-[200px]">{fileName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/upload">
            <Button variant="outline" className="rounded-xl gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </Button>
          </Link>
        </div>
      </div>

      {/* ATS Score Banner */}
      {atsScore !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`rounded-2xl ${atsScore >= 80 ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20" : atsScore >= 60 ? "border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20" : "border-red-500/50 bg-red-50/50 dark:bg-red-950/20"}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${atsScore >= 80 ? "bg-green-100 dark:bg-green-900/50" : atsScore >= 60 ? "bg-yellow-100 dark:bg-yellow-900/50" : "bg-red-100 dark:bg-red-900/50"}`}>
                    <span className={`text-xl font-bold ${atsScore >= 80 ? "text-green-600 dark:text-green-400" : atsScore >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                      {atsScore}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">ATS Compatibility Score</h3>
                    <p className="text-sm text-muted-foreground">
                      {atsScore >= 80 ? "Excellent! Your resume is well-optimized." : atsScore >= 60 ? "Good, but there is room for improvement." : "Needs work. Review the suggestions below."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Skills */}
        <div className="space-y-6">
          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-center">
                  {contact.name || "Unknown"}
                </h3>

                <Separator />

                <div className="space-y-3">
                  {contact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{contact.location}</span>
                    </div>
                  )}
                  {contact.linkedin && (
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline text-accent">
                        {contact.linkedin.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {contact.github && (
                    <div className="flex items-center gap-3 text-sm">
                      <Github className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={contact.github.startsWith("http") ? contact.github : `https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline text-accent">
                        {contact.github.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {contact.portfolio && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={contact.portfolio.startsWith("http") ? contact.portfolio : `https://${contact.portfolio}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline text-accent">
                        {contact.portfolio.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Skills ({skills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills extracted</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Technologies Card */}
          {technologies && technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-accent" />
                    Technologies ({technologies.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="px-3 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Languages Card */}
          {languages && languages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Languages className="h-5 w-5 text-accent" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.length > 0 ? (
                  education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium">{edu.degree}</h4>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-accent">{edu.fieldOfStudy}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{edu.graduationDate}</span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {edu.achievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      )}
                      {index < education.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No education data</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Certifications Card */}
          {certifications && certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-medium text-sm">{cert.name}</h4>
                      <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                      {cert.date && (
                        <p className="text-xs text-muted-foreground">{cert.date}</p>
                      )}
                      {index < certifications.length - 1 && <Separator className="mt-2" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column - Summary, Experience, Projects, Issues, Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {summary}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Experience Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accent" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      {index < experience.length - 1 && (
                        <div className="absolute left-[7px] top-8 bottom-0 w-px bg-border -mb-6" />
                      )}
                      <div className="flex gap-4">
                        <div className="w-4 h-4 rounded-full bg-accent shrink-0 mt-1" />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h4 className="font-semibold">{exp.title}</h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {exp.startDate} - {exp.endDate}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <Building className="h-4 w-4" />
                            <span>{exp.company}</span>
                            {exp.location && (
                              <>
                                <span>|</span>
                                <span>{exp.location}</span>
                              </>
                            )}
                          </div>
                          {exp.description && exp.description.length > 0 && (
                            <ul className="space-y-1.5 mt-3">
                              {exp.description.map((item, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-accent mt-1.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {exp.skills && exp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {exp.skills.map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No work experience data</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Card */}
          {projects && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-accent" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-semibold">{project.name}</h4>
                        {project.url && (
                          <a
                            href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent hover:underline"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {index < projects.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ATS Issues Card */}
          {atsIssues && atsIssues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Card className="rounded-2xl border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <AlertCircle className="h-5 w-5" />
                    ATS Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {atsIssues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <XCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Suggestions Card */}
          {suggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="rounded-2xl border-accent/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-accent">
                    <Lightbulb className="h-5 w-5" />
                    Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
