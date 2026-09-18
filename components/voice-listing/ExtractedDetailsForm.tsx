"use client";

import React, { useState } from "react";
import { ExtractedProductDetails } from "@/types";
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  DollarSign, 
  Layers, 
  Palette, 
  MapPin, 
  Maximize2, 
  Package, 
  FileText,
  Sliders,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ExtractedDetailsFormProps {
  initialDetails: ExtractedProductDetails;
  transcript: string;
  onBackToVoice: () => void;
  onProceedToImageGen: (updatedDetails: ExtractedProductDetails) => void;
}

export function ExtractedDetailsForm({
  initialDetails,
  transcript,
  onBackToVoice,
  onProceedToImageGen
}: ExtractedDetailsFormProps) {
  const [details, setDetails] = useState<ExtractedProductDetails>(initialDetails);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: keyof ExtractedProductDetails, value: any) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      handleChange("price", undefined);
    } else {
      const num = parseInt(val, 10);
      handleChange("price", isNaN(num) ? undefined : num);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!details.productName.trim()) {
      setValidationError("Please provide a product name.");
      return;
    }

    if (!details.price || details.price <= 0) {
      setValidationError("Please specify a selling price for your craft.");
      return;
    }

    onProceedToImageGen(details);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-8">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Step 2 of 5: Review & Edit Extracted Details</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-neutral-900">
            AI-Extracted Product Information
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            ShilpSutra extracted these details from your speech. Review and make any adjustments needed. Your edits will directly shape the AI product photo.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToVoice}
          className="self-start sm:self-auto flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Record Again</span>
        </button>
      </div>

      {/* Spoken Transcript Reference Pill */}
      <div className="bg-craft-cream/40 border border-craft-gold/30 rounded-2xl p-4 text-xs text-neutral-700 space-y-1">
        <div className="font-bold text-craft-green flex items-center gap-1.5">
          <span>Original Spoken Input:</span>
        </div>
        <p className="italic text-neutral-800">&ldquo;{transcript}&rdquo;</p>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Structured Editable Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Product Name */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-craft-terracotta" />
            <span>Product Name *</span>
          </label>
          <input
            type="text"
            value={details.productName}
            onChange={(e) => handleChange("productName", e.target.value)}
            placeholder="e.g. Handwoven Cotton Saree"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-craft-green" />
            <span>Category</span>
          </label>
          <input
            type="text"
            value={details.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="e.g. Saree, Pottery, Bamboo"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
        </div>

        {/* Craft Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Craft Type</span>
          </label>
          <input
            type="text"
            value={details.craftType}
            onChange={(e) => handleChange("craftType", e.target.value)}
            placeholder="e.g. Handwoven, Wheel-Thrown, Woven"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
        </div>

        {/* Material */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>Material</span>
          </label>
          <input
            type="text"
            value={details.material}
            onChange={(e) => handleChange("material", e.target.value)}
            placeholder="e.g. Cotton, Mulberry Silk, Bamboo, Terracotta Clay"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
        </div>

        {/* Color */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-600" />
            <span>Color / Tone</span>
          </label>
          <input
            type="text"
            value={details.color}
            onChange={(e) => handleChange("color", e.target.value)}
            placeholder="e.g. Dark Red, Royal Blue, Natural Earthy"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
          <span className="text-[10px] text-neutral-500">
            * Note: Changing color (e.g. to Royal Blue) will generate a photo with that exact color.
          </span>
        </div>

        {/* Design / Pattern */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Design / Pattern</span>
          </label>
          <input
            type="text"
            value={details.design}
            onChange={(e) => handleChange("design", e.target.value)}
            placeholder="e.g. Traditional Golden Pattern, Peacock Motif"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
        </div>

        {/* Region / Origin */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Region / Origin</span>
          </label>
          <input
            type="text"
            value={details.origin}
            onChange={(e) => handleChange("origin", e.target.value)}
            placeholder="e.g. Madhya Pradesh, Chanderi, Rajasthan"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
        </div>

        {/* Price (INR) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-craft-green" />
            <span>Price (₹) *</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₹</span>
            <input
              type="number"
              value={details.price !== undefined ? details.price : ""}
              onChange={handlePriceChange}
              placeholder="e.g. 1800"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-3 pl-8 pr-3 text-sm text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
              required
            />
          </div>
        </div>

        {/* Dimensions (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>Dimensions (Optional)</span>
          </label>
          <input
            type="text"
            value={details.dimensions || ""}
            onChange={(e) => handleChange("dimensions", e.target.value)}
            placeholder="e.g. 6.2 meters, 28cm x 18cm"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
        </div>

        {/* Quantity (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-neutral-500" />
            <span>Available Quantity / Stock (Optional)</span>
          </label>
          <input
            type="text"
            value={details.quantity || ""}
            onChange={(e) => handleChange("quantity", e.target.value)}
            placeholder="e.g. 5 pieces, Made to order"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white"
          />
        </div>

        {/* Product Description */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-craft-terracotta" />
            <span>Marketplace Product Description</span>
          </label>
          <textarea
            value={details.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            placeholder="A clean, marketplace-ready description suitable for buyers."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green focus:bg-white leading-relaxed"
          />
          <p className="text-[11px] text-neutral-500">
            * Simple, authentic language. Free of unverified claims or marketing hype.
          </p>
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={onBackToVoice}
          className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-4 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Voice Recording</span>
        </button>

        <button
          type="submit"
          className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-craft-terracotta/25 transition-all cursor-pointer hover:scale-102"
        >
          <Sparkles className="w-4 h-4 text-craft-gold" />
          <span>Generate Product Image ➔</span>
        </button>
      </div>

    </form>
  );
}
