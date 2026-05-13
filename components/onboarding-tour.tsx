"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const onboardingSteps: OnboardingStep[] = [
  {
    target: "dashboard-stats",
    title: "Your Career Overview",
    description: "See your key metrics at a glance - job matches, profile views, and application status.",
    position: "bottom",
  },
  {
    target: "jobs-section",
    title: "AI-Matched Jobs",
    description: "These jobs are personalized based on your resume and preferences. Higher match scores mean better fit!",
    position: "top",
  },
  {
    target: "skills-chart",
    title: "Skills Analysis",
    description: "Understand your strengths and discover skills gaps compared to market demand.",
    position: "left",
  },
  {
    target: "ai-copilot",
    title: "Your AI Assistant",
    description: "Click here anytime for personalized career tips and guidance!",
    position: "left",
  },
];

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    // Check if user has seen the tour
    const seen = localStorage.getItem("joblens-onboarding-complete");
    if (!seen) {
      setHasSeenTour(false);
      // Auto-start tour after delay
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = () => {
    setIsActive(false);
    setHasSeenTour(true);
    localStorage.setItem("joblens-onboarding-complete", "true");
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  if (hasSeenTour || !isActive) return null;

  const step = onboardingSteps[currentStep];

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-foreground/60 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Tooltip */}
          <motion.div
            className="fixed z-[101] w-80"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-background rounded-2xl shadow-2xl p-6 relative">
              {/* Close button */}
              <button
                onClick={skipTour}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm mb-6">{step.description}</p>

              {/* Progress */}
              <div className="flex items-center gap-1 mb-4">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index <= currentStep ? "bg-accent" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTour}
                  className="text-muted-foreground"
                >
                  Skip Tour
                </Button>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button variant="outline" size="sm" onClick={prevStep}>
                      Back
                    </Button>
                  )}
                  <Button size="sm" onClick={nextStep}>
                    {currentStep === onboardingSteps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
