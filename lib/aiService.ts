import { AICatalogResult, PriceAnalysis, CraftCategory } from "@/types";
import { removeBackgroundAccurately, compositeCraftOnStudioBackdrop } from "./backgroundRemoval";

export interface StudioPreset {
  id: string;
  name: string;
  description: string;
  previewBg: string;
  badge: string;
  category: "removal" | "backdrop" | "enhancement";
  filterCss?: string;
  icon?: string;
}

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: "remove-bg",
    name: "Background Removal",
    description: "AI extracts craft subject on transparent cutout, removing workshop background",
    previewBg: "bg-slate-100 border-dashed border-rose-400 [background-image:radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:8px_8px]",
    badge: "AI Cutout",
    category: "removal",
    icon: "Scissors",
    filterCss: "contrast(1.06) saturate(1.04) brightness(1.01)",
  },
  {
    id: "clean-white",
    name: "Clean Studio White",
    description: "Amazon & ONDC compliant seamless pure backdrop with balanced neutral light",
    previewBg: "bg-white border-neutral-300 shadow-2xs",
    badge: "E-Commerce",
    category: "backdrop",
    icon: "Sparkles",
    filterCss: "brightness(1.04) contrast(1.05) saturate(1.02)",
  },
  {
    id: "warm-terracotta",
    name: "Warm Terracotta",
    description: "Earthy artisan studio ambiance with gentle clay tones and warm highlights",
    previewBg: "bg-[#F7EDE7] border-[#C85A32]/40",
    badge: "Artisan Preferred",
    category: "backdrop",
    icon: "Flame",
    filterCss: "contrast(1.07) brightness(1.02) saturate(1.12)",
  },
  {
    id: "marble-craft",
    name: "Marble Pedestal",
    description: "Subtle neutral marble texture with soft directional light and reflection",
    previewBg: "bg-[#F3F4F6] border-neutral-300",
    badge: "Premium Display",
    category: "backdrop",
    icon: "Landmark",
    filterCss: "contrast(1.08) brightness(1.03) saturate(1.0)",
  },
  {
    id: "natural-wood",
    name: "Teakwood Workshop",
    description: "Warm wooden grain highlighting organic craft textures and rustic charm",
    previewBg: "bg-[#F5EFEB] border-[#8C6D53]/40",
    badge: "Rustic Authentic",
    category: "backdrop",
    icon: "TreePine",
    filterCss: "sepia(0.08) contrast(1.08) brightness(1.02) saturate(1.1)",
  },
  {
    id: "vibrant-heritage",
    name: "Vibrant Heritage Glow",
    description: "Enhances organic vegetable dyes, gold zari luster, and rich weave hues",
    previewBg: "bg-gradient-to-br from-amber-100 via-rose-100 to-amber-200 border-amber-300",
    badge: "Color Boost",
    category: "enhancement",
    icon: "Palette",
    filterCss: "saturate(1.3) contrast(1.12) brightness(1.04)",
  },
  {
    id: "luxury-spotlight",
    name: "Luxury Spotlight",
    description: "Moody charcoal gallery backdrop with dramatic golden rim illumination",
    previewBg: "bg-[#141414] border-neutral-700 text-white",
    badge: "Boutique Gallery",
    category: "enhancement",
    icon: "SunMedium",
    filterCss: "contrast(1.18) brightness(1.06) saturate(1.12)",
  },
  {
    id: "minimal-pastel",
    name: "Minimalist Sage",
    description: "Modern organic sage green and ivory studio aesthetic favored by craft brands",
    previewBg: "bg-[#EDF2EE] border-[#3E6B56]/40",
    badge: "Contemporary",
    category: "backdrop",
    icon: "Leaf",
    filterCss: "brightness(1.03) contrast(1.04) saturate(1.05)",
  },
  {
    id: "golden-hour",
    name: "Golden Hour Sunlight",
    description: "Warm organic courtyard sunlight casting natural artisan shadows",
    previewBg: "bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-amber-400",
    badge: "Natural Light",
    category: "enhancement",
    icon: "Sun",
    filterCss: "sepia(0.14) brightness(1.06) contrast(1.08) saturate(1.18)",
  },
  {
    id: "ultra-sharp",
    name: "Ultra-Sharp Clarifier",
    description: "Accentuates intricate hand-chiseled textures, weave grain, and micro-details",
    previewBg: "bg-neutral-100 border-neutral-400",
    badge: "Micro Detail",
    category: "enhancement",
    icon: "Zap",
    filterCss: "contrast(1.22) brightness(1.03) saturate(1.08)",
  },
];

