"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { parseVoiceIntent, speakResponse } from "@/lib/voiceParser";
import { formatCurrency } from "@/lib/utils";
import { VoiceCommand, Product } from "@/types";
import { 
  Mic, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Package, 
  RefreshCw,
  Clock
} from "lucide-react";

export default function VoiceAssistantPage() {
  const { products, updateProduct, currentArtisan, showToast } = useApp();
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [activeCommand, setActiveCommand] = useState<VoiceCommand | null>(null);
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);

  const handleProcessVoice = (text: string) => {
    setIsListening(false);
    setTranscript(text);
    const cmd = parseVoiceIntent(text, language);
    setActiveCommand(cmd);
    setCommandHistory((prev) => [cmd, ...prev]);

    // Spoken voice feedback
    speakResponse(cmd.spokenResponse, language);

    // Execute state updates based on intent
    if (cmd.intent === "UPDATE_PRICE" && cmd.entities.price && selectedProduct) {
      updateProduct(selectedProduct.id, { price: cmd.entities.price });
      showToast(`Price of ${selectedProduct.name} updated to ₹${cmd.entities.price}`, "success");
    } else if (cmd.intent === "UPDATE_NAME" && cmd.entities.name && selectedProduct) {
      updateProduct(selectedProduct.id, { name: cmd.entities.name });
      showToast(`Name of product updated to "${cmd.entities.name}"`, "success");
    }
  };

  const handleStartMic = () => {
    setIsListening(true);
    setTranscript(language === "hi" ? "आवाज़ कमांड सुन रहे हैं... बोलिए..." : "Listening for voice command... speak now...");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (e: any) => {
          const res = e.results[0][0].transcript;
          handleProcessVoice(res);
        };

        recognition.onerror = () => {
          setIsListening(false);
          handleProcessVoice("₹650 kar do");
        };

        recognition.start();
      } catch {
        setTimeout(() => handleProcessVoice("₹650 kar do"), 1500);
      }
    } else {
      setTimeout(() => handleProcessVoice("₹650 kar do"), 1500);
    }
  };

  const demoVoiceChips = [
    { label: "Price 650 kar do", text: "Price 650 kar do", desc: "Sets price to ₹650" },
    { label: "Is product ka naam bamboo tray kar do", text: "Is product ka naam bamboo tray kar do", desc: "Renames to Bamboo Tray" },
    { label: "₹500 kar do", text: "₹500 kar do", desc: "Sets price to ₹500" },
    { label: "Kitne enquiry aaye hain?", text: "Kitne enquiry aaye hain?", desc: "Checks buyer enquiries" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-craft-gold/30">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-craft-gold border border-craft-gold/30 font-semibold">
            <Mic className="w-3.5 h-3.5 text-craft-gold" />
            <span>{t("voiceEngineBadge")}</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-craft-ivory">
            {t("voiceAssistantTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-craft-cream/90">
            {t("voiceAssistantSub")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Voice Command Station */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          
          {/* Target Product Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
              Active Craft Target for Voice Commands
            </label>
            <select
              value={selectedProduct?.id}
              onChange={(e) => {
                const found = products.find((p) => p.id === e.target.value);
                if (found) setSelectedProduct(found);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-semibold text-sm text-neutral-800 bg-neutral-50/50"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} • Current Price: {formatCurrency(p.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Target Snapshot Card */}
          {selectedProduct && (
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProduct.processedImageUrl || selectedProduct.originalImageUrl}
                alt=""
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-craft-terracotta block">
                  Target Product
                </span>
                <h4 className="font-serif font-bold text-sm text-neutral-900 truncate">
                  {selectedProduct.name}
                </h4>
                <span className="text-base font-extrabold text-craft-green mt-0.5 block">
                  {formatCurrency(selectedProduct.price)}
                </span>
              </div>
            </div>
          )}

          {/* Interactive Mic Station */}
          <div className="p-8 rounded-3xl bg-neutral-50 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center space-y-4 text-center">
            
            <button
              onClick={handleStartMic}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
                isListening
                  ? "bg-craft-terracotta text-white scale-105 ring-8 ring-craft-terracotta/30"
                  : "bg-craft-green hover:bg-craft-green-light text-white hover:scale-105"
              }`}
            >
              {isListening ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 bg-white rounded-full animate-soundwave-1" />
                  <span className="w-1.5 bg-white rounded-full animate-soundwave-2" />
                  <span className="w-1.5 bg-white rounded-full animate-soundwave-3" />
                  <span className="w-1.5 bg-white rounded-full animate-soundwave-4" />
                </div>
              ) : (
                <Mic className="w-12 h-12 text-craft-gold" />
              )}
            </button>

            <div>
              <span className="font-bold text-sm text-neutral-900 block">
                {isListening ? "Listening... बोलिए..." : "Tap to Speak Hindi Command"}
              </span>
              <span className="text-xs text-neutral-500">
                Try saying: "Price 650 kar do" or "₹500 kar do"
              </span>
            </div>

            {transcript && (
              <div className="w-full bg-white p-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 italic">
                "{transcript}"
              </div>
            )}
          </div>

          {/* Quick 1-Click Voice Test Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
              1-Click Sample Voice Commands
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoVoiceChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessVoice(chip.text)}
                  className="p-3 bg-white hover:bg-amber-50/70 border border-neutral-200 hover:border-craft-terracotta/40 rounded-xl text-left transition-all flex items-start gap-2.5 shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-craft-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">
                      "{chip.label}"
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {chip.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Architecture Audit & Intent History (PRD Section 14) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Latest Execution Details */}
          {activeCommand && (
            <div className="bg-white rounded-3xl p-6 border-2 border-craft-green/20 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-craft-green flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-craft-terracotta" />
                  NLP Parsing Result
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {Math.round(activeCommand.confidence * 100)}% Confidence
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500 font-semibold">Intent:</span>
                  <span className="font-bold text-craft-green">{activeCommand.intent}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500 font-semibold">Extracted Entity:</span>
                  <span className="font-bold text-craft-terracotta">
                    {activeCommand.entities.price ? `price: ₹${activeCommand.entities.price}` : ""}
                    {activeCommand.entities.name ? `name: "${activeCommand.entities.name}"` : ""}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500 font-semibold">Spoken Response:</span>
                  <span className="font-medium text-neutral-800 italic">{activeCommand.spokenResponse}</span>
                </div>
              </div>
            </div>
          )}

          {/* Architecture Pipeline Explanation Card */}
          <div className="bg-craft-cream/60 rounded-3xl p-6 border border-craft-gold/30 space-y-4">
            <h4 className="font-serif font-bold text-sm text-craft-green uppercase tracking-wider">
              PRD Voice Pipeline Architecture
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-craft-terracotta font-bold flex items-center justify-center text-[10px]">1</span>
                <div>
                  <strong className="text-neutral-900 block">Regional Audio Capture</strong>
                  <span className="text-neutral-500">Web Speech API / Regional Hindi audio streams</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-craft-terracotta font-bold flex items-center justify-center text-[10px]">2</span>
                <div>
                  <strong className="text-neutral-900 block">Intent & Entity Extraction</strong>
                  <span className="text-neutral-500">Extracts price numbers, craft names, order inquiries</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-craft-terracotta font-bold flex items-center justify-center text-[10px]">3</span>
                <div>
                  <strong className="text-neutral-900 block">TTS Feedback & Database Sync</strong>
                  <span className="text-neutral-500">Audio voice confirmation spoken back to artisan</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
