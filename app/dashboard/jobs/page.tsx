import { Metadata } from "next";
import { JobsListClient } from "@/components/jobs/jobs-list-client";

export const metadata: Metadata = {
  title: "Job Matches - JobLens AI",
  description: "Browse AI-matched job opportunities tailored to your skills and experience",
};

export default function JobsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Matches</h1>
        <p className="text-muted-foreground">
          AI-powered job recommendations based on your resume
        </p>
      </div>

      {/* Jobs List with Filters */}
      <JobsListClient />
    </div>
  );
}
