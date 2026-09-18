/**
 * ShilpSutra Database Service (lib/db.ts)
 * -------------------------------------------------------------
 * Central database layer for ShilpSutra.
 * 
 * Architecture:
 * - Offline-First Local Database Client with automatic local persistence
 * - Seed Data Initializer (Craft Products, Master Artisans, B2B Buyers & ONDC Nodes)
 * - Standardized CRUD Interface for:
 *     • db.products (create, findMany, findById, update, delete, reset)
 *     • db.artisans (findMany, findById, getActive, setActive)
 *     • db.buyers   (findMany, findById)
 *     • db.queue    (findMany, enqueue, clear)
 * 
 * Pluggable:
 * - Can be swapped directly with SQLite (better-sqlite3 / Prisma), PostgreSQL, 
 *   Supabase, or MongoDB without changing frontend UI components.
 */

import { Product, Artisan, BuyerMatch, OfflineQueueItem } from "@/types";
import { initialProducts } from "@/data/initialProducts";
import { initialArtisans } from "@/data/initialArtisans";
import { initialBuyerMatches } from "@/data/initialBuyers";

export const DB_KEYS = {
  PRODUCTS: "shilpsutra_products",
  QUEUE: "shilpsutra_queue",
  OFFLINE: "shilpsutra_offline",
  ACTIVE_ARTISAN: "shilpsutra_active_artisan",
  LANGUAGE: "shilpsutra_lang"
} as const;

class ShilpSutraDatabase {
  // ==========================================
  // 1. PRODUCTS TABLE / REPOSITORY
  // ==========================================
  products = {
    /**
     * Retrieve all products from the database.
     * Falls back to initial seed if table is empty.
     */
    findMany: (): Product[] => {
      if (typeof window === "undefined") return initialProducts;
      try {
        const raw = localStorage.getItem(DB_KEYS.PRODUCTS);
        if (raw === null) {
          localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialProducts));
          return initialProducts;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Automatic migration: replace any old legacy basket products with new serving trays
          let needsResave = false;
          const updated = parsed.map((p: Product) => {
            if (p.id === "prod-bamboo-basket-1" && (p.name.toLowerCase().includes("basket") || p.name.toLowerCase().includes("fruit"))) {
              needsResave = true;
              return initialProducts.find(ip => ip.id === "prod-bamboo-basket-1") || p;
            }
            if (p.id === "prod-assam-tray-32" && (p.name.toLowerCase().includes("basket") || p.name.toLowerCase().includes("fruit"))) {
              needsResave = true;
              return initialProducts.find(ip => ip.id === "prod-assam-tray-32") || p;
            }
            if (p.name && (p.name.toLowerCase().includes("bamboo fruit basket") || p.name === "Handcrafted Gond Bamboo Basket" || p.name === "Hand-Split Cane Fruit & Bread Basket")) {
              needsResave = true;
              const match = initialProducts.find(ip => ip.id === p.id);
              return match || null;
            }
            return p;
          }).filter(Boolean) as Product[];

          if (needsResave) {
            localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updated));
            return updated;
          }
          return parsed;
        }
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialProducts));
        return initialProducts;
      } catch (err) {
        console.error("[DB Error] Failed to read products:", err);
        return initialProducts;
      }
    },

    /**
     * Retrieve a single product by unique ID.
     */
    findById: (id: string): Product | null => {
      const all = this.products.findMany();
      return all.find((p) => p.id === id) || null;
    },

    /**
     * Insert a new product into the database.
     */
    create: (newProduct: Product): Product => {
      const all = this.products.findMany();
      const updated = [newProduct, ...all];
      if (typeof window !== "undefined") {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updated));
      }
      return newProduct;
    },

    /**
     * Update an existing product by ID.
     */
    update: (id: string, updates: Partial<Product>): Product | null => {
      const all = this.products.findMany();
      let updatedProduct: Product | null = null;
      const updatedList = all.map((p) => {
        if (p.id === id) {
          updatedProduct = { ...p, ...updates };
          return updatedProduct;
        }
        return p;
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updatedList));
      }
      return updatedProduct;
    },

    /**
     * Delete a product by ID.
     */
    delete: (id: string): boolean => {
      const all = this.products.findMany();
      const filtered = all.filter((p) => p.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(filtered));
      }
      return filtered.length < all.length;
    },

    /**
     * Batch save products.
     */
    saveAll: (products: Product[]): void => {
      if (typeof window !== "undefined") {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
      }
    },

    /**
     * Reset products table to pristine seed dataset.
     */
    reset: (): Product[] => {
      if (typeof window !== "undefined") {
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      }
      return initialProducts;
    }
  };

  // ==========================================
  // 2. ARTISANS TABLE / REPOSITORY
  // ==========================================
  artisans = {
    findMany: (): Artisan[] => initialArtisans,

    findById: (id: string): Artisan | null => {
      return initialArtisans.find((a) => a.id === id) || null;
    },

    getActive: (): Artisan => {
      if (typeof window === "undefined") return initialArtisans[0];
      try {
        const savedId = localStorage.getItem(DB_KEYS.ACTIVE_ARTISAN);
        return initialArtisans.find((a) => a.id === savedId) || initialArtisans[0];
      } catch {
        return initialArtisans[0];
      }
    },

    setActive: (artisan: Artisan): void => {
      if (typeof window !== "undefined") {
        localStorage.setItem(DB_KEYS.ACTIVE_ARTISAN, artisan.id);
      }
    }
  };

  // ==========================================
  // 3. BUYERS & MARKET LINKAGES TABLE
  // ==========================================
  buyers = {
    findMany: (): BuyerMatch[] => initialBuyerMatches,

    findById: (id: string): BuyerMatch | null => {
      return initialBuyerMatches.find((b) => b.id === id) || null;
    }
  };

  // ==========================================
  // 4. OFFLINE SYNC QUEUE TABLE
  // ==========================================
  queue = {
    findMany: (): OfflineQueueItem[] => {
      if (typeof window === "undefined") return [];
      try {
        const raw = localStorage.getItem(DB_KEYS.QUEUE);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },

    enqueue: (item: OfflineQueueItem): OfflineQueueItem[] => {
      const items = this.queue.findMany();
      const updated = [...items, item];
      if (typeof window !== "undefined") {
        localStorage.setItem(DB_KEYS.QUEUE, JSON.stringify(updated));
      }
      return updated;
    },

    clear: (): void => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(DB_KEYS.QUEUE);
      }
    }
  };

  // ==========================================
  // 5. DATABASE UTILITIES & PURGE
  // ==========================================
  /**
   * Resets all tables in the database to initial clean seed state.
   */
  resetAll = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DB_KEYS.PRODUCTS);
      localStorage.removeItem(DB_KEYS.QUEUE);
      localStorage.removeItem(DB_KEYS.OFFLINE);
      localStorage.removeItem(DB_KEYS.ACTIVE_ARTISAN);
    }
    this.products.reset();
  };
}

// Export singleton database instance
export const db = new ShilpSutraDatabase();
export default db;