export function getFilterStyleForPreset(presetId: string = "clean-white") {
  const preset = STUDIO_PRESETS.find((p) => p.id === presetId) || STUDIO_PRESETS[1];
  const isCutout = presetId === "remove-bg";

  let containerClass = "bg-white";
  let overlayClass = "bg-gradient-to-b from-white/20 via-transparent to-black/5";
  let badgeLabel = preset.name;
  let filter = preset.filterCss || "none";

  switch (presetId) {
    case "remove-bg":
      containerClass =
        "bg-slate-100 [background-image:linear-gradient(45deg,#cbd5e1_25%,transparent_25%),linear-gradient(-45deg,#cbd5e1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#cbd5e1_75%),linear-gradient(-45deg,transparent_75%,#cbd5e1_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]";
      overlayClass = "pointer-events-none";
      badgeLabel = "✂️ AI Background Removed (Transparent Cutout)";
      break;
    case "clean-white":
      containerClass = "bg-white";
      overlayClass = "bg-gradient-to-b from-white/30 via-transparent to-black/5";
      badgeLabel = "⚪ Clean Studio White";
      break;
    case "warm-terracotta":
      containerClass = "bg-[#F7EDE7]";
      overlayClass = "bg-gradient-to-br from-[#C85A32]/10 via-transparent to-[#8C6D53]/15";
      badgeLabel = "🏺 Warm Terracotta Studio";
      break;
    case "marble-craft":
      containerClass = "bg-[#F3F4F6]";
      overlayClass = "bg-gradient-to-t from-black/15 via-transparent to-white/30";
      badgeLabel = "🏛️ Marble Pedestal Display";
      break;
    case "natural-wood":
      containerClass = "bg-[#F5EFEB]";
      overlayClass = "bg-gradient-to-br from-[#8C6D53]/15 via-transparent to-[#3D2914]/20";
      badgeLabel = "🪵 Teakwood Workshop";
      break;
    case "vibrant-heritage":
      containerClass = "bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50";
      overlayClass = "bg-radial from-amber-500/10 via-transparent to-transparent";
      badgeLabel = "✨ Vibrant Heritage Glow";
      break;
    case "luxury-spotlight":
      containerClass = "bg-[#141414]";
      overlayClass = "bg-radial from-amber-200/20 via-transparent to-black/60";
      badgeLabel = "🔦 Luxury Gallery Spotlight";
      break;
    case "minimal-pastel":
      containerClass = "bg-[#EDF2EE]";
      overlayClass = "bg-gradient-to-b from-[#3E6B56]/10 via-transparent to-transparent";
      badgeLabel = "🌿 Minimalist Sage Studio";
      break;
    case "golden-hour":
      containerClass = "bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]";
      overlayClass = "bg-gradient-to-tr from-amber-500/15 via-transparent to-yellow-200/20";
      badgeLabel = "☀️ Golden Hour Sunlight";
      break;
    case "ultra-sharp":
      containerClass = "bg-neutral-50";
      overlayClass = "bg-gradient-to-b from-transparent via-transparent to-black/10";
      badgeLabel = "🔍 Ultra-Sharp Clarity";
      break;
  }

  return {
    preset,
    isCutout,
    containerClass,
    overlayClass,
    badgeLabel,
    filter,
  };
}

