"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, MapPin, Eye, MessageSquare, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickEnquire?: (product: Product) => void;
}

export function ProductCard({ product, onQuickEnquire }: ProductCardProps) {
  const { t } = useLanguage();
  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 hover:border-craft-terracotta/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.processedImageUrl || product.originalImageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Verified Artisan Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-craft-green/90 text-craft-ivory text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border border-craft-gold/30">
          <ShieldCheck className="w-3 h-3 text-craft-gold" />
          <span>{t("verifiedArtisan")}</span>
        </div>

        {/* ONDC Badge */}
        {product.ondcReady && (
          <div className="absolute top-3 right-3 bg-white/95 text-craft-terracotta text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm border border-craft-terracotta/20">
            ONDC READY
          </div>
        )}

        {/* Category Pill on bottom */}
        <div className="absolute bottom-3 left-3 bg-craft-green-dark/85 backdrop-blur-md text-craft-ivory text-[11px] font-medium px-2.5 py-0.5 rounded-lg border border-craft-sage/40">
          {product.category}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Artisan & Location */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
            <span className="font-semibold text-neutral-700">{product.artisanName}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 truncate">
              <MapPin className="w-3 h-3 text-neutral-400" />
              {product.artisanLocation}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif font-bold text-base text-neutral-900 group-hover:text-craft-terracotta transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Tags with Craft-Sage (#819D94) Tint */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] bg-craft-sage/15 text-craft-sage-dark font-medium px-2 py-0.5 rounded-md border border-craft-sage/25"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
              {t("fairArtisanPrice")}
            </span>
            <span className="font-extrabold text-lg text-craft-green">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onQuickEnquire && (
              <button
                onClick={() => onQuickEnquire(product)}
                className="text-xs font-bold text-craft-terracotta hover:bg-craft-terracotta/10 px-2.5 py-1.5 rounded-lg border border-craft-terracotta/30 transition-colors cursor-pointer"
              >
                {t("enquire")}
              </button>
            )}
            <Link
              href={`/product/${product.id}`}
              className="bg-craft-green hover:bg-craft-green-light text-white p-2 rounded-lg transition-colors shadow-xs"
              title={t("viewStory")}
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
