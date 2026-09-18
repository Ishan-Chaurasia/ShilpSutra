import { NextRequest, NextResponse } from "next/server";
import { analyzeCraftOffline } from "@/lib/aiVisionService";
import { analyzeCraftBuffer } from "@/lib/aiVisionServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, fileName, categoryHint } = body;

    // Check for API key from request headers, request body, or environment variables
    const apiKey =
      req.headers.get("x-gemini-api-key") ||
      body.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (apiKey && image && typeof image === "string" && image.includes("base64,")) {
      try {
        // Extract mime type and raw base64 data
        const [header, base64Data] = image.split(";base64,");
        const mimeType = header.replace("data:", "") || "image/jpeg";

        let prompt = `You are ShilpSutra's AI artisan craft cataloguer. ShilpSutra empowers rural Indian artisans by automatically converting their craft photos into market-ready e-commerce listings with fair living-wage pricing and ONDC tags.
Analyze this handcrafted Indian craft image and output a pure JSON object with the following schema:
{
  "productName": "Descriptive, authentic, alluring Indian craft title (e.g. 'Chanderi Handloom Pure Silk Zari Saree')",
  "category": "Must be one of: 'Bamboo Handicrafts', 'Handwoven Textiles', 'Terracotta & Pottery', 'Woodcarving', 'Dhokra Metalcraft', 'Handmade Jewellery', 'Home Décor'",
  "material": "Natural sustainable materials used (e.g. 'Pure Mulberry Silk & Antique Gold Zari')",
  "description": "2-3 sentences e-commerce description emphasizing texture, functionality, and artisanal finish",
  "culturalStory": "Artisan heritage story, regional origin in India, tribal/traditional community techniques, or GI significance",
  "tags": ["Handmade", "Indian Craft", 5-7 relevant keywords],
  "suggestedPrice": 2400,
  "minPrice": 1900,
  "maxPrice": 3100,
  "rawMaterialCost": 750,
  "productionHours": 14,
  "dimensions": "e.g. '6.3 meters with unstitched blouse' or '8 x 8 x 10 inches'",
  "confidence": 0.96,
  "detectedFeatures": ["Handcrafted weave texture", "Natural earthy finish"]
}
Output strictly valid JSON only.`;

        if (categoryHint) {
          prompt += `\nArtisan Workshop Craft Context: The artisan works primarily in "${categoryHint}". If the uploaded image depicts or relates to this craft tradition, categorize accordingly; otherwise identify the authentic craft accurately.`;
        }

        // Active Google Gemini Vision models
        const candidateModels = [
          "gemini-3.6-flash",
          "gemini-3-flash-preview",
          "gemini-flash-latest",
        ];

        for (const model of candidateModels) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const geminiRes = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(7500),
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: prompt },
                      {
                        inline_data: {
                          mime_type: mimeType,
                          data: base64Data,
                        },
                      },
                    ],
                  },
                ],
                generationConfig: {
                  response_mime_type: "application/json",
                },
              }),
            });

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawText) {
                let cleanedText = rawText.trim();
                if (cleanedText.startsWith("```")) {
                  cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
                }
                const parsed = JSON.parse(cleanedText.trim());

                // Normalize category to valid ShilpSutra CraftCategory
                let normalizedCategory = parsed.category || "Home Décor";
                const catLower = normalizedCategory.toLowerCase();
                if (catLower.includes("saree") || catLower.includes("textile") || catLower.includes("silk") || catLower.includes("weave") || catLower.includes("cloth") || catLower.includes("handloom") || catLower.includes("cotton")) {
                  normalizedCategory = "Handwoven Textiles";
                } else if (catLower.includes("pot") || catLower.includes("clay") || catLower.includes("terracotta") || catLower.includes("diya") || catLower.includes("ceramic")) {
                  normalizedCategory = "Terracotta & Pottery";
                } else if (catLower.includes("bamboo") || catLower.includes("cane") || catLower.includes("basket") || catLower.includes("wicker")) {
                  normalizedCategory = "Bamboo Handicrafts";
                } else if (catLower.includes("metal") || catLower.includes("dhokra") || catLower.includes("dokra") || catLower.includes("brass") || catLower.includes("bronze") || catLower.includes("bell")) {
                  normalizedCategory = "Dhokra Metalcraft";
                } else if (catLower.includes("wood") || catLower.includes("carving") || catLower.includes("sheesham") || catLower.includes("teak")) {
                  normalizedCategory = "Woodcarving";
                } else if (catLower.includes("jewel") || catLower.includes("necklace") || catLower.includes("jhumka") || catLower.includes("bangle")) {
                  normalizedCategory = "Handmade Jewellery";
                } else {
                  normalizedCategory = "Home Décor";
                }

                // Clean price if formatted as currency string (e.g. ₹12,500)
                let cleanPrice = parsed.suggestedPrice;
                if (typeof cleanPrice === "string") {
                  cleanPrice = parseInt(cleanPrice.replace(/[^0-9]/g, ""), 10) || 1500;
                } else if (typeof cleanPrice !== "number") {
                  cleanPrice = 1500;
                }

                return NextResponse.json({
                  ...parsed,
                  category: normalizedCategory,
                  suggestedPrice: cleanPrice,
                  minPrice: parsed.minPrice || Math.round(cleanPrice * 0.8),
                  maxPrice: parsed.maxPrice || Math.round(cleanPrice * 1.3),
                  rawMaterialCost: parsed.rawMaterialCost || Math.round(cleanPrice * 0.35),
                  productionHours: parsed.productionHours || 10,
                  confidence: parsed.confidence || 0.96,
                  detectedFeatures: Array.isArray(parsed.detectedFeatures) ? parsed.detectedFeatures : ["Authentic handcrafted finish"],
                  detectedColors: Array.isArray(parsed.detectedColors) ? parsed.detectedColors : ["Natural Craft Tones"],
                });
              }
            } else {
              console.warn(`Gemini Vision model ${model} returned non-OK status:`, geminiRes.status);
            }
          } catch (modelErr) {
            console.warn(`Error trying Gemini model ${model}:`, modelErr);
          }
        }
      } catch (geminiErr) {
        console.warn("Error invoking Gemini Vision API, falling back to local craft intelligence:", geminiErr);
      }
    }

    // High-Precision Pixel Vision Fallback using Sharp
    if (image && typeof image === "string" && image.includes("base64,")) {
      try {
        const [, base64Data] = image.split(";base64,");
        const buffer = Buffer.from(base64Data, "base64");
        const pixelAnalysis = await analyzeCraftBuffer(buffer, fileName, categoryHint);
        return NextResponse.json(pixelAnalysis);
      } catch (sharpErr) {
        console.warn("Pixel vision analysis failed, falling back to heuristic engine:", sharpErr);
      }
    }

    // Heuristic Fallback
    const craftAnalysis = analyzeCraftOffline(fileName || "handcrafted-artisan-product.jpg");
    return NextResponse.json(craftAnalysis);
  } catch (error) {
    console.error("AI Image analysis error:", error);
    const fallback = analyzeCraftOffline("handcrafted-artisan-product.jpg");
    return NextResponse.json(fallback);
  }
}
