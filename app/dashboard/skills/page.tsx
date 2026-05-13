import { Metadata } from "next";
import { SkillsAnalysisClient } from "@/components/skills/skills-analysis-client";

export const metadata: Metadata = {
  title: "Skills Analysis - JobLens AI",
  description: "Analyze your skills and discover opportunities for growth",
};

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skills Analysis</h1>
        <p className="text-muted-foreground">
          Understand your strengths and areas for growth
        </p>
      </div>

      <SkillsAnalysisClient />
    </div>
  );
}
