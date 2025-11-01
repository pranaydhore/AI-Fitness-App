import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./api/providers/ThemeProvider"; // ✅ Add this line

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Fitness Coach - Personalized Workout & Diet Plans",
  description:
    "Get AI-powered personalized fitness and nutrition plans tailored to your goals. Transform your health journey with smart, data-driven guidance.",
  keywords: [
    "fitness",
    "AI",
    "workout plans",
    "diet plans",
    "personal trainer",
    "health",
    "nutrition",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn(inter.className, "antialiased")}>
        {/* ✅ Wrap your app with the Theme Provider */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
