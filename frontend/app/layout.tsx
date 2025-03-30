import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/components/Provider";
import Chat from "@/components/Chat"; // Import the Chat component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockOps - AI-Powered Financial Management",
  description: "Track, save, and grow your wealth with AI-powered financial insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
        <Chat /> {/* Include the Chat component here */}
      </body>
    </html>
  );
}