"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  LineChart,
  Clock,
  Shield,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    description:
      "Advanced NLP extracts skills, experience, and qualifications from your resume with 95% accuracy.",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description:
      "Our algorithm matches your profile against thousands of jobs to find the best fit for your career goals.",
  },
  {
    icon: LineChart,
    title: "Career Insights",
    description:
      "Get personalized insights on skill gaps, market trends, and salary expectations in your field.",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description:
      "Access the latest job postings from top companies, updated in real-time from multiple sources.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is encrypted and never shared. You control what information is visible to employers.",
  },
  {
    icon: Layers,
    title: "Multi-Format Support",
    description:
      "Upload resumes in PDF, DOCX, or TXT format. Our parser handles all common resume structures.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
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
            Powerful Features for Your Job Search
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Everything you need to find your perfect job, powered by cutting-edge
            AI technology and real-time data.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                  <feature.icon className="h-6 w-6 text-foreground group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
