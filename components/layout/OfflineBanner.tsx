"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { WifiOff, RefreshCw, CheckCircle2, Clock } from "lucide-react";

export function OfflineBanner() {
  const { offlineMode, offlineQueue, syncOfflineQueue, setOfflineMode } = useApp();
  const { t } = useLanguage();
  const [syncing, setSyncing] = useState(false);

  if (!offlineMode && offlineQueue.length === 0) return null;

  const handleSync = async () => {
    setSyncing(true);
    await syncOfflineQueue();
    setSyncing(false);
  };

  return (
    <div className="bg-amber-900/90 text-amber-50 border-b border-amber-700 px-4 py-2.5 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Offline Status indicator */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
            <WifiOff className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {offlineMode ? t("offlineAlert") : "Pending Sync Queue"}
              </span>
              <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {offlineQueue.length} {offlineQueue.length === 1 ? "listing" : "listings"} waiting
              </span>
            </div>
            <p className="text-xs text-amber-100/90">
              {offlineQueue.length > 0 
                ? `Local queue: ${offlineQueue.map(q => q.entityName).slice(0, 3).join(", ")}${offlineQueue.length > 3 ? "..." : ""}`
                : "Your changes are saved locally. Connect to internet to publish to the world."}
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2">
          {offlineQueue.length > 0 && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : t("syncNow")}
            </button>
          )}

          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className="text-xs text-amber-200 hover:text-white underline underline-offset-2 px-2 py-1"
          >
            {offlineMode ? t("simulateOnline") : t("simulateOffline")}
          </button>
        </div>

      </div>
    </div>
  );
}
