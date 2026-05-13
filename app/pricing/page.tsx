"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown, Building2, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";

const plans = [
  {
    name: "Free",
    icon: Zap,
    description: "Perfect for exploring JobLens AI",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "5 job searches per day",
      "Basic resume analysis",
      "10 job applications tracking",
      "Email support",
    ],
    limitations: [
      "Limited AI insights",
      "No skill gap analysis",
      "No priority support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    description: "For serious job seekers",
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      "Unlimited job searches",
      "Advanced AI resume analysis",
      "Unlimited job tracking",
      "Skills gap identification",
      "Personalized recommendations",
      "Priority email support",
      "Resume optimization tips",
      "Interview preparation guides",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    description: "For teams and organizations",
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom AI training",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced analytics",
      "SSO & security features",
      "24/7 phone support",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "How does the AI job matching work?",
    answer: "Our AI analyzes your resume, extracting skills, experience, and preferences. It then matches these against thousands of job listings in real-time, scoring each opportunity based on compatibility. The more you interact with the platform, the better our recommendations become.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to your plan's features until the end of your billing period. We don't offer prorated refunds, but you won't be charged for the next period.",
  },
  {
    question: "Is my resume data secure?",
    answer: "Absolutely. We use enterprise-grade encryption for all data storage and transmission. Your resume data is never shared with employers without your explicit consent. We're also GDPR compliant and regularly undergo security audits.",
  },
  {
    question: "What file formats are supported for resume upload?",
    answer: "We support PDF, DOC, DOCX, and TXT file formats. For best results, we recommend uploading your resume as a PDF to preserve formatting. Our AI can extract information from most standard resume layouts.",
  },
  {
    question: "How accurate is the skills gap analysis?",
    answer: "Our skills gap analysis is based on current market demand data and job posting requirements. It's typically 90%+ accurate for technical skills and is continuously updated as the job market evolves. However, we recommend using it as guidance alongside your own research.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with JobLens AI within the first 14 days, contact our support team for a full refund. No questions asked.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Simple Pricing
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Choose your path to
                <br />
                <span className="gradient-text">career success</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Start free and upgrade as you grow. All plans include our core AI matching technology.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  Monthly
                </span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <span className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  Yearly
                </span>
                {isYearly && (
                  <Badge variant="default" className="bg-accent text-accent-foreground">
                    Save 20%
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                const period = isYearly ? "/year" : "/month";

                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-foreground text-background">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <Card className={`h-full ${plan.popular ? "border-foreground shadow-lg" : ""}`}>
                      <CardHeader className="pb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                          plan.popular ? "bg-foreground" : "bg-muted"
                        }`}>
                          <Icon className={`w-6 h-6 ${plan.popular ? "text-background" : "text-foreground"}`} />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">
                            ${price}
                          </span>
                          {price > 0 && (
                            <span className="text-muted-foreground">{period}</span>
                          )}
                        </div>

                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-foreground text-background hover:bg-foreground/90"
                              : ""
                          }`}
                          variant={plan.popular ? "default" : "outline"}
                          asChild
                        >
                          <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                            {plan.cta}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>

                        <div className="space-y-3">
                          {plan.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                              <span className="text-sm text-left">{feature}</span>
                            </div>
                          ))}
                          {plan.limitations.map((limitation) => (
                            <div key={limitation} className="flex items-start gap-3 opacity-50">
                              <span className="w-5 h-5 shrink-0 mt-0.5 text-center">-</span>
                              <span className="text-sm text-left">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Table - Desktop */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Compare plans</h2>
              <p className="text-muted-foreground">
                See what&apos;s included in each plan
              </p>
            </motion.div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-medium">Features</th>
                    <th className="text-center py-4 px-4 font-medium">Free</th>
                    <th className="text-center py-4 px-4 font-medium bg-muted/50 rounded-t-lg">Pro</th>
                    <th className="text-center py-4 px-4 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Job searches", free: "5/day", pro: "Unlimited", enterprise: "Unlimited" },
                    { feature: "Resume analysis", free: "Basic", pro: "Advanced", enterprise: "Custom AI" },
                    { feature: "Job tracking", free: "10 jobs", pro: "Unlimited", enterprise: "Unlimited" },
                    { feature: "Skills gap analysis", free: false, pro: true, enterprise: true },
                    { feature: "Personalized recommendations", free: false, pro: true, enterprise: true },
                    { feature: "API access", free: false, pro: false, enterprise: true },
                    { feature: "Team collaboration", free: false, pro: false, enterprise: true },
                    { feature: "Custom integrations", free: false, pro: false, enterprise: true },
                    { feature: "Priority support", free: false, pro: true, enterprise: "24/7" },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b">
                      <td className="py-4 px-4 text-sm">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.free === "boolean" ? (
                          row.free ? <Check className="w-5 h-5 text-accent mx-auto" /> : <span className="text-muted-foreground">-</span>
                        ) : (
                          <span className="text-sm">{row.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-muted/50">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? <Check className="w-5 h-5 text-accent mx-auto" /> : <span className="text-muted-foreground">-</span>
                        ) : (
                          <span className="text-sm font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? <Check className="w-5 h-5 text-accent mx-auto" /> : <span className="text-muted-foreground">-</span>
                        ) : (
                          <span className="text-sm">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about JobLens AI
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">
                Still have questions?
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </motion.div>
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
                Ready to find your dream job?
              </h2>
              <p className="text-background/70 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have accelerated their careers with JobLens AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                  asChild
                >
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-background/30 text-background hover:bg-background/10"
                  asChild
                >
                  <Link href="/contact">Talk to Sales</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
