import { Metadata } from "next";
import Link from "next/link";
import { ResumeUploader } from "@/components/upload/resume-uploader";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Upload Resume - JobLens AI",
  description: "Upload your resume and let AI analyze your skills to find perfect job matches",
};

export default function UploadPage() {
  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <span className="text-xl font-semibold tracking-tight">
              JobLens<span className="text-accent">AI</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Upload Your Resume
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Our AI will analyze your skills, experience, and qualifications to
            find the perfect job matches for you.
          </p>
        </div>

        <ResumeUploader />

        {/* Features List */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Smart Parsing",
              description: "AI extracts skills, experience, and education automatically",
            },
            {
              title: "Instant Analysis",
              description: "Get your results in seconds, not hours",
            },
            {
              title: "Privacy Protected",
              description: "Your data is encrypted and never shared",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
