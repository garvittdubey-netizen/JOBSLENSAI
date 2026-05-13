"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Sparkles, ArrowRight, Chrome, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    // signIn will redirect to Google OAuth, so we don't need try/catch
    // The redirect happens automatically and the function doesn't return
    await signIn("google", { 
      callbackUrl: "/upload",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-accent/20" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-32 right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-32 w-56 h-56 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold">JobLens AI</span>
            </Link>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Start your AI-powered
              <br />
              <span className="text-accent">job search today</span>
            </h1>

            <p className="text-background/70 text-lg mb-8 max-w-md">
              Join thousands of professionals who have found their dream jobs through intelligent matching.
            </p>

            <div className="space-y-4">
              {[
                "AI-powered resume analysis",
                "Personalized job recommendations",
                "Skills gap identification",
                "Career growth insights",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-background/80">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-background/5 border border-background/10">
              <p className="text-background/60 text-sm mb-2">Trusted by professionals from</p>
              <div className="flex items-center gap-4 text-background/40">
                <span className="font-semibold">Google</span>
                <span>|</span>
                <span className="font-semibold">Meta</span>
                <span>|</span>
                <span className="font-semibold">Amazon</span>
                <span>|</span>
                <span className="font-semibold">Microsoft</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-background" />
              </div>
              <span className="text-2xl font-bold">JobLens AI</span>
            </Link>
          </div>

          <Card className="border-0 shadow-none lg:shadow-lg lg:border">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                Sign up with your Google account to get started with JobLens AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Google Signup */}
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Chrome className="w-5 h-5 mr-3" />
                    Continue with Google
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
