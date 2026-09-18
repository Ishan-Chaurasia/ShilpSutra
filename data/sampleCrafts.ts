export interface SampleCraft {
  id: string;
  name: string;
  category: string;
  material: string;
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  rawMaterialCost: number;
  productionCost: number;
  confidence: number;
  description: string;
  culturalStory: string;
  tags: string[];
  rawImageUrl: string;
  enhancedImageUrl: string;
  voicePromptHi: string;
  voicePromptEn: string;
}

export const sampleCrafts: SampleCraft[] = [
  {
    id: "sample-bamboo-tray",
    name: "Handcrafted Bamboo Serving Tray",
    category: "Bamboo Handicrafts",
    material: "Natural Cane & Bamboo",
    suggestedPrice: 650,
    minPrice: 520,
    maxPrice: 850,
    rawMaterialCost: 140,
    productionCost: 220,
    confidence: 0.94,
    description: "An artisanal hand-woven bamboo serving tray made using traditional Gond herringbone weave. Lightweight, sturdy, water-resistant, and 100% eco-friendly.",
    culturalStory: "Handmade in Betul village using mature bamboo fibers harvested during the waxing moon, ensuring lifelong resilience and natural resistance against insects.",
    tags: ["Handmade", "Bamboo Tray", "Serving Tray", "Home Décor", "Gond Art"],
    // Raw photo simulates an artisan workshop environment
    rawImageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=85",
    // Enhanced photo simulates studio cutout & lighting
    enhancedImageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=85",
    voicePromptHi: "यह हाथ से बनी बाँस की सर्विंग ट्रे है, चाय और टेबल के लिए।",
    voicePromptEn: "This is a handmade bamboo serving tray for tea and table decor.",
  },
  {
    id: "sample-terracotta-lamp",
    name: "Terracotta Pierced Lantern",
    category: "Terracotta & Pottery",
    material: "Natural Clay & Mineral Pigment",
    suggestedPrice: 650,
    minPrice: 520,
    maxPrice: 850,
    rawMaterialCost: 80,
    productionCost: 240,
    confidence: 0.93,
    description: "Wheel-thrown, hand-punctured terracotta lamp casting intricate geometric ambient light patterns.",
    culturalStory: "Crafted by Molela terracotta sculptors using clay from the Banas river basin, sun-baked and fired in open wood kilns.",
    tags: ["Terracotta", "Pottery", "Lantern", "Diwali", "Handcrafted"],
    rawImageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&auto=format&fit=crop&q=85",
    enhancedImageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1600&auto=format&fit=crop&q=85",
    voicePromptHi: "मिट्टी का हाथ से बना पियर्स्ड दिया लैंप है, पूजा और लिविंग रूम के लिए।",
    voicePromptEn: "Handmade pierced terracotta diya lantern for pooja and living room.",
  },
  {
    id: "sample-silk-saree",
    name: "Chanderi Silk Tissue Saree",
    category: "Handwoven Textiles",
    material: "Pure Chanderi Silk & Zari",
    suggestedPrice: 2400,
    minPrice: 2100,
    maxPrice: 3200,
    rawMaterialCost: 750,
    productionCost: 900,
    confidence: 0.94,
    description: "Authentic Chanderi silk saree featuring peacock feather gold zari buttis and a glossy gossamer drape.",
    culturalStory: "Woven by traditional female weavers in Ashoknagar district over 5 days of intensive pit loom weaving.",
    tags: ["Chanderi", "Handloom", "Pure Silk", "GI Tagged", "Heritage"],
    rawImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=85",
    enhancedImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=85",
    voicePromptHi: "चंदेरी शुद्ध सिल्क और सोने की ज़री वाली हाथ से बुनी साड़ी है।",
    voicePromptEn: "Chanderi pure silk handwoven saree with gold zari work.",
  },
];
