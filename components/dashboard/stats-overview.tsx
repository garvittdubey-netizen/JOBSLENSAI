"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  TrendingUp,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  delay?: number;
}

function StatCard({ title, value, change, changeLabel, icon: Icon, delay = 0 }: StatCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="rounded-2xl border-border hover:border-accent/30 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {change !== undefined && (
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
                    {Math.abs(change)}%
                  </span>
                  {changeLabel && (
                    <span className="text-sm text-muted-foreground">{changeLabel}</span>
                  )}
                </div>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Icon className="h-6 w-6 text-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsOverview() {
  const stats = [
    {
      title: "Job Matches",
      value: 156,
      change: 12,
      changeLabel: "vs last week",
      icon: Briefcase,
    },
    {
      title: "Match Score",
      value: "85%",
      change: 5,
      changeLabel: "improvement",
      icon: Target,
    },
    {
      title: "Skills Matched",
      value: 24,
      change: 8,
      changeLabel: "new matches",
      icon: Zap,
    },
    {
      title: "Profile Views",
      value: 47,
      change: -3,
      changeLabel: "vs last week",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}