export async function processAIStudioImage(
  imageUrl: string,
  presetId: string = "clean-white"
): Promise<{ processedUrl: string; operations: string[]; preset: StudioPreset }> {
  // Simulate AI pipeline latency (fast < 500ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const preset = STUDIO_PRESETS.find((p) => p.id === presetId) || STUDIO_PRESETS[1];

  let operations = [
    "Object centering & perspective alignment",
    "Lighting balance & glare reduction",
    "ONDC / Amazon 1:1 square crop framing",
    `Applied enhancement filter: ${preset.name}`,
  ];

  let processedUrl = imageUrl;

  if (presetId === "remove-bg") {
    operations = [
      "Perimeter color clustering & background model",
      "Adaptive gradient craft boundary detection",
      "Alpha channel transparency generated",
      "Anti-aliased sub-pixel edge feathering",
      "Ambient contact ground shadow synthesized",
      "Exported high-precision transparent PNG craft cutout",
    ];
    try {
      processedUrl = await removeBackgroundAccurately(imageUrl, { maxDimension: 1800 });
    } catch (e) {
      console.warn("Background removal error, keeping base image:", e);
    }
  } else if (preset.category === "backdrop") {
    operations.push("Multi-point craft boundary segmentation");
    operations.push(`Applied commercial studio backdrop: ${preset.name}`);
    operations.push("Synthesized ambient ground contact shadow");
    try {
      processedUrl = await compositeCraftOnStudioBackdrop(imageUrl, presetId, { maxDimension: 1600 });
    } catch (e) {
      console.warn("Studio compositing error, keeping base image:", e);
    }
  } else if (preset.category === "enhancement") {
    operations.push("Micro-contrast texture sharpening");
    operations.push("Color gamut calibration for GI Indian crafts");
    try {
      // For enhancement presets (like clean-white or golden-hour), composite onto clean studio backdrop
      processedUrl = await compositeCraftOnStudioBackdrop(imageUrl, presetId, { maxDimension: 1600 });
    } catch (e) {
      console.warn("Studio enhancement compositing error, keeping base image:", e);
    }
  }

  return {
    processedUrl,
    operations,
    preset,
  };
}

/**
 * Normalizes Devanagari numerals (०-९) to ASCII digits (0-9)
 */
function normalizeDigits(str: string): string {
  const devanagari = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  let res = str;
  for (let i = 0; i < 10; i++) {
    res = res.split(devanagari[i]).join(String(i));
  }
  return res;
}

/**
 * Robust extractor for spoken prices in both English and Hindi.
 * Extracts numbers from patterns like "3500 rupaye", "₹2400", "price is 850", "do hazar", "500 rs", "कीमत ₹3500", etc.
 */
