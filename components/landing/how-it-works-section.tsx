"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Briefcase, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description:
      "Drag and drop your resume in PDF, DOCX, or TXT format. Our system accepts all common resume formats.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analysis",
    description:
      "Our AI extracts your skills, experience, education, and career preferences using advanced natural language processing.",
  },
  {
    number: "03",
    icon: Briefcase,
    title: "Smart Matching",
    description:
      "We search through thousands of job listings and match them against your profile to find the best opportunities.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Get Insights",
    description:
      "View your personalized dashboard with job matches, skill analysis, and career recommendations.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How JobLens AI Works
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            From upload to job match in minutes. Our streamlined process makes
            job hunting effortless.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center ${
                  index % 2 === 0 ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`${
                    index % 2 === 0
                      ? "lg:text-right lg:pr-12"
                      : "lg:col-start-2 lg:pl-12"
                  }`}
                >
                  <span className="text-6xl font-bold text-secondary">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-semibold mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className={`hidden lg:flex ${
                    index % 2 === 0
                      ? "lg:col-start-2 lg:justify-start lg:pl-12"
                      : "lg:col-start-1 lg:row-start-1 lg:justify-end lg:pr-12"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-xl" />
                    <div className="relative w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                      <step.icon className="h-10 w-10 text-accent" />
                    </div>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
