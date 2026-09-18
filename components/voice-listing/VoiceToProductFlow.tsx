"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ExtractedProductDetails, Product, CraftCategory } from "@/types";
import { extractProductFromSpeech, buildImagePromptFromDetails } from "@/lib/voiceExtractionService";
import { generateCraftImage, GeneratedImageResult, getFallbackImage } from "@/lib/aiImageService";
import { calculatePricingBreakdown, calculatePricingForTargetPrice } from "@/lib/aiService";
import { VoiceRecorder } from "./VoiceRecorder";
import { ExtractedDetailsForm } from "./ExtractedDetailsForm";
import { ImageGenerationPreview } from "./ImageGenerationPreview";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Mic, 
  Edit3, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight,
  RotateCcw
} from "lucide-react";

type VoiceFlowStep = "SPEAK" | "EDIT_DETAILS" | "GENERATE_PREVIEW";

interface VoiceToProductFlowProps {
  onCancelToDirectUpload?: () => void;
}

export function VoiceToProductFlow({ onCancelToDirectUpload }: VoiceToProductFlowProps) {
  const router = useRouter();
  const { currentArtisan, addProduct, showToast } = useApp();
  const { language } = useLanguage();

  const [step, setStep] = useState<VoiceFlowStep>("SPEAK");
  const [transcript, setTranscript] = useState<string>("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en-IN");
  const [details, setDetails] = useState<ExtractedProductDetails | null>(null);
  
  // Image Generation State
  const [generatedResult, setGeneratedResult] = useState<GeneratedImageResult | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);

  // 1. Transcription completed from VoiceRecorder
  const handleTranscriptionComplete = (spokenText: string, lang: string) => {
    setTranscript(spokenText);
    setDetectedLanguage(lang);
    
    // Extract structured data from spoken transcript
    const extracted = extractProductFromSpeech(spokenText, lang);
    setDetails(extracted);
    setStep("EDIT_DETAILS");
  };

  // 2. Details confirmed/edited from ExtractedDetailsForm
  const handleProceedToImageGen = async (updatedDetails: ExtractedProductDetails) => {
    setDetails(updatedDetails);
    setStep("GENERATE_PREVIEW");
    setIsGeneratingImage(true);

    // Build prompt strictly from the LATEST edited attributes
    const prompt = buildImagePromptFromDetails(updatedDetails);
    
    try {
      const result = await generateCraftImage(prompt, Math.floor(Math.random() * 999999), updatedDetails);
      setGeneratedResult(result);
    } catch {
      showToast("Using matching studio photo while offline.", "info");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 3. Regenerate Image variation
  const handleRegenerate = async () => {
    if (!details) return;
    setIsGeneratingImage(true);
    const prompt = buildImagePromptFromDetails(details);
    const newSeed = Math.floor(Math.random() * 999999);
    const result = await generateCraftImage(prompt, newSeed, details);
    setGeneratedResult(result);
    setIsGeneratingImage(false);
    showToast("Generated new craft photo variation!", "success");
  };

  // 4. Return to edit details if needed
  const handleBackToEditDetails = () => {
    setStep("EDIT_DETAILS");
  };

  // 5. Use This Image & Create Listing Integration
  const handleUseThisImageAndCreateListing = (finalImageUrl?: string, studioBackground?: string) => {
    if (!details) return;

    const chosenImageUrl = finalImageUrl || generatedResult?.imageUrl || getFallbackImage(details);
    const targetPrice = details.price || 500;
    const pricing = calculatePricingForTargetPrice(details.productName, targetPrice);

    const newProduct: Product = {
      id: `prod-voice-${Date.now()}`,
      artisanId: currentArtisan.id,
      artisanName: currentArtisan.name,
      artisanLocation: details.origin 
        ? `${details.origin}, ${currentArtisan.state}`
        : `${currentArtisan.location}, ${currentArtisan.state}`,
      artisanPhone: currentArtisan.phone,
      name: details.productName,
      slug: details.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: (details.category as CraftCategory) || "Handicrafts",
      material: details.material || "Natural Craft Materials",
      description: details.description,
      culturalStory: details.origin 
        ? `Handcrafted by master artisan ${currentArtisan.name} following authentic ${details.origin} artisanal traditions.`
        : `Handcrafted with meticulous dedication by ${currentArtisan.name}.`,
      price: targetPrice,
      minPrice: pricing.minPrice,
      maxPrice: pricing.maxPrice,
      rawMaterialCost: pricing.rawMaterialCost,
      productionCost: pricing.productionCost,
      confidence: 0.95,
      currency: "INR",
      status: "PUBLISHED",
      tags: [
        details.craftType,
        details.color,
        details.material,
        details.category,
        "Voice-to-Product",
        "Handmade"
      ].filter(Boolean) as string[],
      originalImageUrl: chosenImageUrl,
      processedImageUrl: chosenImageUrl,
      studioBackground: studioBackground || "clean-white",
      dimensions: details.dimensions || "Standard Size",
      ondcReady: true,
      views: 1,
      enquiries: 0,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    // Save to AppContext
    addProduct(newProduct);

    // Celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#133E2B", "#C85A32", "#D4AF37", "#FFFFFF"],
      });
    } catch {
      // safe fallback
    }

    showToast(`Successfully created & published "${newProduct.name}"!`, "success");

    // Redirect to the newly created product view
    setTimeout(() => {
      router.push(`/product/${newProduct.id}`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* 5-Step Visual Flow Stepper Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs font-bold">
          
          <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            step === "SPEAK" 
              ? "bg-craft-green text-craft-gold shadow-xs" 
              : "bg-emerald-50 text-emerald-800"
          }`}>
            <Mic className="w-3.5 h-3.5" />
            <span>1. Speak</span>
          </div>

          <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            step === "EDIT_DETAILS" 
              ? "bg-craft-green text-craft-gold shadow-xs" 
              : details 
              ? "bg-emerald-50 text-emerald-800" 
              : "bg-neutral-50 text-neutral-400"
          }`}>
            <Edit3 className="w-3.5 h-3.5" />
            <span>2. Review & Edit</span>
          </div>

          <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            step === "GENERATE_PREVIEW" && isGeneratingImage
              ? "bg-craft-green text-craft-gold shadow-xs animate-pulse" 
              : generatedResult 
              ? "bg-emerald-50 text-emerald-800" 
              : "bg-neutral-50 text-neutral-400"
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Gen Image</span>
          </div>

          <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            step === "GENERATE_PREVIEW" && !isGeneratingImage
              ? "bg-craft-green text-craft-gold shadow-xs" 
              : generatedResult 
              ? "bg-emerald-50 text-emerald-800" 
              : "bg-neutral-50 text-neutral-400"
          }`}>
            <Eye className="w-3.5 h-3.5" />
            <span>4. Preview</span>
          </div>

          <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 bg-neutral-50 text-neutral-400`}>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>5. Add Listing</span>
          </div>

        </div>
      </div>

      {/* Step 1: Voice Recording */}
      {step === "SPEAK" && (
        <VoiceRecorder
          initialTranscript={transcript}
          onTranscriptionComplete={handleTranscriptionComplete}
        />
      )}

      {/* Step 2: Extracted Details Form */}
      {step === "EDIT_DETAILS" && details && (
        <ExtractedDetailsForm
          initialDetails={details}
          transcript={transcript}
          onBackToVoice={() => setStep("SPEAK")}
          onProceedToImageGen={handleProceedToImageGen}
        />
      )}

      {/* Step 3 & 4: Image Generation & Preview */}
      {step === "GENERATE_PREVIEW" && details && (
        <ImageGenerationPreview
          details={details}
          imageUrl={generatedResult?.imageUrl || ""}
          prompt={generatedResult?.prompt || buildImagePromptFromDetails(details)}
          isGenerating={isGeneratingImage}
          onRegenerate={handleRegenerate}
          onEditDetails={handleBackToEditDetails}
          onUseThisImage={handleUseThisImageAndCreateListing}
        />
      )}

    </div>
  );
}
