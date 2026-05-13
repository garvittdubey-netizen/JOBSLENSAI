"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
} from "lucide-react";

type InsightType = "strength" | "improvement" | "opportunity" | "trend";

interface Insight {
  type: InsightType;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const insights: Insight[] = [
  {
    type: "strength",
    title: "Strong React Skills",
    description: "Your React proficiency is in the top 15% of candidates",
    priority: "high",
  },
  {
    type: "trend",
    title: "AI/ML is Trending",
    description: "40% more jobs require ML skills this quarter",
    priority: "high",
  },
  {
    type: "opportunity",
    title: "Remote Opportunities",
    description: "68% of your matches offer remote work",
    priority: "medium",
  },
  {
    type: "improvement",
    title: "Cloud Certifications",
    description: "AWS cert could boost match scores by 15%",
    priority: "medium",
  },
];

const typeConfig: Record<InsightType, { icon: React.ElementType; color: string }> = {
  strength: { icon: Zap, color: "text-green-600 bg-green-100" },
  improvement: { icon: Target, color: "text-orange-600 bg-orange-100" },
  opportunity: { icon: Lightbulb, color: "text-blue-600 bg-blue-100" },
  trend: { icon: TrendingUp, color: "text-purple-600 bg-purple-100" },
};

export function CareerInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="rounded-2xl border-border h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Career Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => {
            const config = typeConfig[insight.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {insight.title}
                    </h4>
                    {insight.priority === "high" && (
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                        Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {insight.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
