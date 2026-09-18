"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BeforeAfterSlider } from "@/components/ai/BeforeAfterSlider";
import { StudioBackgroundSelector } from "@/components/ai/StudioBackgroundSelector";
import { LiveCameraModal } from "@/components/ai/LiveCameraModal";
import { sampleCrafts } from "@/data/sampleCrafts";
import { processAIStudioImage } from "@/lib/aiService";
import { Sparkles, Camera, Check, Download, ArrowRight, Loader2, Upload } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AIStudioPage() {
  const { showToast } = useApp();
  const [selectedSample, setSelectedSample] = useState(sampleCrafts[0]);
  const [selectedPreset, setSelectedPreset] = useState("clean-white");
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedUrl, setEnhancedUrl] = useState(sampleCrafts[0].enhancedImageUrl);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleReprocess = async (presetId: string) => {
    setSelectedPreset(presetId);
    setIsProcessing(true);
    const res = await processAIStudioImage(selectedSample.rawImageUrl, presetId);
    setEnhancedUrl(res.processedUrl);
    setIsProcessing(false);
    showToast(
      presetId === "remove-bg"
        ? "✂️ Background removed! Craft isolated on transparent cutout with drop-shadow."
        : `Applied ${presetId.replace(/-/g, " ")} enhancement preset!`,
      "success"
    );
  };

  const handleCameraCapture = async (dataUrl: string, fileName: string) => {
    const customCraft = {
      id: "camera-capture",
      name: "Live Camera Craft",
      category: "Handicrafts",
      material: "Handcrafted Item",
      description: "Photo captured from live camera",
      culturalStory: "",
      tags: ["Camera", "Craft"],
      suggestedPrice: 750,
      rawMaterialCost: 200,
      rawImageUrl: dataUrl,
      enhancedImageUrl: dataUrl,
      voicePromptHi: "",
      voicePromptEn: "",
    };
    setSelectedSample(customCraft as any);
    setEnhancedUrl(dataUrl);
    showToast("Captured craft photo from camera! Processing enhancements...", "success");
    setIsProcessing(true);
    const res = await processAIStudioImage(dataUrl, selectedPreset);
    setEnhancedUrl(res.processedUrl);
    setIsProcessing(false);
  };

  const handleSelectCraft = (craft: typeof sampleCrafts[0]) => {
    setSelectedSample(craft);
    setEnhancedUrl(craft.enhancedImageUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-craft-gold/30">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-craft-gold border border-craft-gold/30 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-craft-gold" />
            <span>Computer Vision & Image Enhancement Studio</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-craft-ivory">
            AI Product Studio
          </h1>
          <p className="text-xs sm:text-sm text-craft-cream/90">
            Transform raw, imperfect workshop snapshots into pristine, e-commerce grade product photography without needing DSLR equipment or photo studios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Slider */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Interactive Image Segmentation
            </h3>
            {isProcessing && (
              <span className="text-xs text-craft-terracotta font-bold flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Regenerating Lighting & Shadows...
              </span>
            )}
          </div>

          <BeforeAfterSlider
            originalImage={selectedSample.rawImageUrl}
            enhancedImage={enhancedUrl}
            studioPresetName={selectedPreset}
          />

          {/* Backdrop Presets */}
          <StudioBackgroundSelector
            selectedPreset={selectedPreset}
            onSelectPreset={handleReprocess}
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
            <button
              onClick={() => showToast("Enhanced image saved to asset gallery.", "success")}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download 1:1 HD Square</span>
            </button>

            <Link
              href="/create-product"
              className="bg-craft-green hover:bg-craft-green-light text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
            >
              <span>Use This in New Listing</span>
              <ArrowRight className="w-4 h-4 text-craft-gold" />
            </Link>
          </div>
        </div>

        {/* Right: Craft Samples & AI Pipeline Specs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Pick Sample or Upload */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-neutral-900">
                Select or Upload Craft
              </h4>
            </div>

            {/* Upload Own Photo Button */}
            <div>
              <input
                type="file"
                id="studio-file-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = reader.result as string;
                      const customCraft = {
                        id: "custom-upload",
                        name: file.name.replace(/\.[^/.]+$/, ""),
                        category: "Handicrafts",
                        material: "Custom Craft",
                        description: "Uploaded craft photo",
                        culturalStory: "",
                        tags: ["Uploaded", "Craft"],
                        suggestedPrice: 500,
                        rawMaterialCost: 150,
                        rawImageUrl: dataUrl,
                        enhancedImageUrl: dataUrl,
                        voicePromptHi: "",
                        voicePromptEn: "",
                      };
                      setSelectedSample(customCraft as any);
                      setEnhancedUrl(dataUrl);
                      showToast(`Loaded ${file.name} into AI Studio!`, "success");
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Open Live Camera</span>
                </button>

                <label
                  htmlFor="studio-file-upload"
                  className="py-2.5 px-3 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-neutral-500" />
                  <span>Upload File</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {sampleCrafts.map((craft) => (
                <button
                  key={craft.id}
                  onClick={() => handleSelectCraft(craft)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    selectedSample.id === craft.id
                      ? "bg-amber-50/70 border-craft-terracotta"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={craft.rawImageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-neutral-900 block truncate">{craft.name}</span>
                    <span className="text-[11px] text-neutral-500">{craft.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Operations Checklist (PRD Section 5.5) */}
          <div className="bg-craft-cream/60 rounded-3xl p-5 border border-craft-gold/30 space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-craft-green uppercase tracking-wider">
              Autonomous Studio Operations
            </h4>
            <div className="space-y-2 text-neutral-700">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-200">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Background Detection:</strong> AI detects cluttered workshop elements</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-200">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Lighting Enhancement:</strong> Balances exposure and eliminates hard shadows</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-200">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Geometric Centering:</strong> 1:1 square crop compliant with ONDC</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-200">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Subtle Ground Shadow:</strong> Realistic contact shadow for depth</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Live Camera Scanner Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        onFallbackUploadClick={() => document.getElementById("studio-file-upload")?.click()}
      />

    </div>
  );
}
