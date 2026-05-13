"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Briefcase,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Job } from "@/lib/types";
import { useBookmarks, useAuth } from "@/lib/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface JobCardProps {
  job: Job;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  index: number;
}

export function JobCard({
  job,
  matchScore,
  matchingSkills,
  missingSkills,
  index,
}: JobCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [saved, setSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Sync saved state with bookmarks
  useEffect(() => {
    setSaved(isBookmarked(job.job_id));
  }, [isBookmarked, job.job_id]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const formatSalary = () => {
    if (job.job_min_salary && job.job_max_salary) {
      return `$${(job.job_min_salary / 1000).toFixed(0)}k - $${(job.job_max_salary / 1000).toFixed(0)}k`;
    }
    return "Salary not disclosed";
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Please sign in to save jobs", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }
    
    const isNowSaved = toggleBookmark(job);
    setSaved(isNowSaved);
    
    if (isNowSaved) {
      toast.success("Job saved successfully", {
        description: `${job.job_title} at ${job.employer_name}`,
      });
    } else {
      toast.info("Job removed from saved", {
        description: `${job.job_title} at ${job.employer_name}`,
      });
    }
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!job.job_apply_link) {
      toast.error("Apply link not available", {
        description: "Try searching for this job on the company website.",
      });
      return;
    }

    // Validate URL
    try {
      new URL(job.job_apply_link);
    } catch {
      toast.error("Invalid apply link", {
        description: "The application link appears to be broken.",
      });
      return;
    }

    setIsApplying(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      window.open(job.job_apply_link, "_blank", "noopener,noreferrer");
      setIsApplying(false);
      toast.success("Opening application page", {
        description: "Good luck with your application!",
      });
    }, 500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card
          className="rounded-2xl border-border hover:border-accent/30 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => setShowDetails(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                {job.employer_logo ? (
                  <Image
                    src={job.employer_logo}
                    alt={job.employer_name}
                    width={40}
                    height={40}
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Building2 className="h-7 w-7 text-muted-foreground" />
                )}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors line-clamp-1">
                      {job.job_title}
                    </h3>
                    <p className="text-muted-foreground">{job.employer_name}</p>
                  </div>
                  
                  {/* Match Score */}
                  <div className="flex flex-col items-end shrink-0">
                    <Badge
                      className={`text-sm px-3 py-1 ${
                        matchScore >= 80
                          ? "bg-green-100 text-green-700 border-green-200"
                          : matchScore >= 60
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {matchScore}% Match
                    </Badge>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.job_city || "Remote"}, {job.job_state || "USA"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {formatDate(job.job_posted_at_timestamp)}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="rounded-lg">
                    {job.job_employment_type}
                  </Badge>
                  {job.job_is_remote && (
                    <Badge variant="outline" className="rounded-lg border-accent text-accent">
                      Remote
                    </Badge>
                  )}
                </div>

                {/* Matching Skills Preview */}
                {matchingSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {matchingSkills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        {skill}
                      </Badge>
                    ))}
                    {matchingSkills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{matchingSkills.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-9 w-9 rounded-xl ${saved ? "text-accent" : ""}`}
                  onClick={handleBookmark}
                  title={saved ? "Remove from saved" : "Save job"}
                >
                  {saved ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-xl"
                  onClick={handleApply}
                  disabled={isApplying || !job.job_apply_link}
                  title="Apply to this job"
                >
                  {isApplying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                {job.employer_logo ? (
                  <Image
                    src={job.employer_logo}
                    alt={job.employer_name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl">{job.job_title}</DialogTitle>
                <p className="text-muted-foreground text-lg">{job.employer_name}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Match Score Section */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Your Match Score</span>
                <span className="text-2xl font-bold text-accent">{matchScore}%</span>
              </div>
              <Progress value={matchScore} className="h-3" />
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <MapPin className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{job.job_city || "Remote"}, {job.job_state || "USA"}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <DollarSign className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">{formatSalary()}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <Briefcase className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{job.job_employment_type}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <Clock className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="font-medium">{formatDate(job.job_posted_at_timestamp)}</p>
              </div>
            </div>

            {/* Skills Match */}
            <div className="space-y-4">
              <h4 className="font-semibold">Skills Match</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Matching Skills ({matchingSkills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchingSkills.map((skill) => (
                      <Badge key={skill} className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                        {skill}
                      </Badge>
                    ))}
                    {matchingSkills.length === 0 && (
                      <p className="text-sm text-muted-foreground">No matching skills detected</p>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-700 dark:text-orange-400">
                      Skills to Learn ({missingSkills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.slice(0, 5).map((skill) => (
                      <Badge key={skill} className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
                        {skill}
                      </Badge>
                    ))}
                    {missingSkills.length === 0 && (
                      <p className="text-sm text-muted-foreground">You have all required skills!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h4 className="font-semibold mb-3">Job Description</h4>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="whitespace-pre-line line-clamp-[20]">
                  {job.job_description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.job_highlights?.Qualifications && (
              <div>
                <h4 className="font-semibold mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {job.job_highlights.Qualifications.slice(0, 6).map((qual, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Button */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                className="flex-1 rounded-xl"
                onClick={handleApply}
                disabled={isApplying || !job.job_apply_link}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className={`rounded-xl ${saved ? "text-accent border-accent" : ""}`}
                onClick={handleBookmark}
              >
                {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </Button>
            </div>
            
            {!job.job_apply_link && (
              <p className="text-sm text-muted-foreground text-center">
                Application link not available. Try searching for this job on the company website.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
