"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { QRCodeModal } from "@/components/product/QRCodeModal";
import { 
  QrCode, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Eye, 
  Download,
  Phone
} from "lucide-react";

export default function CataloguePage() {
  const { currentArtisan, products, showToast } = useApp();
  const { t, language } = useLanguage();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Current artisan's products
  const artisanProducts = products.filter(
    (p) => p.artisanId === currentArtisan.id || p.artisanName === currentArtisan.name
  );
  const displayProducts = artisanProducts.length > 0 ? artisanProducts : products.slice(0, 4);

  const handleCopyLink = () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/catalogue/${currentArtisan.id}`
      : `https://shilpsutra.gov.in/catalogue/${currentArtisan.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast("Artisan catalogue link copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Namaste! Please browse my official handcrafted digital catalogue on ShilpSutra: https://shilpsutra.gov.in/catalogue/${currentArtisan.id}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-craft-gold/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-craft-gold border border-craft-gold/30 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-craft-gold" />
              <span>{language === "hi" ? "व्यक्तिगत डिजिटल शिल्पकार माइक्रोसाइट" : "Personalized Digital Artisan Microsite"}</span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-craft-ivory">
              {t("catalogueTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-craft-cream/90">
              {t("catalogueSub")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowQR(true)}
              className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-craft-terracotta/30 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-craft-gold" />
              <span>{t("openStallQR")}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{t("shareWhatsApp")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Catalogue Microsite Preview Box */}
      <div className="bg-white rounded-3xl border-2 border-neutral-200/80 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Artisan Hero Banner in Catalogue */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-craft-gold mx-auto shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentArtisan.profileImage}
              alt={currentArtisan.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="font-serif font-bold text-2xl text-neutral-900">
                {currentArtisan.name}
              </h2>
              <ShieldCheck className="w-5 h-5 text-craft-green" />
            </div>
            <p className="text-sm font-semibold text-craft-terracotta">
              {currentArtisan.craftCategory}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {currentArtisan.location}, {currentArtisan.state} • Pehchan ID: {currentArtisan.pehchanId}
            </p>
          </div>

          <p className="text-xs text-neutral-600 italic bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
            "{currentArtisan.bio}"
          </p>

          {/* Quick Share Buttons Bar */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2 rounded-xl border border-neutral-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === "hi" ? "लिंक कॉपी हो गया!" : "Link Copied!") : t("copyLink")}</span>
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2 rounded-xl border border-neutral-200 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-craft-terracotta" />
              <span>View QR Code</span>
            </button>
          </div>
        </div>

        {/* Products in Catalogue Grid */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Master Craft Creations ({displayProducts.length})
            </h3>
            <span className="text-xs text-neutral-500">
              Direct from Maker • ONDC Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((p) => (
              <div
                key={p.id}
                className="bg-craft-cream/30 rounded-2xl border border-neutral-200 overflow-hidden flex flex-col shadow-xs"
              >
                <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.processedImageUrl || p.originalImageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900 line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <span className="font-extrabold text-sm text-craft-green">
                      {formatCurrency(p.price)}
                    </span>
                    <Link
                      href={`/product/${p.id}`}
                      className="text-xs font-bold text-craft-terracotta hover:underline"
                    >
                      Enquire ➔
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QR Modal */}
      <QRCodeModal
        artisan={currentArtisan}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
      />

    </div>
  );
}
