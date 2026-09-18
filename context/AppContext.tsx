"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Artisan, Product, BuyerMatch, OfflineQueueItem, UserRole } from "@/types";
import { initialArtisans } from "@/data/initialArtisans";
import { initialProducts } from "@/data/initialProducts";
import { initialBuyerMatches } from "@/data/initialBuyers";
import { db, DB_KEYS } from "@/lib/db";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface AppContextType {
  artisans: Artisan[];
  currentArtisan: Artisan;
  setCurrentArtisan: (artisan: Artisan) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  buyerMatches: BuyerMatch[];
  offlineMode: boolean;
  setOfflineMode: (enabled: boolean) => void;
  offlineQueue: OfflineQueueItem[];
  syncOfflineQueue: () => Promise<void>;
  resetDemoData: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  openRoleModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [artisans] = useState<Artisan[]>(initialArtisans);
  const [currentArtisan, setCurrentArtisanState] = useState<Artisan>(initialArtisans[0]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [buyerMatches, setBuyerMatches] = useState<BuyerMatch[]>(initialBuyerMatches);
  const [offlineMode, setOfflineModeState] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Initialize data from central DB layer + MongoDB Atlas Cloud + User Role
  useEffect(() => {
    try {
      // Check saved user role or URL query parameter
      if (typeof window !== "undefined") {
        const queryRole = new URLSearchParams(window.location.search).get("role") as UserRole | null;
        if (queryRole === "buyer" || queryRole === "seller") {
          setUserRoleState(queryRole);
          localStorage.setItem("shilpsutra_user_role", queryRole);
          return;
        }

        const savedRole = localStorage.getItem("shilpsutra_user_role") as UserRole | null;
        if (savedRole === "buyer" || savedRole === "seller") {
          setUserRoleState(savedRole);
        } else {
          // First visit: ask the user whether they are buyer or seller
          const timer = setTimeout(() => {
            setIsRoleModalOpen(true);
          }, 350);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    try {
      const loadedProducts = db.products.findMany();
      setProducts(loadedProducts);

      const queue = db.queue.findMany();
      setOfflineQueue(queue);

      const savedOffline = typeof window !== "undefined" ? localStorage.getItem(DB_KEYS.OFFLINE) : null;
      if (savedOffline) {
        setOfflineModeState(savedOffline === "true");
      }
    } catch {
      setProducts(initialProducts);
    }

    // Background sync from MongoDB Atlas (only if remote Atlas cluster is connected)
    fetch("/api/products")
      .then((res) => res.json())
      .then((res) => {
        if (res && res.source === "mongodb-atlas" && Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
          db.products.saveAll(res.data);
        }
      })
      .catch((err) => {
        console.log("[AppContext] Using local cache, MongoDB sync pending:", err.message);
      });
  }, []);

  // Sync products through central DB layer
  const saveProductsToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    db.products.saveAll(updatedProducts);
  };

  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setOfflineMode = (enabled: boolean) => {
    setOfflineModeState(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("shilpsutra_offline", String(enabled));
    }
    if (enabled) {
      showToast("Offline Mode Enabled. New crafts and edits will be stored locally.", "warning");
    } else {
      showToast("Online Connection Restored!", "success");
    }
  };

  const addProduct = (newProduct: Product) => {
    if (offlineMode) {
      const queueItem: OfflineQueueItem = {
        id: `queue-${Date.now()}`,
        operationType: "CREATE_PRODUCT",
        entityName: newProduct.name,
        payload: newProduct,
        timestamp: new Date().toISOString(),
        status: "QUEUED",
      };
      const updatedQueue = db.queue.enqueue(queueItem);
      setOfflineQueue(updatedQueue);
      showToast(`Saved to offline queue: "${newProduct.name}"`, "warning");
    } else {
      db.products.create(newProduct);
      setProducts(db.products.findMany());
      showToast(`Published "${newProduct.name}" to Marketplace!`, "success");

      // Asynchronously push to MongoDB Atlas
      fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      }).catch((err) => console.warn("[MongoDB Push Failed]", err));
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    if (offlineMode) {
      const queueItem: OfflineQueueItem = {
        id: `queue-${Date.now()}`,
        operationType: "UPDATE_PRICE",
        entityName: updates.name || "Product Edit",
        payload: { id, updates },
        timestamp: new Date().toISOString(),
        status: "QUEUED",
      };
      const updatedQueue = db.queue.enqueue(queueItem);
      setOfflineQueue(updatedQueue);
    } else {
      fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).catch((err) => console.warn("[MongoDB Update Failed]", err));
    }

    db.products.update(id, updates);
    setProducts(db.products.findMany());
    showToast("Product updated successfully", "success");
  };

  const deleteProduct = (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    const prodName = targetProduct?.name || "Product";

    if (offlineMode) {
      const queueItem: OfflineQueueItem = {
        id: `queue-${Date.now()}`,
        operationType: "DELETE_PRODUCT",
        entityName: prodName,
        payload: { id },
        timestamp: new Date().toISOString(),
        status: "QUEUED",
      };
      const updatedQueue = db.queue.enqueue(queueItem);
      setOfflineQueue(updatedQueue);
    } else {
      fetch(`/api/products/${id}`, {
        method: "DELETE",
      }).catch((err) => console.warn("[MongoDB Delete Failed]", err));
    }

    db.products.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${prodName}" deleted from your listings.`, "info");
  };

  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;

    showToast(`Syncing ${offlineQueue.length} pending items to server...`, "info");
    
    // Sync queue items to MongoDB Atlas
    for (const item of offlineQueue) {
      try {
        if (item.operationType === "CREATE_PRODUCT") {
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.payload),
          });
        } else if (item.operationType === "UPDATE_PRICE" || item.operationType === "UPDATE_NAME") {
          const { id, updates } = item.payload;
          await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
        } else if (item.operationType === "DELETE_PRODUCT") {
          const { id } = item.payload;
          await fetch(`/api/products/${id}`, {
            method: "DELETE",
          });
        }
      } catch (err) {
        console.warn("[Sync item error]", err);
      }
    }

    let updatedProducts = [...products];
    offlineQueue.forEach((item) => {
      if (item.operationType === "CREATE_PRODUCT") {
        const prod = item.payload as Product;
        prod.status = "PUBLISHED";
        if (!updatedProducts.some((p) => p.id === prod.id)) {
          updatedProducts = [prod, ...updatedProducts];
        }
      } else if (item.operationType === "UPDATE_PRICE" || item.operationType === "UPDATE_NAME") {
        const { id, updates } = item.payload;
        updatedProducts = updatedProducts.map((p) => (p.id === id ? { ...p, ...updates } : p));
      } else if (item.operationType === "DELETE_PRODUCT") {
        const { id } = item.payload;
        updatedProducts = updatedProducts.filter((p) => p.id !== id);
      }
    });

    db.products.saveAll(updatedProducts);
    setProducts(updatedProducts);
    db.queue.clear();
    setOfflineQueue([]);
    setOfflineModeState(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DB_KEYS.OFFLINE, "false");
    }
    showToast("All offline items synchronized to MongoDB Atlas & published!", "success");
  };

  const resetDemoData = () => {
    db.resetAll();
    setProducts(db.products.findMany());
    setOfflineModeState(false);
    setOfflineQueue([]);
    setCurrentArtisanState(initialArtisans[0]);

    // Reseed MongoDB Atlas
    fetch("/api/products/seed", { method: "POST" })
      .catch((err) => console.warn("[MongoDB Reseed Failed]", err));

    showToast("Prototype data reset to initial pristine state.", "info");
  };

  const setCurrentArtisan = (artisan: Artisan) => {
    setCurrentArtisanState(artisan);
    showToast(`Switched active artisan to ${artisan.name}`, "info");
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("shilpsutra_user_role", role);
    }
    setIsRoleModalOpen(false);
    showToast(
      role === "seller"
        ? "Artisan Studio Mode Active (शिल्पकार मोड)"
        : "Buyer & Connoisseur Mode Active (खरीदार मोड)",
      "success"
    );
  };

  const openRoleModal = () => {
    setIsRoleModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        artisans,
        currentArtisan,
        setCurrentArtisan,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        buyerMatches,
        offlineMode,
        setOfflineMode,
        offlineQueue,
        syncOfflineQueue,
        resetDemoData,
        toasts,
        showToast,
        removeToast,
        userRole,
        setUserRole,
        isRoleModalOpen,
        setIsRoleModalOpen,
        openRoleModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
