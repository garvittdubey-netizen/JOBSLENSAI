"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { searchJobs, matchJobsWithResume } from "@/lib/api";
import { Job, JobMatch, ResumeData } from "@/lib/types";
import { AlertCircle, Briefcase, RefreshCw } from "lucide-react";

// Mock resume data for demonstration
const mockResumeData: ResumeData = {
  id: "mock-1",
  fileName: "resume.pdf",
  uploadedAt: new Date(),
  skills: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Python", "SQL", "PostgreSQL", "AWS", "Docker", "Git",
    "REST API", "GraphQL", "Agile", "Team Collaboration"
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      description: ["Led development of microservices architecture"],
      skills: ["React", "Node.js", "AWS"]
    }
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of Technology",
      graduationDate: "2019"
    }
  ],
  contact: {
    name: "Alex Johnson",
    email: "alex@example.com",
    location: "San Francisco, CA"
  },
  summary: "Experienced software engineer with 5+ years in full-stack development",
  rawText: ""
};

interface FilterState {
  query: string;
  location: string;
  datePosted: string;
  remoteOnly: boolean;
  employmentTypes: string[];
  experienceLevels: string[];
  salaryRange: [number, number];
}

export function JobsListClient() {
  const [filters, setFilters] = useState<FilterState>({
    query: "Software Engineer",
    location: "",
    datePosted: "all",
    remoteOnly: false,
    employmentTypes: [],
    experienceLevels: [],
    salaryRange: [0, 300000],
  });
  
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async (searchFilters: FilterState, pageNum: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const rawJobs = await searchJobs({
        query: searchFilters.query || "Software Engineer",
        location: searchFilters.location || undefined,
        page: pageNum,
        date_posted: searchFilters.datePosted as "all" | "today" | "3days" | "week" | "month",
        remote_jobs_only: searchFilters.remoteOnly,
        employment_types: searchFilters.employmentTypes.length > 0 
          ? searchFilters.employmentTypes.join(",").toUpperCase()
          : undefined,
      });

      // Match jobs with resume
      const matchedJobs = matchJobsWithResume(rawJobs, mockResumeData);
      
      if (pageNum === 1) {
        setJobs(matchedJobs);
      } else {
        setJobs(prev => [...prev, ...matchedJobs]);
      }
      
      setPage(pageNum);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters);
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchJobs(filters, 1);
  };

  const handleLoadMore = () => {
    fetchJobs(filters, page + 1);
  };

  return (
    <div>
      <JobFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <div className="flex-1">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-accent" />
            <span className="font-medium">
              {isLoading ? "Searching..." : `${jobs.length} jobs found`}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            disabled={isLoading}
            className="rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-4 mb-6"
          >
            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <p className="font-medium text-destructive">Error loading jobs</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearch}
              className="ml-auto rounded-xl"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && jobs.length === 0 && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Job Cards */}
        {!isLoading && jobs.length === 0 && !error && (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters or query
            </p>
            <Button onClick={handleSearch} className="rounded-xl">
              Search Again
            </Button>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((match, index) => (
              <JobCard
                key={match.job.job_id}
                job={match.job}
                matchScore={match.overallScore}
                matchingSkills={match.matchingSkills}
                missingSkills={match.missingSkills}
                index={index}
              />
            ))}

            {/* Load More */}
            {jobs.length >= 10 && (
              <div className="text-center pt-6">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="rounded-xl"
                >
                  {isLoading ? "Loading..." : "Load More Jobs"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
