"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { X, Send, CheckCircle2, MessageSquare, PhoneCall } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

interface BuyerEnquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyerEnquiryModal({ product, isOpen, onClose }: BuyerEnquiryModalProps) {
  const { showToast } = useApp();
  const { t, language } = useLanguage();
  const [buyerType, setBuyerType] = useState<"INDIVIDUAL" | "WHOLESALE">("WHOLESALE");
  const [quantity, setQuantity] = useState(buyerType === "WHOLESALE" ? 50 : 1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(`Enquiry sent directly to ${product.artisanName}!`, "success");
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Namaste ${product.artisanName}, I am interested in your craft "${product.name}" (Price: ${formatCurrency(product.price)}) on ShilpSutra. Quantity: ${quantity}.`
    );
    window.open(`https://wa.me/${product.artisanPhone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-craft-gold/30 w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-craft-green text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-craft-gold">
              {language === "hi" ? "सीधा कारीगर बाज़ार लिंकेज" : "Direct Artisan Market Linkage"}
            </span>
            <h3 className="font-serif font-bold text-lg text-craft-ivory mt-0.5">
              {language === "hi" ? `${product.artisanName} को पूछताछ भेजें` : `Send Enquiry to ${product.artisanName}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-lg text-neutral-900">
              {language === "hi" ? "पूछताछ भेज दी गई!" : "Enquiry Dispatched!"}
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              {language === "hi" 
                ? `आपकी पूछताछ ${product.artisanName} को भेज दी गई है। एक SMS अलर्ट भी जारी किया गया है।`
                : `Your inquiry has been sent to ${product.artisanName}. An SMS alert was generated.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Product summary card */}
            <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.processedImageUrl || product.originalImageUrl}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-serif font-bold text-sm text-neutral-900 truncate">
                  {product.name}
                </h5>
                <p className="text-xs text-craft-green font-extrabold">
                  {formatCurrency(product.price)} <span className="text-neutral-500 font-normal">/ {language === "hi" ? "इकाई" : "unit"}</span>
                </p>
              </div>
            </div>

            {/* Buyer Type Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBuyerType("WHOLESALE");
                  setQuantity(50);
                }}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  buyerType === "WHOLESALE"
                    ? "border-craft-terracotta bg-amber-50 text-craft-terracotta shadow-xs"
                    : "border-neutral-200 text-neutral-600"
                }`}
              >
                {language === "hi" ? "थोक / बल्क ऑर्डर" : "Wholesale / B2B Bulk Order"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBuyerType("INDIVIDUAL");
                  setQuantity(1);
                }}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  buyerType === "INDIVIDUAL"
                    ? "border-craft-terracotta bg-amber-50 text-craft-terracotta shadow-xs"
                    : "border-neutral-200 text-neutral-600"
                }`}
              >
                {language === "hi" ? "व्यक्तिगत खुदरा खरीदार" : "Individual Retail Buyer"}
              </button>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {language === "hi" ? "मांगी गई मात्रा (इकाईयां)" : "Requested Quantity (Units)"}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:border-craft-green focus:ring-0"
              />
              {buyerType === "WHOLESALE" && (
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {language === "hi" ? "अनुमानित ऑर्डर मूल्य:" : "Est. Order Value:"} <strong className="text-craft-green">{formatCurrency(quantity * product.price * 0.85)}</strong> ({language === "hi" ? "15% थोक छूट सहित" : "incl. 15% wholesale discount"})
                </span>
              )}
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {language === "hi" ? "आपका नाम / संस्था" : "Your Name / Org"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === "hi" ? "उदा. फैबइंडिया / प्रिया" : "e.g. FabIndia / Priya"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:border-craft-green focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {language === "hi" ? "फ़ोन नंबर" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:border-craft-green focus:ring-0"
                />
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {language === "hi" ? "संदेश / विशेष आवश्यकताएं" : "Message / Custom Requirements"}
              </label>
              <textarea
                rows={2}
                placeholder={language === "hi" ? "कोई विशेष आकार, डिलीवरी समय या पैकेजिंग आवश्यकताएं..." : "Mention any custom dimensions, delivery timelines, or packaging requirements..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:border-craft-green focus:ring-0"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 bg-craft-green hover:bg-craft-green-light text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-craft-gold" />
                {language === "hi" ? "सीधी पूछताछ सबमिट करें" : "Submit Direct Enquiry"}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                title="Direct WhatsApp Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
