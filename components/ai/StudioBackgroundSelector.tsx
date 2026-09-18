"use client";

import React, { useState } from "react";
import { STUDIO_PRESETS, StudioPreset } from "@/lib/aiService";
import { 
  Check, 
  Scissors, 
  Sparkles, 
  Flame, 
  Landmark, 
  TreePine, 
  Palette, 
  SunMedium, 
  Leaf, 
  Sun, 
  Zap,
  Layers,
  Wand2
} from "lucide-react";

interface StudioBackgroundSelectorProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
  compact?: boolean;
}

export function StudioBackgroundSelector({
  selectedPreset,
  onSelectPreset,
  compact = false,
}: StudioBackgroundSelectorProps) {
  const [activeTab, setActiveTab] = useState<"all" | "removal" | "backdrop" | "enhancement">("all");

  const filteredPresets = STUDIO_PRESETS.filter((p) => {
    if (activeTab === "all") return true;
    return p.category === activeTab;
  });

  const getPresetIcon = (id: string) => {
    switch (id) {
      case "remove-bg":
        return <Scissors className="w-4 h-4 text-rose-600" />;
      case "clean-white":
        return <Sparkles className="w-4 h-4 text-neutral-800" />;
      case "warm-terracotta":
        return <Flame className="w-4 h-4 text-craft-terracotta" />;
      case "marble-craft":
        return <Landmark className="w-4 h-4 text-slate-700" />;
      case "natural-wood":
        return <TreePine className="w-4 h-4 text-amber-800" />;
      case "vibrant-heritage":
        return <Palette className="w-4 h-4 text-pink-600" />;
      case "luxury-spotlight":
        return <SunMedium className="w-4 h-4 text-amber-400" />;
      case "minimal-pastel":
        return <Leaf className="w-4 h-4 text-emerald-700" />;
      case "golden-hour":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "ultra-sharp":
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <Wand2 className="w-4 h-4 text-craft-green" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-craft-terracotta" />
            <span>AI Studio Filters & Backgrounds ({STUDIO_PRESETS.length})</span>
          </label>
          <span className="text-[11px] text-neutral-500">
            One-click background removal, studio lighting & color grade presets
          </span>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-xl text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "all" ? "bg-white text-craft-green shadow-xs font-bold" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            All ({STUDIO_PRESETS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("removal")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "removal" ? "bg-rose-600 text-white shadow-xs font-bold" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Scissors className="w-3 h-3" />
            <span>Remove BG</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("backdrop")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "backdrop" ? "bg-white text-craft-green shadow-xs font-bold" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Studio Sets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("enhancement")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "enhancement" ? "bg-white text-craft-green shadow-xs font-bold" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Lighting & Glow
          </button>
        </div>
      </div>

      {/* Grid of Preset Cards */}
      <div className={`grid gap-2.5 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
        {filteredPresets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          const isRemoval = preset.id === "remove-bg";

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={`relative flex flex-col items-start p-3 rounded-2xl border-2 text-left transition-all cursor-pointer group ${
                isSelected
                  ? isRemoval
                    ? "border-rose-500 bg-rose-50/60 shadow-md ring-2 ring-rose-200"
                    : "border-craft-terracotta bg-amber-50/70 shadow-md ring-2 ring-amber-200"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs"
              }`}
            >
              {isSelected && (
                <div className={`absolute top-2 right-2 w-5 h-5 rounded-full text-white flex items-center justify-center shadow-xs ${
                  isRemoval ? "bg-rose-600" : "bg-craft-terracotta"
                }`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Swatch & Icon Header */}
              <div className="flex items-center gap-2 w-full mb-1.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${preset.previewBg}`}>
                  {getPresetIcon(preset.id)}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  isRemoval
                    ? "bg-rose-100 text-rose-800"
                    : "bg-neutral-100 text-neutral-600"
                }`}>
                  {preset.badge}
                </span>
              </div>

              {/* Title & Description */}
              <span className={`text-xs font-bold leading-tight ${isSelected ? (isRemoval ? "text-rose-900" : "text-neutral-900") : "text-neutral-800"}`}>
                {preset.name}
              </span>
              
              {!compact && (
                <span className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-snug">
                  {preset.description}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Background Removal Explanatory Callout */}
      {selectedPreset === "remove-bg" && (
        <div className="bg-rose-50/80 rounded-xl p-3 border border-rose-200 text-xs text-rose-950 flex items-center gap-2.5 animate-in fade-in duration-150">
          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block">✂️ AI Background Removal Filter Active</span>
            <span className="text-[11px] text-rose-800">
              Workshop backgrounds, distracting shadows, and surfaces are extracted with smooth anti-aliased edge masking. Perfect for transparent PNG e-commerce listings.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
