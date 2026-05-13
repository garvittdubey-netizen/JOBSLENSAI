"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started with your job search",
    price: { monthly: 0, annual: 0 },
    features: [
      "5 resume uploads per month",
      "Basic AI analysis",
      "10 job matches daily",
      "Standard search filters",
      "Email support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For serious job seekers who want an edge",
    price: { monthly: 19, annual: 15 },
    features: [
      "Unlimited resume uploads",
      "Advanced AI analysis",
      "Unlimited job matches",
      "Premium search filters",
      "Skill gap analysis",
      "Salary insights",
      "Priority support",
      "Export reports",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    description: "For teams and recruitment agencies",
    price: { monthly: 49, annual: 39 },
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "Advanced analytics",
      "White-label options",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Choose the plan that fits your needs. Upgrade or downgrade at any
            time.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !annual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={cn(
              "relative w-14 h-8 rounded-full transition-colors",
              annual ? "bg-accent" : "bg-secondary"
            )}
          >
            <div
              className={cn(
                "absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform",
                annual ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              annual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Annual
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative rounded-2xl p-8",
                plan.highlighted
                  ? "bg-primary text-primary-foreground shadow-xl scale-105"
                  : "bg-card border border-border"
              )}
            >
              {plan.badge && (
                <Badge
                  className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2",
                    "bg-accent text-accent-foreground"
                  )}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {plan.badge}
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p
                  className={cn(
                    "text-sm mb-4",
                    plan.highlighted
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      plan.highlighted
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    /month
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "h-5 w-5 shrink-0 mt-0.5",
                        plan.highlighted ? "text-accent" : "text-accent"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        plan.highlighted
                          ? "text-primary-foreground/90"
                          : "text-foreground"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/upload" className="block">
                <Button
                  className={cn(
                    "w-full rounded-xl",
                    plan.highlighted
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : ""
                  )}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
