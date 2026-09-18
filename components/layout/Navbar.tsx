"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ShoppingBag, 
  LayoutDashboard, 
  PlusCircle, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Layers, 
  QrCode, 
  Mic,
  ChevronDown,
  Menu,
  X,
  LogIn,
  UserPlus
} from "lucide-react";
import {
  useAuth,
  UserButton
} from "@clerk/nextjs";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { 
    currentArtisan, 
    artisans, 
    setCurrentArtisan, 
    offlineMode, 
    setOfflineMode, 
    userRole,
    setUserRole,
    openRoleModal
  } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [artisanMenuOpen, setArtisanMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setArtisanMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-[#1A4D37] border-b border-[#266549] shadow-sm w-full">
      <div className="w-full max-w-[1440px] 2xl:max-w-screen-2xl mx-auto px-2 sm:px-3 lg:px-5 xl:px-6">
        {/* Responsive Navbar: Flex justify-between below xl, 3-Column Symmetrical Grid on xl+ */}
        <div className="flex xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center justify-between h-18 sm:h-20 w-full gap-1 sm:gap-2 xl:gap-3 2xl:gap-4">
          
          {/* ================= LEFT SIDE OBJECTS (Slightly shifted to left) ================= */}
          <div className="flex items-center justify-start gap-0.5 sm:gap-1 xl:gap-1.5 shrink-0 min-w-0">
            {/* Mobile / Tablet Menu Button (xl:hidden) on the far left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-[#143E2C]/80 hover:bg-[#143E2C] border border-[#266549] text-craft-cream hover:text-white transition-colors cursor-pointer mr-1 shrink-0"
              title="Navigation Menu"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Desktop Nav Links (Left Group: Explore & Manage) */}
            <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 min-w-0">
              {/* Marketplace */}
              <Link
                href="/marketplace"
                className={`group relative flex items-center gap-1 xl:gap-1.5 py-1.5 px-1.5 xl:px-2 2xl:px-2.5 rounded-xl text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
                  pathname === "/marketplace"
                    ? "text-craft-gold font-bold bg-[#123927]/70 shadow-2xs"
                    : "text-craft-cream/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <ShoppingBag className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  pathname === "/marketplace" ? "text-craft-gold" : "text-craft-gold/80 group-hover:text-craft-gold"
                }`} />
                <span className="truncate">{t("navMarketplace")}</span>

                {/* Navbar Animated Underline */}
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ease-out origin-center pointer-events-none ${
                    pathname === "/marketplace"
                      ? "scale-x-100 opacity-100 bg-gradient-to-r from-craft-gold via-amber-300 to-craft-gold shadow-[0_0_8px_rgba(201,158,47,0.8)]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 bg-gradient-to-r from-craft-gold via-amber-200 to-craft-gold"
                  }`}
                />
              </Link>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                className={`group relative flex items-center gap-1 xl:gap-1.5 py-1.5 px-1.5 xl:px-2 2xl:px-2.5 rounded-xl text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
                  pathname.startsWith("/dashboard")
                    ? "text-craft-gold font-bold bg-[#123927]/70 shadow-2xs"
                    : "text-craft-cream/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <LayoutDashboard className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  pathname.startsWith("/dashboard") ? "text-craft-terracotta-light" : "text-craft-terracotta-light/80 group-hover:text-craft-terracotta-light"
                }`} />
                <span className="truncate">{t("navDashboard")}</span>

                {/* Navbar Animated Underline */}
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ease-out origin-center pointer-events-none ${
                    pathname.startsWith("/dashboard")
                      ? "scale-x-100 opacity-100 bg-gradient-to-r from-craft-gold via-amber-300 to-craft-gold shadow-[0_0_8px_rgba(201,158,47,0.8)]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 bg-gradient-to-r from-craft-gold via-amber-200 to-craft-gold"
                  }`}
                />
              </Link>

              {/* Catalogue */}
              <Link
                href="/catalogue"
                className={`group relative flex items-center gap-1 xl:gap-1.5 py-1.5 px-1.5 xl:px-2 2xl:px-2.5 rounded-xl text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
                  pathname === "/catalogue"
                    ? "text-craft-gold font-bold bg-[#123927]/70 shadow-2xs"
                    : "text-craft-cream/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <QrCode className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  pathname === "/catalogue" ? "text-amber-300" : "text-amber-300/80 group-hover:text-amber-300"
                }`} />
                <span className="truncate">{t("navCatalogue")}</span>

                {/* Navbar Animated Underline */}
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ease-out origin-center pointer-events-none ${
                    pathname === "/catalogue"
                      ? "scale-x-100 opacity-100 bg-gradient-to-r from-craft-gold via-amber-300 to-craft-gold shadow-[0_0_8px_rgba(201,158,47,0.8)]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 bg-gradient-to-r from-craft-gold via-amber-200 to-craft-gold"
                  }`}
                />
              </Link>

              {/* Market Linkage */}
              <Link
                href="/market-linkage"
                className={`group relative flex items-center gap-1 xl:gap-1.5 py-1.5 px-1.5 xl:px-2 2xl:px-2.5 rounded-xl text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
                  pathname === "/market-linkage"
                    ? "text-craft-gold font-bold bg-[#123927]/70 shadow-2xs"
                    : "text-craft-cream/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <Layers className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  pathname === "/market-linkage" ? "text-emerald-400" : "text-emerald-400/80 group-hover:text-emerald-400"
                }`} />
                <span className="truncate hidden 2xl:inline">{t("navMarketLinkage")}</span>
                <span className="truncate 2xl:hidden">{language === "hi" ? "लिंकेज" : "Linkage"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-craft-gold animate-ping shrink-0" />

                {/* Navbar Animated Underline */}
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ease-out origin-center pointer-events-none ${
                    pathname === "/market-linkage"
                      ? "scale-x-100 opacity-100 bg-gradient-to-r from-craft-gold via-amber-300 to-craft-gold shadow-[0_0_8px_rgba(201,158,47,0.8)]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 bg-gradient-to-r from-craft-gold via-amber-200 to-craft-gold"
                  }`}
                />
              </Link>

              {/* Voice Assistant */}
              <Link
                href="/voice"
                className={`group relative flex items-center gap-1 xl:gap-1.5 py-1.5 px-1.5 xl:px-2 2xl:px-2.5 rounded-xl text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
                  pathname === "/voice"
                    ? "text-craft-gold font-bold bg-[#123927]/70 shadow-2xs"
                    : "text-craft-cream/90 hover:text-white hover:bg-white/10"
                }`}
                title="Voice Assistant / आवाज़ सहायक"
              >
                <Mic className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  pathname === "/voice" ? "text-craft-terracotta-light" : "text-craft-terracotta-light/80 group-hover:text-craft-terracotta-light"
                }`} />
                <span className="truncate">{language === "hi" ? "आवाज़" : "Voice"}</span>
                <span className="hidden 2xl:inline">{language === "hi" ? " सहायक" : " Assistant"}</span>

                {/* Navbar Animated Underline */}
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ease-out origin-center pointer-events-none ${
                    pathname === "/voice"
                      ? "scale-x-100 opacity-100 bg-gradient-to-r from-craft-gold via-amber-300 to-craft-gold shadow-[0_0_8px_rgba(201,158,47,0.8)]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 bg-gradient-to-r from-craft-gold via-amber-200 to-craft-gold"
                  }`}
                />
              </Link>
            </nav>
          </div>

          {/* ================= CENTER: SHILPSUTRA LOGO, NAME & TAGLINE ================= */}
          <div className="flex items-center justify-center flex-shrink-0 px-1 xl:px-2 2xl:px-3 text-center">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 2xl:gap-2.5 group">
              {/* ShilpSutra Emblem */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-10 2xl:h-10 rounded-xl overflow-hidden shadow-inner border border-craft-gold/40 group-hover:rotate-2 transition-transform bg-craft-cream flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-emblem.png"
                  alt="ShilpSutra"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="font-serif font-bold text-sm sm:text-base lg:text-xl 2xl:text-[22px] tracking-tight text-craft-ivory flex items-center gap-1 leading-none">
                  ShilpSutra
                </span>
                <span className="hidden xl:block text-[9px] 2xl:text-[10px] text-craft-cream/80 font-medium italic mt-0.5 max-w-[130px] 2xl:max-w-[165px] truncate">
                  {t("tagline")}
                </span>
              </div>
            </Link>
          </div>

          {/* ================= RIGHT SIDE OBJECTS ================= */}
          <div className="flex items-center justify-end gap-1 sm:gap-1.5 xl:gap-1.5 2xl:gap-2 shrink-0 min-w-0">
            {/* Desktop Nav Links (Right Group: Actions & Portals) */}
            <div className="hidden xl:flex items-center gap-0.5 xl:gap-1">
              {/* + Add Product CTA */}
              <Link
                href="/create-product"
                className={`group relative flex items-center gap-1 xl:gap-1.5 py-1.5 px-2 xl:px-2 2xl:px-3 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap ${
                  pathname === "/create-product"
                    ? "bg-craft-terracotta text-white ring-2 ring-craft-gold/50 shadow-md shadow-craft-terracotta/20"
                    : "bg-craft-terracotta hover:bg-craft-terracotta-dark text-white hover:shadow-md"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 flex-shrink-0 text-craft-gold transition-transform group-hover:rotate-90 duration-200" />
                <span className="truncate">{t("navAddProduct")}</span>

                {/* Navbar Animated Underline */}
                <span
                  className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-300 ease-out origin-center pointer-events-none ${
                    pathname === "/create-product"
                      ? "scale-x-100 opacity-100 bg-craft-gold shadow-[0_0_6px_rgba(201,158,47,0.8)]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 bg-craft-gold"
                  }`}
                />
              </Link>

              {/* Admin */}
              <Link
                href="/admin"
                className={`group relative flex items-center gap-1 xl:gap-1.5 py-1.5 px-1.5 xl:px-1.5 2xl:px-2.5 rounded-xl text-xs font-medium transition-colors shrink-0 whitespace-nowrap ${
                  pathname === "/admin"
                    ? "text-craft-gold font-bold bg-[#123927]/70 shadow-2xs"
                    : "text-craft-cream/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  pathname === "/admin" ? "text-craft-gold" : "text-craft-gold/70 group-hover:text-craft-gold"
                }`} />
                <span className="truncate">{t("navAdmin")}</span>

                {/* Navbar Animated Underline */}
                <span
                  className={`absolute bottom-0.5 left-2 right-2 h-[2.5px] rounded-full transition-all duration-300 ease-out origin-center pointer-events-none ${
                    pathname === "/admin"
                      ? "scale-x-100 opacity-100 bg-gradient-to-r from-craft-gold via-amber-300 to-craft-gold shadow-[0_0_8px_rgba(201,158,47,0.8)]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 bg-gradient-to-r from-craft-gold via-amber-200 to-craft-gold"
                  }`}
                />
              </Link>
            </div>

            {/* Active Artisan Dropdown */}
            <div className="relative">
              <button
                onClick={() => setArtisanMenuOpen(!artisanMenuOpen)}
                className="flex items-center justify-between bg-[#133C29]/80 hover:bg-[#133C29] p-1 sm:p-1 xl:p-1.25 2xl:px-2.5 2xl:py-2 rounded-xl border border-[#266549] text-left transition-colors cursor-pointer"
                title={t("selectDemoArtisan")}
              >
                <div className="flex items-center gap-1.5 2xl:gap-2 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentArtisan.profileImage}
                    alt={currentArtisan.name}
                    className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full object-cover border border-craft-gold flex-shrink-0"
                  />
                  <div className="hidden 2xl:flex flex-col text-left leading-tight min-w-0 max-w-[110px]">
                    <span className="text-xs font-semibold text-craft-ivory truncate">{currentArtisan.name}</span>
                    <span className="text-[10px] text-craft-gold truncate">{currentArtisan.craftCategory}</span>
                  </div>
                </div>
                <ChevronDown className="hidden 2xl:block w-3.5 h-3.5 text-craft-cream/70 flex-shrink-0 ml-1" />
              </button>

              {artisanMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 sm:w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 text-neutral-800">
                  <div className="px-3 py-1.5 border-b border-neutral-100 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {t("selectDemoArtisan")}
                  </div>
                  {artisans.map((artisan) => (
                    <button
                      key={artisan.id}
                      onClick={() => {
                        setCurrentArtisan(artisan);
                        setArtisanMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-neutral-50 transition-colors ${
                        artisan.id === currentArtisan.id ? "bg-amber-50/70 font-semibold text-craft-green" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={artisan.profileImage} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-neutral-900 truncate">{artisan.name}</div>
                        <div className="text-[11px] text-neutral-500 truncate">{artisan.craftCategory} • {artisan.state}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher (Buyer / Artisan) - Visible on tablet (md) & desktop */}
            <div className="hidden md:flex items-center bg-[#133C29] rounded-xl p-0.5 border border-[#266549] text-[11px] sm:text-xs font-medium shrink-0">
              <button
                onClick={() => setUserRole("buyer")}
                className={`flex items-center gap-1 py-1 px-1.5 xl:px-1.5 2xl:px-2 rounded-lg transition-all cursor-pointer ${
                  userRole === "buyer"
                    ? "bg-craft-sage text-craft-green-dark font-bold shadow-xs"
                    : "text-craft-cream/80 hover:text-white"
                }`}
                title={t("roleBuyer")}
              >
                <span>🛍️</span>
                <span className="hidden 2xl:inline">{t("roleBuyer")}</span>
              </button>
              <button
                onClick={() => setUserRole("seller")}
                className={`flex items-center gap-1 py-1 px-1.5 xl:px-1.5 2xl:px-2 rounded-lg transition-all cursor-pointer ${
                  userRole === "seller"
                    ? "bg-craft-terracotta text-white font-bold shadow-xs"
                    : "text-craft-cream/80 hover:text-white"
                }`}
                title={t("roleSeller")}
              >
                <span>🎨</span>
                <span className="hidden 2xl:inline">{t("roleSeller")}</span>
              </button>
            </div>

            {/* 2-Language Toggle: EN / हिन्दी */}
            <div className="w-13 sm:w-13.5 xl:w-13.5 2xl:w-16 grid grid-cols-2 bg-[#133C29] rounded-xl p-0.5 border border-[#266549] text-[11px] sm:text-xs font-medium shrink-0">
              <button
                onClick={() => setLanguage("hi")}
                className={`w-full py-1 text-center rounded-lg transition-all ${
                  language === "hi" ? "bg-craft-terracotta text-white font-bold shadow-xs" : "text-craft-cream/80 hover:text-white"
                }`}
                title="हिन्दी में बदलें"
              >
                हि
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`w-full py-1 text-center rounded-lg transition-all ${
                  language === "en" ? "bg-craft-terracotta text-white font-bold shadow-xs" : "text-craft-cream/80 hover:text-white"
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Offline Simulation Toggle (Visible on wide screens) */}
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`hidden 2xl:flex w-8 h-8 items-center justify-center rounded-xl border transition-all flex-shrink-0 ${
                offlineMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-500 animate-pulse"
                  : "bg-[#133C29] text-craft-cream/80 border-[#266549] hover:text-white"
              }`}
              title={offlineMode ? t("simulateOnline") : t("simulateOffline")}
            >
              {offlineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5" />}
            </button>

            {/* Clerk Authentication Controls - Responsive & clean across all screens */}
            <div className="flex items-center gap-1 sm:gap-1 xl:gap-1.5 flex-shrink-0">
              {isSignedIn ? (
                <div className="flex items-center pl-1">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-full border-2 border-craft-gold shadow-md",
                        userButtonPopoverCard: "rounded-2xl border border-neutral-200 shadow-xl",
                      },
                    }}
                  />
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-1 text-xs font-bold text-white bg-[#133C29] hover:bg-[#133C29]/80 px-2 xl:px-2 2xl:px-2.5 py-1.5 rounded-xl border border-craft-gold/50 hover:border-craft-gold transition-all shadow-sm flex-shrink-0"
                    title="Sign In / Login"
                  >
                    <LogIn className="w-3.5 h-3.5 text-craft-gold" />
                    <span className="hidden lg:inline">Login</span>
                  </Link>
                  <Link
                    href="/sign-up"
                    className="hidden sm:flex items-center gap-1 text-xs font-bold text-white bg-craft-terracotta hover:bg-craft-terracotta-dark px-2 xl:px-2 2xl:px-2.5 py-1.5 rounded-xl border border-craft-gold/40 shadow-sm transition-all flex-shrink-0"
                    title="Sign Up / Register"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-craft-gold" />
                    <span className="hidden lg:inline">Sign Up</span>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#15422F] border-t border-[#266549] py-3 px-4 animate-in slide-in-from-top-2 duration-150 shadow-2xl">
          {/* Mobile Role Switcher Banner */}
          <div className="mb-2.5 p-2.5 bg-[#1A4D37]/80 rounded-2xl border border-[#266549] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-craft-ivory font-medium">
              <span className="text-craft-gold font-bold">{t("switchRole")}:</span>
            </div>
            <div className="flex items-center bg-[#133C29] rounded-xl p-0.5 border border-[#266549] text-xs font-medium">
              <button
                onClick={() => setUserRole("buyer")}
                className={`flex items-center gap-1 py-1 px-3 rounded-lg transition-all ${
                  userRole === "buyer"
                    ? "bg-craft-sage text-craft-green-dark font-bold shadow-xs"
                    : "text-craft-cream/80 hover:text-white"
                }`}
              >
                <span>🛍️</span>
                <span>{t("roleBuyer")}</span>
              </button>
              <button
                onClick={() => setUserRole("seller")}
                className={`flex items-center gap-1 py-1 px-3 rounded-lg transition-all ${
                  userRole === "seller"
                    ? "bg-craft-terracotta text-white font-bold shadow-xs"
                    : "text-craft-cream/80 hover:text-white"
                }`}
              >
                <span>🎨</span>
                <span>{t("roleSeller")}</span>
              </button>
            </div>
          </div>

          {/* Mobile Auth Banner */}
          {!isSignedIn && (
            <div className="mb-3 p-2 bg-black/20 rounded-2xl border border-craft-gold/40 grid grid-cols-2 gap-2">
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#133C29] hover:bg-[#1A4D37] border border-craft-gold/40 shadow-xs"
              >
                <LogIn className="w-4 h-4 text-craft-gold" />
                <span>Login / साइन इन</span>
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-craft-terracotta hover:bg-craft-terracotta-dark shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-craft-gold" />
                <span>Sign Up / खाता बनाएं</span>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Link
              href="/marketplace"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                pathname === "/marketplace" ? "bg-craft-green text-craft-gold font-bold" : "text-craft-cream/90 hover:bg-craft-green/50"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-craft-gold flex-shrink-0" />
              <span>{t("navMarketplace")}</span>
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                pathname.startsWith("/dashboard") ? "bg-craft-green text-craft-gold font-bold" : "text-craft-cream/90 hover:bg-craft-green/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-craft-terracotta-light flex-shrink-0" />
              <span>{t("navDashboard")}</span>
            </Link>

            <Link
              href="/create-product"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                pathname === "/create-product" ? "bg-craft-terracotta text-white ring-2 ring-craft-gold/40" : "bg-craft-terracotta/90 text-white"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-craft-gold flex-shrink-0" />
              <span>{t("navAddProduct")}</span>
            </Link>

            <Link
              href="/market-linkage"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                pathname === "/market-linkage" ? "bg-craft-green text-craft-gold font-bold" : "text-craft-cream/90 hover:bg-craft-green/50"
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t("navMarketLinkage")}</span>
            </Link>

            <Link
              href="/catalogue"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                pathname === "/catalogue" ? "bg-craft-green text-craft-gold font-bold" : "text-craft-cream/90 hover:bg-craft-green/50"
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>{t("navCatalogue")}</span>
            </Link>

            <Link
              href="/voice"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                pathname === "/voice" ? "bg-craft-green text-craft-gold font-bold" : "text-craft-cream/90 hover:bg-craft-green/50"
              }`}
            >
              <Mic className="w-4 h-4 text-craft-terracotta-light flex-shrink-0" />
              <span>{t("navVoice")}</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                pathname === "/admin" ? "bg-craft-green text-craft-gold font-bold" : "text-craft-cream/70 hover:bg-craft-green/50"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-craft-gold flex-shrink-0" />
              <span>{t("navAdmin")}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
