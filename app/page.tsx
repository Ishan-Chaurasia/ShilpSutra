"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { BeforeAfterSlider } from "@/components/ai/BeforeAfterSlider";
import { 
  Sparkles, 
  Mic, 
  DollarSign, 
  Globe2, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Camera
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { currentArtisan, userRole, openRoleModal } = useApp();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-16 sm:space-y-24">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-craft-green-dark text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-craft-green-light min-h-[620px] flex items-center">
        {/* Heritage Artisan Background (Cleaned & Untouched Photo) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        {/* Ambient Dark Gradient Overlay for Maximum Readability & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-craft-green-dark/95 via-craft-green-dark/70 to-craft-green-dark/85 backdrop-blur-[0.5px]" />

        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-craft-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-craft-sage/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-craft-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tagline Pill + Active Role Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-craft-green-dark/80 border border-craft-gold/40 px-3.5 py-1.5 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-craft-gold animate-pulse" />
                <span className="font-serif italic text-sm text-craft-gold tracking-wide">
                  {t("tagline")}
                </span>
              </div>

              {userRole && (
                <button
                  onClick={openRoleModal}
                  className={`inline-flex items-center gap-1.5 bg-craft-green-dark/90 hover:bg-craft-green border px-3 py-1.5 rounded-full text-xs text-craft-ivory transition-all cursor-pointer shadow-inner hover:scale-102 ${
                    userRole === "buyer" ? "border-craft-sage/60" : "border-craft-gold/40"
                  }`}
                  title="Click to switch between Buyer and Artisan mode"
                >
                  <span>{userRole === "buyer" ? "🛍️" : "🎨"}</span>
                  <span className={`font-bold ${userRole === "buyer" ? "text-craft-sage-light" : "text-craft-gold"}`}>
                    {userRole === "buyer" ? t("roleBuyer") : t("roleSeller")}
                  </span>
                  <span className="text-[10px] text-craft-cream/70 underline ml-0.5">{t("switchRole")}</span>
                </button>
              )}
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-craft-ivory leading-[1.15]">
              {t("heroTitle")}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-craft-cream/90 max-w-2xl font-normal leading-relaxed">
              {t("heroSubtitle")}
            </p>

            {/* Dual CTAs + Demo Bypass */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {userRole === "buyer" ? (
                <>
                  <Link
                    href="/marketplace"
                    className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-7 py-3.5 rounded-2xl text-sm sm:text-base shadow-lg shadow-craft-terracotta/30 flex items-center gap-2.5 transition-all hover:scale-102"
                  >
                    <span>{t("ctaExploreMarket")}</span>
                    <ArrowRight className="w-4 h-4 text-craft-gold" />
                  </Link>
                  <Link
                    href="/create-product"
                    className="bg-craft-green-dark/80 hover:bg-craft-green-dark text-craft-cream border border-craft-green-light hover:border-craft-gold/50 font-semibold px-6 py-3.5 rounded-2xl text-sm sm:text-base transition-colors flex items-center gap-2"
                  >
                    <span>{t("ctaCreateProduct")}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/create-product"
                    className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-7 py-3.5 rounded-2xl text-sm sm:text-base shadow-lg shadow-craft-terracotta/30 flex items-center gap-2.5 transition-all hover:scale-102"
                  >
                    <span>{t("ctaCreateProduct")}</span>
                    <ArrowRight className="w-4 h-4 text-craft-gold" />
                  </Link>
                  <Link
                    href="/marketplace"
                    className="bg-craft-green-dark/80 hover:bg-craft-green-dark text-craft-cream border border-craft-green-light hover:border-craft-gold/50 font-semibold px-6 py-3.5 rounded-2xl text-sm sm:text-base transition-colors flex items-center gap-2"
                  >
                    <span>{t("ctaExploreMarket")}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Try Demo Artisan Bypass */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-craft-gold/30 px-4 py-2 rounded-xl text-xs text-craft-ivory transition-colors group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-craft-gold">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentArtisan.profileImage} alt="" className="w-full h-full object-cover" />
                </div>
                <span>
                  <strong className="text-craft-gold">{t("tryDemoArtisan")}</strong>
                </span>
                <span className="text-[10px] bg-craft-gold text-craft-green font-bold px-1.5 py-0.5 rounded ml-1 group-hover:translate-x-0.5 transition-transform">
                  {t("skipOtp")} ➔
                </span>
              </button>
            </div>

          </div>

          {/* Hero Right: Interactive Before/After Studio Showcase */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-craft-green-dark/90 p-4 rounded-3xl border border-craft-gold/30 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-craft-cream mb-2 px-1">
                <span className="font-bold flex items-center gap-1.5 text-craft-gold">
                  <Sparkles className="w-4 h-4 text-craft-gold" />
                  {t("aiStudioTitle")}
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-craft-cream/70">
                  Interactive Preview
                </span>
              </div>

              <BeforeAfterSlider
                originalImage="https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1600&auto=format&fit=crop&q=85"
                enhancedImage="https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1600&auto=format&fit=crop&q=85"
                studioPresetName="Clean Studio White"
              />
            </div>
          </div>

        </div>
      </section>

      {/* CORE 4 PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-craft-terracotta">
            The ShilpSutra Advantage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-craft-green">
            {t("advantageTitle")}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            {t("advantageSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:border-craft-terracotta/40 shadow-xs hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-craft-terracotta flex items-center justify-center font-bold">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              AI Product Studio
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Instantly removes cluttered workshop backdrops, enhances lighting, balances color, and formats for Amazon & ONDC standards.
            </p>
            <div className="text-[11px] font-semibold text-craft-terracotta flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero photography costs</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:border-craft-terracotta/40 shadow-xs hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-craft-green flex items-center justify-center font-bold">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Voice-First Cataloguing
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Speak naturally in Hindi or regional languages. Computer vision + NLP extracts craft category, materials, dimensions, and cultural story.
            </p>
            <div className="text-[11px] font-semibold text-craft-green flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero typing required</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:border-craft-terracotta/40 shadow-xs hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-craft-gold flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Smart Pricing Assistant
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Calculates fair artisan wages based on labor hours and material costs. Provides price corridors (₹400 — ₹500 — ₹650).
            </p>
            <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Human approval guarantee</span>
            </div>
          </div>

          {/* Pillar 4 (Craft-Sage #819D94 Styling) */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:border-craft-sage/60 shadow-xs hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-craft-sage/20 text-craft-sage-dark flex items-center justify-center font-bold">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Market Linkage & ONDC
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Matches crafts with wholesale buyers like FabIndia, TRIFED, and urban retail stores. Generates QR codes and WhatsApp catalogues.
            </p>
            <div className="text-[11px] font-semibold text-craft-sage-dark flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-craft-sage-dark" />
              <span>Direct B2B connections</span>
            </div>
          </div>

        </div>
      </section>

      {/* STEP-BY-STEP TRANSFORMATION PIPELINE */}
      <section className="bg-craft-cream/60 py-16 px-4 sm:px-6 lg:px-8 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-craft-terracotta">
              ShilpSutra Workflow
            </span>
            <h2 className="font-serif text-3xl font-bold text-craft-green">
              {t("howItWorks")}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              {t("howItWorksSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-neutral-200 relative">
              <span className="text-3xl font-serif font-bold text-craft-terracotta/20 absolute top-3 right-4">01</span>
              <span className="text-xs font-bold text-craft-terracotta uppercase">Step 1</span>
              <h4 className="font-bold text-sm text-neutral-900 mt-1">{t("step1Title")}</h4>
              <p className="text-xs text-neutral-500 mt-1">
                {t("step1Desc")}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-neutral-200 relative">
              <span className="text-3xl font-serif font-bold text-craft-terracotta/20 absolute top-3 right-4">02</span>
              <span className="text-xs font-bold text-craft-terracotta uppercase">Step 2</span>
              <h4 className="font-bold text-sm text-neutral-900 mt-1">{t("step2Title")}</h4>
              <p className="text-xs text-neutral-500 mt-1">
                {t("step2Desc")}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-neutral-200 relative">
              <span className="text-3xl font-serif font-bold text-craft-terracotta/20 absolute top-3 right-4">03</span>
              <span className="text-xs font-bold text-craft-terracotta uppercase">Step 3</span>
              <h4 className="font-bold text-sm text-neutral-900 mt-1">{t("step3Title")}</h4>
              <p className="text-xs text-neutral-500 mt-1">
                {t("step3Desc")}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-neutral-200 relative">
              <span className="text-3xl font-serif font-bold text-craft-terracotta/20 absolute top-3 right-4">04</span>
              <span className="text-xs font-bold text-craft-terracotta uppercase">Step 4</span>
              <h4 className="font-bold text-sm text-neutral-900 mt-1">{t("step4Title")}</h4>
              <p className="text-xs text-neutral-500 mt-1">
                {t("step4Desc")}
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link
              href="/create-product"
              className="inline-flex items-center gap-2 bg-craft-green hover:bg-craft-green-light text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-md transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 text-craft-gold" />
              <span>{t("launchDemo")}</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
