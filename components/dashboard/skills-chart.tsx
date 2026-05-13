"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const topSkills = [
  { name: "React", proficiency: 95, demand: "High", color: "bg-chart-1" },
  { name: "TypeScript", proficiency: 90, demand: "High", color: "bg-chart-2" },
  { name: "Node.js", proficiency: 85, demand: "High", color: "bg-chart-3" },
  { name: "Python", proficiency: 75, demand: "Very High", color: "bg-chart-4" },
  { name: "AWS", proficiency: 70, demand: "High", color: "bg-chart-5" },
];

const skillGaps = [
  { name: "Kubernetes", relevance: "High" },
  { name: "GraphQL", relevance: "Medium" },
  { name: "Machine Learning", relevance: "High" },
];

export function SkillsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="rounded-2xl border-border h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Skills Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top Skills */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              Your Top Skills
            </h4>
            <div className="space-y-4">
              {topSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {skill.demand} Demand
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>
                  <Progress value={skill.proficiency} className="h-2" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              Recommended Skills to Learn
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((skill) => (
                <Badge
                  key={skill.name}
                  variant="outline"
                  className={`px-3 py-1.5 ${
                    skill.relevance === "High"
                      ? "border-accent text-accent"
                      : "border-border"
                  }`}
                >
                  {skill.name}
                  {skill.relevance === "High" && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
