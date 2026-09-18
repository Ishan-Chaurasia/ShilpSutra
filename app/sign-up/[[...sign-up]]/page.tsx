import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-craft-ivory via-craft-cream/40 to-craft-ivory relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-craft-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-craft-gold/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10 space-y-2">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-craft-gold/40 bg-white p-1 group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-emblem.png"
              alt="ShilpSutra"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <span className="font-serif font-bold text-3xl tracking-tight text-craft-green">
            ShilpSutra
          </span>
        </Link>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          Create an account to showcase your handmade products or discover India&apos;s finest master artisans.
        </p>
      </div>

      {/* Clerk SignUp Form Component */}
      <div className="relative z-10 w-full max-w-md flex justify-center">
        <SignUp
          appearance={{
            elements: {
              card: "shadow-2xl rounded-3xl border border-craft-gold/25 bg-white/95 backdrop-blur-sm",
              headerTitle: "font-serif text-2xl text-craft-green font-bold",
              headerSubtitle: "text-sm text-neutral-600",
              formButtonPrimary:
                "bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold rounded-xl shadow-md transition-all",
              socialButtonsBlockButton:
                "border-neutral-200 hover:border-craft-gold/50 rounded-xl transition-all",
              formFieldInput:
                "rounded-xl border-neutral-300 focus:border-craft-terracotta focus:ring-craft-terracotta",
              footerActionLink: "text-craft-terracotta hover:text-craft-terracotta-dark font-semibold",
            },
            variables: {
              colorPrimary: "#C85A32",
              colorForeground: "#1F2937",
              colorMutedForeground: "#4B5563",
              borderRadius: "0.85rem",
            },
          }}
        />
      </div>

      {/* Heritage Tagline */}
      <div className="mt-8 text-center text-xs text-neutral-500 relative z-10">
        <p>आत्मनिर्भर भारत • Minimum typing + Maximum automation + Human approval</p>
      </div>
    </div>
  );
}
