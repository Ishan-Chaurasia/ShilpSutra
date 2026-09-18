"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { 
  Package, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  MessageSquare,
  Search,
  Check,
  AlertTriangle
} from "lucide-react";

export default function MyProductsPage() {
  const { products, updateProduct, deleteProduct, currentArtisan, showToast } = useApp();
  const { t, language } = useLanguage();
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(500);
  const [search, setSearch] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");

  const artisanProducts = products.filter(
    (p) => p.artisanId === currentArtisan.id || p.artisanName === currentArtisan.name
  );
  
  const displayProducts = activeTab === "my" ? artisanProducts : products;

  const filtered = displayProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSavePrice = (productId: string) => {
    updateProduct(productId, { price: tempPrice });
    setEditingPriceId(null);
    showToast(`Updated price to ${formatCurrency(tempPrice)}`, "success");
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    setProductToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-craft-terracotta">
            {t("inventorySub")}
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 mt-0.5">
            {t("inventoryTitle")} ({filtered.length})
          </h1>
        </div>

        <Link
          href="/create-product"
          className="bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow transition-all hover:scale-102"
        >
          <PlusCircle className="w-4 h-4 text-craft-gold" />
          <span>{t("addNewProduct")}</span>
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Scope Tabs */}
        <div className="inline-flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "my"
                ? "bg-white text-craft-green font-bold shadow-xs border border-craft-green/20"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {currentArtisan.name}&apos;s Crafts ({artisanProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-craft-green font-bold shadow-xs border border-craft-green/20"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            All Marketplace Crafts ({products.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder={language === "hi" ? "उत्पाद के नाम या श्रेणी से खोजें..." : "Search crafts or categories..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs bg-white focus:border-craft-green focus:ring-0 shadow-xs"
          />
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-craft-cream/40 border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">{t("tableCraft")}</th>
                <th className="p-4">{t("tableCategory")}</th>
                <th className="p-4">{t("tablePrice")}</th>
                <th className="p-4">{t("tableStatus")}</th>
                <th className="p-4">{t("tableEngagement")}</th>
                <th className="p-4 text-right">{t("tableActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 px-4">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <h3 className="font-serif font-bold text-base text-neutral-700">
                      {search
                        ? `No products match "${search}"`
                        : activeTab === "my"
                        ? `No craft listings under ${currentArtisan.name}`
                        : "No craft listings found"}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                      {search
                        ? "Try adjusting your search query or clear the filter."
                        : activeTab === "my"
                        ? "You have deleted or not yet created any crafts under this artisan profile. You can add a new craft or browse all marketplace crafts."
                        : "No crafts are currently available in the database."}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      {search ? (
                        <button
                          onClick={() => setSearch("")}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                        >
                          Clear Search
                        </button>
                      ) : (
                        <>
                          <Link
                            href="/create-product"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-craft-terracotta hover:bg-craft-terracotta-dark text-white shadow"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-craft-gold" />
                            <span>Add New Craft</span>
                          </Link>
                          {activeTab === "my" && products.length > 0 && (
                            <button
                              onClick={() => setActiveTab("all")}
                              className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                            >
                              View All Crafts ({products.length})
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                const isEditing = editingPriceId === prod.id;
                return (
                  <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors">
                    
                    {/* Craft thumbnail + title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.processedImageUrl || prod.originalImageUrl}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                        />
                        <div>
                          <div className="font-serif font-bold text-sm text-neutral-900">{prod.name}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">{prod.material}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-semibold text-neutral-700">
                      {prod.category}
                    </td>

                    {/* Price with quick inline edit */}
                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm">₹</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs font-bold border border-craft-green rounded-lg"
                            step="50"
                          />
                          <button
                            onClick={() => handleSavePrice(prod.id)}
                            className="p-1 bg-craft-green text-white rounded hover:bg-craft-green-light"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-craft-green">
                            {formatCurrency(prod.price)}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(prod.id);
                              setTempPrice(prod.price);
                            }}
                            className="text-neutral-400 hover:text-craft-terracotta p-1"
                            title="Quick edit price"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        {prod.status}
                      </span>
                    </td>

                    {/* Views & Enquiries */}
                    <td className="p-4 text-neutral-500">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {prod.views}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-craft-terracotta" /> {prod.enquiries}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${prod.id}`}
                          className="p-2 text-neutral-500 hover:text-craft-green hover:bg-neutral-100 rounded-lg transition-colors"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setProductToDelete(prod)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  {language === "hi" ? "शिल्प उत्पाद हटाएं?" : "Delete Craft Listing?"}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === "hi"
                    ? "क्या आप वाकई इस शिल्प को अपने खाते और बाज़ार से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
                    : "Are you sure you want to delete this listing? It will be permanently removed from your inventory and the ShilpSutra marketplace."}
                </p>
              </div>
            </div>

            {/* Preview of item being deleted */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productToDelete.processedImageUrl || productToDelete.originalImageUrl}
                alt={productToDelete.name}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
              />
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-xs text-neutral-900 truncate">
                  {productToDelete.name}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {productToDelete.category} • {formatCurrency(productToDelete.price)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "हाँ, हटाएं" : "Yes, Delete Craft"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