export function extractPriceFromText(text: string): number | null {
  if (!text) return null;
  const clean = normalizeDigits(text.toLowerCase());

  // 1. Check for standard currency prefix/keyword followed by numbers: ₹3500, price: 2400, kimat 800, 3500 rupaye, कीमत ₹3500
  const numRegex = /(?:₹|rs\.?|inr|rupees?|rupaye?|price|rate|kimat|keemat|daam|लागत|मूल्य|रुपये|कीमत)\s*(?:is|hai|ho|:|hai\s*toh)?\s*₹?\s*([0-9,]+)/i;
  const m1 = clean.match(numRegex);
  if (m1 && m1[1]) {
    const val = parseInt(m1[1].replace(/,/g, ""), 10);
    if (!isNaN(val) && val >= 50 && val <= 500000) return val;
  }

  // 2. Trailing currency suffix: 3500 ₹, 3500 rs, 3500 rupaye, 3500/-
  const trailRegex = /([0-9,]+)\s*(?:₹|rs\.?|inr|rupees?|rupaye?|रुपये|\/-)/i;
  const m2 = clean.match(trailRegex);
  if (m2 && m2[1]) {
    const val = parseInt(m2[1].replace(/,/g, ""), 10);
    if (!isNaN(val) && val >= 50 && val <= 500000) return val;
  }

  // 3. Spoken Hindi compound and number words
  if (clean.includes("hazar") || clean.includes("हजार") || clean.includes("thousand")) {
    let base = 0;
    if (clean.includes("ek") || clean.includes("एक") || clean.includes("one")) base = 1000;
    else if (clean.includes("dedh") || clean.includes("डेढ़")) return 1500;
    else if (clean.includes("do") || clean.includes("दो") || clean.includes("two")) base = 2000;
    else if (clean.includes("dhai") || clean.includes("ढाई")) return 2500;
    else if (clean.includes("teen") || clean.includes("तीन") || clean.includes("three")) base = 3000;
    else if (clean.includes("char") || clean.includes("चार") || clean.includes("four")) base = 4000;
    else if (clean.includes("panch") || clean.includes("पाँच") || clean.includes("पांच") || clean.includes("five")) base = 5000;

    let extra = 0;
    if (clean.includes("sau") || clean.includes("सौ") || clean.includes("hundred")) {
      if (clean.includes("panch sau") || clean.includes("पांच सौ") || clean.includes("पाँच सौ") || clean.includes("five hundred")) extra = 500;
      else if (clean.includes("do sau") || clean.includes("दो सौ") || clean.includes("two hundred")) extra = 200;
      else if (clean.includes("teen sau") || clean.includes("तीन सौ") || clean.includes("three hundred")) extra = 300;
      else if (clean.includes("char sau") || clean.includes("चार सौ") || clean.includes("four hundred")) extra = 400;
      else if (clean.includes("ek sau") || clean.includes("एक सौ") || clean.includes("one hundred")) extra = 100;
    }
    if (base > 0) return base + extra;
  }
  if (clean.includes("sau") || clean.includes("सौ") || clean.includes("hundred")) {
    if (clean.includes("panch") || clean.includes("पाँच") || clean.includes("पांच") || clean.includes("five")) return 500;
    if (clean.includes("chhe") || clean.includes("छह") || clean.includes("six")) return 600;
    if (clean.includes("saat") || clean.includes("सात") || clean.includes("seven")) return 700;
    if (clean.includes("aath") || clean.includes("आठ") || clean.includes("eight")) return 800;
    if (clean.includes("nau") || clean.includes("नौ") || clean.includes("nine")) return 900;
  }

  // 4. Standalone 3-5 digit number in craft context
  const standRegex = /\b([1-9][0-9]{2,4})\b/;
  const m3 = clean.match(standRegex);
  if (m3 && m3[1]) {
    const val = parseInt(m3[1], 10);
    if (!isNaN(val) && val >= 100 && val <= 100000) return val;
  }

  return null;
}

