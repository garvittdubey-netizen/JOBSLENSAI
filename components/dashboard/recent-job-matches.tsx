"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Bookmark,
} from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    matchScore: number;
    posted: string;
    type: string;
    remote: boolean;
    logo?: string;
  };
  index: number;
}

function JobCard({ job, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group p-4 rounded-xl border border-border hover:border-accent/30 bg-card hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          {job.logo ? (
            <Image
              src={job.logo}
              alt={job.company}
              width={32}
              height={32}
              className="rounded"
            />
          ) : (
            <Building2 className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate group-hover:text-accent transition-colors">
              {job.title}
            </h4>
            <Badge
              variant={job.matchScore >= 80 ? "default" : "secondary"}
              className={`shrink-0 ${
                job.matchScore >= 80
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              {job.matchScore}% Match
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.posted}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              {job.type}
            </Badge>
            {job.remote && (
              <Badge variant="outline" className="text-xs">
                Remote
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

const recentJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    salary: "$150k - $180k",
    matchScore: 92,
    posted: "2h ago",
    type: "Full-time",
    remote: true,
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    salary: "$130k - $160k",
    matchScore: 87,
    posted: "5h ago",
    type: "Full-time",
    remote: true,
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Agency",
    location: "Austin, TX",
    salary: "$120k - $145k",
    matchScore: 84,
    posted: "1d ago",
    type: "Full-time",
    remote: false,
  },
  {
    id: "4",
    title: "Software Engineer",
    company: "Enterprise Co",
    location: "Seattle, WA",
    salary: "$140k - $170k",
    matchScore: 79,
    posted: "1d ago",
    type: "Full-time",
    remote: true,
  },
];

export function RecentJobMatches() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="rounded-2xl border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">
            Recent Job Matches
          </CardTitle>
          <Link href="/dashboard/jobs">
            <Button variant="ghost" size="sm" className="text-accent">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
