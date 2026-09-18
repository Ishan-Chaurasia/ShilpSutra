"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { UserRole } from "@/types";
import { 
  Palette, 
  ShoppingBag, 
  Sparkles, 
  Camera, 
  Mic, 
  Scale, 
  Store, 
  ShieldCheck, 
  Building2, 
  HeartHandshake, 
  ArrowRight, 
  X
} from "lucide-react";

export function RoleSelectionModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, setUserRole, isRoleModalOpen, setIsRoleModalOpen } = useApp();
  const { t } = useLanguage();

  // Close on Escape key if user already has a chosen role
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && userRole) {
        setIsRoleModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userRole, setIsRoleModalOpen]);

  if (!isRoleModalOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    setIsRoleModalOpen(false);

    // If user was on the home page, take them directly to the relevant destination
    if (pathname === "/") {
      if (role === "seller") {
        router.push("/dashboard");
      } else {
        router.push("/marketplace");
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-craft-gold/40 overflow-hidden my-auto">
        
        {/* Top Heritage Ornament Bar with Craft-Sage (#819D94) */}
        <div className="h-2 bg-gradient-to-r from-craft-terracotta via-craft-gold via-craft-sage to-craft-green" />

        {/* Close button (only available if user has already chosen a role previously) */}
        {userRole && (
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors z-20 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="pt-6 sm:pt-8 px-6 sm:px-10 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-craft-gold/50 shadow-md flex-shrink-0 bg-craft-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-emblem.png"
                alt="ShilpSutra Emblem"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-craft-green tracking-tight leading-none block">
                {t("roleModalTitle")}
              </span>
              <span className="text-xs font-serif italic text-craft-terracotta font-medium">
                {t("roleModalTagline")} • शिल्पसूत्र
              </span>
            </div>
          </div>

          <h2 className="text-base sm:text-lg text-neutral-700 font-medium max-w-xl mx-auto pt-1">
            {t("roleModalSubtitle")}
          </h2>
        </div>

        {/* Two Interactive Selection Cards */}
        <div className="p-5 sm:p-8 sm:pt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* CARD 1: ARTISAN / SELLER */}
          <div
            onClick={() => handleSelectRole("seller")}
            className={`group relative rounded-2xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              userRole === "seller"
                ? "border-craft-terracotta bg-craft-terracotta/5 ring-2 ring-craft-terracotta/30 shadow-md"
                : "border-neutral-200 hover:border-craft-terracotta hover:bg-craft-terracotta/5 hover:shadow-xl"
            }`}
          >
            <div>
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-12 h-12 rounded-xl bg-craft-terracotta/15 flex items-center justify-center text-craft-terracotta group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-craft-terracotta/15 text-craft-terracotta-dark px-2.5 py-1 rounded-full border border-craft-terracotta/30">
                  {t("roleSeller")} • शिल्पकार
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-craft-terracotta transition-colors flex items-center gap-2">
                <span>{t("roleArtisanTitle")}</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                {t("roleArtisanDesc")}
              </p>

              {/* Feature Points */}
              <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <Camera className="w-4 h-4 text-craft-terracotta flex-shrink-0 mt-0.5" />
                  <span>{t("roleArtisanFeat1")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <Mic className="w-4 h-4 text-craft-terracotta flex-shrink-0 mt-0.5" />
                  <span>{t("roleArtisanFeat2")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <Scale className="w-4 h-4 text-craft-terracotta flex-shrink-0 mt-0.5" />
                  <span>{t("roleArtisanFeat3")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <Store className="w-4 h-4 text-craft-terracotta flex-shrink-0 mt-0.5" />
                  <span>{t("roleArtisanFeat4")}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold text-sm shadow-md shadow-craft-terracotta/20 flex items-center justify-center gap-2 transition-transform group-hover:scale-102"
              >
                <span>{t("roleArtisanBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2: BUYER / CONNOISSEUR (Craft Sage #819D94 Styling) */}
          <div
            onClick={() => handleSelectRole("buyer")}
            className={`group relative rounded-2xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              userRole === "buyer"
                ? "border-craft-sage bg-craft-sage/10 ring-2 ring-craft-sage/30 shadow-md"
                : "border-neutral-200 hover:border-craft-sage hover:bg-craft-sage/5 hover:shadow-xl"
            }`}
          >
            <div>
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-12 h-12 rounded-xl bg-craft-sage/20 flex items-center justify-center text-craft-sage-dark group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-craft-sage/20 text-craft-sage-dark px-2.5 py-1 rounded-full border border-craft-sage/40">
                  {t("roleBuyer")} • खरीदार
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-craft-sage-dark transition-colors flex items-center gap-2">
                <span>{t("roleBuyerTitle")}</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                {t("roleBuyerDesc")}
              </p>

              {/* Feature Points */}
              <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <ShieldCheck className="w-4 h-4 text-craft-sage-dark flex-shrink-0 mt-0.5" />
                  <span>{t("roleBuyerFeat1")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <Sparkles className="w-4 h-4 text-craft-sage-dark flex-shrink-0 mt-0.5" />
                  <span>{t("roleBuyerFeat2")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <Building2 className="w-4 h-4 text-craft-sage-dark flex-shrink-0 mt-0.5" />
                  <span>{t("roleBuyerFeat3")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <HeartHandshake className="w-4 h-4 text-craft-sage-dark flex-shrink-0 mt-0.5" />
                  <span>{t("roleBuyerFeat4")}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-craft-sage hover:bg-craft-sage-dark text-white font-bold text-sm shadow-md shadow-craft-sage/25 flex items-center justify-center gap-2 transition-transform group-hover:scale-102"
              >
                <span>{t("roleBuyerBtn")}</span>
                <ArrowRight className="w-4 h-4 text-craft-gold-light" />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Reassurance & Auth Footer */}
        <div className="bg-neutral-50 border-t border-neutral-100 py-3 px-6 text-center space-y-1.5">
          <p className="text-xs text-neutral-500">
            {t("roleModalFooter")}
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-neutral-600 pt-1">
            <span>
              Already have an account?{" "}
              <Link 
                href="/sign-in" 
                onClick={() => setIsRoleModalOpen(false)} 
                className="text-craft-terracotta hover:text-craft-terracotta-dark font-bold underline transition-colors"
              >
                Login
              </Link>
            </span>
            <span className="text-neutral-300">•</span>
            <span>
              New to ShilpSutra?{" "}
              <Link 
                href="/sign-up" 
                onClick={() => setIsRoleModalOpen(false)} 
                className="text-craft-green hover:text-craft-green-dark font-bold underline transition-colors"
              >
                Sign Up
              </Link>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