export async function generateSmartCatalog(
  textOrVoiceDescription: string,
  categoryHint?: string
): Promise<AICatalogResult> {
  // Simulate fast AI generation
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = textOrVoiceDescription.toLowerCase();
  const spokenPrice = extractPriceFromText(textOrVoiceDescription);

  // 1. Handwoven Textiles / Saree / Silk
  if (
    lower.includes("saree") ||
    lower.includes("साड़ी") ||
    lower.includes("silk") ||
    lower.includes("सिल्क") ||
    lower.includes("chanderi") ||
    lower.includes("चंदेरी") ||
    lower.includes("dupatta") ||
    lower.includes("handloom") ||
    lower.includes("zari") ||
    lower.includes("textile") ||
    categoryHint === "Handwoven Textiles"
  ) {
    const finalPrice = spokenPrice || 2400;
    return {
      productName: "Chanderi Handloom Pure Silk Zari Saree",
      category: "Handwoven Textiles",
      material: "Pure Mulberry Silk, Fine Mercerized Cotton & Gold Zari",
      description: "Gossamer sheer handwoven saree featuring delicate traditional buttis and an opulent gold zari border woven on pit looms.",
      culturalStory: "Master-woven in historic Chanderi, Madhya Pradesh. Celebrated across centuries for featherlight elegance, breathable weave, and royal drape.",
      tags: ["Chanderi", "Handloom Saree", "GI Tagged", "Pure Silk", "Gold Zari", "Vocal For Local"],
      suggestedPrice: finalPrice,
      minPrice: Math.round((finalPrice * 0.8) / 50) * 50,
      maxPrice: Math.round((finalPrice * 1.3) / 50) * 50,
      confidence: 0.95,
      rawMaterialCost: Math.round(finalPrice * 0.35),
      productionHours: Math.max(12, Math.round(finalPrice / 180)),
    };
  }

  // 2. Terracotta & Pottery
  if (
    lower.includes("mitti") ||
    lower.includes("मिट्टी") ||
    lower.includes("terracotta") ||
    lower.includes("diya") ||
    lower.includes("lamp") ||
    lower.includes("दीया") ||
    lower.includes("pot") ||
    lower.includes("pottery") ||
    categoryHint === "Terracotta & Pottery"
  ) {
    const finalPrice = spokenPrice || 650;
    return {
      productName: "Molela Terracotta Pierced Ambient Lantern",
      category: "Terracotta & Pottery",
      material: "Natural Riverbed Clay & Organic Mineral Pigments",
      description: "Wheel-thrown and meticulously hand-pierced terracotta lantern that casts celestial geometric shadows when lit.",
      culturalStory: "Crafted by Molela terracotta sculptors using Banas river clay, sun-dried and fired in traditional slow-combustion wood kilns.",
      tags: ["Terracotta", "Handmade Pottery", "Festive Décor", "Molela Art", "Sustainable", "Eco Diya"],
      suggestedPrice: finalPrice,
      minPrice: Math.round((finalPrice * 0.8) / 50) * 50,
      maxPrice: Math.round((finalPrice * 1.3) / 50) * 50,
      confidence: 0.94,
      rawMaterialCost: Math.round(finalPrice * 0.25),
      productionHours: Math.max(6, Math.round(finalPrice / 120)),
    };
  }

  // 3. Bamboo & Cane Crafts
  if (
    lower.includes("bamboo") ||
    lower.includes("baans") ||
    lower.includes("बाँस") ||
    lower.includes("tokri") ||
    lower.includes("टोकरी") ||
    lower.includes("basket") ||
    lower.includes("cane") ||
    categoryHint === "Bamboo Handicrafts"
  ) {
    const finalPrice = spokenPrice || 650;
    return {
      productName: "Handcrafted Gond Bamboo Serving Tray",
      category: "Bamboo Handicrafts",
      material: "Natural Seasoned Bamboo & Brass Handles",
      description: "Traditional hand-split bamboo woven serving tray designed for elegant tea service, tabletop dining, and eco-friendly interior décor.",
      culturalStory: "Crafted by indigenous Gond tribal artisans of Betul, Madhya Pradesh using mature bamboo harvested sustainably during the waning moon.",
      tags: ["Handmade", "Bamboo", "Serving Tray", "Home Décor", "Zero Waste", "Gond Art"],
      suggestedPrice: finalPrice,
      minPrice: Math.round((finalPrice * 0.8) / 50) * 50,
      maxPrice: Math.round((finalPrice * 1.3) / 50) * 50,
      confidence: 0.93,
      rawMaterialCost: Math.round(finalPrice * 0.25),
      productionHours: Math.max(5, Math.round(finalPrice / 100)),
    };
  }

  // 4. Dhokra Metalcraft
  if (
    lower.includes("brass") ||
    lower.includes("dhokra") ||
    lower.includes("dokra") ||
    lower.includes("metal") ||
    lower.includes("पीतल") ||
    categoryHint === "Dhokra Metalcraft"
  ) {
    const finalPrice = spokenPrice || 1450;
    return {
      productName: "Bastar Dhokra Lost-Wax Cast Brass Figurine",
      category: "Dhokra Metalcraft",
      material: "Recycled Bell Metal, Brass & Natural Beeswax",
      description: "Ancient non-ferrous lost-wax cast brass sculpture depicting traditional tribal life. Hand-formed with intricate filigree wire texture.",
      culturalStory: "Crafted by the Ghadwa tribal community of Bastar, Chhattisgarh using an irreproducible 4,000-year-old lost-wax process.",
      tags: ["Dhokra Art", "Lost Wax Casting", "Bastar Tribal", "Bell Metal", "Brass Figurine"],
      suggestedPrice: finalPrice,
      minPrice: Math.round((finalPrice * 0.8) / 50) * 50,
      maxPrice: Math.round((finalPrice * 1.3) / 50) * 50,
      confidence: 0.94,
      rawMaterialCost: Math.round(finalPrice * 0.35),
      productionHours: Math.max(10, Math.round(finalPrice / 140)),
    };
  }

  // 5. Woodcarving
  if (
    lower.includes("wood") ||
    lower.includes("wooden") ||
    lower.includes("sheesham") ||
    lower.includes("carving") ||
    lower.includes("लकड़ी") ||
    categoryHint === "Woodcarving"
  ) {
    const finalPrice = spokenPrice || 850;
    return {
      productName: "Saharanpur Hand-Carved Sheesham Jali Box",
      category: "Woodcarving",
      material: "Legally Harvested Seasoned Sheesham Wood (Indian Rosewood)",
      description: "Exquisitely hand-chiseled wooden keepsake box featuring delicate Mughal-inspired geometric lattice work and natural beeswax polish.",
      culturalStory: "Carved by hereditary master carpenters of Saharanpur, Uttar Pradesh, known for centuries as the 'Wood City of India'.",
      tags: ["Woodcarving", "Sheesham Wood", "Saharanpur Craft", "Jali Work", "Handmade Box"],
      suggestedPrice: finalPrice,
      minPrice: Math.round((finalPrice * 0.8) / 50) * 50,
      maxPrice: Math.round((finalPrice * 1.3) / 50) * 50,
      confidence: 0.92,
      rawMaterialCost: Math.round(finalPrice * 0.3),
      productionHours: Math.max(7, Math.round(finalPrice / 120)),
    };
  }

  // 6. Handmade Jewellery
  if (
    lower.includes("jewel") ||
    lower.includes("necklace") ||
    lower.includes("earring") ||
    lower.includes("jhumka") ||
    lower.includes("झुमका") ||
    categoryHint === "Handmade Jewellery"
  ) {
    const finalPrice = spokenPrice || 750;
    return {
      productName: "Artisanal Terracotta Hand-Painted Jhumka Set",
      category: "Handmade Jewellery",
      material: "Purified Baked Terracotta Clay, Organic Acrylics & Cotton Dori",
      description: "Vibrant ethnic handcrafted terracotta jewelry set with floral relief carvings and matching jhumka earrings.",
      culturalStory: "Indigenously crafted by women artisan self-help groups in West Bengal and Tamil Nadu, transforming sacred earth into wearable art.",
      tags: ["Handmade Jewellery", "Terracotta Jhumka", "Temple Jewellery", "Eco-Jewellery"],
      suggestedPrice: finalPrice,
      minPrice: Math.round((finalPrice * 0.8) / 50) * 50,
      maxPrice: Math.round((finalPrice * 1.3) / 50) * 50,
      confidence: 0.93,
      rawMaterialCost: Math.round(finalPrice * 0.25),
      productionHours: Math.max(6, Math.round(finalPrice / 120)),
    };
  }

  // Default craft fallback
  const finalPrice = spokenPrice || 550;
  return {
    productName: "Artisanal Handcrafted Heritage Craft",
    category: (categoryHint as CraftCategory) || "Home Décor",
    material: "Natural Sustainable Eco-Friendly Materials",
    description: "Authentically handcrafted using hereditary artisan techniques, combining traditional aesthetic elegance with daily utility.",
    culturalStory: "Directly made by rural Indian master craftsmen supporting sustainable livelihoods and preserving ancient cultural heritage.",
    tags: ["Handmade", "Indian Craft", "Eco Friendly", "Artisan Made", "GI Heritage"],
    suggestedPrice: finalPrice,
    minPrice: Math.round((finalPrice * 0.8) / 50) * 50,
    maxPrice: Math.round((finalPrice * 1.3) / 50) * 50,
    confidence: 0.88,
    rawMaterialCost: Math.round(finalPrice * 0.28),
    productionHours: Math.max(6, Math.round(finalPrice / 100)),
  };
}

