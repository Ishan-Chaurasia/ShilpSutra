"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { 
  PlusCircle, 
  Package, 
  Eye, 
  MessageSquare, 
  Layers, 
  Mic, 
  QrCode, 
  TrendingUp, 
  ShieldCheck, 
  Share2, 
  ArrowUpRight, 
  Sparkles,
  WifiOff,
  ChevronRight
} from "lucide-react";
import { QRCodeModal } from "@/components/product/QRCodeModal";

export default function ArtisanDashboard() {
  const router = useRouter();
  const { currentArtisan, products, buyerMatches, offlineMode, setOfflineMode } = useApp();
  const { t } = useLanguage();
  const [showQR, setShowQR] = useState(false);

  // Filter products created by current artisan
  const artisanProducts = products.filter(
    (p) => p.artisanId === currentArtisan.id || p.artisanName === currentArtisan.name
  );
  const displayProducts = artisanProducts.length > 0 ? artisanProducts : products.slice(0, 3);

  const totalViews = displayProducts.reduce((acc, p) => acc + p.views, 0) || 428;
  const totalEnquiries = displayProducts.reduce((acc, p) => acc + p.enquiries, 0) || 17;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Artisan Welcome Banner */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-craft-gold/30">
        <div className="absolute right-0 top-0 w-80 h-80 bg-craft-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Artisan Profile Snapshot */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentArtisan.profileImage}
                alt={currentArtisan.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-craft-gold shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-craft-gold text-craft-green p-1 rounded-full shadow">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-craft-ivory">
                  {t("greeting")}, {currentArtisan.name} 👋
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-craft-cream/90">
                <span className="font-semibold text-craft-gold">{currentArtisan.craftCategory}</span>
                <span>•</span>
                <span>{currentArtisan.district}, {currentArtisan.state}</span>
                <span>•</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono">
                  Pehchan ID: {currentArtisan.pehchanId}
                </span>
              </div>
            </div>
          </div>

          {/* Primary CTA: + Add Product */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              href="/create-product"
              className="flex-1 md:flex-none bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-craft-terracotta/40 hover:scale-102 transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-craft-gold" />
              <span>{t("navAddProduct")}</span>
            </Link>

            <button
              onClick={() => setShowQR(true)}
              className="bg-craft-green-dark hover:bg-craft-green-light border border-craft-gold/40 text-craft-cream px-4 py-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-craft-gold" />
              <span>{t("openStallQR")}</span>
            </button>
          </div>

        </div>
      </div>

      {/* STATS OVERVIEW CARDS (PRD: 12 Products, 428 Views, 17 Enquiries) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>{t("statProducts")}</span>
            <Package className="w-4 h-4 text-craft-green" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900">
            {displayProducts.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>{t("allVerified")}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>{t("statViews")}</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900">
            {totalViews}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+24% this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>{t("statEnquiries")}</span>
            <MessageSquare className="w-4 h-4 text-craft-terracotta" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900">
            {totalEnquiries}
          </div>
          <div className="text-[11px] text-craft-terracotta font-semibold flex items-center gap-1">
            <span>1 Wholesale pending</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>{t("statRevenue")}</span>
            <TrendingUp className="w-4 h-4 text-craft-gold" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900">
            ₹24,500
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">
            {t("directBank")}
          </div>
        </div>

      </div>

      {/* 4 CORE DASHBOARD ACTION MODULES (PRD Specified) */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-xl text-craft-green">
          {t("principalModules")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Module 1: My Products */}
          <Link
            href="/products"
            className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-craft-green/40 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-craft-green/10 text-craft-green flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 group-hover:text-craft-green transition-colors">
                {t("navProducts")}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {t("myProductsDesc")}
              </p>
            </div>
            <span className="text-xs font-bold text-craft-green flex items-center gap-1">
              View {displayProducts.length} crafts <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Module 2: Market Linkage */}
          <Link
            href="/market-linkage"
            className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-craft-terracotta/40 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 bg-craft-gold/20 text-craft-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
              3 Matches
            </div>
            <div className="w-10 h-10 rounded-xl bg-craft-terracotta/10 text-craft-terracotta flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 group-hover:text-craft-terracotta transition-colors">
                {t("navMarketLinkage")}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {t("marketLinkageDesc")}
              </p>
            </div>
            <span className="text-xs font-bold text-craft-terracotta flex items-center gap-1">
              Explore B2B Matches <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Module 3: Voice Assistant */}
          <Link
            href="/voice"
            className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-craft-green/40 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 group-hover:text-craft-green transition-colors">
                {t("navVoice")}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {t("voiceAssistantDesc")}
              </p>
            </div>
            <span className="text-xs font-bold text-craft-green flex items-center gap-1">
              Open Voice Studio <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Module 4: Digital Catalogue */}
          <Link
            href="/catalogue"
            className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-craft-green/40 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 group-hover:text-craft-green transition-colors">
                {t("navCatalogue")}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {t("digitalCatalogueDesc")}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              View Catalogue <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

        </div>
      </div>

      {/* RECENT CRAFTS SNAPSHOT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-neutral-900">
            {t("activeListings")}
          </h2>
          <Link href="/products" className="text-xs font-bold text-craft-green hover:underline">
            {t("viewAll")} ({displayProducts.length})
          </Link>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-neutral-200 p-3.5 flex gap-3 items-center shadow-xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.processedImageUrl || product.originalImageUrl}
                alt=""
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block truncate">
                  {product.category}
                </span>
                <h4 className="font-serif font-bold text-sm text-neutral-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-extrabold text-sm text-craft-green">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    PUBLISHED
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR CODE MODAL */}
      <QRCodeModal
        artisan={currentArtisan}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
      />

    </div>
  );
}
