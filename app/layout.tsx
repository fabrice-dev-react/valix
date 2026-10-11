import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Valix — 12 High-Converting Videos a Month for SaaS Founders | $97",
  description:
    "We edit 12 conversion-focused videos a month for SaaS founders for $97. Pay, and your first video lands in 24 hours. Love it and we deliver 12 a month. Don't like it? Instant refund, no questions asked.",
  openGraph: {
    title: "Valix — 12 High-Converting Videos a Month for SaaS Founders | $97",
    description:
      "Pay $97 and your first fully edited video lands in 24 hours. Love it and we deliver 12 a month. Hate it and we refund you instantly, no questions asked.",
    type: "website",
    siteName: "Valix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valix — 12 High-Converting Videos a Month for SaaS Founders | $97",
    description:
      "Pay $97 and your first fully edited video lands in 24 hours. Love it and we deliver 12 a month. Hate it and we refund you instantly, no questions asked.",
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