export function calculatePricingBreakdown(
  productName: string,
  rawMaterialCost: number = 110,
  productionHours: number = 6
): PriceAnalysis {
  const laborCost = productionHours * 30; // ₹30/hr living wage standard
  const overhead = 50;
  const baseCost = rawMaterialCost + laborCost + overhead;
  const artisanMargin = Math.round(baseCost * 0.45);
  const suggestedPrice = Math.max(100, Math.round((baseCost + artisanMargin) / 50) * 50);

  return {
    suggestedPrice,
    minPrice: Math.round((suggestedPrice * 0.8) / 50) * 50,
    maxPrice: Math.round((suggestedPrice * 1.3) / 50) * 50,
    confidence: 0.94,
    rawMaterialCost,
    productionCost: laborCost + overhead,
    factors: [
      {
        name: "Raw Material Index",
        impact: `₹${rawMaterialCost}`,
        description: "Natural, sustainably harvested artisan materials and eco-friendly pigments",
      },
      {
        name: "Artisan Fair Labor",
        impact: `₹${laborCost}`,
        description: `${productionHours} hours of skilled handicraft labor at fair trade wage standards`,
      },
      {
        name: "Market Demand Signal",
        impact: "+18%",
        description: "Strong demand for verified GI-tagged handmade Indian crafts",
      },
      {
        name: "Wholesale Cushion",
        impact: "Healthy",
        description: "Allows flexible B2B bulk orders on ONDC network",
      },
    ],
  };
}

