import { Metadata } from "next";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { SkillsChart } from "@/components/dashboard/skills-chart";
import { RecentJobMatches } from "@/components/dashboard/recent-job-matches";
import { CareerInsights } from "@/components/dashboard/career-insights";
import { ActivityChart } from "@/components/dashboard/activity-chart";

export const metadata: Metadata = {
  title: "Dashboard - JobLens AI",
  description: "View your job matches, skills analysis, and career insights",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, Alex
          </h1>
          <p className="text-muted-foreground">
            {"Here's"} what{"'s"} happening with your job search today.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Matches - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentJobMatches />
        </div>

        {/* Skills Analysis */}
        <div className="lg:col-span-1">
          <SkillsChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <CareerInsights />
      </div>
    </div>
  );
}
