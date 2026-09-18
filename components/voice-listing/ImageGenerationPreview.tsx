"use client";

import React, { useState, useEffect } from "react";
import { ExtractedProductDetails } from "@/types";
import { 
  Sparkles, 
  RotateCcw, 
  Edit3, 
  Check, 
  ArrowRight, 
  Info, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  CheckCheck,
  Scissors,
  Layers,
  Wand2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getFallbackImage } from "@/lib/aiImageService";
import { StudioBackgroundSelector } from "@/components/ai/StudioBackgroundSelector";
import { getFilterStyleForPreset } from "@/lib/aiService";
import { removeBackgroundAccurately } from "@/lib/backgroundRemoval";

interface ImageGenerationPreviewProps {
  details: ExtractedProductDetails;
  imageUrl: string;
  prompt: string;
  isGenerating: boolean;
  onRegenerate: () => void;
  onEditDetails: () => void;
  onUseThisImage: (finalImageUrl?: string, studioPreset?: string) => void;
}

export function ImageGenerationPreview({
  details,
  imageUrl,
  prompt,
  isGenerating,
  onRegenerate,
  onEditDetails,
  onUseThisImage
}: ImageGenerationPreviewProps) {
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [isSegmenting, setIsSegmenting] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("clean-white");
  const [compareMode, setCompareMode] = useState<"enhanced" | "raw">("enhanced");

  const { isCutout, containerClass, overlayClass, badgeLabel, filter } = getFilterStyleForPreset(selectedPreset);

  useEffect(() => {
    if (imageUrl && imageUrl.trim() !== "") {
      setImgSrc(imageUrl);
    }
    setCutoutUrl(null);
    setIsImageLoading(true);
  }, [imageUrl]);

  const fallbackSrc = getFallbackImage(details);
  const rawImage = (compareMode === "enhanced" && isCutout && cutoutUrl) ? cutoutUrl : (imgSrc || imageUrl);
  const displaySrc = (rawImage && rawImage.trim() !== "") ? rawImage : (isGenerating ? null : fallbackSrc);

  const handleCopyPrompt = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
      setHasCopiedPrompt(true);
      setTimeout(() => setHasCopiedPrompt(false), 2000);
    }
  };

  const isLoading = isGenerating || isImageLoading;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-8">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Step 3 & 4 of 5: AI Image Generation & Preview</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-neutral-900">
            Studio-Grade AI Product Photograph
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Generated strictly from your confirmed specifications with professional commercial studio lighting and backdrop.
          </p>
        </div>

        <button
          type="button"
          onClick={onEditDetails}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Product Details</span>
        </button>
      </div>

      {/* Main Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Big Generated Product Image Card with Live Studio Enhancements */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`relative aspect-square rounded-3xl overflow-hidden shadow-xl border-2 border-craft-gold/30 group transition-all duration-300 ${
            compareMode === "enhanced" ? containerClass : "bg-neutral-900"
          }`}>
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-craft-green-dark via-[#0c2419] to-neutral-950 text-white space-y-4 z-20">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-craft-gold/20 border-t-craft-gold animate-spin" />
                  <Sparkles className="w-7 h-7 text-craft-gold absolute animate-pulse" />
                </div>

                <div className="space-y-1.5 max-w-md">
                  <h4 className="font-serif font-bold text-xl text-craft-ivory">
                    Gemini AI is Generating Your Product Photo...
                  </h4>
                  <p className="text-xs text-craft-cream/80 leading-relaxed">
                    Generating a real product photo of your {details.color ? `${details.color} ` : ""}{details.material ? `${details.material} ` : ""}{details.craftType || details.productName} using Google Gemini native image generation.
                  </p>
                </div>

                {/* Dynamic Attribute Badges in Loader */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px]">
                  {details.color && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white font-medium">
                      🎨 Color: {details.color}
                    </span>
                  )}
                  {details.material && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white font-medium">
                      🧵 Material: {details.material}
                    </span>
                  )}
                  {details.design && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white font-medium">
                      ✨ Design: {details.design}
                    </span>
                  )}
                  {details.origin && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white font-medium">
                      🏛️ Heritage: {details.origin}
                    </span>
                  )}
                </div>

                <div className="w-48 bg-white/10 rounded-full h-1 overflow-hidden mt-3">
                  <div className="bg-gradient-to-r from-craft-gold via-amber-400 to-craft-gold h-full animate-pulse w-full rounded-full" />
                </div>
              </div>
            )}

            {/* Actual Product Image with dynamic Studio / Cutout filter */}
            {displaySrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displaySrc}
                alt={details.productName || "Handcrafted Product"}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setImgSrc(fallbackSrc);
                  setIsImageLoading(false);
                }}
                style={{
                  filter: compareMode === "enhanced" ? filter : "none",
                }}
                className={`w-full h-full object-cover group-hover:scale-102 transition-all duration-500 ${
                  isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              />
            ) : (
              <div className="w-full h-full bg-neutral-900" />
            )}

            {/* Studio Lighting Overlay */}
            {compareMode === "enhanced" && (
              <div className={`absolute inset-0 ${overlayClass} pointer-events-none transition-opacity duration-300`} />
            )}

            {/* Floating Filter Badge */}
            <div className={`absolute top-4 left-4 z-10 flex items-center gap-1.5 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border shadow-lg transition-all ${
              isCutout && compareMode === "enhanced"
                ? "bg-rose-600/90 border-rose-300"
                : "bg-black/75 border-craft-gold/40"
            }`}>
              {isCutout && compareMode === "enhanced" ? (
                <Scissors className="w-3.5 h-3.5 text-white" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-craft-gold" />
              )}
              <span>{compareMode === "enhanced" ? badgeLabel : "Raw AI Generated"}</span>
            </div>

            {/* Live Before / After Compare Button */}
            <div className="absolute top-4 right-4 z-10 flex items-center bg-black/80 backdrop-blur-md rounded-xl p-1 border border-white/20 text-xs shadow-lg">
              <button
                type="button"
                onClick={() => setCompareMode("enhanced")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  compareMode === "enhanced"
                    ? "bg-craft-green text-white shadow-xs"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                ✨ Filter Enhanced
              </button>
              <button
                type="button"
                onClick={() => setCompareMode("raw")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  compareMode === "raw"
                    ? "bg-neutral-700 text-white shadow-xs"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                📸 Raw
              </button>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 text-white flex items-end justify-between z-10">
              <div>
                <span className="text-xs text-craft-gold font-bold uppercase tracking-wider block">
                  {details.category}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl leading-snug">
                  {details.productName}
                </h3>
              </div>
              {details.price && (
                <div className="text-right">
                  <span className="text-[10px] text-white/70 block uppercase font-semibold">Price</span>
                  <span className="text-lg font-serif font-bold text-craft-gold">
                    {formatCurrency(details.price)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AI Studio & Background Removal Filter Selector Component */}
          <div className="bg-neutral-50/90 rounded-3xl p-5 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800">
                Enhancement Backdrop & Removal Presets
              </span>
              {isSegmenting && (
                <span className="text-[11px] font-bold text-craft-terracotta bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating Pixel Cutout...
                </span>
              )}
            </div>
            <StudioBackgroundSelector
              selectedPreset={selectedPreset}
              onSelectPreset={async (presetId) => {
                setSelectedPreset(presetId);
                setCompareMode("enhanced");
                if (presetId === "remove-bg" && !cutoutUrl) {
                  const sourceForCutout = displaySrc || fallbackSrc;
                  if (sourceForCutout) {
                    setIsSegmenting(true);
                    try {
                      const cutout = await removeBackgroundAccurately(sourceForCutout);
                      setCutoutUrl(cutout);
                    } catch (e) {
                      console.warn("Cutout generation failed:", e);
                    } finally {
                      setIsSegmenting(false);
                    }
                  }
                }
              }}
              compact={false}
            />
          </div>

          {/* Prompt Transparency Inspector */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-craft-terracotta" />
                <span>AI Prompt Transparency Rule</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="text-xs text-craft-green hover:underline font-semibold cursor-pointer"
              >
                {showPromptDetails ? "Hide Prompt" : "Inspect Prompt"}
              </button>
            </div>
            
            {showPromptDetails && (
              <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                <div className="relative">
                  <pre className="text-xs text-neutral-700 bg-white p-3.5 pr-10 rounded-xl border border-neutral-200 font-mono leading-relaxed select-all whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {prompt}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    title="Copy Prompt"
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    {hasCopiedPrompt ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Guaranteed: Built strictly from your edited details (Color: <strong>{details.color || "N/A"}</strong>, Material: <strong>{details.material || "N/A"}</strong>, Origin: <strong>{details.origin || "N/A"}</strong>).</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary Attributes & Decision Controls */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-craft-terracotta uppercase tracking-wider">
                Confirmed Attributes
              </span>
              <h3 className="font-serif font-bold text-xl text-neutral-900">
                {details.productName}
              </h3>
            </div>

            {/* Key Value Summary Table */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 divide-y divide-neutral-200/70 text-xs">
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 font-medium">Category</span>
                <span className="font-bold text-neutral-900">{details.category || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 font-medium">Craft Type</span>
                <span className="font-bold text-neutral-900">{details.craftType || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 font-medium">Material</span>
                <span className="font-bold text-neutral-900">{details.material || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 font-medium">Color Tone</span>
                <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  {details.color || "—"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 font-medium">Design / Pattern</span>
                <span className="font-bold text-neutral-900">{details.design || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 font-medium">Origin</span>
                <span className="font-bold text-neutral-900">{details.origin || "—"}</span>
              </div>
              {details.dimensions && (
                <div className="flex justify-between py-2">
                  <span className="text-neutral-500 font-medium">Dimensions</span>
                  <span className="font-bold text-neutral-900">{details.dimensions}</span>
                </div>
              )}
              {details.price && (
                <div className="flex justify-between py-2.5 font-bold">
                  <span className="text-craft-green">Final Price</span>
                  <span className="text-craft-green text-sm">{formatCurrency(details.price)}</span>
                </div>
              )}
            </div>

            {/* Clean Description Display */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                Marketplace Description
              </span>
              <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-100 leading-relaxed italic">
                &ldquo;{details.description}&rdquo;
              </p>
            </div>
          </div>

          {/* 3 Core Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            
            {/* 1. Primary: Use This Image & Create Listing */}
            <button
              type="button"
              onClick={() => onUseThisImage(
                selectedPreset === "remove-bg" && cutoutUrl ? cutoutUrl : (displaySrc || fallbackSrc),
                selectedPreset
              )}
              disabled={isLoading || !displaySrc}
              className="w-full bg-craft-green hover:bg-craft-green-dark text-white font-bold py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-craft-green/20 transition-all cursor-pointer hover:scale-102 disabled:opacity-50"
            >
              <Check className="w-5 h-5 text-craft-gold" />
              <span>Use This Image & Create Listing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 2. Secondary Row: Regenerate & Edit Details */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onRegenerate}
                disabled={isGenerating}
                className="w-full bg-neutral-100 hover:bg-amber-100/70 text-neutral-800 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-200"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5 text-craft-gold" />}
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={onEditDetails}
                disabled={isGenerating}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-craft-terracotta" />
                <span>Edit Details</span>
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 text-center">
              * The product will not be published automatically until you review and confirm the listing.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
