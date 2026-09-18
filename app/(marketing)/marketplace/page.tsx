"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { ProductCard } from "@/components/product/ProductCard";
import { BuyerEnquiryModal } from "@/components/product/BuyerEnquiryModal";
import { Product, CraftCategory } from "@/types";
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  Package,
  RotateCcw
} from "lucide-react";

export default function MarketplacePage() {
  const { products } = useApp();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [bulkOnly, setBulkOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Selected product for Enquiry Modal
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);

  const categories = [
    { id: "ALL", label: language === "hi" ? "सभी शिल्प" : "All Crafts" },
    { id: "Bamboo Handicrafts", label: language === "hi" ? "बाँस शिल्प" : "Bamboo" },
    { id: "Handwoven Textiles", label: language === "hi" ? "हस्तनिर्मित वस्त्र" : "Textiles" },
    { id: "Terracotta & Pottery", label: language === "hi" ? "मिट्टी और बर्तन" : "Pottery & Clay" },
    { id: "Woodcarving", label: language === "hi" ? "काष्ठ शिल्प" : "Woodcarving" },
    { id: "Dhokra Metalcraft", label: language === "hi" ? "ढोकरा धातु शिल्प" : "Dhokra Craft" },
    { id: "Handmade Jewellery", label: language === "hi" ? "पारंपरिक आभूषण" : "Jewellery" },
    { id: "Home Décor", label: language === "hi" ? "गृह सज्जा" : "Home Décor" },
  ];

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesMaterial = p.material.toLowerCase().includes(q);
        const matchesArtisan = p.artisanName.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesMaterial && !matchesArtisan && !matchesTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }

      // Verified
      if (verifiedOnly && !p.ondcReady) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // featured default
    });
  }, [products, searchQuery, selectedCategory, verifiedOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-craft-gold/30">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-craft-gold border border-craft-gold/30 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-craft-gold" />
            <span>{t("marketHeaderBadge")}</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-craft-ivory">
            {t("marketTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-craft-cream/90">
            {t("marketSubtitle")}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-craft-green focus:ring-0 bg-neutral-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
              >
                {language === "hi" ? "साफ़ करें" : "Clear"}
              </button>
            )}
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex-1 md:flex-none flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                verifiedOnly
                  ? "bg-craft-sage/20 border-craft-sage text-craft-sage-dark shadow-xs"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-craft-sage/50"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-craft-sage-dark" />
              <span>{t("verifiedOnly")}</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 bg-white"
            >
              <option value="featured">{t("featured")}</option>
              <option value="price-asc">{t("priceLowHigh")}</option>
              <option value="price-desc">{t("priceHighLow")}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Styled with Craft-Sage #819D94) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-craft-sage text-craft-green-dark shadow-sm ring-2 ring-craft-sage/30"
                  : "bg-neutral-100 text-neutral-600 hover:bg-craft-sage/15 hover:text-craft-sage-dark"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {language === "hi" ? (
              <><strong className="text-neutral-900">{filteredProducts.length}</strong> {t("showingCrafts")}</>
            ) : (
              <>{t("showingCrafts")} <strong className="text-neutral-900">{filteredProducts.length}</strong></>
            )}
          </span>
          {(searchQuery || selectedCategory !== "ALL" || verifiedOnly) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setVerifiedOnly(false);
              }}
              className="text-craft-terracotta hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {t("resetFilters")}
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
            <Package className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-neutral-800">{t("noCraftsFound")}</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {t("noCraftsSub")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickEnquire={(p) => setEnquiryProduct(p)}
              />
            ))}
          </div>
        )}
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
