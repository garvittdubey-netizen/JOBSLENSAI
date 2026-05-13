"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Sparkles,
  Download,
  Edit,
  Upload,
  Calendar,
  Building,
} from "lucide-react";

// Mock resume data
const resumeData = {
  contact: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
  },
  summary:
    "Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable applications and mentoring developers.",
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST API",
    "Git",
    "Agile",
    "Team Leadership",
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: [
        "Led development of microservices architecture serving 1M+ daily users",
        "Mentored team of 5 junior developers and conducted code reviews",
        "Improved system performance by 40% through optimization initiatives",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
      ],
    },
    {
      title: "Software Developer",
      company: "Startup Labs",
      location: "New York, NY",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      description: [
        "Built full-stack web applications using React and Node.js",
        "Collaborated with design team on UI/UX improvements",
        "Implemented automated testing increasing code coverage to 85%",
        "Participated in agile development processes and sprint planning",
      ],
    },
    {
      title: "Junior Developer",
      company: "Digital Agency Co.",
      location: "Boston, MA",
      startDate: "Aug 2017",
      endDate: "May 2019",
      description: [
        "Developed responsive web applications for client projects",
        "Maintained and updated legacy codebases",
        "Worked directly with clients to gather requirements",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      graduationDate: "May 2017",
      gpa: "3.8",
    },
  ],
  uploadedAt: "2024-01-15",
  fileName: "Alex_Johnson_Resume.pdf",
};

export function ResumeViewer() {
  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Uploaded on {resumeData.uploadedAt}</span>
          <span>|</span>
          <span>{resumeData.fileName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/upload">
            <Button variant="outline" className="rounded-xl gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

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
                  {resumeData.contact.name}
                </h3>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{resumeData.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{resumeData.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{resumeData.contact.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <span>{resumeData.contact.linkedin}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span>{resumeData.contact.github}</span>
                  </div>
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
                  Skills ({resumeData.skills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{edu.graduationDate}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Summary & Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
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
                  {resumeData.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

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
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    {index < resumeData.experience.length - 1 && (
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{exp.company}</span>
                          <span>|</span>
                          <span>{exp.location}</span>
                        </div>
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
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
