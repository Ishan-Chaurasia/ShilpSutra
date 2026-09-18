"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { 
  Layers, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Globe2, 
  Building2, 
  Send,
  Download
} from "lucide-react";

export default function MarketLinkagePage() {
  const { buyerMatches, products, currentArtisan, showToast } = useApp();
  const { t, language } = useLanguage();
  const [selectedMatch, setSelectedMatch] = useState(buyerMatches[0]);
  const [proposalSent, setProposalSent] = useState<Record<string, boolean>>({});

  const handleSendProposal = (matchId: string, businessName: string) => {
    setProposalSent((prev) => ({ ...prev, [matchId]: true }));
    showToast(`Wholesale proposal & catalogue sent to ${businessName}!`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-craft-green via-craft-green to-craft-green-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-craft-gold/30">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-craft-gold border border-craft-gold/30 font-semibold">
            <Layers className="w-3.5 h-3.5 text-craft-gold" />
            <span>{language === "hi" ? "AI B2B और थोक मैचमेकिंग इंजन" : "AI B2B & Wholesale Matchmaking Engine"}</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-craft-ivory">
            {t("marketLinkageTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-craft-cream/90">
            {t("marketLinkageSub")}
          </p>
        </div>
      </div>

      {/* ONDC Connectivity Banner (PRD Section 34) */}
      <div className="bg-white rounded-2xl p-5 border-2 border-emerald-500/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-neutral-900">
                {language === "hi" ? "डिजिटल कॉमर्स के लिए ओपन नेटवर्क (ONDC)" : "Open Network for Digital Commerce (ONDC)"}
              </h3>
              <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                {language === "hi" ? "सक्रिय प्रोटोकॉल" : "ACTIVE PROTOCOL"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === "hi" 
                ? "आपके उत्पाद बेकन प्रोटोकॉल स्कीमा के तहत सूचीबद्ध हैं, जिससे पेटीएम, माईस्टोर और क्राफ्ट्सविला जैसे प्लेटफॉर्म से सीधे ऑर्डर प्राप्त होते हैं।"
                : "Your listings are catalogued in accordance with Beckn Protocol schema, allowing buyers across Paytm, Mystore, and Craftsvilla to order your products."}
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast(language === "hi" ? "सभी लिस्टिंग के लिए ONDC बेकन स्कीमा सत्यापित है।" : "ONDC Beckn schema verified for all listings.", "info")}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
        >
          {language === "hi" ? "प्रोटोकॉल नोड्स जांचें" : "Check Protocol Nodes"}
        </button>
      </div>

      {/* Matches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-craft-terracotta" />
            {t("recommendedBuyers")} ({buyerMatches.length})
          </h2>
          <span className="text-xs text-neutral-500">
            {language === "hi" ? "अनुकूलता स्कोर के आधार पर क्रमित" : "Sorted by algorithmic compatibility score"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {buyerMatches.map((match) => {
            const isSent = proposalSent[match.id];
            return (
              <div
                key={match.id}
                className="bg-white rounded-3xl border-2 border-neutral-200/80 hover:border-craft-terracotta/40 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-5"
              >
                
                <div className="space-y-4">
                  {/* Match Score Badge & Buyer Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2.5 py-1 rounded-lg">
                      {match.buyer.buyerType}
                    </span>

                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1 rounded-full font-extrabold text-sm shadow-xs">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{match.matchScore}% {language === "hi" ? "मैच" : "Match"}</span>
                    </div>
                  </div>

                  {/* Buyer Profile */}
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={match.buyer.avatar}
                      alt={match.buyer.businessName}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-base text-neutral-900 truncate">
                        {match.buyer.businessName}
                      </h4>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {match.buyer.location}, {match.buyer.state}
                      </p>
                    </div>
                  </div>

                  {/* Matched Product Banner */}
                  <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/70 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={match.productImage}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-semibold text-craft-terracotta block">
                        {language === "hi" ? "संबंधित उत्पाद" : "Matching Product"}
                      </span>
                      <h5 className="font-serif font-bold text-xs text-neutral-900 truncate">
                        {match.productName}
                      </h5>
                      <span className="text-xs font-extrabold text-craft-green">
                        {formatCurrency(match.productPrice)} / {language === "hi" ? "इकाई" : "unit"}
                      </span>
                    </div>
                  </div>

                  {/* Reasons for Match (PRD: Section 12) */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                      {language === "hi" ? "अनुकूलता कारक" : "Compatibility Factors"}
                    </span>
                    <div className="space-y-1">
                      {match.matchReasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-neutral-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Potential Order Value */}
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-medium">
                      {language === "hi" ? "अनुमानित ऑर्डर मूल्य:" : "Est. Order Value:"}
                    </span>
                    <span className="font-extrabold text-craft-green text-sm">
                      {formatCurrency(match.potentialOrderValue)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <button
                    onClick={() => handleSendProposal(match.id, match.buyer.businessName)}
                    disabled={isSent}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                      isSent
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-craft-green hover:bg-craft-green-light text-white"
                    }`}
                  >
                    {isSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t("proposalSent")}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-craft-gold" />
                        <span>{t("sendQuotation")}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
