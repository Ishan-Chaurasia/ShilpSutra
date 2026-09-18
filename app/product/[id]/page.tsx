"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { getFilterStyleForPreset } from "@/lib/aiService";
import { BuyerEnquiryModal } from "@/components/product/BuyerEnquiryModal";
import { 
  ShieldCheck, 
  MapPin, 
  Share2, 
  ArrowLeft, 
  Award, 
  Send,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, artisans, currentArtisan, deleteProduct, showToast } = useApp();
  const { t, language } = useLanguage();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const productId = params?.id as string;
  const product = products.find((p) => p.id === productId) || products[0];
  const productArtisan = (product && artisans.find((a) => a.id === product.artisanId)) || currentArtisan;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl">Craft Not Found</h2>
        <Link href="/marketplace" className="text-craft-terracotta hover:underline text-sm font-bold">
          ← Return to Marketplace
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Craft link copied to clipboard!", "success");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-craft-green transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === "hi" ? "शिल्पों पर वापस जाएं" : "Back to Crafts"}</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          {(() => {
            const filterStyle = getFilterStyleForPreset(product.studioBackground);
            return (
              <div className={`aspect-square rounded-3xl overflow-hidden border border-neutral-200 relative shadow-md ${filterStyle.containerClass} transition-colors duration-300`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.processedImageUrl || product.originalImageUrl}
                  alt={product.name}
                  style={{
                    filter: filterStyle.filter,
                  }}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${filterStyle.overlayClass} pointer-events-none`} />
                {product.ondcReady && (
                  <span className="absolute top-4 right-4 bg-white/95 text-craft-terracotta text-xs font-extrabold px-3 py-1 rounded-md shadow-sm border border-craft-terracotta/20">
                    ONDC READY
                  </span>
                )}
                <span className={`absolute bottom-4 left-4 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-lg ${
                  filterStyle.isCutout ? "bg-rose-600/90 border border-rose-300" : "bg-black/60"
                }`}>
                  {filterStyle.badgeLabel || product.studioBackground || (language === "hi" ? "AI उन्नत स्टूडियो शॉट" : "AI Enhanced Studio Shot")}
                </span>
              </div>
            );
          })()}
        </div>

        {/* Right: Details & Purchase / Enquiry Flow */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-craft-terracotta bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {product.category}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                SKU: {product.slug}
              </span>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-craft-green">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-neutral-500">
                ({t("fairArtisanPrice")} • {language === "hi" ? "सीधे शिल्पकार को" : "Direct to Maker"})
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="flex-1 bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-craft-terracotta/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Send className="w-4 h-4 text-craft-gold" />
              <span>{language === "hi" ? "सीधी खरीदार पूछताछ भेजें" : "Send Direct Buyer Enquiry"}</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 p-3.5 rounded-2xl text-sm transition-colors cursor-pointer shadow-xs"
              title="Share Craft"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-white hover:bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl text-sm transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              title="Delete Craft Listing"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-xs font-semibold">{language === "hi" ? "हटाएं" : "Delete"}</span>
            </button>
          </div>

          {/* Artisan Identity Card */}
          <Link
            href={`/profile?id=${product.artisanId || currentArtisan.id}`}
            className="group block bg-craft-cream/60 hover:bg-craft-cream rounded-2xl p-4 sm:p-5 border border-craft-gold/30 hover:border-craft-gold transition-all"
            title="View Artisan Full Profile"
          >
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productArtisan.profileImage}
                alt={product.artisanName}
                className="w-16 h-16 rounded-2xl object-cover border border-craft-gold shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-base text-neutral-900 group-hover:text-craft-green transition-colors truncate">
                    {product.artisanName}
                  </h4>
                  <div className="flex items-center gap-0.5 text-craft-green text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-craft-gold" />
                    <span>{language === "hi" ? "सत्यापित" : "Verified"}</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {product.artisanLocation}
                </p>
                <p className="text-[11px] text-neutral-500 italic line-clamp-1">
                  {productArtisan.bio}
                </p>
                <p className="text-[10px] text-craft-terracotta font-bold group-hover:underline pt-0.5">
                  {language === "hi" ? "कारीगर प्रोफ़ाइल व अन्य शिल्प देखें ➔" : "View Artisan Profile & Creations ➔"}
                </p>
              </div>
            </div>
          </Link>

          {/* Cultural Heritage Story */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-base text-neutral-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-craft-terracotta" />
              {t("craftHeritage")}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-white p-4 rounded-2xl border border-neutral-200/80">
              {product.culturalStory}
            </p>
          </div>

          {/* Craft Specifications */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-2.5 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-neutral-600 text-[11px]">
              {t("specifications")}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-neutral-700">
              <div><strong className="text-neutral-900">{language === "hi" ? "सामग्री:" : "Material:"}</strong> {product.material}</div>
              <div><strong className="text-neutral-900">{language === "hi" ? "श्रेणी:" : "Category:"}</strong> {product.category}</div>
              <div><strong className="text-neutral-900">{language === "hi" ? "आकार:" : "Dimensions:"}</strong> {product.dimensions || (language === "hi" ? "मानक आकार" : "Standard Size")}</div>
              <div><strong className="text-neutral-900">{language === "hi" ? "निर्माण समय:" : "Production Time:"}</strong> {product.leadTimeDays || 4} {language === "hi" ? "दिन" : "Days"}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* Enquiry Modal */}
      <BuyerEnquiryModal
        product={product}
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  {language === "hi" ? "शिल्प उत्पाद हटाएं?" : "Delete Craft Listing?"}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === "hi"
                    ? "क्या आप वाकई इस शिल्प को अपने खाते और बाज़ार से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
                    : "Are you sure you want to delete this listing? It will be permanently removed from your inventory and the ShilpSutra marketplace."}
                </p>
              </div>
            </div>

            {/* Preview of item being deleted */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.processedImageUrl || product.originalImageUrl}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
              />
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-xs text-neutral-900 truncate">
                  {product.name}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {product.category} • {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  deleteProduct(product.id);
                  setShowDeleteModal(false);
                  router.push("/products");
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "हाँ, हटाएं" : "Yes, Delete Craft"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
