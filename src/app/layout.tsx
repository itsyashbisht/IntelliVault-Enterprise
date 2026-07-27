import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

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
      <html lang="en" className={inter.className}>
        <body className="bg-canvas text-ink antialiased overflow-x-hidden">
          <main>{children}</main>
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={3000}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
