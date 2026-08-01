import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Valix — Trade-Ready Signals From Any Market Screenshot",
  description: "Upload a chart screenshot — forex, indices, gold, crypto or stocks. Valix reads the price action and returns a clear buy or sell signal with entry, stop loss, take profit and a confidence score.",
  openGraph: {
    title: "Valix — Trade-Ready Signals From Any Market Screenshot",
    description: "Turn any market screenshot into a clear trading signal with entry, stop loss, take profit and confidence. Forex, indices, gold, crypto and stocks.",
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
