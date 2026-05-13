"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Lightbulb, 
  X, 
  ChevronRight, 
  Target,
  TrendingUp,
  BookOpen,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/context";

interface CareerTip {
  id: string;
  category: "skill" | "interview" | "resume" | "networking";
  title: string;
  content: string;
  actionLabel?: string;
  actionUrl?: string;
}

const careerTips: CareerTip[] = [
  {
    id: "1",
    category: "skill",
    title: "Learn TypeScript",
    content: "Based on your job interests, TypeScript skills are in high demand. Consider taking a course to boost your market value by 15-20%.",
    actionLabel: "View Courses",
    actionUrl: "/dashboard/skills",
  },
  {
    id: "2",
    category: "interview",
    title: "Practice STAR Method",
    content: "The STAR method (Situation, Task, Action, Result) is highly effective for behavioral interviews. Prepare 5-7 stories using this framework.",
  },
  {
    id: "3",
    category: "resume",
    title: "Quantify Your Achievements",
    content: "Resumes with quantified achievements get 40% more callbacks. Try adding metrics like 'increased sales by 25%' or 'reduced processing time by 50%'.",
    actionLabel: "Update Resume",
    actionUrl: "/dashboard/resume",
  },
  {
    id: "4",
    category: "networking",
    title: "Optimize LinkedIn Profile",
    content: "Profiles with a professional photo receive 21x more views. Ensure your headline clearly states your value proposition.",
  },
  {
    id: "5",
    category: "skill",
    title: "Cloud Skills are Hot",
    content: "AWS and Azure certifications can increase your salary potential by 25%. They're especially valuable for the roles you're targeting.",
    actionLabel: "Explore Skills",
    actionUrl: "/dashboard/skills",
  },
];

const categoryIcons = {
  skill: Target,
  interview: Briefcase,
  resume: BookOpen,
  networking: TrendingUp,
};

const categoryColors = {
  skill: "bg-blue-100 text-blue-700",
  interview: "bg-purple-100 text-purple-700",
  resume: "bg-green-100 text-green-700",
  networking: "bg-orange-100 text-orange-700",
};

export function AICopilot() {
  const { resumeData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState<CareerTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    // Show a random tip after a delay
    const timer = setTimeout(() => {
      const availableTips = careerTips.filter(tip => !dismissedTips.has(tip.id));
      if (availableTips.length > 0) {
        const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];
        setCurrentTip(randomTip);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [dismissedTips]);

  const dismissTip = (tipId: string) => {
    setDismissedTips(prev => new Set([...prev, tipId]));
    setCurrentTip(null);
    
    // Show next tip after delay
    setTimeout(() => {
      const availableTips = careerTips.filter(tip => !dismissedTips.has(tip.id) && tip.id !== tipId);
      if (availableTips.length > 0) {
        const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];
        setCurrentTip(randomTip);
      }
    }, 10000);
  };

  const handleFabClick = () => {
    setIsOpen(!isOpen);
    setShowPulse(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        {/* Pulse Animation */}
        {showPulse && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent"
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-lg"
          onClick={handleFabClick}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Notification Badge */}
        {!isOpen && currentTip && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Lightbulb className="w-3 h-3 text-accent-foreground" />
          </motion.div>
        )}
      </motion.div>

      {/* Copilot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">AI Career Copilot</CardTitle>
                      <p className="text-xs text-muted-foreground">Your personal advisor</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Tip */}
                {currentTip ? (
                  <motion.div
                    key={currentTip.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${categoryColors[currentTip.category]}`}>
                        {(() => {
                          const Icon = categoryIcons[currentTip.category];
                          return <Icon className="w-4 h-4" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{currentTip.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {currentTip.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {currentTip.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {currentTip.actionLabel && (
                        <Button size="sm" className="flex-1 h-8 text-xs">
                          {currentTip.actionLabel}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs"
                        onClick={() => dismissTip(currentTip.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No new tips right now. Check back later!
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                {resumeData && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Your Profile Strength</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${resumeData.matchScore || 75}%` }}
                          transition={{ delay: 0.3, duration: 1 }}
                        />
                      </div>
                      <span className="text-xs font-medium">{resumeData.matchScore || 75}%</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                      <Target className="w-3 h-3 mr-1" />
                      Set Goals
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Resources
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
