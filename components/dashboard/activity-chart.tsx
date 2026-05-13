"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Mon", matches: 12, applications: 3 },
  { date: "Tue", matches: 19, applications: 5 },
  { date: "Wed", matches: 15, applications: 4 },
  { date: "Thu", matches: 25, applications: 8 },
  { date: "Fri", matches: 32, applications: 10 },
  { date: "Sat", matches: 28, applications: 7 },
  { date: "Sun", matches: 25, applications: 6 },
];

export function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="matchesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
                />
                <Area
                  type="monotone"
                  dataKey="matches"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#matchesGradient)"
                  name="Job Matches"
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  fill="url(#applicationsGradient)"
                  name="Applications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Job Matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2" />
              <span className="text-sm text-muted-foreground">Applications</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
