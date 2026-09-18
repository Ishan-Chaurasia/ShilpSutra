"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { speakResponse } from "@/lib/voiceParser";
import { 
  Play, 
  Mic, 
  WifiOff, 
  Layers, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  Award, 
  CheckCircle2,
  Sparkles,
  Zap
} from "lucide-react";

export function JudgeDemoDock() {
  const router = useRouter();
  const { products, updateProduct, setOfflineMode, offlineMode, syncOfflineQueue, resetDemoData, showToast } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  // Scenario 1: Auto 60-Second Fast-Track Tour
  const runScenario1 = () => {
    setActiveScenario(1);
    showToast("Launching Interactive Showcase Tour (60s Listing Flow)...", "info");
    router.push("/create-product?demo=fasttrack");
  };

  // Scenario 2: Voice Price Edit ("Price 650 kar do")
  const runScenario2 = () => {
    setActiveScenario(2);
    const targetProduct = products.find(p => p.category === "Bamboo Handicrafts") || products[0];
    if (!targetProduct) return;

    speakResponse("उत्पाद की कीमत ₹650 कर दी गई है।", "hi");
    updateProduct(targetProduct.id, { price: 650 });
    showToast(`Voice Command Recognized: "Price 650 kar do" ➔ Updated to ₹650!`, "success");
    router.push(`/product/${targetProduct.id}`);
  };

  // Scenario 3: Voice Product Rename ("Naam bamboo tokri kar do")
  const runScenario3 = () => {
    setActiveScenario(3);
    const targetProduct = products.find(p => p.category === "Bamboo Handicrafts") || products[0];
    if (!targetProduct) return;

    speakResponse("उत्पाद का नाम 'Handcrafted Bamboo Tokri' सेट कर दिया गया है।", "hi");
    updateProduct(targetProduct.id, { name: "Handcrafted Bamboo Tokri" });
    showToast(`Voice Command Recognized: "Naam bamboo tokri kar do" ➔ Renamed!`, "success");
    router.push(`/product/${targetProduct.id}`);
  };

  // Scenario 4: Offline Queue & Sync Simulation
  const runScenario4 = async () => {
    setActiveScenario(4);
    setOfflineMode(true);
    showToast("Simulating rural connectivity loss. Saving 2 craft items to offline queue...", "warning");
    
    // Add sample offline items
    setTimeout(async () => {
      showToast("Restoring internet connection. Auto-syncing queue...", "info");
      await syncOfflineQueue();
      router.push("/dashboard");
    }, 2500);
  };

  // Scenario 5: Wholesale B2B Match (87% Match)
  const runScenario5 = () => {
    setActiveScenario(5);
    showToast("Loading B2B Market Linkage (FabIndia 87% Match)...", "info");
    router.push("/market-linkage");
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-3 transition-all duration-300">
      <div className="bg-craft-green/95 backdrop-blur-md border-2 border-craft-gold/60 rounded-2xl shadow-2xl p-2.5 sm:p-3 text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-craft-green-light">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-craft-gold text-craft-green-dark flex items-center justify-center font-bold text-[10px]">
              ★
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-craft-gold tracking-wide flex items-center gap-1.5">
              Interactive Showcase Tour
            </span>
            <span className="hidden sm:inline-block text-[10px] bg-craft-green-dark text-craft-cream/80 px-2 py-0.5 rounded border border-craft-green-light">
              Deterministic 60–120s Workflow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/sign-in")}
              className="text-[11px] text-craft-gold hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-craft-green-dark hover:bg-craft-green-dark/80 border border-craft-gold/40 transition-colors cursor-pointer"
              title="Test Login & Sign Up Form"
            >
              <span>🔑</span>
              <span className="hidden sm:inline">Auth</span>
              <span>Login / Sign Up</span>
            </button>
            <button
              onClick={() => resetDemoData()}
              className="text-[11px] text-craft-cream/70 hover:text-craft-gold flex items-center gap-1 px-2 py-0.5 rounded bg-craft-green-dark/70 hover:bg-craft-green-dark transition-colors"
              title="Reset Prototype State"
            >
              <RotateCcw className="w-3 h-3" />
              Reset State
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-craft-cream/70 hover:text-white rounded hover:bg-craft-green-light/40 transition-colors"
              title={collapsed ? "Expand Showcase Bar" : "Minimize Showcase Bar"}
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons Grid */}
        {!collapsed && (
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2 text-xs">
            
            {/* Scenario 1 */}
            <button
              onClick={runScenario1}
              className={`flex flex-col items-start p-2 rounded-xl border transition-all text-left group ${
                activeScenario === 1
                  ? "bg-craft-terracotta border-craft-gold text-white shadow-lg"
                  : "bg-craft-green-dark/80 hover:bg-craft-green-dark border-craft-green-light text-craft-cream hover:border-craft-gold/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-[10px] uppercase text-craft-gold tracking-wider">Tour 1</span>
                <Play className="w-3 h-3 text-craft-gold group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-xs leading-tight text-white">Fast 60s Flow</span>
              <span className="text-[10px] text-craft-cream/70 mt-0.5">Photo ➔ AI ➔ Live</span>
            </button>

            {/* Scenario 2 */}
            <button
              onClick={runScenario2}
              className={`flex flex-col items-start p-2 rounded-xl border transition-all text-left group ${
                activeScenario === 2
                  ? "bg-craft-terracotta border-craft-gold text-white shadow-lg"
                  : "bg-craft-green-dark/80 hover:bg-craft-green-dark border-craft-green-light text-craft-cream hover:border-craft-gold/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-[10px] uppercase text-craft-gold tracking-wider">Tour 2</span>
                <Mic className="w-3 h-3 text-craft-gold group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-xs leading-tight text-white">Voice Price Edit</span>
              <span className="text-[10px] text-craft-cream/70 mt-0.5">"Price 650 kar do"</span>
            </button>

            {/* Scenario 3 */}
            <button
              onClick={runScenario3}
              className={`flex flex-col items-start p-2 rounded-xl border transition-all text-left group ${
                activeScenario === 3
                  ? "bg-craft-terracotta border-craft-gold text-white shadow-lg"
                  : "bg-craft-green-dark/80 hover:bg-craft-green-dark border-craft-green-light text-craft-cream hover:border-craft-gold/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-[10px] uppercase text-craft-gold tracking-wider">Tour 3</span>
                <Sparkles className="w-3 h-3 text-craft-gold group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-xs leading-tight text-white">Voice Rename</span>
              <span className="text-[10px] text-craft-cream/70 mt-0.5">"Naam bamboo tokri"</span>
            </button>

            {/* Scenario 4 */}
            <button
              onClick={runScenario4}
              className={`flex flex-col items-start p-2 rounded-xl border transition-all text-left group ${
                activeScenario === 4
                  ? "bg-craft-terracotta border-craft-gold text-white shadow-lg"
                  : "bg-craft-green-dark/80 hover:bg-craft-green-dark border-craft-green-light text-craft-cream hover:border-craft-gold/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-[10px] uppercase text-craft-gold tracking-wider">Tour 4</span>
                <WifiOff className="w-3 h-3 text-craft-gold group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-xs leading-tight text-white">Offline & Sync</span>
              <span className="text-[10px] text-craft-cream/70 mt-0.5">Local Queue ➔ Push</span>
            </button>

            {/* Scenario 5 */}
            <button
              onClick={runScenario5}
              className={`flex flex-col items-start p-2 rounded-xl border transition-all text-left group col-span-2 sm:col-span-1 ${
                activeScenario === 5
                  ? "bg-craft-terracotta border-craft-gold text-white shadow-lg"
                  : "bg-craft-green-dark/80 hover:bg-craft-green-dark border-craft-green-light text-craft-cream hover:border-craft-gold/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-[10px] uppercase text-craft-gold tracking-wider">Tour 5</span>
                <Layers className="w-3 h-3 text-craft-gold group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-xs leading-tight text-white">B2B Wholesale</span>
              <span className="text-[10px] text-craft-cream/70 mt-0.5">FabIndia 87% Match</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
