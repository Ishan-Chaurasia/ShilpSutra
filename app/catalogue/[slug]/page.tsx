"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import { BuyerEnquiryModal } from "@/components/product/BuyerEnquiryModal";
import { Product } from "@/types";
import { 
  ShieldCheck, 
  MapPin, 
  Share2, 
  MessageSquare, 
  Phone, 
  ArrowUpRight, 
  Award,
  Sparkles
} from "lucide-react";

export default function PublicCataloguePage() {
  const params = useParams();
  const { currentArtisan, products, artisans, showToast } = useApp();
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);

  const slug = params?.slug as string;
  // Match artisan by id or fallback to currentArtisan
  const artisan = artisans.find((a) => a.id === slug) || currentArtisan;

  const artisanProducts = products.filter(
    (p) => p.artisanId === artisan.id || p.artisanName === artisan.name
  );
  const displayProducts = artisanProducts.length > 0 ? artisanProducts : products;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Catalogue link copied to clipboard!", "success");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Artisan Showcase Banner */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-craft-gold/30">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
          
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-craft-gold shadow-xl flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artisan.profileImage}
              alt={artisan.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-craft-gold bg-white/10 px-3 py-1 rounded-full border border-craft-gold/30">
                Official ShilpSutra Craft Portfolio
              </span>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Master Artisan
              </span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-craft-ivory">
              {artisan.name}
            </h1>

            <p className="text-base font-medium text-craft-gold">
              Traditional {artisan.craftCategory} • {artisan.location}, {artisan.state}
            </p>

            <p className="text-xs sm:text-sm text-craft-cream/90 max-w-2xl leading-relaxed">
              {artisan.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={handleShare}
                className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Catalogue</span>
              </button>

              <a
                href={`https://wa.me/${artisan.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Craft Collection Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-2xl text-neutral-900">
            Handcrafted Works ({displayProducts.length})
          </h2>
          <span className="text-xs text-neutral-500">
            Direct Fair-Trade Artisan Prices
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.processedImageUrl || p.originalImageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
                  {p.category}
                </span>
                {p.ondcReady && (
                  <span className="absolute top-3 right-3 bg-white/95 text-craft-terracotta text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                    ONDC READY
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-neutral-900 line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Price</span>
                    <span className="text-lg font-serif font-extrabold text-craft-green">
                      {formatCurrency(p.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEnquiryProduct(p)}
                      className="text-xs font-bold text-craft-terracotta hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-craft-terracotta/30 transition-colors"
                    >
                      Enquire
                    </button>
                    <Link
                      href={`/product/${p.id}`}
                      className="bg-craft-green hover:bg-craft-green-light text-white p-2 rounded-lg transition-colors shadow-xs"
                      title="View Details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Enquiry Modal */}
      <BuyerEnquiryModal
        product={enquiryProduct}
        isOpen={Boolean(enquiryProduct)}
        onClose={() => setEnquiryProduct(null)}
      />

    </div>
  );
}
