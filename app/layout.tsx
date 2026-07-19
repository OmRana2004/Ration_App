import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Changed import to Inter
import "./globals.css";

// 2. Initialized Inter font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ration Distribution Live Tracking System",
  description:
    "A live tracking system for ration distribution built with Next.js, Prisma, and Tailwind CSS.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // 3. Replaced geist variables with inter.variable
      className={`${inter.variable} h-full antialiased`}
    >
      {/* 4. Applied inter.variable and tailwind sans utility */}
      <body className={`${inter.variable} font-sans min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
