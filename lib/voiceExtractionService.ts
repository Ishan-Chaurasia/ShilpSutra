import { ExtractedProductDetails } from "@/types";

/**
 * Parses spoken speech transcript into structured product attributes.
 * Enforces strict rule: ONLY populate attributes mentioned or confidently inferred.
 * Does NOT invent prices, materials, origins, or certifications.
 */
export function extractProductFromSpeech(transcript: string, language: string = "hi"): ExtractedProductDetails {
  const text = transcript.trim();
  const lower = text.toLowerCase();

  // 1. Extract Price if mentioned (e.g. "1800 rupees", "₹1800", "price is 1800", "1800 rupaye", "daam 1800")
  let price: number | undefined = undefined;
  const priceMatch = lower.match(/(?:price|daam|keemat|cost|₹|rs\.?)\s*(?:is|hai)?\s*(\d+)|(\d+)\s*(?:rupees|rupaye|rs|\/\-)/i);
  if (priceMatch) {
    const rawVal = priceMatch[1] || priceMatch[2];
    if (rawVal) {
      const parsed = parseInt(rawVal, 10);
      if (!isNaN(parsed) && parsed > 0) {
        price = parsed;
      }
    }
  }

  // 2. Extract Color
  const colorMap: Record<string, string> = {
    "dark red": "Dark Red",
    "royal blue": "Royal Blue",
    "deep blue": "Deep Blue",
    "navy blue": "Navy Blue",
    "light blue": "Light Blue",
    "sky blue": "Sky Blue",
    "forest green": "Forest Green",
    "emerald green": "Emerald Green",
    "bottle green": "Bottle Green",
    "light green": "Light Green",
    "mustard yellow": "Mustard Yellow",
    "golden yellow": "Golden Yellow",
    "bright yellow": "Bright Yellow",
    "red": "Red",
    "blue": "Blue",
    "green": "Green",
    "yellow": "Yellow",
    "golden": "Golden",
    "gold": "Gold",
    "silver": "Silver",
    "black": "Black",
    "white": "White",
    "brown": "Brown",
    "terracotta": "Terracotta",
    "orange": "Orange",
    "pink": "Pink",
    "maroon": "Maroon",
    "beige": "Beige",
    "cream": "Cream",
    // Hindi colors
    "laal": "Red",
    "lal": "Red",
    "peela": "Yellow",
    "hara": "Green",
    "neela": "Blue",
    "safed": "White",
    "kaala": "Black",
    "kala": "Black",
    "sunehra": "Golden",
    "gulabi": "Pink",
    "bhura": "Brown"
  };

  let color = "";
  for (const [key, val] of Object.entries(colorMap)) {
    if (lower.includes(key)) {
      color = val;
      break;
    }
  }

  // 3. Extract Material
  const materialList = [
    "mulberry silk", "tussar silk", "chanderi silk", "pure silk", "silk",
    "organic cotton", "khadi cotton", "cotton",
    "terracotta clay", "riverbed clay", "clay", "terracotta",
    "mature bamboo", "cane", "bamboo",
    "brass", "bell metal", "bronze", "copper",
    "sheesham wood", "teak wood", "wood",
    "jute", "wool", "leather"
  ];
  let material = "";
  for (const mat of materialList) {
    if (lower.includes(mat)) {
      material = mat.charAt(0).toUpperCase() + mat.slice(1);
      break;
    }
  }
  // Hindi material mappings
  if (!material) {
    if (lower.includes("sooti") || lower.includes("suti") || lower.includes("सूती")) material = "Cotton";
    else if (lower.includes("reshami") || lower.includes("resham") || lower.includes("रेशमी") || lower.includes("सिल्क")) material = "Silk";
    else if (lower.includes("mitti") || lower.includes("माटी") || lower.includes("मिट्टी")) material = "Natural Clay";
    else if (lower.includes("baans") || lower.includes("बांस") || lower.includes("बाँस")) material = "Bamboo";
    else if (lower.includes("peetal") || lower.includes("पीतल")) material = "Brass";
    else if (lower.includes("lakdi") || lower.includes("लकड़ी")) material = "Wood";
  }

  // 4. Extract Category & Craft Type
  let category = "Handicrafts";
  let craftType = "";
  let productName = "";

  if (lower.includes("saree") || lower.includes("sari") || lower.includes("साड़ी") || lower.includes("साड़ी")) {
    category = "Saree";
    craftType = lower.includes("handloom") || lower.includes("handwoven") || lower.includes("haath se") || lower.includes("buni") ? "Handwoven" : "Textile";
    productName = [craftType, color, material, "Saree"].filter(Boolean).join(" ");
  } else if (lower.includes("dupatta") || lower.includes("chunni") || lower.includes("दुपट्टा")) {
    category = "Dupatta & Stoles";
    craftType = lower.includes("handwoven") ? "Handwoven" : "Textile";
    productName = [craftType, color, material, "Dupatta"].filter(Boolean).join(" ");
  } else if (lower.includes("basket") || lower.includes("tokri") || lower.includes("टोकरी")) {
    category = "Bamboo & Cane";
    craftType = "Handwoven Bamboo Basketry";
    productName = [craftType, color, material, "Basket"].filter(Boolean).join(" ");
  } else if (lower.includes("lamp") || lower.includes("diya") || lower.includes("lantern") || lower.includes("दीपक") || lower.includes("दीया")) {
    category = lower.includes("terracotta") || lower.includes("clay") || lower.includes("mitti") ? "Terracotta & Pottery" : "Home Décor";
    craftType = lower.includes("terracotta") || lower.includes("clay") ? "Pierced Pottery" : "Artisanal Lighting";
    productName = [color, material, "Pierced Lamp"].filter(Boolean).join(" ");
  } else if (lower.includes("pot") || lower.includes("matka") || lower.includes("vase") || lower.includes("मटका")) {
    category = "Terracotta & Pottery";
    craftType = "Wheel-Thrown Pottery";
    productName = [color, material, "Clay Pot"].filter(Boolean).join(" ");
  } else if (lower.includes("shawl") || lower.includes("शॉल")) {
    category = "Shawls & Stoles";
    craftType = "Handloom Weaving";
    productName = [color, material, "Shawl"].filter(Boolean).join(" ");
  } else if (lower.includes("box") || lower.includes("dibba") || lower.includes("डिब्बा")) {
    category = "Home Décor";
    craftType = "Handcrafted Joinery";
    productName = [color, material, "Keepsake Box"].filter(Boolean).join(" ");
  } else {
    // Default fallback based on detected craft words
    if (material) {
      productName = `${color ? color + " " : ""}${material} Craft`;
    } else {
      productName = "Handcrafted Artisan Product";
    }
  }

  // 5. Extract Region / Origin
  const regions = [
    "Madhya Pradesh", "Uttar Pradesh", "Rajasthan", "Gujarat", "West Bengal",
    "Odisha", "Bihar", "Chhattisgarh", "Assam", "Kashmir", "Tamil Nadu",
    "Karnataka", "Kerala", "Maharashtra", "Punjab", "Haryana", "Andhra Pradesh",
    "Chanderi", "Varanasi", "Gorakhpur", "Molela", "Bastar", "Betul", "Jaipur", "Kutch"
  ];
  let origin = "";
  for (const reg of regions) {
    if (lower.includes(reg.toLowerCase())) {
      origin = reg;
      break;
    }
  }

  // 6. Extract Design / Pattern
  let design = "";
  const designPatterns = [
    { key: "traditional golden patterns", val: "Traditional Golden Pattern" },
    { key: "golden pattern", val: "Traditional Golden Pattern" },
    { key: "golden patterns", val: "Traditional Golden Pattern" },
    { key: "zari pattern", val: "Zari Border & Buttis" },
    { key: "zari", val: "Traditional Zari Work" },
    { key: "peacock", val: "Peacock Motif" },
    { key: "floral", val: "Floral Motif" },
    { key: "geometric", val: "Geometric Weave" },
    { key: "pierced", val: "Hand-Pierced Lattice" },
    { key: "jaali", val: "Lattice Cutwork" },
    { key: "gond art", val: "Gond Tribal Pattern" },
    { key: "tribal", val: "Tribal Motif" },
    { key: "plain", val: "Minimalist Solid" }
  ];
  for (const item of designPatterns) {
    if (lower.includes(item.key)) {
      design = item.val;
      break;
    }
  }

  // 7. Extract Dimensions if mentioned
  let dimensions: string | undefined = undefined;
  const dimMatch = text.match(/(\d+(?:\.\d+)?\s*(?:meters?|m|cm|inches?|ft|feet|x\s*\d+))/i);
  if (dimMatch) {
    dimensions = dimMatch[1];
  }

  // 8. Extract Quantity if mentioned
  let quantity: string | undefined = undefined;
  const qtyMatch = lower.match(/(?:quantity|stock|pieces?|pcs?|nag|items?)\s*(?:is|hai)?\s*(\d+)|(\d+)\s*(?:pieces?|pcs?|items?)/i);
  if (qtyMatch) {
    quantity = qtyMatch[1] || qtyMatch[2];
  }

  // 9. Generate Clean, Marketplace-Ready Description
  // Note: Following rule: Do not add unsupported claims such as "100% authentic", "premium quality", "certified", "eco-friendly", "handmade" unless provided.
  const descriptionParts: string[] = [];
  if (craftType && productName) {
    descriptionParts.push(`This is a ${craftType.toLowerCase()} ${productName.toLowerCase()}.`);
  } else {
    descriptionParts.push(`This is a ${text.split(".")[0]}.`);
  }

  const specSentences: string[] = [];
  if (color && material) {
    specSentences.push(`Crafted in ${color.toLowerCase()} using ${material.toLowerCase()}.`);
  } else if (material) {
    specSentences.push(`Crafted using ${material.toLowerCase()}.`);
  } else if (color) {
    specSentences.push(`Features a ${color.toLowerCase()} finish.`);
  }

  if (design) {
    specSentences.push(`Adorned with ${design.toLowerCase()}.`);
  }

  if (origin) {
    specSentences.push(`Originates from the artisanal traditions of ${origin}.`);
  }

  if (dimensions) {
    specSentences.push(`Dimensions: ${dimensions}.`);
  }

  if (specSentences.length > 0) {
    descriptionParts.push(specSentences.join(" "));
  }

  const description = descriptionParts.join(" ");

  return {
    productName: productName || "Handcrafted Product",
    category: category || "Handicrafts",
    craftType: craftType || "Traditional Craft",
    material: material || "",
    color: color || "",
    design: design || "",
    origin: origin || "",
    dimensions,
    price,
    quantity,
    description: description || text,
    additionalCharacteristics: ""
  };
}

