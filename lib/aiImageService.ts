import { ExtractedProductDetails } from "@/types";

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
  seed: number;
  timestamp: string;
}

// Curated high-resolution fallback craft photographs mapped by craft category & color
export const CRAFT_FALLBACKS: Record<string, string[]> = {
  "saree-red": [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1600&auto=format&fit=crop&q=85"
  ],
  "saree-blue": [
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop&q=85"
  ],
  "saree-yellow": [
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1600&auto=format&fit=crop&q=85"
  ],
  "saree-green": [
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop&q=85"
  ],
  "saree-pink": [
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1600&auto=format&fit=crop&q=85"
  ],
  "saree-white": [
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1600&auto=format&fit=crop&q=85"
  ],
  "pottery-terracotta": [
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&auto=format&fit=crop&q=85"
  ],
  "pottery-lamp": [
    "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=1600&auto=format&fit=crop&q=85"
  ],
  "pottery-glazed": [
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop&q=85"
  ],
  "bamboo-basket": [
    "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1600&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=85"
  ],
  "bamboo-decor": [
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1600&auto=format&fit=crop&q=85"
  ],
  "metal-brass": [
    "https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=1600&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1600&auto=format&fit=crop&q=85"
  ],
  "wood-carving": [
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1600&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=85"
  ],
  "default": [
    "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1600&auto=format&fit=crop&q=85"
  ]
};

export function getFallbackImage(details?: ExtractedProductDetails): string {
  if (!details) return CRAFT_FALLBACKS.default[0];
  const cat = (details.category || "").toLowerCase();
  const name = (details.productName || "").toLowerCase();
  const col = (details.color || "").toLowerCase();
  const mat = (details.material || "").toLowerCase();

  // 1. Textiles & Sarees
  if (cat.includes("saree") || cat.includes("textile") || cat.includes("dupatta") || cat.includes("shawl") || name.includes("saree")) {
    if (col.includes("blue") || col.includes("neela")) return CRAFT_FALLBACKS["saree-blue"][0];
    if (col.includes("yellow") || col.includes("peela") || col.includes("mustard") || col.includes("gold")) return CRAFT_FALLBACKS["saree-yellow"][0];
    if (col.includes("green") || col.includes("hara")) return CRAFT_FALLBACKS["saree-green"][0];
    if (col.includes("pink") || col.includes("gulabi") || col.includes("magenta")) return CRAFT_FALLBACKS["saree-pink"][0];
    if (col.includes("white") || col.includes("safed") || col.includes("cream") || col.includes("beige")) return CRAFT_FALLBACKS["saree-white"][0];
    return CRAFT_FALLBACKS["saree-red"][0];
  }

  // 2. Pottery & Terracotta
  if (cat.includes("pottery") || cat.includes("terracotta") || cat.includes("clay") || name.includes("pot") || name.includes("lamp") || name.includes("diya")) {
    if (name.includes("lamp") || name.includes("diya") || name.includes("lantern")) return CRAFT_FALLBACKS["pottery-lamp"][0];
    if (col.includes("blue") || name.includes("glazed") || name.includes("ceramic")) return CRAFT_FALLBACKS["pottery-glazed"][0];
    return CRAFT_FALLBACKS["pottery-terracotta"][0];
  }

  // 3. Bamboo & Cane
  if (cat.includes("bamboo") || cat.includes("cane") || cat.includes("basket") || mat.includes("bamboo") || mat.includes("cane")) {
    if (name.includes("decor") || name.includes("tray") || name.includes("lamp")) return CRAFT_FALLBACKS["bamboo-decor"][0];
    return CRAFT_FALLBACKS["bamboo-basket"][0];
  }

  // 4. Metal & Brass
  if (cat.includes("metal") || cat.includes("brass") || mat.includes("brass") || mat.includes("bronze") || mat.includes("bell metal")) {
    return CRAFT_FALLBACKS["metal-brass"][0];
  }

  // 5. Woodcraft
  if (cat.includes("wood") || mat.includes("wood") || mat.includes("teak") || mat.includes("sheesham")) {
    return CRAFT_FALLBACKS["wood-carving"][0];
  }

  return CRAFT_FALLBACKS.default[0];
}

/**
 * Builds the focused positive prompt sent to the Gemini image model.
 * Emphasizes still life product photography, flat lays for textiles, and studio backdrops.
 */
