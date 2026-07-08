import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "IntelliVault",
  description: "Enterprise document intelligence",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={inter.className}
      >
        <body className="bg-canvas text-ink antialiased">
          {/*<Navigation />*/}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
