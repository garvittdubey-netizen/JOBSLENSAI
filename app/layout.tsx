import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "@/lib/context";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "JobLens AI - AI-Powered Job Discovery Platform",
  description:
    "Upload your resume and let AI find your perfect job matches. Smart matching, career insights, and personalized recommendations powered by advanced AI.",
  keywords: [
    "job search",
    "AI job matching",
    "resume parser",
    "career insights",
    "job recommendations",
  ],
  authors: [{ name: "JobLens AI" }],
  openGraph: {
    title: "JobLens AI - AI-Powered Job Discovery Platform",
    description: "Find your perfect job match with AI-powered resume analysis",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <AppProvider>
            {children}
            <Toaster position="bottom-right" />
          </AppProvider>
        </AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
