import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Valix - Find and Start Your Perfect Online AI Side Hustle",
  description: "AI guides you from zero to income through validated phases — market research, offer design, pricing, content planning, and daily tasks. Start your AI side hustle today.",
  openGraph: {
    title: "Valix — Find and Start Your Perfect Online AI Side Hustle",
    description: "AI guides you from zero to income through validated phases — market research, offer design, pricing, content planning, and daily tasks.",
    type: "website",
    siteName: "Valix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valix — Find and Start Your Perfect Online AI Side Hustle",
    description: "AI guides you from zero to income through validated phases — market research, offer design, pricing, content planning, and daily tasks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