export function buildDiffusionPrompt(details?: ExtractedProductDetails): string {
  if (!details) {
    return "commercial e-commerce studio product photo of an authentic Indian handcrafted artisan product, white background, still life product photography, product only, no people, no text";
  }

  const name = details.productName || "artisan craft";
  const cat = (details.category || "").toLowerCase();
  const color = details.color && details.color !== "not provided" ? details.color : "";
  const mat = details.material && details.material !== "not provided" ? details.material : "";
  const design = details.design && details.design !== "not provided" ? details.design : "";
  const origin = details.origin && details.origin !== "not provided" ? `handcrafted in ${details.origin}` : "authentic Indian handcraft";

  // For sarees and textiles: flat lay / folded display prevents human faces from being hallucinated
  if (cat.includes("saree") || name.toLowerCase().includes("saree") || cat.includes("dupatta") || cat.includes("shawl") || cat.includes("textile")) {
    return `Professional e-commerce flat lay product photograph of an authentic ${origin} handwoven ${color} ${mat} ${name}, neatly folded and arranged on a clean white studio surface, ${design ? "featuring " + design + " pattern," : "with traditional border motifs,"} soft natural lighting, sharp textile texture details, no people, no text, no watermarks`;
  }

  // For terracotta, pottery, lamps
  if (cat.includes("pottery") || cat.includes("terracotta") || cat.includes("clay") || name.toLowerCase().includes("pot") || name.toLowerCase().includes("lamp") || name.toLowerCase().includes("diya")) {
    return `Professional e-commerce studio product photograph of an authentic ${origin} wheel-thrown ${color} ${mat} ${name} ${design ? "featuring " + design : ""}, on a clean white studio background, soft directional lighting showing clay texture and artisan handwork detail, no people, no text, no watermarks`;
  }

  // For bamboo and cane
  if (cat.includes("bamboo") || cat.includes("cane") || cat.includes("basket") || (mat || "").toLowerCase().includes("bamboo")) {
    return `Professional e-commerce studio product photograph of an authentic ${origin} hand-woven ${color} ${mat} ${name} ${design ? "with " + design : ""}, displayed on clean white studio background, natural bamboo fiber textures clearly visible, soft overhead lighting, no people, no text, no watermarks`;
  }

  // For metal and brass / Dhokra
  if (cat.includes("metal") || cat.includes("brass") || cat.includes("dhokra") || (mat || "").toLowerCase().includes("brass") || (mat || "").toLowerCase().includes("bronze")) {
    return `Professional e-commerce studio product photograph of an authentic ${origin} lost-wax cast ${color} ${mat} ${name} ${design ? "with " + design : ""}, on clean white studio background, warm directional lighting highlighting metallic brass sheen and intricate filigree details, no people, no text, no watermarks`;
  }

  // For wood
  if (cat.includes("wood") || (mat || "").toLowerCase().includes("wood") || (mat || "").toLowerCase().includes("teak") || (mat || "").toLowerCase().includes("sheesham")) {
    return `Professional e-commerce studio product photograph of an authentic ${origin} hand-chiseled ${color} ${mat} ${name} ${design ? "with " + design : ""}, on clean white studio background, soft natural lighting showing wood grain and artisan carving details, no people, no text, no watermarks`;
  }

  // For jewellery
  if (cat.includes("jewel") || cat.includes("necklace") || cat.includes("earring") || cat.includes("bangle")) {
    return `Professional e-commerce macro product photograph of an authentic ${origin} handcrafted ${color} ${mat} ${name} ${design ? "with " + design : ""}, laid flat or propped on clean white studio surface, soft diffused lighting highlighting intricate metalwork and stone details, no people, no text, no watermarks`;
  }

  return `Professional e-commerce studio product photograph of an authentic ${origin} handcrafted ${color} ${mat} ${name} ${design ? "featuring " + design : ""}, clean white studio background, soft professional lighting, sharp artisan craft detail visible, no people, no text, no watermarks`;
}

/**
 * Generates an AI product photograph using the Gemini native image generation API.
 * Falls back to curated category-matched Unsplash photos if Gemini is rate-limited or unavailable.
 */
export async function generateCraftImage(
  prompt: string,
  seed: number = Math.floor(Math.random() * 1000000),
  details?: ExtractedProductDetails
): Promise<GeneratedImageResult> {
  const timestamp = new Date().toISOString();

  // If client is completely offline, return matching category & color fallback immediately
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      imageUrl: getFallbackImage(details),
      prompt,
      seed,
      timestamp,
    };
  }

  const diffusionPrompt = buildDiffusionPrompt(details);
  const negativePrompt = "person, people, woman, girl, human, model, face, mannequin, hands, body, wearing, text, watermark, logo, duplicate products, collage, multiple objects, blurry, low quality";

  try {
    // Call the server-side Gemini image generation route
    const res = await fetch("/api/ai/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: diffusionPrompt,
        negativePrompt,
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.imageDataUrl && !data.fallback) {
        return {
          imageUrl: data.imageDataUrl,
          prompt: diffusionPrompt,
          seed,
          timestamp,
        };
      }
    }
  } catch (err) {
    console.warn("[generateCraftImage] Server image generation failed, using curated fallback:", (err as Error).message);
  }

  // Intelligent curated photo fallback — matches category and color precisely
  const fallbackUrl = getFallbackImage(details);
  return {
    imageUrl: fallbackUrl,
    prompt: diffusionPrompt,
    seed,
    timestamp,
  };
}
