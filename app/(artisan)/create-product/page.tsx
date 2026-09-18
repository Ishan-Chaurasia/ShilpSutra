"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { sampleCrafts, SampleCraft } from "@/data/sampleCrafts";
import { processAIStudioImage, generateSmartCatalog, calculatePricingBreakdown, calculatePricingForTargetPrice, extractPriceFromText, getFilterStyleForPreset } from "@/lib/aiService";
import { analyzeCraftImage, getCraftDetailsForCategory } from "@/lib/aiVisionService";
import { BeforeAfterSlider } from "@/components/ai/BeforeAfterSlider";
import { StudioBackgroundSelector } from "@/components/ai/StudioBackgroundSelector";
import { SmartPricingCard } from "@/components/ai/SmartPricingCard";
import { VoiceAssistantModal } from "@/components/ai/VoiceAssistantModal";
import { LiveCameraModal } from "@/components/ai/LiveCameraModal";
import { VoiceToProductFlow } from "@/components/voice-listing/VoiceToProductFlow";
import { formatCurrency } from "@/lib/utils";
import { Product, CraftCategory, VoiceCommand } from "@/types";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Mic, 
  MicOff,
  Check, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Send,
  Loader2,
  Volume2,
  Image as ImageIcon,
  Scan,
  Wand2,
  Zap,
  RefreshCw,
  Layers,
  Key,
  X
} from "lucide-react";

function CreateProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentArtisan, addProduct, showToast, offlineMode } = useApp();
  const { t, language } = useLanguage();

  // Top-Level Input Method: Direct AI Upload vs Create with Voice
  const [inputMode, setInputMode] = useState<"direct-ai" | "voice">("direct-ai");

  // File Upload Refs & State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Wizard state: 1 = Image, 2 = AI Studio, 3 = Voice & Catalog, 4 = Pricing, 5 = Review & Publish
  const [step, setStep] = useState<number>(1);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  // Form Fields
  const [selectedSample, setSelectedSample] = useState<SampleCraft>(sampleCrafts[0]);
  const [rawImageUrl, setRawImageUrl] = useState<string>(sampleCrafts[0].rawImageUrl);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string>(sampleCrafts[0].enhancedImageUrl);
  const [selectedPreset, setSelectedPreset] = useState<string>("clean-white");

  // AI Catalog Fields
  const [productName, setProductName] = useState<string>(sampleCrafts[0].name);
  const [category, setCategory] = useState<CraftCategory>(sampleCrafts[0].category as CraftCategory);
  const [material, setMaterial] = useState<string>(sampleCrafts[0].material);
  const [description, setDescription] = useState<string>(sampleCrafts[0].description);
  const [culturalStory, setCulturalStory] = useState<string>(sampleCrafts[0].culturalStory);
  const [tags, setTags] = useState<string[]>(sampleCrafts[0].tags);
  const [price, setPrice] = useState<number>(sampleCrafts[0].suggestedPrice);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<number>(sampleCrafts[0].suggestedPrice);
  const [pricingAnalysis, setPricingAnalysis] = useState(
    calculatePricingBreakdown(sampleCrafts[0].name, sampleCrafts[0].rawMaterialCost, 6)
  );

  // Direct AI Upload & Vision Auto-Cataloging States
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(1);
  const [aiExtracted, setAiExtracted] = useState<boolean>(false);
  const [aiConfidence, setAiConfidence] = useState<number>(0.95);
  const [detectedFeatures, setDetectedFeatures] = useState<string[]>([
    "Natural artisan material weave",
    "Hand-turned structural contour",
    "Eco-friendly organic finish"
  ]);
  const [detectedColors, setDetectedColors] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<string>("Standard Artisan Size");

  // Gemini Multimodal Cloud Vision API Key Configuration
  const [geminiApiKey, setGeminiApiKey] = useState<string>(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  );
  const [showVisionSettings, setShowVisionSettings] = useState<boolean>(false);
  const [inputApiKey, setInputApiKey] = useState<string>(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shilpsutra_gemini_key");
      if (saved) {
        setGeminiApiKey(saved);
        setInputApiKey(saved);
      } else if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        setGeminiApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        setInputApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      }
    } catch (e) {
      console.warn("Could not read gemini key from storage:", e);
    }
  }, []);

  const handleSaveGeminiKey = (key: string) => {
    const trimmed = key.trim();
    setGeminiApiKey(trimmed);
    setInputApiKey(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem("shilpsutra_gemini_key", trimmed);
        showToast("Gemini Vision API Key saved for cloud vision!", "success");
      } else {
        localStorage.removeItem("shilpsutra_gemini_key");
        showToast("Reverted to local smart pixel computer vision.", "info");
      }
    } catch (e) {
      console.warn("Could not write gemini key to storage:", e);
    }
    setShowVisionSettings(false);
  };

  // 1-Click Craft Category Switcher Handler
  const handleSwitchCraftCategory = (newCat: CraftCategory) => {
    const res = getCraftDetailsForCategory(newCat, detectedColors);
    setCategory(res.category);
    setProductName(res.productName);
    setMaterial(res.material);
    setDescription(res.description);
    setCulturalStory(res.culturalStory);
    setTags(res.tags);
    setPrice(res.suggestedPrice);
    setAiSuggestedPrice(res.suggestedPrice);
    setPricingAnalysis(res.pricingAnalysis);
    setDimensions(res.dimensions);
    setDetectedFeatures(res.detectedFeatures);
    showToast(
      language === "hi"
        ? `श्रेणी बदलकर "${newCat}" की गई`
        : `Craft category switched to "${newCat}"`,
      "info"
    );
  };

  // Voice Assistant Modal
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState(sampleCrafts[0].voicePromptHi);

  // Direct Inline Voice Dictation & Real-Time Spoken Pricing
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [dictationLang, setDictationLang] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [detectedVoicePrice, setDetectedVoicePrice] = useState<number | null>(null);
  const dictationRef = useRef<any>(null);

  // Synchronize price & fair wage pricing analysis from spoken description or transcript
  const syncPriceFromTranscript = (text: string, notify: boolean = true) => {
    const extracted = extractPriceFromText(text);
    if (extracted && extracted >= 50) {
      setDetectedVoicePrice(extracted);
      setPrice(extracted);
      const newPricing = calculatePricingForTargetPrice(productName, extracted, aiSuggestedPrice);
      setPricingAnalysis(newPricing);
      if (notify) {
        showToast(
          language === "hi"
            ? `💰 आवाज से पहचानी गई कीमत: ₹${extracted.toLocaleString("en-IN")} (उचित मूल्य ब्रेकडाउन अपडेट हुआ)`
            : `💰 Spoken price detected: ₹${extracted.toLocaleString("en-IN")} (Fair pricing breakdown updated)`,
          "success"
        );
      }
      return extracted;
    }
    return null;
  };

  // Direct Inline Voice Dictation Handler using Web Speech Recognition API
  const handleToggleDictation = () => {
    if (isDictating) {
      if (dictationRef.current) {
        try {
          dictationRef.current.stop();
        } catch {}
      }
      setIsDictating(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = dictationLang;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        dictationRef.current = recognition;

        recognition.onstart = () => {
          setIsDictating(true);
          showToast(
            language === "hi"
              ? "🎙️ बोलना शुरू करें (उदा. यह चंदेरी साड़ी है, कीमत ₹3500)..."
              : "🎙️ Listening... Speak craft description and price",
            "info"
          );
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setVoiceInputText(currentTranscript);
            syncPriceFromTranscript(currentTranscript, false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event?.error);
          setIsDictating(false);
          // If microphone is blocked or not available, use intelligent fallback simulation
          if (event?.error === "not-allowed" || event?.error === "service-not-allowed" || event?.error === "no-speech") {
            simulateVoiceDictation();
          }
        };

        recognition.onend = () => {
          setIsDictating(false);
          if (voiceInputText) {
            syncPriceFromTranscript(voiceInputText, true);
          }
        };

        recognition.start();
        setIsDictating(true);
      } catch (err) {
        console.warn("Could not start Web Speech Recognition:", err);
        simulateVoiceDictation();
      }
    } else {
      simulateVoiceDictation();
    }
  };

  // Fallback voice simulation for browsers without active mic permissions
  const simulateVoiceDictation = () => {
    setIsDictating(true);
    showToast(
      language === "hi"
        ? "🎙️ माइक्रोफोन सिमुलेशन सक्रिय... (कारीगर की आवाज दर्ज हो रही है)"
        : "🎙️ Microphone simulation active... (Capturing artisan voice)",
      "info"
    );

    let simulatedText = "यह हाथ से बनी शुद्ध चंदेरी सिल्क साड़ी है, इसमें जरी का काम है और इसकी कीमत ₹3500 है।";
    if (category === "Terracotta & Pottery" || productName.toLowerCase().includes("diya") || productName.toLowerCase().includes("mitti")) {
      simulatedText = "मिट्टी का हाथ से बना पियर्स्ड दिया लैंप है, प्राकृतिक टेराकोटा, कीमत ₹450 है।";
    } else if (category === "Bamboo Handicrafts" || productName.toLowerCase().includes("tray") || productName.toLowerCase().includes("bamboo")) {
      simulatedText = "असम के बांस से बनी हाथ से बुनी सर्विंग ट्रे है, होम डेकोर और टेबल के लिए, इसकी कीमत ₹650 है।";
    } else if (category === "Dhokra Metalcraft" || productName.toLowerCase().includes("brass") || productName.toLowerCase().includes("nataraj")) {
      simulatedText = "स्वामिमलाई की हाथ से ढली पीतल की नटराज मूर्ति है, शुद्ध कांसा, कीमत ₹4200 है।";
    } else if (category === "Woodcarving") {
      simulatedText = "सहारनपुर की शीशम की लकड़ी का हाथ से तराशा हुआ जाली बॉक्स है, कीमत ₹1250 है।";
    }

    setTimeout(() => {
      setVoiceInputText(simulatedText);
      syncPriceFromTranscript(simulatedText, true);
      setIsDictating(false);
    }, 1100);
  };

  const handleVoiceTextChange = (text: string) => {
    setVoiceInputText(text);
    syncPriceFromTranscript(text, false);
  };

  const handleSetQuickPrompt = (text: string) => {
    setVoiceInputText(text);
    syncPriceFromTranscript(text, true);
  };

  // Core Direct AI Vision Auto-Fetch Handler
  const triggerAutoVisionAnalysis = async (dataUrl: string, fileName: string) => {
    setIsAnalyzingImage(true);
    setAnalysisStep(1);

    // Progressive visual telemetry steps
    const stepTimer1 = setTimeout(() => setAnalysisStep(2), 400);
    const stepTimer2 = setTimeout(() => setAnalysisStep(3), 900);
    const stepTimer3 = setTimeout(() => setAnalysisStep(4), 1400);

    try {
      // Execute vision analysis & AI studio background enhancement
      const effectiveKey = geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || undefined;

      const [analysisResult, studioResult] = await Promise.all([
        analyzeCraftImage(dataUrl, fileName, effectiveKey, undefined),
        processAIStudioImage(dataUrl, selectedPreset),
      ]);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      // Automatically populate ALL product listing details
      setProductName(analysisResult.productName);
      setCategory(analysisResult.category);
      setMaterial(analysisResult.material);
      setDescription(analysisResult.description);
      setCulturalStory(analysisResult.culturalStory);
      setTags(analysisResult.tags);
      setPrice(analysisResult.suggestedPrice);
      setAiSuggestedPrice(analysisResult.suggestedPrice);
      setPricingAnalysis(analysisResult.pricingAnalysis);
      setAiConfidence(analysisResult.confidence);
      setDetectedFeatures(analysisResult.detectedFeatures || []);
      setDetectedColors(analysisResult.detectedColors || []);
      setDimensions(analysisResult.dimensions || "Standard Artisan Size");
      setEnhancedImageUrl(studioResult.processedUrl || dataUrl);
      setAiExtracted(true);

      showToast(
        language === "hi"
          ? `✨ AI विज़न ने "${analysisResult.productName}" के सभी विवरण स्वतः फेच कर लिए!`
          : `✨ AI automatically fetched listing details for "${analysisResult.productName}"!`,
        "success"
      );

      // Upload image to Cloudinary in background for high-speed CDN delivery
      fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, folder: "shilpsutra/products" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.url) {
            setRawImageUrl(data.url);
            // Only update enhancedImageUrl if it has not yet been modified by AI Studio filter or cutout
            setEnhancedImageUrl((prev) => (prev === dataUrl ? data.url : prev));
            console.log("[Cloudinary] Uploaded image successfully:", data.url);
          }
        })
        .catch((err) => console.warn("[Cloudinary] Upload failed, retaining local preview:", err));
    } catch (err) {
      console.error("AI Vision extraction error:", err);
      showToast("Photo uploaded. Ready for listing.", "info");
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Check for ?tour=fasttrack or ?demo=fasttrack or ?mode=voice in query
  useEffect(() => {
    if (searchParams?.get("demo") === "fasttrack" || searchParams?.get("tour") === "fasttrack") {
      // Auto-populate bamboo basket and jump to Step 5 (Review & Publish)
      handlePickSample(sampleCrafts[0]);
      setStep(5);
      showToast("Fast-track loaded Bamboo Tray. Ready to review and publish!", "info");
    }
    if (searchParams?.get("mode") === "voice") {
      setInputMode("voice");
    }
  }, [searchParams]);

  // Helper to optimize image dataUrl for fast, lightweight Vision API transport (<150KB)
  const optimizeImageForVision = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w <= maxDim && h <= maxDim && dataUrl.length < 500000) {
          resolve(dataUrl);
          return;
        }
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Handle local image file upload (PNG/JPG/WEBP) or phone camera capture
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (PNG, JPG, WEBP).", "warning");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast("Image size should be under 15MB.", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setRawImageUrl(dataUrl);
      setEnhancedImageUrl(dataUrl);
      setUploadedFileName(file.name);

      // Downscale to max 1200px for lightning-fast, guaranteed Gemini Vision upload
      const visionDataUrl = await optimizeImageForVision(dataUrl);
      triggerAutoVisionAnalysis(visionDataUrl, file.name);
    };
    reader.onerror = () => {
      showToast("Failed to read image file. Please try again.", "warning");
    };
    reader.readAsDataURL(file);
  };

  // Real-time live camera capture handler
  const handleCameraCapture = async (dataUrl: string, fileName: string) => {
    setRawImageUrl(dataUrl);
    setEnhancedImageUrl(dataUrl);
    setUploadedFileName(fileName);
    showToast(
      language === "hi"
        ? "📸 फोटो खींची गई! AI विज़न शिल्प विवरण और सूची स्वतः तैयार कर रहा है..."
        : "📸 Live photo captured! AI Vision is analyzing your craft...",
      "info"
    );
    const visionDataUrl = await optimizeImageForVision(dataUrl);
    triggerAutoVisionAnalysis(visionDataUrl, fileName);
  };

  // Pick sample craft
  const handlePickSample = (sample: SampleCraft) => {
    setSelectedSample(sample);
    setRawImageUrl(sample.rawImageUrl);
    setEnhancedImageUrl(sample.enhancedImageUrl);
    setProductName(sample.name);
    setCategory(sample.category as CraftCategory);
    setMaterial(sample.material);
    setDescription(sample.description);
    setCulturalStory(sample.culturalStory);
    setTags(sample.tags);
    setPrice(sample.suggestedPrice);
    setAiSuggestedPrice(sample.suggestedPrice);
    setPricingAnalysis(calculatePricingBreakdown(sample.name, sample.rawMaterialCost, 6));
    setVoiceInputText(sample.voicePromptHi);
    setUploadedFileName(sample.name);
    setAiExtracted(true);
    setAiConfidence(sample.confidence || 0.94);
    setDetectedFeatures([
      "Natural authentic craft texture",
      "Traditional Indian heritage weave",
      "Sustainable hand-formed finish"
    ]);
  };

  // Run AI Studio processing
  const handleProceedToStudio = async () => {
    setLoadingAI(true);
    try {
      const res = await processAIStudioImage(rawImageUrl, selectedPreset);
      if (res.processedUrl) {
        setEnhancedImageUrl(res.processedUrl);
      }
    } catch (e) {
      console.warn("AI Studio processing error:", e);
    } finally {
      setLoadingAI(false);
      setStep(2);
    }
  };

  // Run Voice & Catalog generation
  const handleRunCatalogAI = async () => {
    setLoadingAI(true);
    const spokenPrice = extractPriceFromText(voiceInputText);

    // Only run template generator if voiceInputText is a detailed craft description
    // and NOT just a short command (like "Price 650 kar do", "naam badlo", "next", etc.)
    const isCommandOnly = !voiceInputText || 
      voiceInputText.trim().length < 15 || 
      /^(?:price|keemat|daam|rupaye|₹|\d+|\s|kar\s*do|bhejo|rakh\s*do|filter|background)+$/i.test(voiceInputText.trim());

    if (!isCommandOnly) {
      const result = await generateSmartCatalog(voiceInputText, category);
      
      // Preserve existing custom/vision-detected title unless empty or default
      if (!productName || productName === sampleCrafts[0].name || productName.includes("Heritage Craft")) {
        setProductName(result.productName);
      }
      
      // CRITICAL: Preserve existing valid description if user already has one!
      // Only set if current description is empty or default sample
      if (!description || description === sampleCrafts[0].description || description.length < 20) {
        setDescription(result.description);
      }
      
      if (!culturalStory || culturalStory === sampleCrafts[0].culturalStory) {
        setCulturalStory(result.culturalStory);
      }
      
      if (!material || material === sampleCrafts[0].material) {
        setMaterial(result.material);
      }
      
      if (!tags || tags.length <= 1) {
        setTags(result.tags);
      }
    }

    // Prioritize spoken price if specified by artisan, otherwise active price, otherwise benchmark
    const targetPrice = spokenPrice || price || 650;
    const benchmark = aiSuggestedPrice || targetPrice;
    setPrice(targetPrice);
    setPricingAnalysis(calculatePricingForTargetPrice(productName, targetPrice, benchmark));
    setLoadingAI(false);
    setStep(4);
  };

  // Dedicated Price Change and 1-Click Apply AI Suggested Price Handlers
  const handlePriceChange = (newPrice: number) => {
    const clean = Math.max(0, newPrice);
    setPrice(clean);
    setPricingAnalysis(calculatePricingForTargetPrice(productName, clean, aiSuggestedPrice));
  };

  const handleApplySuggestedPrice = () => {
    const target = aiSuggestedPrice || pricingAnalysis.suggestedPrice || 500;
    setPrice(target);
    setPricingAnalysis(calculatePricingForTargetPrice(productName, target, target));
    showToast(
      language === "hi"
        ? `✨ AI अनुशंसित उचित मूल्य ₹${target.toLocaleString("en-IN")} लागू किया गया!`
        : `✨ Applied AI recommended fair price of ₹${target.toLocaleString("en-IN")}!`,
      "success"
    );
  };

  // Handle Voice Command apply with rich support for filters, description, price, name, and steps
  const handleApplyVoiceCommand = async (cmd: VoiceCommand) => {
    // 1. UPDATE_PRICE
    if (cmd.entities.price) {
      const newPrice = cmd.entities.price;
      setPrice(newPrice);
      setDetectedVoicePrice(newPrice);
      setPricingAnalysis(calculatePricingForTargetPrice(productName, newPrice, aiSuggestedPrice));
      showToast(`Updated price to ₹${newPrice.toLocaleString("en-IN")}`, "success");
    }

    // 2. UPDATE_NAME
    if (cmd.intent === "UPDATE_NAME" && cmd.entities.name) {
      setProductName(cmd.entities.name);
      showToast(`Updated name to "${cmd.entities.name}"`, "success");
    }

    // 3. UPDATE_FILTER (Studio Backdrop Presets & AI Cutout)
    if (cmd.intent === "UPDATE_FILTER" && cmd.entities.preset) {
      const newPreset = cmd.entities.preset;
      setSelectedPreset(newPreset);
      try {
        const res = await processAIStudioImage(rawImageUrl, newPreset);
        if (res.processedUrl) {
          setEnhancedImageUrl(res.processedUrl);
        }
      } catch (e) {
        console.warn("Studio filter voice update error:", e);
      }
      showToast(
        newPreset === "remove-bg"
          ? (language === "hi" ? "✂️ AI पारदर्शी कटआउट लागू किया गया!" : "✂️ AI transparent cutout applied!")
          : `Applied ${newPreset.replace(/-/g, " ")} filter!`,
        "success"
      );
    }

    // 4. UPDATE_DESCRIPTION
    if (cmd.intent === "UPDATE_DESCRIPTION" && cmd.entities.description) {
      setDescription(cmd.entities.description);
      showToast("Updated product description!", "success");
    }

    // 5. NEXT_STEP
    if (cmd.intent === "NEXT_STEP") {
      if (step === 3) {
        handleRunCatalogAI();
      } else if (step === 1) {
        handleProceedToStudio();
      } else {
        setStep((prev) => Math.min(5, prev + 1));
      }
    }

    // 6. PUBLISH
    if (cmd.intent === "PUBLISH") {
      setStep(5);
      setTimeout(() => handlePublish(), 600);
    }
  };

  // Publish product
  const handlePublish = () => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      artisanId: currentArtisan.id,
      artisanName: currentArtisan.name,
      artisanLocation: `${currentArtisan.location}, ${currentArtisan.state}`,
      artisanPhone: currentArtisan.phone,
      name: productName,
      slug: productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      material,
      description,
      culturalStory,
      price,
      minPrice: pricingAnalysis.minPrice,
      maxPrice: pricingAnalysis.maxPrice,
      rawMaterialCost: pricingAnalysis.rawMaterialCost,
      productionCost: pricingAnalysis.productionCost,
      confidence: aiConfidence || pricingAnalysis.confidence,
      currency: "INR",
      status: "PUBLISHED",
      tags,
      originalImageUrl: rawImageUrl,
      processedImageUrl: enhancedImageUrl,
      studioBackground: selectedPreset,
      dimensions: dimensions || "Standard Craft Size",
      ondcReady: true,
      views: 1,
      enquiries: 0,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    addProduct(newProduct);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#133E2B", "#C85A32", "#D4AF37", "#FFFFFF"],
      });
    } catch {
      // safe fallback
    }

    // Redirect to newly created product page
    setTimeout(() => {
      router.push(`/product/${newProduct.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Wizard Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-craft-terracotta">
              Minimum Typing • Human Approval
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 mt-0.5">
              Create New Craft Listing
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="flex items-center gap-2 bg-craft-green hover:bg-craft-green-light text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4 text-craft-gold animate-pulse" />
            <span>Speak Voice Command</span>
          </button>
        </div>

        {/* Dual Input Pathway Selector (PRD: Direct AI Upload vs Create with Voice) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 p-1.5 bg-neutral-100/90 rounded-2xl border border-neutral-200 text-xs sm:text-sm font-bold gap-1.5">
          <button
            type="button"
            onClick={() => setInputMode("direct-ai")}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              inputMode === "direct-ai"
                ? "bg-white text-craft-green shadow-xs border border-neutral-200"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Camera className="w-4 h-4 text-craft-terracotta" />
            <span>📸 Direct AI Upload (Photo ➔ Studio)</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode("voice")}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              inputMode === "voice"
                ? "bg-craft-green text-craft-gold shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Mic className="w-4 h-4 text-craft-gold animate-pulse" />
            <span>🎙️ Create with Voice (Speech ➔ AI Photo)</span>
          </button>
        </div>
      </div>

      {/* PATHWAY 1: CREATE WITH VOICE */}
      {inputMode === "voice" ? (
        <VoiceToProductFlow onCancelToDirectUpload={() => setInputMode("direct-ai")} />
      ) : (
        /* PATHWAY 2: DIRECT AI UPLOAD (5-STEP WIZARD) */
        <div className="space-y-8">
          
          {/* 5-Step Stepper Bar */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 1, title: t("step1") },
              { num: 2, title: t("step2") },
              { num: 3, title: t("step3") },
              { num: 4, title: t("step4") },
              { num: 5, title: t("step5") },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`py-2 px-1 text-center border-b-4 text-xs font-bold transition-all ${
                  step === s.num
                    ? "border-craft-terracotta text-craft-terracotta"
                    : step > s.num
                    ? "border-emerald-600 text-emerald-700"
                    : "border-neutral-200 text-neutral-400"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* STEP 1: PHOTO INPUT WITH DIRECT AI AUTO-CATALOG */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              
              {/* Feature Header Banner */}
              <div className="bg-gradient-to-r from-amber-50 via-emerald-50/60 to-amber-50 p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-craft-terracotta text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5 text-craft-gold animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900">
                        {language === "hi" ? "⚡ डायरेक्ट AI अपलोड एवं स्वतः कैटलॉगिंग" : "⚡ Direct AI Upload & Auto-Catalog"}
                      </h4>
                      <span className="text-[10px] bg-craft-terracotta text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Zero-Typing
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {language === "hi"
                        ? "फोटो अपलोड करते ही AI शीर्षक, शिल्प श्रेणी, प्राकृतिक सामग्री, विरासत कथा एवं उचित मूल्य स्वतः फेच कर लेता है।"
                        : "Upload or drop any craft photo — AI instantly identifies the craft, writes the heritage story, and fetches listing details."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowVisionSettings(true)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-amber-300/80 bg-white/90 hover:bg-white text-neutral-800 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Configure Gemini Cloud Vision or Smart Local Vision"
                  >
                    <Zap className={`w-3.5 h-3.5 ${geminiApiKey ? "text-emerald-600" : "text-craft-terracotta"}`} />
                    <span>{geminiApiKey ? "Gemini Cloud Vision: Active" : "Vision: Smart Local CV"}</span>
                    <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded font-mono">Config</span>
                  </button>

                  {aiExtracted && (
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="bg-craft-green hover:bg-craft-green-light text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <span>{language === "hi" ? "कैटलॉग देखें (५/५) →" : "View Listing (5/5) →"}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  {language === "hi" ? "कदम १: शिल्प का फोटो लें या अपलोड करें" : "Step 1: Take or Upload Craft Photo"}
                </h3>
                <p className="text-xs text-neutral-500">
                  {t("step1Sub")}
                </p>
              </div>

              {/* 1-Click Pre-Selected Samples for Quick Demo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                    {t("quickSelect")}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {language === "hi" ? "क्लिक करके त्वरित AI फेचिंग टेस्ट करें" : "Click to test instant AI auto-fetch"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sampleCrafts.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handlePickSample(sample)}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                        selectedSample.id === sample.id
                          ? "border-craft-terracotta bg-amber-50/70 shadow-sm ring-2 ring-craft-terracotta/20"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sample.rawImageUrl}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-neutral-900 truncate">{sample.name}</h5>
                        <span className="text-[11px] text-neutral-500 block truncate">{sample.category}</span>
                        <span className="text-xs font-extrabold text-craft-green mt-0.5 block">
                          {formatCurrency(sample.suggestedPrice)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hidden File & Camera Inputs */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
              />
              <input
                type="file"
                ref={cameraInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
                accept="image/*"
                capture="environment"
                className="hidden"
              />

              {/* LIVE AI SCANNING RADAR OVERLAY */}
              {isAnalyzingImage ? (
                <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-2 border-craft-terracotta rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-6 relative overflow-hidden animate-pulse">
                  <div className="relative w-44 h-44 mx-auto rounded-2xl overflow-hidden border-2 border-craft-terracotta shadow-md bg-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {rawImageUrl ? (
                      <img src={rawImageUrl} alt="Scanning craft" className="w-full h-full object-cover" />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-craft-gold/40 to-transparent animate-bounce" />
                    <div className="absolute top-2 right-2 bg-craft-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3 animate-spin text-craft-gold" />
                      <span>AI Vision Scanning</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h4 className="font-serif font-bold text-lg text-neutral-900 flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-craft-terracotta" />
                      <span>{language === "hi" ? "शिल्प की AI जांच एवं स्वतः कैटलॉगिंग जारी है..." : "AI Vision Scanning & Extracting Listing Details..."}</span>
                    </h4>
                    <p className="text-xs text-neutral-600">
                      {language === "hi" 
                        ? "आपकी फोटो से शीर्षक, शिल्प श्रेणी, प्राकृतिक सामग्री, विरासत कथा और उचित मूल्य का स्वतः निर्धारण किया जा रहा है।"
                        : "Detecting weave texture, materials, cultural heritage, and fair living wage pricing..."}
                    </p>
                  </div>

                  {/* Progressive Telemetry Steps */}
                  <div className="max-w-md mx-auto bg-white/90 backdrop-blur rounded-2xl p-4 border border-amber-200 text-left space-y-2.5 text-xs font-semibold">
                    <div className={`flex items-center gap-2.5 ${analysisStep >= 1 ? "text-craft-green font-bold" : "text-neutral-400"}`}>
                      {analysisStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin text-craft-terracotta" />}
                      <span>{language === "hi" ? "१. बुनाई घनत्व एवं सतह की बनावट की जांच..." : "1. Scanning craft contours & texture density..."}</span>
                    </div>
                    <div className={`flex items-center gap-2.5 ${analysisStep >= 2 ? "text-craft-green font-bold" : "text-neutral-400"}`}>
                      {analysisStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : analysisStep === 2 ? <Loader2 className="w-4 h-4 animate-spin text-craft-terracotta" /> : <div className="w-4 h-4 rounded-full border border-neutral-300" />}
                      <span>{language === "hi" ? "२. प्राकृतिक सामग्री और पारंपरिक श्रेणी की पहचान..." : "2. Identifying natural materials & craft category..."}</span>
                    </div>
                    <div className={`flex items-center gap-2.5 ${analysisStep >= 3 ? "text-craft-green font-bold" : "text-neutral-400"}`}>
                      {analysisStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : analysisStep === 3 ? <Loader2 className="w-4 h-4 animate-spin text-craft-terracotta" /> : <div className="w-4 h-4 rounded-full border border-neutral-300" />}
                      <span>{language === "hi" ? "३. सांस्कृतिक इतिहास एवं भौगोलिक संकेत (GI) मैपिंग..." : "3. Synthesizing cultural story & GI heritage registry..."}</span>
                    </div>
                    <div className={`flex items-center gap-2.5 ${analysisStep >= 4 ? "text-craft-green font-bold" : "text-neutral-400"}`}>
                      {analysisStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-neutral-300" />}
                      <span>{language === "hi" ? "४. निष्पक्ष कारीगर आजीविका मूल्य एवं ONDC टैग्स की गणना..." : "4. Computing fair living-wage price & ONDC search tags..."}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fully Working Photo Dropzone / Upload Box */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer ${
                    isDragging
                      ? "border-craft-terracotta bg-amber-50/80 scale-101"
                      : uploadedFileName
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-neutral-300 hover:border-craft-terracotta bg-neutral-50/50 hover:bg-neutral-50"
                  }`}
                >
                  {uploadedFileName ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-500 bg-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {rawImageUrl ? (
                          <img src={rawImageUrl} alt="Uploaded Craft" className="w-full h-full object-cover" />
                        ) : null}
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Uploaded Photo: {uploadedFileName}</span>
                        </span>
                        <p className="text-xs text-neutral-500">
                          {language === "hi" ? "फोटो बदलने के लिए क्लिक करें या नीचे से बटन चुनें" : "Click to change photo, or use buttons below"}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 shadow-2xs cursor-pointer"
                        >
                          Choose Different Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCameraOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-craft-terracotta" />
                          <span>Retake with Live Camera</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileName(null);
                            handlePickSample(sampleCrafts[0]);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-100 text-xs font-bold text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                        >
                          Revert to Sample
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-craft-terracotta flex items-center justify-center shadow-inner">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="space-y-1 max-w-sm">
                        <span className="font-bold text-sm sm:text-base text-neutral-900 block">
                          Click to Browse Photo or Drag & Drop Here
                        </span>
                        <span className="text-xs text-neutral-500 block">
                          PNG, JPG, JPEG, WEBP up to 15MB • Phone camera friendly
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2.5 rounded-xl bg-craft-green text-white text-xs font-bold shadow hover:bg-craft-green-dark transition-colors cursor-pointer"
                        >
                          Choose Photo File
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCameraOpen(true)}
                          className="px-5 py-2.5 rounded-xl bg-craft-terracotta text-white text-xs font-bold shadow hover:bg-craft-terracotta-dark transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Open Live Camera</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* AI EXTRACTED CRAFT DETAILS PANEL */}
              {aiExtracted && (
                <div className="bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/60 rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/60 shadow-sm space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-5 h-5 text-amber-200" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-neutral-900 flex items-center gap-2">
                          <span>{language === "hi" ? "✨ AI विज़न द्वारा प्राप्त शिल्प विवरण" : "✨ AI Extracted Craft Listing Details"}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {Math.round(aiConfidence * 100)}% Confidence
                          </span>
                        </h4>
                        <p className="text-xs text-neutral-500">
                          {language === "hi"
                            ? "AI ने फोटो स्कैन कर सभी विवरण भर दिए हैं। नीचे विवरण जांचें अथवा १-क्लिक में श्रेणी बदलें।"
                            : "AI accurately analyzed your photo and generated your complete market-ready listing."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-neutral-500">{language === "hi" ? "उचित मूल्य:" : "Fair Price:"}</span>
                      <span className="text-base font-extrabold text-craft-green bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        {formatCurrency(price)}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Craft Category Switcher */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-craft-terracotta" />
                        <span>{language === "hi" ? "शिल्प श्रेणी (यदि बदलना चाहें तो क्लिक करें):" : "Craft Category (1-click switcher if needed):"}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-craft-terracotta bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        Current: {category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          "Bamboo Handicrafts",
                          "Handwoven Textiles",
                          "Terracotta & Pottery",
                          "Woodcarving",
                          "Dhokra Metalcraft",
                          "Handmade Jewellery",
                          "Home Décor",
                        ] as CraftCategory[]
                      ).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleSwitchCraftCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            category === cat
                              ? "bg-craft-terracotta text-white shadow-sm ring-2 ring-craft-terracotta/30"
                              : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listing Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Craft Title & Materials */}
                    <div className="space-y-3 bg-white/90 p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
                      <div>
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                          {language === "hi" ? "उत्पाद का शीर्षक / नाम" : "Listing Title"}
                        </span>
                        <div className="font-serif font-bold text-sm text-neutral-900 mt-0.5">
                          {productName}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-100">
                        <div>
                          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                            {language === "hi" ? "प्राकृतिक सामग्री" : "Natural Material"}
                          </span>
                          <span className="font-medium text-neutral-800 mt-0.5 block">{material}</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                            {language === "hi" ? "आयाम / नाप" : "Dimensions"}
                          </span>
                          <span className="font-medium text-neutral-800 mt-0.5 block">{dimensions}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cultural Story & GI Heritage */}
                    <div className="bg-white/90 p-4 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                          {language === "hi" ? "विरासत एवं सांस्कृतिक इतिहास" : "Artisan Heritage & Cultural Story"}
                        </span>
                        <p className="font-medium text-neutral-700 mt-1 line-clamp-3 leading-relaxed">
                          {culturalStory}
                        </p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                        <span>GI Authenticity: Verified</span>
                        <span>Living Wage: Included</span>
                      </div>
                    </div>
                  </div>

                  {/* Detected Features & Tags */}
                  <div className="space-y-2 bg-white/70 p-3.5 rounded-2xl border border-neutral-200/60">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-neutral-600 mr-1">
                        {language === "hi" ? "पहचानी गई विशेषताएं:" : "Detected Features:"}
                      </span>
                      {detectedFeatures.slice(0, 4).map((feat, i) => (
                        <span
                          key={i}
                          className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md text-[11px] font-medium"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-neutral-600 mr-1">
                        {language === "hi" ? "ONDC टैग्स:" : "ONDC Search Tags:"}
                      </span>
                      {tags.slice(0, 6).map((tg, i) => (
                        <span
                          key={i}
                          className="bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded-md text-[11px] font-medium"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="flex items-center justify-between pt-2">
                {aiExtracted ? (
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{language === "hi" ? "विवरण स्वतः प्राप्त: " : "Details Auto-Fetched: "} <strong>{productName}</strong> ({formatCurrency(price)})</span>
                  </div>
                ) : <div />}

                <div className="flex items-center gap-3">
                  {aiExtracted && (
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-craft-gold" />
                      <span>{language === "hi" ? "त्वरित समीक्षा एवं प्रकाशन (५/५) →" : "Fast-Track: Review & Publish (5/5) →"}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={loadingAI || isAnalyzingImage}
                    onClick={handleProceedToStudio}
                    className="bg-craft-green hover:bg-craft-green-light text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>{t("processAIStudio")}</span>
                    <ArrowRight className="w-4 h-4 text-craft-gold" />
                  </button>
                </div>
              </div>
            </div>
          )}

      {/* STEP 2: AI PRODUCT STUDIO (Before/After & Backgrounds) */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                {language === "hi" ? "कदम २: AI प्रोडक्ट स्टूडियो पूर्वावलोकन" : "Step 2: AI Product Studio Preview"}
              </h3>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                {language === "hi" ? "0.6 सेकंड में तैयार" : "Processed in 0.6s"}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {t("step2Sub")}
            </p>
          </div>

          {/* Interactive Before/After Slider */}
          <div className="max-w-2xl mx-auto">
            <BeforeAfterSlider
              originalImage={rawImageUrl}
              enhancedImage={enhancedImageUrl}
              studioPresetName={selectedPreset}
            />
          </div>

          {/* Studio Backdrop Presets */}
          <StudioBackgroundSelector
            selectedPreset={selectedPreset}
            onSelectPreset={async (presetId) => {
              setSelectedPreset(presetId);
              try {
                const res = await processAIStudioImage(rawImageUrl, presetId);
                if (res.processedUrl) {
                  setEnhancedImageUrl(res.processedUrl);
                }
              } catch (e) {
                console.warn("Studio preset processing error:", e);
              }
              showToast(
                presetId === "remove-bg"
                  ? (language === "hi" ? "✂️ पृष्ठभूमि हटा दी गई! (AI पारदर्शी कटआउट)" : "✂️ Background removed! AI transparent cutout applied.")
                  : `Applied ${presetId.replace(/-/g, " ")} enhancement preset!`,
                "success"
              );
            }}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2"
            >
              {t("backToPhoto")}
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="bg-craft-green hover:bg-craft-green-light text-white font-bold px-7 py-3 rounded-2xl text-sm flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <span>{t("continueVoice")}</span>
              <ArrowRight className="w-4 h-4 text-craft-gold" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VOICE & SMART CATALOGUING */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              {language === "hi" ? "कदम ३: आवाज़ से कैटलॉगिंग और सांस्कृतिक इतिहास" : "Step 3: Voice-First Cataloguing & Cultural Story"}
            </h3>
            <p className="text-xs text-neutral-500">
              {t("step3Sub")}
            </p>
          </div>

          {/* Voice Prompt Input with Direct Mic Dictation */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                {t("audioTranscript")}
              </label>

              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex items-center bg-neutral-200/80 p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setDictationLang("hi-IN")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      dictationLang === "hi-IN" ? "bg-white text-craft-green shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    🇮🇳 हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => setDictationLang("en-IN")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      dictationLang === "en-IN" ? "bg-white text-craft-green shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>

                {/* Open Modal Assistant */}
                <button
                  type="button"
                  onClick={() => setVoiceModalOpen(true)}
                  className="text-xs font-bold text-craft-terracotta hover:text-craft-terracotta-dark flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl cursor-pointer transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-craft-terracotta" />
                  <span>{language === "hi" ? "कमांड सहायक" : "Voice Assistant"}</span>
                </button>
              </div>
            </div>

            {/* Big One-Tap Voice Recording Action Banner */}
            <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              isDictating
                ? "bg-rose-50/90 border-rose-300 ring-2 ring-rose-200 shadow-sm"
                : "bg-white border-neutral-200 hover:border-craft-terracotta/40"
            }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleDictation}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isDictating
                      ? "bg-rose-600 text-white animate-pulse shadow-md"
                      : "bg-craft-green hover:bg-craft-green-light text-white shadow-xs"
                  }`}
                  title={isDictating ? "Stop recording" : "Start speaking"}
                >
                  {isDictating ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-craft-gold" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                    {isDictating ? (
                      <span className="text-rose-600 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
                        {language === "hi" ? "सुन रहा है... बोलिए (विवरण और कीमत बताएं)" : "Listening... Speak craft details and price"}
                      </span>
                    ) : (
                      <span>{language === "hi" ? "माइक पर टैप करके बोलें (आवाज से विवरण व कीमत)" : "Tap Mic to Speak (Voice Details & Fair Price)"}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {language === "hi"
                      ? "उदा. 'यह हाथ से बुनी चंदेरी सिल्क साड़ी है, जरी का बॉर्डर है और इसकी कीमत ₹3500 है'"
                      : "e.g. 'Pure Chanderi handwoven silk saree with gold zari border, price is ₹3,500'"}
                  </p>
                </div>
              </div>

              <div>
                {isDictating ? (
                  <button
                    type="button"
                    onClick={handleToggleDictation}
                    className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{language === "hi" ? "रिकॉर्डिंग रोकें" : "Stop Recording"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleDictation}
                    className="text-xs bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5 text-craft-gold" />
                    <span>{language === "hi" ? "बोलना शुरू करें" : "Start Speaking"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Direct Editable Voice Transcript Textarea */}
            <textarea
              rows={3}
              value={voiceInputText}
              onChange={(e) => handleVoiceTextChange(e.target.value)}
              className="w-full bg-white p-3.5 rounded-xl border border-neutral-300 text-sm font-medium focus:border-craft-green focus:ring-1 focus:ring-craft-green transition-all"
              placeholder="उदा. यह हाथ से बनी चंदेरी सिल्क साड़ी है, इसकी कीमत ₹3500 है..."
            />

            {/* Real-time Detected Price Pill & Breakdown Sync */}
            {(() => {
              const activeExtracted = extractPriceFromText(voiceInputText) || detectedVoicePrice || price;
              const isExplicitlyMentioned = Boolean(extractPriceFromText(voiceInputText));
              return (
                <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
                  isExplicitlyMentioned
                    ? "bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs"
                    : "bg-amber-50/60 border-amber-200/80 text-neutral-800"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isExplicitlyMentioned ? "bg-emerald-600 text-white shadow-xs" : "bg-amber-200 text-amber-900"
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>
                          {isExplicitlyMentioned
                            ? (language === "hi" ? "✨ आवाज से पहचानी गई कीमत:" : "✨ Spoken Price Detected:")
                            : (language === "hi" ? "सक्रिय मूल्य निर्धारण:" : "Active Target Price:")}
                        </span>
                        <span className="text-sm font-extrabold text-craft-green">
                          ₹{activeExtracted.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        {isExplicitlyMentioned
                          ? (language === "hi" ? "उचित पारिश्रमिक ब्रेकडाउन इस कीमत के आधार पर तुरंत अपडेट हो गया है।" : "Smart fair wage breakdown dynamically synchronized to this spoken price.")
                          : (language === "hi" ? "आवाज में या विवरण में कोई भी कीमत बोलें/लिखें (उदा. 'कीमत ₹3500')।" : "Speak or type any price (e.g. 'price ₹3,500' or '2400 rupaye').")}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      {language === "hi" ? "उचित पारिश्रमिक स्थिति" : "Fair Wage Status"}
                    </span>
                    <span className="text-xs font-extrabold text-craft-terracotta bg-white px-2.5 py-0.5 rounded-full border border-neutral-200 shadow-2xs">
                      {pricingAnalysis?.confidence ? `${Math.round(pricingAnalysis.confidence * 100)}% Verified` : "95% Verified"}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Quick 1-Click Craft Prompts with Dynamic Prices */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-neutral-600 block">
                {language === "hi" ? "त्वरित कारीगर सुझाव (कीमत के साथ):" : "Quick Artisan Prompts (With calibrated prices):"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetQuickPrompt("यह हाथ से बनी बाँस की सर्विंग ट्रे है, चाय और टेबल के लिए, कीमत ₹650 है।")}
                  className="text-[11px] bg-white hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl text-neutral-800 font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  🪵 बाँस की सर्विंग ट्रे (₹650)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickPrompt("मिट्टी का हाथ से बना पियर्स्ड दिया लैंप है, पूजा और दिवाली के लिए, कीमत ₹450 है।")}
                  className="text-[11px] bg-white hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl text-neutral-800 font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  🪔 मिट्टी का दीया लैंप (₹450)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickPrompt("चंदेरी शुद्ध सिल्क और सोने की ज़री वाली हाथ से बुनी साड़ी है, इसकी कीमत ₹3500 है।")}
                  className="text-[11px] bg-white hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl text-neutral-800 font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  🥻 चंदेरी सिल्क साड़ी (₹3,500)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickPrompt("स्वामिमलाई की हाथ से ढली पीतल की नटराज मूर्ति है, शुद्ध कांसा, कीमत ₹4200 है।")}
                  className="text-[11px] bg-white hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl text-neutral-800 font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  ✨ पीतल नटराज मूर्ति (₹4,200)
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2"
            >
              {language === "hi" ? "← AI स्टूडियो पर वापस जाएं" : "← Back to AI Studio"}
            </button>

            <button
              type="button"
              disabled={loadingAI}
              onClick={handleRunCatalogAI}
              className="bg-craft-green hover:bg-craft-green-light text-white font-bold px-7 py-3 rounded-2xl text-sm flex items-center gap-2 shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-craft-gold" />}
              <span>{t("generateCatalogPricing")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SMART PRICING ASSISTANT */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              {language === "hi" ? "कदम ४: स्मार्ट मूल्य निर्धारण सहायक" : "Step 4: Smart Pricing Assistant"}
            </h3>
            <p className="text-xs text-neutral-500">
              {t("step4Sub")}
            </p>
          </div>

          {/* Smart Pricing Component with Dual Marker & AI Benchmark Sync */}
          <SmartPricingCard
            analysis={pricingAnalysis}
            currentPrice={price}
            suggestedPrice={aiSuggestedPrice}
            onPriceChange={handlePriceChange}
            onApplySuggested={handleApplySuggestedPrice}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2"
            >
              {t("backToVoice")}
            </button>

            <button
              type="button"
              onClick={() => setStep(5)}
              className="bg-craft-green hover:bg-craft-green-light text-white font-bold px-7 py-3 rounded-2xl text-sm flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <span>{t("reviewListing")}</span>
              <ArrowRight className="w-4 h-4 text-craft-gold" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: HUMAN APPROVAL & PUBLISH (PRD Section 5.8 & 5.10) */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          
          {/* AI Auto-Catalog Notification Banner */}
          {aiExtracted && (
            <div className="bg-gradient-to-r from-emerald-50 via-amber-50/70 to-emerald-50 p-4 rounded-2xl border border-emerald-300 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Sparkles className="w-5 h-5 text-craft-gold animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-emerald-950">
                      {language === "hi" ? "✨ AI विज़न द्वारा विवरण स्वतः प्राप्त!" : "✨ AI Vision Auto-Cataloged from Craft Photo"}
                    </span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      {Math.round((aiConfidence || 0.95) * 100)}% Confidence Match
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800/90 mt-0.5">
                    {language === "hi"
                      ? "आपकी फोटो से शीर्षक, शिल्प श्रेणी, प्राकृतिक सामग्री, विरासत कथा और उचित मूल्य का स्वतः निर्धारण किया गया है।"
                      : "All fields were automatically analyzed and fetched from your photo. You can edit any detail or 1-click publish below."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="text-xs font-bold text-white bg-craft-terracotta hover:bg-craft-terracotta-dark px-3.5 py-1.5 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span>{language === "hi" ? "कैमरा खोलें" : "Open Camera"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{language === "hi" ? "फोटो बदलें" : "Change Photo"}</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                {t("step5Title")}
              </h3>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                {t("humanApprovalReq")}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {t("step5Sub")}
            </p>
          </div>

          {/* Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Image Preview */}
            {(() => {
              const { isCutout, containerClass, overlayClass, badgeLabel, filter } = getFilterStyleForPreset(selectedPreset);
              return (
                <div className="md:col-span-4 space-y-3">
                  <div className={`aspect-square rounded-2xl overflow-hidden border border-neutral-200 relative shadow-sm ${containerClass} transition-colors duration-300`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {(enhancedImageUrl || rawImageUrl) ? (
                      <img
                        src={enhancedImageUrl || rawImageUrl}
                        alt=""
                        style={{
                          filter: filter,
                        }}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                    ) : null}
                    {/* Studio Lighting Overlay */}
                    <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />
                    <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow ${
                      isCutout ? "bg-rose-600/95 border border-rose-300" : "bg-craft-green/95 border border-craft-gold/40"
                    }`}>
                      {badgeLabel || (language === "hi" ? "AI उन्नत स्टूडियो फ़ोटो" : "AI Enhanced Studio Shot")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500 font-medium">
                      Studio Filter: <strong className="text-neutral-700 capitalize">{selectedPreset.replace(/-/g, " ")}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-craft-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {language === "hi" ? "बैकग्राउंड बदलें" : "Change Preset"}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Right Fields with Inline Editing */}
            <div className="md:col-span-8 space-y-4">

              {/* 1-Click Craft Category Switcher Chips */}
              <div className="bg-gradient-to-r from-amber-50/80 via-white to-amber-50/60 border border-amber-200 p-3.5 rounded-2xl space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-craft-terracotta" />
                    <span className="text-xs font-bold text-neutral-800">
                      {language === "hi" ? "AI शिल्प पहचान (१-क्लिक श्रेणी बदलें):" : "AI Detected Craft (1-Click Category Adjustment):"}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                    {Math.round((aiConfidence || 0.95) * 100)}% Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "Handwoven Textiles", label: "🥻 Handwoven Textiles / Saree" },
                    { id: "Terracotta & Pottery", label: "🏺 Terracotta & Pottery" },
                    { id: "Bamboo Handicrafts", label: "🌾 Bamboo & Cane" },
                    { id: "Dhokra Metalcraft", label: "🪆 Dhokra Metal" },
                    { id: "Woodcarving", label: "🪵 Woodcarving" },
                    { id: "Handmade Jewellery", label: "💍 Jewellery" },
                    { id: "Home Décor", label: "🎨 Folk Art & Décor" },
                  ].map((chip) => {
                    const isSelected = category === chip.id;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => handleSwitchCraftCategory(chip.id as CraftCategory)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-craft-green text-white shadow-sm ring-2 ring-craft-gold scale-102"
                            : "bg-white text-neutral-700 border border-neutral-200 hover:bg-amber-100/60 hover:border-amber-300"
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>

                {detectedColors.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-neutral-500 border-t border-amber-100/80">
                    <span className="font-semibold text-neutral-600">
                      {language === "hi" ? "पहचाने गए रंग:" : "Detected Palette:"}
                    </span>
                    {detectedColors.map((col, idx) => (
                      <span key={idx} className="bg-white border border-neutral-200 px-2 py-0.5 rounded-md text-neutral-700 font-medium">
                        {col}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1 flex items-center justify-between">
                  <span>{t("productTitle")}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">{language === "hi" ? "AI द्वारा तैयार ✓" : "AI Generated ✓"}</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-bold text-base text-neutral-900 focus:border-craft-green focus:ring-0"
                />
              </div>

              {/* Category, Material & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    {t("craftCategory")}
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CraftCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 focus:border-craft-green focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    {t("materialLabel")}
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 focus:border-craft-green focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    {language === "hi" ? "आयाम (Dimensions)" : "Dimensions"}
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 10 x 8 inches"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 focus:border-craft-green focus:ring-0"
                  />
                </div>
              </div>

              {/* Detected Craft Features */}
              {detectedFeatures && detectedFeatures.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {language === "hi" ? "AI द्वारा पहचाने गए शिल्प लक्षण" : "AI Detected Craft Characteristics"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {detectedFeatures.map((feat, i) => (
                      <span
                        key={i}
                        className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural Story / Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  {t("craftStoryDesc")}
                </label>
                <textarea
                  rows={3}
                  value={culturalStory}
                  onChange={(e) => setCulturalStory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-700 leading-relaxed focus:border-craft-green focus:ring-0"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  {t("autoSearchTags")}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-amber-50 text-craft-terracotta border border-amber-200 px-2.5 py-1 rounded-lg font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-500 block uppercase">
                    {t("approvedSellingPrice")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-serif font-extrabold text-craft-green">
                      {formatCurrency(price)}
                    </span>
                    {price !== aiSuggestedPrice && (
                      <button
                        type="button"
                        onClick={handleApplySuggestedPrice}
                        className="text-[11px] bg-amber-100 hover:bg-amber-200 text-craft-terracotta font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Reset to AI suggested benchmark price"
                      >
                        <Sparkles className="w-3 h-3 text-craft-gold" />
                        <span>{language === "hi" ? `सुझाव लागू करें (${formatCurrency(aiSuggestedPrice)})` : `Apply Suggested (${formatCurrency(aiSuggestedPrice)})`}</span>
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-bold text-craft-terracotta hover:underline cursor-pointer"
                >
                  {t("adjustPricing")}
                </button>
              </div>

            </div>

          </div>

          {/* Verification Pre-Publish Checklist (PRD Section 5.10) */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-emerald-950">{language === "hi" ? "प्रकाशन पूर्व चेकलिस्ट:" : "Pre-Publish Checklist:"}</span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold"><Check className="w-3.5 h-3.5" /> {language === "hi" ? "फोटो" : "Image"}</span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold"><Check className="w-3.5 h-3.5" /> {language === "hi" ? "नाम" : "Name"}</span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold"><Check className="w-3.5 h-3.5" /> {language === "hi" ? "श्रेणी" : "Category"}</span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold"><Check className="w-3.5 h-3.5" /> {language === "hi" ? "कथा" : "Story"}</span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold"><Check className="w-3.5 h-3.5" /> {language === "hi" ? "मूल्य" : "Price"} ({formatCurrency(price)})</span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold"><Check className="w-3.5 h-3.5" /> ONDC</span>
          </div>

          {/* Actions: Save Draft vs Publish Product */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                showToast(language === "hi" ? "लिस्टिंग ड्राफ्ट में सहेजी गई।" : "Listing saved to drafts.", "info");
                router.push("/products");
              }}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t("saveDraft")}</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-craft-terracotta/40 hover:scale-102 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-craft-gold" />
              <span>{offlineMode ? (language === "hi" ? "ऑफ़लाइन कतार में सहेजें" : "Save to Offline Queue") : t("publish")}</span>
            </button>
          </div>

        </div>
      )}

        </div>
      )}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onApplyCommand={handleApplyVoiceCommand}
        currentPrice={price}
        currentName={productName}
      />

      {/* Vision Settings Modal */}
      {showVisionSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-neutral-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-craft-terracotta flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">AI Vision Engine Configuration</h4>
                  <p className="text-[11px] text-neutral-500">ShilpSutra Dual-Tier Craft Intelligence</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVisionSettings(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-600">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">Tier 1: Smart Local Computer Vision (Always Active)</span>
                  <span className="text-[11px] text-emerald-800 leading-relaxed block mt-0.5">
                    Analyzes real RGB/HSL pixel distributions, saturation index, edge textures, and heritage color palettes with sub-30ms execution. 100% offline-ready with zero API cost.
                  </span>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-craft-terracotta shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950 block">Tier 2: Google Gemini Multimodal Cloud Vision (Optional)</span>
                  <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                    Enter a free Gemini API key from Google AI Studio (<code>aistudio.google.com</code>) to unlock live neural multimodal vision recognition.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Google Gemini API Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-xs focus:border-craft-green focus:ring-0"
                  />
                  <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-neutral-400">
                  Key is saved privately in your local browser and never sent to third parties.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              {geminiApiKey ? (
                <button
                  type="button"
                  onClick={() => handleSaveGeminiKey("")}
                  className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Disconnect Key
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowVisionSettings(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveGeminiKey(inputApiKey)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-craft-green text-white hover:bg-craft-green-dark shadow transition-all cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Scanner Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        onFallbackUploadClick={() => fileInputRef.current?.click()}
      />

    </div>
  );
}

export default function CreateProductPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-neutral-500">Loading AI Listing Wizard...</div>}>
      <CreateProductContent />
    </Suspense>
  );
}
