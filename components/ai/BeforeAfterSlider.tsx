"use client";

import React, { useState, useRef, useCallback } from "react";
import { Sparkles, Camera, Check, Scissors } from "lucide-react";
import { getFilterStyleForPreset } from "@/lib/aiService";

interface BeforeAfterSliderProps {
  originalImage: string;
  enhancedImage: string;
  studioPresetName?: string;
}

export function BeforeAfterSlider({
  originalImage,
  enhancedImage,
  studioPresetName = "clean-white",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isCutout, containerClass, overlayClass, badgeLabel, filter } = getFilterStyleForPreset(studioPresetName);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className={`relative w-full aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-2 border-craft-green/10 cursor-ew-resize group ${containerClass} transition-colors duration-300`}
      >
        {/* ENHANCED IMAGE (Base) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={enhancedImage}
          alt="AI Studio Enhanced"
          style={{
            filter: filter,
            transform: "translateZ(0)",
          }}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
        />

        {/* Studio backdrop lighting glow overlay */}
        <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />

        {/* Enhanced Label */}
        <div className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border ${
          isCutout
            ? "bg-rose-600/90 border-rose-300 text-white"
            : "bg-craft-green/90 text-white border-craft-gold/40"
        }`}>
          {isCutout ? <Scissors className="w-3.5 h-3.5 text-white" /> : <Sparkles className="w-3.5 h-3.5 text-craft-gold" />}
          <span>{badgeLabel}</span>
        </div>

        {/* ORIGINAL IMAGE (Clipped with GPU-accelerated clipPath - zero blur or distortion) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            transform: "translateZ(0)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalImage}
            alt="Original Raw Craft Photo"
            className="absolute inset-0 w-full h-full object-cover filter contrast-90 brightness-95"
            style={{ transform: "translateZ(0)" }}
          />
          {/* Workshop raw photo tint overlay */}
          <div className="absolute inset-0 bg-amber-950/15 pointer-events-none" />

          {/* Original Label */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/75 text-craft-cream text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            <Camera className="w-3.5 h-3.5 text-craft-terracotta-light" />
            <span>Raw Photo (Workshop)</span>
          </div>
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Center Draggable Knob */}
          <div className="w-9 h-9 rounded-full bg-craft-terracotta border-2 border-white shadow-xl flex items-center justify-center text-white text-xs group-hover:scale-110 transition-transform">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                transform="rotate(90 12 12)"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-white">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{isCutout ? "Transparent Cutout Active" : "Background Enhanced"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-white">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{isCutout ? "Anti-Aliased Edges" : "Pro Studio Lighting"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-white">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>ONDC 1:1 Compliant</span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-neutral-500 italic">
        Drag slider left or right to compare raw photo with AI studio processing
      </div>
    </div>
  );
}
