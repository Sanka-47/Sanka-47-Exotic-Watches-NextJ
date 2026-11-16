import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "@/components/feedback";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Exotica Watches",
    template: "%s | Exotica Watches",
  },
  description:
    "Exotica Watches is a full-stack storefront demo for curated luxury watches, built with Next.js, Prisma, NextAuth and Stripe.",
  openGraph: {
    type: "website",
    title: "Exotica Watches",
    description:
      "Browse a curated collection of luxury watches. Built with Next.js, Prisma, NextAuth and Stripe.",
    url: appUrl,
    siteName: "Exotica Watches",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1976d2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <FeedbackProvider>{children}</FeedbackProvider>
      </body>
    </html>
  );
}
