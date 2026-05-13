import { Metadata } from "next";
import { ResumeViewer } from "@/components/resume/resume-viewer";

export const metadata: Metadata = {
  title: "Resume - JobLens AI",
  description: "View and manage your uploaded resume",
};

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Resume</h1>
        <p className="text-muted-foreground">
          AI-extracted information from your uploaded resume
        </p>
      </div>

      <ResumeViewer />
    </div>
  );
}
