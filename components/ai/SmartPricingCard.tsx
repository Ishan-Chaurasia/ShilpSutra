"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, TrendingUp, ShieldCheck, Check, RotateCcw, ArrowRight } from "lucide-react";
import { PriceAnalysis } from "@/types";

interface SmartPricingCardProps {
  analysis: PriceAnalysis;
  currentPrice: number;
  onPriceChange: (newPrice: number) => void;
  suggestedPrice?: number;
  onApplySuggested?: () => void;
}

export function SmartPricingCard({
  analysis,
  currentPrice,
  onPriceChange,
  suggestedPrice: propSuggestedPrice,
  onApplySuggested,
}: SmartPricingCardProps) {
  const effectiveSuggested = propSuggestedPrice || analysis.suggestedPrice;
  const { minPrice, maxPrice, confidence, factors, rawMaterialCost, productionCost } = analysis;

  const minRange = Math.min(minPrice, Math.round(effectiveSuggested * 0.7));
  const maxRange = Math.max(maxPrice, Math.round(effectiveSuggested * 1.35), currentPrice + 200);
  const range = maxRange - minRange || 1;

  const currentPercent = Math.min(100, Math.max(0, ((currentPrice - minRange) / range) * 100));
  const suggestedPercent = Math.min(100, Math.max(0, ((effectiveSuggested - minRange) / range) * 100));
  const isAtSuggested = Math.abs(currentPrice - effectiveSuggested) < 5;

  const handleApplyClick = () => {
    if (onApplySuggested) {
      onApplySuggested();
    } else {
      onPriceChange(effectiveSuggested);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-craft-green/15 p-5 sm:p-7 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif font-bold text-lg text-craft-green flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-craft-terracotta" />
              Smart Fair Pricing Engine
            </h4>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {Math.round(confidence * 100)}% Confidence
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Calibrated with living wage standards, raw materials, and live ONDC handicraft benchmarks
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-neutral-500 block uppercase tracking-wider">
            AI Recommended Fair Price
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-craft-green">
            {formatCurrency(effectiveSuggested)}
          </span>
        </div>
      </div>

      {/* Interactive Price Range & Dual Track */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-neutral-600">
          <button
            type="button"
            onClick={() => onPriceChange(minPrice)}
            className="hover:text-craft-terracotta transition-colors cursor-pointer"
          >
            Min: {formatCurrency(minPrice)}
          </button>
          
          <button
            type="button"
            onClick={handleApplyClick}
            className="text-craft-terracotta hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested: {formatCurrency(effectiveSuggested)}</span>
          </button>

          <button
            type="button"
            onClick={() => onPriceChange(maxPrice)}
            className="hover:text-craft-terracotta transition-colors cursor-pointer"
          >
            Max: {formatCurrency(maxPrice)}
          </button>
        </div>

        {/* Visual Dual-Marker Track */}
        <div className="relative h-6 bg-gradient-to-r from-amber-100 via-emerald-100 to-amber-100 rounded-full border border-neutral-200 shadow-inner flex items-center px-1">
          {/* AI Suggested Target Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-craft-gold rounded-full border-2 border-amber-900 shadow-sm -translate-x-1/2 z-10 pointer-events-none"
            style={{ left: `${suggestedPercent}%` }}
            title={`AI Suggested: ₹${effectiveSuggested}`}
          />

          {/* Current Artisan Price Indicator (Moving) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center transition-all duration-150"
            style={{ left: `${currentPercent}%` }}
          >
            <div className="w-5 h-5 rounded-full bg-craft-green border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Interactive Slider Input */}
        <input
          type="range"
          min={minRange}
          max={maxRange}
          step="50"
          value={currentPrice}
          onChange={(e) => onPriceChange(Number(e.target.value) || minPrice)}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-ew-resize accent-craft-green"
          aria-label="Adjust craft price slider"
        />

        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>High Volume Wholesale</span>
          <span>Optimal Fair Living Wage</span>
          <span>Premium Boutique Retail</span>
        </div>
      </div>

      {/* Artisan Final Decision Input & Quick Action Chips */}
      <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900 block">
                Your Final Listing Price
              </span>
              {isAtSuggested ? (
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                  <Check className="w-3 h-3 text-emerald-700" />
                  AI Suggested Match
                </span>
              ) : currentPrice > effectiveSuggested ? (
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  +₹{(currentPrice - effectiveSuggested).toLocaleString("en-IN")} above suggested
                </span>
              ) : (
                <span className="text-[11px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                  -₹{(effectiveSuggested - currentPrice).toLocaleString("en-IN")} below suggested
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-500 block mt-0.5">
              You hold complete pricing authority. The AI never locks or enforces your valuation.
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl font-serif font-bold text-craft-green">₹</span>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => onPriceChange(Number(e.target.value) || 0)}
              className="w-32 text-xl font-extrabold text-neutral-900 bg-white px-3.5 py-2 rounded-xl border-2 border-craft-green/40 focus:border-craft-green focus:ring-0 text-center shadow-xs"
              step="50"
              min="50"
            />
            <button
              type="button"
              onClick={handleApplyClick}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                isAtSuggested
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-craft-green hover:bg-craft-green-dark text-white shadow"
              }`}
            >
              {isAtSuggested ? (
                <>
                  <Check className="w-3.5 h-3.5 text-craft-gold" />
                  <span>Applied ✓</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-craft-gold" />
                  <span>Apply Suggested (₹{effectiveSuggested.toLocaleString("en-IN")})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1-Click Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60 text-xs">
          <span className="font-semibold text-neutral-600 text-[11px]">Quick Presets:</span>
          <button
            type="button"
            onClick={() => onPriceChange(minPrice)}
            className="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium cursor-pointer"
          >
            Min (₹{minPrice})
          </button>
          <button
            type="button"
            onClick={handleApplyClick}
            className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer transition-all ${
              isAtSuggested
                ? "bg-craft-green text-white border-craft-green shadow-2xs"
                : "bg-white border-amber-300 text-craft-terracotta hover:bg-amber-100"
            }`}
          >
            <Sparkles className="w-3 h-3 text-craft-gold" />
            <span>AI Suggested (₹{effectiveSuggested})</span>
          </button>
          <button
            type="button"
            onClick={() => onPriceChange(maxPrice)}
            className="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium cursor-pointer"
          >
            Max (₹{maxPrice})
          </button>
        </div>
      </div>

      {/* Factor Breakdown Accordion / Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
            Pricing Formulation Breakdown
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            Direct Artisan Payout: 100%
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {factors.map((f, idx) => (
            <div key={idx} className="bg-neutral-50/80 p-3.5 rounded-2xl border border-neutral-200/80 flex items-start gap-2.5 hover:bg-white transition-colors">
              <TrendingUp className="w-4 h-4 text-craft-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-neutral-800">{f.name}</span>
                  <span className="font-extrabold text-craft-green text-[11px]">{f.impact}</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

