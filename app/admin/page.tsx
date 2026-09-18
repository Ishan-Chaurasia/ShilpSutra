"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Users, 
  FileText, 
  Search,
  Check,
  Eye
} from "lucide-react";

export default function AdminDashboardPage() {
  const { products, updateProduct, showToast } = useApp();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"moderation" | "artisans" | "ai-audit">("moderation");

  // Sample moderation queue items
  const [moderationItems, setModerationItems] = useState([
    {
      id: "mod-1",
      productName: "Dhokra Brass Elephant",
      artisanName: "Ramesh Kumar",
      category: "Dhokra Metalcraft",
      price: 1200,
      confidence: 0.91,
      status: "APPROVED",
      flags: "None (Passed auto-checks)",
      image: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=1600&auto=format&fit=crop&q=85",
    },
    {
      id: "mod-2",
      productName: "Molela Terracotta Pierced Lantern",
      artisanName: "Meera Bai",
      category: "Terracotta & Pottery",
      price: 650,
      confidence: 0.93,
      status: "APPROVED",
      flags: "None (Passed auto-checks)",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&auto=format&fit=crop&q=85",
    },
    {
      id: "mod-3",
      productName: "Chanderi Handloom Cotton-Silk Saree",
      artisanName: "Sunita Devi",
      category: "Handwoven Textiles",
      price: 2400,
      confidence: 0.94,
      status: "APPROVED",
      flags: "GI tag match confirmed",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=85",
    },
    {
      id: "mod-4",
      productName: "Sheesham Wood Carved Panel",
      artisanName: "Arjun Singh",
      category: "Woodcarving",
      price: 3500,
      confidence: 0.88,
      status: "APPROVED",
      flags: "None (Passed auto-checks)",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1600&auto=format&fit=crop&q=85",
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setModerationItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "APPROVED" } : m))
    );
    showToast(`Approved listing "${name}" for national marketplace.`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-neutral-700">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-craft-gold border border-craft-gold/30 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-craft-gold" />
              <span>{t("adminBadge")}</span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-craft-ivory">
              {t("adminTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300">
              {t("adminSub")}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-800 p-1.5 rounded-2xl border border-neutral-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("moderation")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === "moderation" ? "bg-craft-terracotta text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t("productModeration")}
            </button>
            <button
              onClick={() => setActiveTab("ai-audit")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === "ai-audit" ? "bg-craft-terracotta text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t("aiAudit")}
            </button>
          </div>
        </div>
      </div>

      {/* Moderation Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500 font-semibold uppercase">Pending Verification</span>
          <div className="text-2xl font-bold text-neutral-900">0 Items</div>
          <span className="text-[11px] text-emerald-600 font-bold">Queue cleared</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500 font-semibold uppercase">AI Acceptance Rate</span>
          <div className="text-2xl font-bold text-craft-green">94.2%</div>
          <span className="text-[11px] text-neutral-500">Artisan approval match</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500 font-semibold uppercase">Certified Artisans</span>
          <div className="text-2xl font-bold text-neutral-900">1,480+</div>
          <span className="text-[11px] text-emerald-600 font-bold">Pehchan ID Linked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500 font-semibold uppercase">Average AI Latency</span>
          <div className="text-2xl font-bold text-craft-terracotta">0.82s</div>
          <span className="text-[11px] text-neutral-500">Edge inference speed</span>
        </div>
      </div>

      {/* Moderation Table */}
      {activeTab === "moderation" && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-neutral-900">
              Product Listing Moderation Queue
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Automated Safety Engine Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Craft</th>
                  <th className="p-4">Artisan</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">AI Confidence</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {moderationItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <span className="font-bold text-neutral-900">{item.productName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-neutral-700">{item.artisanName}</td>
                    <td className="p-4 text-neutral-600">{item.category}</td>
                    <td className="p-4 font-bold text-craft-green">{formatCurrency(item.price)}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        <Check className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleApprove(item.id, item.productName)}
                        className="bg-craft-green hover:bg-craft-green-light text-white font-bold px-3 py-1 rounded-lg text-[11px]"
                      >
                        Re-verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Audit Trail Tab */}
      {activeTab === "ai-audit" && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-craft-terracotta" />
            AI Jobs & Verification Audit Trail (PRD Section 10)
          </h3>
          <p className="text-xs text-neutral-500">
            Audit logs tracking what AI generated vs what the artisan approved to ensure model alignment and fair pricing integrity.
          </p>

          <div className="space-y-3">
            {[
              {
                job: "IMAGE_ENHANCEMENT",
                input: "raw_bamboo_tray.jpg",
                output: "segmented_1_1_white.jpg",
                model: "U-Net Segmenter v2.4",
                latency: "0.58s",
                status: "COMPLETED",
              },
              {
                job: "VOICE_TRANSCRIPTION",
                input: "audio_hi_in_chunk_4.wav ('₹650 kar do')",
                output: "Intent: UPDATE_PRICE, Entity: 650",
                model: "IndicWhisper-Hindi-v3",
                latency: "0.32s",
                status: "COMPLETED",
              },
              {
                job: "PRICE_RECOMMENDATION",
                input: "Serving Tray, raw: 140, labor: 220",
                output: "Suggested: ₹650 (Range: ₹520-₹850)",
                model: "ShilpPricing-Heuristic-v1",
                latency: "0.12s",
                status: "COMPLETED",
              },
            ].map((log, i) => (
              <div key={i} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-craft-green">{log.job}</span>
                  <span className="text-neutral-400">{log.latency}</span>
                </div>
                <div className="text-neutral-700"><strong>Input:</strong> {log.input}</div>
                <div className="text-neutral-700"><strong>Output:</strong> {log.output}</div>
                <div className="text-[11px] text-neutral-400">Model: {log.model}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