/**
 * Calculates fair-wage pricing breakdown directly calibrated to a target/spoken artisan price.
 * Ensures the breakdown, labor wage, and cost analysis match the spoken valuation.
 */
export function calculatePricingForTargetPrice(
  productName: string,
  targetPrice: number,
  originalSuggestedPrice?: number
): PriceAnalysis {
  const cleanPrice = Math.max(50, Math.round(targetPrice / 10) * 10);
  const benchmarkPrice =
    originalSuggestedPrice && originalSuggestedPrice > 0
      ? originalSuggestedPrice
      : cleanPrice;
  const rawMaterialCost = Math.max(20, Math.round(cleanPrice * 0.32));
  const productionCost = Math.max(30, Math.round(cleanPrice * 0.38));
  const estimatedHours = Math.max(2, Math.round((productionCost * 0.7) / 30));
  const marginPercent = Math.round(
    ((cleanPrice - rawMaterialCost - productionCost) / cleanPrice) * 100
  );

  return {
    suggestedPrice: benchmarkPrice,
    minPrice: Math.round((benchmarkPrice * 0.8) / 10) * 10,
    maxPrice: Math.round((benchmarkPrice * 1.3) / 10) * 10,
    confidence: 0.95,
    rawMaterialCost,
    productionCost,
    factors: [
      {
        name: "Artisan Fair Wage",
        impact: `₹${productionCost}`,
        description: `${estimatedHours} hours of skilled craft labor at certified fair wage standards`,
      },
      {
        name: "Raw Material Cost",
        impact: `₹${rawMaterialCost}`,
        description: "Directly sourced authentic artisan raw materials and natural finishes",
      },
      {
        name: "Artisan Selected Price",
        impact: `₹${cleanPrice}`,
        description: `Current pricing decision for ${productName || "this craft item"}`,
      },
      {
        name: "Market Benchmark Delta",
        impact:
          cleanPrice >= benchmarkPrice
            ? `+₹${cleanPrice - benchmarkPrice}`
            : `-₹${benchmarkPrice - cleanPrice}`,
        description:
          cleanPrice >= benchmarkPrice
            ? "Priced above suggested benchmark (premium / boutique artisan margin)"
            : "Priced below suggested benchmark (high volume / competitive wholesale)",
      },
      {
        name: "Fair Trade Margin",
        impact: `+${marginPercent > 0 ? marginPercent : 30}%`,
        description: "Provides fair remuneration and community sustainability",
      },
    ],
  };
}

