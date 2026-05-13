"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  Target, 
  Users, 
  Globe, 
  Award,
  Heart,
  Lightbulb,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";

const stats = [
  { value: "50K+", label: "Jobs Matched" },
  { value: "10K+", label: "Happy Users" },
  { value: "95%", label: "Match Accuracy" },
  { value: "500+", label: "Companies" },
];

const values = [
  {
    icon: Target,
    title: "Precision Matching",
    description: "We believe in quality over quantity. Our AI ensures every job recommendation is relevant to your career goals.",
  },
  {
    icon: Heart,
    title: "User First",
    description: "Every feature we build starts with a simple question: how does this help job seekers succeed?",
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description: "We're constantly improving our AI models to provide more accurate and insightful recommendations.",
  },
  {
    icon: Globe,
    title: "Global Opportunity",
    description: "We connect talent with opportunities worldwide, breaking down geographical barriers.",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
  },
  {
    name: "Michael Rodriguez",
    role: "CTO & Co-founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
  },
  {
    name: "Emily Watson",
    role: "Head of AI",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
  },
  {
    name: "David Kim",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Our Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Transforming how people
                <br />
                <span className="gradient-text">find their dream jobs</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Founded in 2023, JobLens AI was born from a simple frustration: 
                the traditional job search is broken. We&apos;re fixing it with AI.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We believe everyone deserves a fulfilling career. Our mission is to leverage 
                  artificial intelligence to create perfect matches between talented individuals 
                  and opportunities that align with their skills, values, and aspirations.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Traditional job boards flood you with irrelevant listings. We flip the script 
                  by understanding who you are first, then finding roles where you&apos;ll truly thrive.
                </p>
                <div className="flex items-center gap-4">
                  <Award className="w-12 h-12 text-accent" />
                  <div>
                    <div className="font-semibold">Award-Winning Technology</div>
                    <div className="text-sm text-muted-foreground">
                      Recognized by TechCrunch Disrupt 2024
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-accent/20 to-muted overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-accent/20 animate-pulse-glow flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-accent" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-4">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Our Team</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Meet the People Behind JobLens</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A diverse team of engineers, designers, and career experts united by a shared vision
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-foreground text-background">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join the future of job searching
              </h2>
              <p className="text-background/70 text-lg mb-8 max-w-2xl mx-auto">
                Start your AI-powered career journey today
              </p>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
