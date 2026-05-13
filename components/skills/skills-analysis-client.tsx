"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const skillsData = [
  { skill: "React", proficiency: 95, marketDemand: 92, category: "Frontend" },
  { skill: "TypeScript", proficiency: 90, marketDemand: 88, category: "Languages" },
  { skill: "Node.js", proficiency: 85, marketDemand: 85, category: "Backend" },
  { skill: "Python", proficiency: 75, marketDemand: 90, category: "Languages" },
  { skill: "AWS", proficiency: 70, marketDemand: 88, category: "Cloud" },
  { skill: "Docker", proficiency: 65, marketDemand: 82, category: "DevOps" },
  { skill: "PostgreSQL", proficiency: 80, marketDemand: 78, category: "Database" },
  { skill: "GraphQL", proficiency: 60, marketDemand: 72, category: "API" },
];

const radarData = [
  { subject: "Frontend", A: 95, fullMark: 100 },
  { subject: "Backend", A: 85, fullMark: 100 },
  { subject: "Database", A: 80, fullMark: 100 },
  { subject: "Cloud", A: 70, fullMark: 100 },
  { subject: "DevOps", A: 65, fullMark: 100 },
  { subject: "AI/ML", A: 40, fullMark: 100 },
];

const trendingSkills = [
  { name: "AI/ML", growth: 45, relevance: "High" },
  { name: "Kubernetes", growth: 38, relevance: "High" },
  { name: "Rust", growth: 32, relevance: "Medium" },
  { name: "Go", growth: 28, relevance: "Medium" },
  { name: "WebAssembly", growth: 25, relevance: "Low" },
];

const recommendedCourses = [
  {
    title: "Machine Learning Fundamentals",
    provider: "Coursera",
    duration: "8 weeks",
    impact: "High",
  },
  {
    title: "AWS Solutions Architect",
    provider: "AWS",
    duration: "12 weeks",
    impact: "High",
  },
  {
    title: "Kubernetes for Developers",
    provider: "Udemy",
    duration: "6 weeks",
    impact: "Medium",
  },
];

export function SkillsAnalysisClient() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Skills", value: "24", icon: Zap, change: "+3 this month" },
          { label: "Avg Proficiency", value: "78%", icon: Target, change: "+5% growth" },
          { label: "Market Match", value: "85%", icon: TrendingUp, change: "High demand" },
          { label: "Learning Path", value: "4", icon: BookOpen, change: "courses active" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Proficiency Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-lg">Skill Proficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      axisLine={false}
                      tickLine={false}
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="proficiency" radius={[0, 4, 4, 0]}>
                      {skillsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.proficiency >= 80 ? "var(--accent)" : "var(--chart-2)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-lg">Skills Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Proficiency"
                      dataKey="A"
                      stroke="var(--accent)"
                      fill="var(--accent)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Skills List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Detailed Skill Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsData.map((skill, index) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{skill.proficiency}%</p>
                        <p className="text-xs text-muted-foreground">Proficiency</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{skill.marketDemand}%</span>
                          {skill.marketDemand >= 85 && (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Demand</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress value={skill.proficiency} className="flex-1 h-2" />
                    <Progress
                      value={skill.marketDemand}
                      className="flex-1 h-2 [&>div]:bg-chart-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trending Skills & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Trending Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingSkills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{skill.name}</span>
                      <Badge
                        variant={skill.relevance === "High" ? "default" : "secondary"}
                        className={skill.relevance === "High" ? "bg-accent" : ""}
                      >
                        {skill.relevance}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="font-medium">+{skill.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="rounded-2xl h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Recommended Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedCourses.map((course, index) => (
                  <div
                    key={course.title}
                    className="p-4 rounded-xl border border-border hover:border-accent/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{course.title}</h4>
                      <Badge
                        variant={course.impact === "High" ? "default" : "secondary"}
                        className={course.impact === "High" ? "bg-accent" : ""}
                      >
                        {course.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{course.provider}</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
