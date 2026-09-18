"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { ProductCard } from "@/components/product/ProductCard";
import { BuyerEnquiryModal } from "@/components/product/BuyerEnquiryModal";
import { Product } from "@/types";
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Edit3,
  ArrowLeft,
  ShoppingBag,
  Sparkles
} from "lucide-react";

function ArtisanProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artisanId = searchParams?.get("id");
  const { artisans, currentArtisan, products, showToast } = useApp();
  const { language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const artisan = (artisanId && artisans.find((a) => a.id === artisanId)) || currentArtisan;
  const artisanProducts = products.filter((p) => p.artisanId === artisan.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-craft-green transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === "hi" ? "पीछे जाएं" : "Back"}</span>
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-craft-gold/30">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artisan.profileImage}
            alt={artisan.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-craft-gold shadow-md"
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-craft-ivory">
                {artisan.name}
              </h1>
              <ShieldCheck className="w-6 h-6 text-craft-gold flex-shrink-0" />
            </div>
            <p className="text-sm font-semibold text-craft-gold">
              Master Artisan • {artisan.craftCategory}
            </p>
            <p className="text-xs text-craft-cream/80 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {artisan.district}, {artisan.state}
            </p>
          </div>
        </div>
      </div>

      {/* KYC & Pehchan Card Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 flex-wrap gap-2">
          <h2 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-craft-terracotta" />
            Artisan Pehchan & Government Registry
          </h2>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ministry of Textiles Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold block">Pehchan ID Card No:</span>
            <span className="font-mono font-bold text-neutral-900 text-sm">{artisan.pehchanId}</span>
          </div>

          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold block">Phone Number (OTP Linked):</span>
            <span className="font-bold text-neutral-900 text-sm">{artisan.phone}</span>
          </div>

          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold block">Craft Tradition Experience:</span>
            <span className="font-bold text-neutral-900 text-sm">{artisan.yearsOfExperience} Years of Heritage Work</span>
          </div>

          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold block">Direct Benefit Transfer (DBT):</span>
            <span className="font-bold text-emerald-700 text-sm">Aadhaar Linked Direct Account</span>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
            Artisan Biography & Craft Narrative
          </span>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
            {artisan.bio}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => showToast("KYC details verified by Ministry of Textiles portal.", "info")}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Contact Info</span>
          </button>
        </div>
      </div>

      {/* Artisan Products Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h2 className="font-serif font-bold text-xl text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-craft-terracotta" />
              <span>Handcrafted Creations by {artisan.name}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {artisanProducts.length} authentic {artisan.craftCategory} creations directly from their workshop
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-craft-terracotta hover:underline"
          >
            Explore All Crafts ➔
          </Link>
        </div>

        {artisanProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 p-6">
            <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700">No products currently listed</p>
            <p className="text-xs text-neutral-500 mt-1">This artisan is currently working on upcoming pieces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisanProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickEnquire={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Enquiry Modal */}
      {selectedProduct && (
        <BuyerEnquiryModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default function ArtisanProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-neutral-500">Loading Artisan Profile...</div>}>
      <ArtisanProfileContent />
    </Suspense>
  );
}
