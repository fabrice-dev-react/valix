import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Guide to Becoming Your Manager's Favorite Employee | $9 PDF",
  description:
    "The practical 24-page guide to becoming the employee your manager trusts, protects and promotes. Nine principles, ten scripts, a 30-day plan. Instant PDF for $9.",
  openGraph: {
    title: "Guide to Becoming Your Manager's Favorite Employee | $9 PDF",
    description:
      "Make your work impossible to overlook, build real trust with your manager, and ask for what you deserve. Instant PDF download for $9.",
    type: "website",
    siteName: "Valix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guide to Becoming Your Manager's Favorite Employee | $9 PDF",
    description:
      "Nine practical principles and ten word-for-word scripts for becoming the employee your manager fights to keep. Instant PDF for $9.",
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
