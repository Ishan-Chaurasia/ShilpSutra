"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2, Download, ExternalLink } from "lucide-react";
import { Artisan } from "@/types";
import { useApp } from "@/context/AppContext";

interface QRCodeModalProps {
  artisan: Artisan;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ artisan, isOpen, onClose }: QRCodeModalProps) {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const catalogueUrl = typeof window !== "undefined"
    ? `${window.location.origin}/catalogue/${artisan.id}`
    : `https://shilpsutra.gov.in/catalogue/${artisan.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(catalogueUrl);
    setCopied(true);
    showToast("Catalogue link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Namaste! Explore my official handcrafted craft catalogue on ShilpSutra: ${catalogueUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-craft-gold/40 w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-craft-green text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-craft-gold">
              Shareable Digital Portfolio
            </span>
            <h3 className="font-serif font-bold text-lg text-craft-ivory mt-0.5">
              {artisan.name}'s Craft QR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Printable Card */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          
          <div className="p-4 bg-craft-cream/50 rounded-2xl border-2 border-dashed border-craft-terracotta/40 flex flex-col items-center shadow-xs">
            {/* ShilpSutra brand mark */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-5 h-5 rounded-md bg-craft-terracotta text-white font-serif font-bold text-xs flex items-center justify-center">
                श
              </span>
              <span className="font-serif font-bold text-sm text-craft-green">
                ShilpSutra Verified Catalogue
              </span>
            </div>

            {/* SVG QR Code */}
            <div className="w-48 h-48 bg-white p-3 rounded-xl border border-neutral-200 shadow-inner flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-craft-green">
                <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                {/* QR Finder Corners */}
                <rect x="5" y="5" width="26" height="26" fill="#133E2B" />
                <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
                <rect x="13" y="13" width="10" height="10" fill="#C85A32" />

                <rect x="69" y="5" width="26" height="26" fill="#133E2B" />
                <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
                <rect x="77" y="13" width="10" height="10" fill="#C85A32" />

                <rect x="5" y="69" width="26" height="26" fill="#133E2B" />
                <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
                <rect x="13" y="77" width="10" height="10" fill="#C85A32" />

                {/* Simulated QR matrix pattern */}
                <rect x="36" y="8" width="6" height="6" fill="#133E2B" />
                <rect x="46" y="8" width="6" height="6" fill="#133E2B" />
                <rect x="56" y="8" width="6" height="6" fill="#133E2B" />
                <rect x="36" y="18" width="6" height="6" fill="#133E2B" />
                <rect x="46" y="24" width="6" height="6" fill="#C99E2F" />
                <rect x="8" y="36" width="6" height="6" fill="#133E2B" />
                <rect x="18" y="46" width="6" height="6" fill="#133E2B" />
                <rect x="28" y="36" width="6" height="6" fill="#133E2B" />
                <rect x="36" y="36" width="12" height="12" fill="#C85A32" rx="2" />
                <rect x="52" y="36" width="6" height="6" fill="#133E2B" />
                <rect x="62" y="46" width="6" height="6" fill="#133E2B" />
                <rect x="72" y="36" width="6" height="6" fill="#133E2B" />
                <rect x="82" y="46" width="6" height="6" fill="#133E2B" />
                <rect x="36" y="52" width="6" height="6" fill="#133E2B" />
                <rect x="46" y="62" width="6" height="6" fill="#133E2B" />
                <rect x="56" y="52" width="6" height="6" fill="#C99E2F" />
                <rect x="66" y="62" width="6" height="6" fill="#133E2B" />
                <rect x="76" y="72" width="6" height="6" fill="#133E2B" />
                <rect x="86" y="82" width="6" height="6" fill="#133E2B" />
                <rect x="36" y="72" width="6" height="6" fill="#133E2B" />
                <rect x="46" y="82" width="6" height="6" fill="#133E2B" />
                <rect x="56" y="72" width="6" height="6" fill="#133E2B" />
              </svg>
            </div>

            <div className="mt-3 text-center">
              <span className="font-bold text-xs text-neutral-900 block">{artisan.name}</span>
              <span className="text-[11px] text-neutral-500">{artisan.craftCategory} • {artisan.location}, {artisan.state}</span>
            </div>
          </div>

          {/* URL Copy Bar */}
          <div className="w-full flex items-center gap-2 bg-neutral-100 p-1.5 rounded-xl border border-neutral-200">
            <span className="text-xs text-neutral-600 truncate flex-1 px-2 text-left font-mono">
              {catalogueUrl}
            </span>
            <button
              onClick={handleCopy}
              className="bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-neutral-200 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Share Buttons */}
          <div className="w-full grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share WhatsApp
            </button>
            <button
              onClick={() => window.print()}
              className="bg-craft-green hover:bg-craft-green-light text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-craft-gold" />
              Print Stall Card
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
