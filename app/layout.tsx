import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { RoleSelectionModal } from "@/components/onboarding/RoleSelectionModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "ShilpSutra — Apne Hunar Ko Bazaar Tak",
  description: "AI-Driven Market Linkage & Smart Cataloging Platform for Indian Artisans. Minimum typing + Maximum automation + Human approval.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#C85A32",
          colorForeground: "#1F2937",
          fontFamily: "var(--font-sans)",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased overflow-x-hidden`}>
        <body className="min-h-full flex flex-col bg-craft-ivory text-neutral-900 font-sans selection:bg-craft-terracotta selection:text-white pb-6 overflow-x-hidden w-full max-w-full">
          <LanguageProvider>
            <AppProvider>
              <Navbar />
              <OfflineBanner />
              <main className="flex-grow flex flex-col w-full max-w-full overflow-x-hidden">{children}</main>
              <RoleSelectionModal />
            </AppProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