/**
 * Builds the image generation prompt strictly from the confirmed product details.
 * Implements the ShilpSutra AI product photography generator instructions.
 */
export function buildImagePromptFromDetails(details: ExtractedProductDetails): string {
  const productName = details.productName?.trim() || "Handcrafted Product";
  const category = details.category?.trim() || "Handicrafts";
  const craftType = details.craftType?.trim() || "not provided";
  const material = details.material?.trim() || "not provided";
  const color = details.color?.trim() || "not provided";
  const design = details.design?.trim() || "not provided";
  const origin = details.origin?.trim() || "not provided";
  const dimensions = details.dimensions?.trim() || "not provided";
  const additionalCharacteristics = details.additionalCharacteristics?.trim() || "not provided";
  const description = details.description?.trim() || "not provided";

  return `You are an AI product photography generator for **ShilpSutra**, a marketplace for artisan products.

Generate a **highly realistic e-commerce product photograph** based strictly on the confirmed product information provided below.

### CONFIRMED PRODUCT INFORMATION

Product Name: ${productName}
Category: ${category}
Craft Type: ${craftType}
Material: ${material}
Color: ${color}
Design / Pattern: ${design}
Origin / Region: ${origin}
Dimensions: ${dimensions}
Additional Characteristics: ${additionalCharacteristics}
Description: ${description}

### IMAGE GENERATION INSTRUCTIONS

Create an accurate visual representation of the product described above.

1. **PRODUCT ACCURACY IS THE HIGHEST PRIORITY**
   * The generated product must visually match the confirmed product details.
   * Preserve the specified material, color, shape, structure, pattern, texture, craftsmanship, and distinctive characteristics.
   * If a detail is explicitly provided, represent it clearly.
   * Do not replace, reinterpret, or alter confirmed product attributes.

2. **DO NOT INVENT PRODUCT DETAILS**
   * Never invent materials, patterns, decorations, logos, embroidery, ornaments, accessories, labels, certifications, or cultural elements.
   * Do not infer specific regional or traditional designs unless they are explicitly described.
   * Do not add characteristics simply because they are common for that category.

3. **EXPLICIT FALLBACK FOR UNCLEAR, MISSING, OR CONTRADICTORY DETAILS**
   * Treat every field marked \`unknown\`, \`unclear\`, \`not provided\`, \`null\`, empty, or otherwise ambiguous as **unspecified**.
   * If a visual attribute is unclear, use the **simplest neutral visual interpretation** that does not introduce unsupported details.
   * Never guess a specific color, material, pattern, shape, ornament, texture, size, or design when it is not confirmed.
   * If two confirmed fields conflict, do **not** choose one arbitrarily. Use the least-specific visual interpretation that remains consistent with both, or omit the conflicting visual detail.
   * If the product itself cannot be identified with reasonable confidence, **do not generate a misleading specific product**. Return an image-generation failure state so the application can ask the artisan for clarification.
   * Missing optional information must never be replaced with fabricated information.
   * The fallback must preserve everything that is known while avoiding everything that is unknown.

4. **PRODUCT PHOTOGRAPHY**
   * Create a realistic professional e-commerce photograph.
   * Show the complete product clearly whenever possible.
   * Use natural-looking proportions and realistic physical structure.
   * Preserve realistic material texture and craftsmanship.
   * Use soft, balanced studio lighting.
   * Use a clean, subtle neutral background.
   * Keep the product as the primary subject.
   * Avoid excessive artistic effects or dramatic cinematic styling.

5. **ARTISAN CRAFT PRESERVATION**
   * Preserve handmade characteristics when the product is explicitly described as handmade or handwoven.
   * Maintain realistic variations in texture and craftsmanship.
   * Do not make the product look artificially perfect or digitally manufactured.

6. **CATALOGUE-READY OUTPUT**
   * Suitable for an online marketplace product listing.
   * Sharp product details.
   * Realistic colors.
   * Realistic shadows.
   * Accurate perspective.
   * No unnecessary props.
   * No people unless the product information specifically requires a person to demonstrate its use.

7. **TEXT AND BRANDING**
   Do NOT generate:
   * Text
   * Product names
   * Prices
   * Watermarks
   * Logos
   * Fake brand names
   * Labels
   * Promotional badges
   * UI elements

### CRITICAL SOURCE-OF-TRUTH RULE

The information above represents the **final, user-confirmed product data**.

Use ONLY this final information when generating the image.

If the artisan edited any field after speech-to-text, always use the edited value and completely ignore the original spoken value.

For example:

Original voice:
Color = Red

Final edited information:
Color = Royal Blue

The generated product MUST be Royal Blue.

### EXAMPLES OF FALLBACK BEHAVIOR

**Example 1 — Missing color**
\`\`\`text
Color: unknown
Material: Cotton
Product: Handwoven Saree
\`\`\`
Generate a realistic cotton saree without inventing a specific color or elaborate color combination.

**Example 2 — Missing pattern**
\`\`\`text
Color: Blue
Material: Silk
Design / Pattern: not provided
\`\`\`
Generate a plain/neutral blue silk representation without inventing embroidery, motifs, or traditional patterns.

**Example 3 — Unclear material**
\`\`\`text
Material: unclear
Color: Red
Product: Handcrafted Bag
\`\`\`
Do not assume leather, cotton, jute, or any other material. Represent the bag using only characteristics that are confidently established.

**Example 4 — Conflicting information**
\`\`\`text
Material: Cotton
Description: Silk fabric
\`\`\`
Do not arbitrarily decide that the product is cotton or silk. Avoid emphasizing the conflicting material attribute and flag the data for clarification before generating a definitive product image.

### OUTPUT

Generate only the product image when the product information is sufficiently clear.

The result should look like a **real photograph of the actual artisan product prepared for an online marketplace**, not an illustration, concept art, advertisement, or generic representation.

If the product cannot be represented accurately because essential information is unclear or contradictory, **do not fabricate an answer**; signal that clarification is required.`;
}
