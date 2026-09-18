import { VoiceCommand } from "@/types";
import { extractPriceFromText } from "./aiService";

export function parseVoiceIntent(transcript: string, language: "hi" | "en" = "hi"): VoiceCommand {
  const text = transcript.trim().toLowerCase();
  const id = `voice-cmd-${Date.now()}`;

  // 1. UPDATE_PRICE with robust Hindi/English extraction
  const extractedPrice = extractPriceFromText(transcript);
  if (extractedPrice) {
    return {
      id,
      transcript,
      language,
      intent: "UPDATE_PRICE",
      entities: {
        price: extractedPrice,
      },
      confidence: 0.96,
      spokenResponse: language === "hi" 
        ? `उत्पाद की कीमत ₹${extractedPrice.toLocaleString("en-IN")} कर दी गई है।`
        : `Product price has been updated to ₹${extractedPrice.toLocaleString("en-IN")}.`,
      timestamp: new Date().toISOString(),
    };
  }

  // Fallback regex for price
  const priceRegex = /(?:price|keemat|daam|rupaye|₹|rs\.?)\s*(\d+)|(\d+)\s*(?:rupaye|kar do|rs)/i;
  const priceMatch = text.match(priceRegex);

  if (priceMatch) {
    const rawNumber = priceMatch[1] || priceMatch[2];
    const extractedNumber = rawNumber ? parseInt(rawNumber, 10) : 500;

    return {
      id,
      transcript,
      language,
      intent: "UPDATE_PRICE",
      entities: {
        price: extractedNumber,
      },
      confidence: 0.96,
      spokenResponse: language === "hi" 
        ? `उत्पाद की कीमत ₹${extractedNumber.toLocaleString("en-IN")} कर दी गई है।`
        : `Product price has been updated to ₹${extractedNumber.toLocaleString("en-IN")}.`,
      timestamp: new Date().toISOString(),
    };
  }

  // 2. UPDATE_NAME
  // Patterns: "is product ka naam pure silk saree kar do", "naam brass diya kar do", "rename to terracotta lantern"
  if (text.includes("naam") || text.includes("name") || text.includes("rename") || text.includes("title")) {
    let extractedName = "";
    const nameMatch = text.match(/(?:naam|name|rename(?:\s+to)?|title)\s+(?:is\s+|to\s+|ka\s+)?(.+?)(?:\s+kar\s+do|\s+rakh\s+do|\s+set\s+kar\s+do|$)/i);
    if (nameMatch && nameMatch[1]) {
      extractedName = nameMatch[1].replace(/^(?:ka|to|is)\s+/i, "").trim();
      extractedName = extractedName.replace(/\b\w/g, (l) => l.toUpperCase());
    }
    const finalName = extractedName || (language === "hi" ? "कारीगर हस्तशिल्प" : "Artisan Handcrafted Craft");

    return {
      id,
      transcript,
      language,
      intent: "UPDATE_NAME",
      entities: {
        name: finalName,
      },
      confidence: 0.94,
      spokenResponse: language === "hi"
        ? `उत्पाद का नाम "${finalName}" सेट कर दिया गया है।`
        : `Product name has been updated to "${finalName}".`,
      timestamp: new Date().toISOString(),
    };
  }

  // 3. UPDATE_FILTER (Studio Backdrop & AI Removal Presets)
  if (
    text.includes("filter") || 
    text.includes("background") || 
    text.includes("backdrop") || 
    text.includes("कटआउट") || 
    text.includes("हटा") || 
    text.includes("पर्दा") ||
    text.includes("preset")
  ) {
    let preset = "clean-white";
    let presetLabel = "Clean Studio White";

    if (text.includes("remove") || text.includes("cutout") || text.includes("hata") || text.includes("transparent") || text.includes("पारदर्शी")) {
      preset = "remove-bg";
      presetLabel = "AI Background Removal (Cutout)";
    } else if (text.includes("terracotta") || text.includes("टेराकोटा") || text.includes("clay") || text.includes("mitti")) {
      preset = "warm-terracotta";
      presetLabel = "Warm Terracotta Studio";
    } else if (text.includes("wood") || text.includes("wooden") || text.includes("लकड़ी") || text.includes("teak")) {
      preset = "natural-wood";
      presetLabel = "Teakwood Workshop";
    } else if (text.includes("marble") || text.includes("मार्बल") || text.includes("pedestal")) {
      preset = "marble-craft";
      presetLabel = "Marble Pedestal";
    } else if (text.includes("gold") || text.includes("golden") || text.includes("धूप") || text.includes("sunlight")) {
      preset = "golden-hour";
      presetLabel = "Golden Hour Sunlight";
    } else if (text.includes("luxury") || text.includes("spotlight") || text.includes("dark")) {
      preset = "luxury-spotlight";
      presetLabel = "Luxury Gallery Spotlight";
    } else if (text.includes("vibrant") || text.includes("heritage")) {
      preset = "vibrant-heritage";
      presetLabel = "Vibrant Heritage Glow";
    } else if (text.includes("sage") || text.includes("minimal") || text.includes("pastel")) {
      preset = "minimal-pastel";
      presetLabel = "Minimalist Sage Studio";
    }

    return {
      id,
      transcript,
      language,
      intent: "UPDATE_FILTER",
      entities: {
        preset,
      },
      confidence: 0.95,
      spokenResponse: language === "hi"
        ? `बैकग्राउंड फिल्टर "${presetLabel}" लागू कर दिया गया है।`
        : `Studio backdrop filter set to "${presetLabel}".`,
      timestamp: new Date().toISOString(),
    };
  }

  // 4. UPDATE_DESCRIPTION
  if (text.includes("description") || text.includes("विवरण") || text.includes("describe") || text.includes("likh do")) {
    let descText = "";
    const descMatch = text.match(/(?:description|विवरण|likh do)\s+(?:is\s+|to\s+|mein\s+)?(.+?)(?:\s+kar\s+do|\s+set\s+kar\s+do|$)/i);
    if (descMatch && descMatch[1]) {
      descText = descMatch[1].trim();
      descText = descText.charAt(0).toUpperCase() + descText.slice(1);
    }
    const finalDesc = descText || transcript;
    return {
      id,
      transcript,
      language,
      intent: "UPDATE_DESCRIPTION",
      entities: {
        description: finalDesc,
      },
      confidence: 0.93,
      spokenResponse: language === "hi"
        ? "उत्पाद का विवरण अपडेट कर दिया गया है।"
        : "Product description has been updated.",
      timestamp: new Date().toISOString(),
    };
  }

  // 5. NEXT_STEP
  if (text.includes("next") || text.includes("अगला") || text.includes("आगे") || text.includes("aage") || text.includes("continue")) {
    return {
      id,
      transcript,
      language,
      intent: "NEXT_STEP",
      entities: {},
      confidence: 0.95,
      spokenResponse: language === "hi"
        ? "अगले चरण पर आगे बढ़ रहे हैं।"
        : "Proceeding to next step.",
      timestamp: new Date().toISOString(),
    };
  }

  // 6. GET_ENQUIRIES
  if (text.includes("enquiry") || text.includes("order") || text.includes("kitne") || text.includes("orders")) {
    return {
      id,
      transcript,
      language,
      intent: "GET_ENQUIRIES",
      entities: {},
      confidence: 0.92,
      spokenResponse: language === "hi"
        ? "आपके पास कुल 17 खरीदार पूछताछ हैं, जिसमें FabIndia का एक थोक ऑर्डर शामिल है।"
        : "You have 17 active buyer enquiries, including a wholesale requirement from FabIndia.",
      timestamp: new Date().toISOString(),
    };
  }

  // 7. PUBLISH
  if (text.includes("publish") || text.includes("bazaar") || text.includes("live kar do") || text.includes("bhej do")) {
    return {
      id,
      transcript,
      language,
      intent: "PUBLISH",
      entities: {},
      confidence: 0.95,
      spokenResponse: language === "hi"
        ? "उत्पाद को सफलतापूर्वक शिल्पसूत्र बाज़ार में प्रकाशित कर दिया गया है!"
        : "Product successfully published to ShilpSutra Marketplace!",
      timestamp: new Date().toISOString(),
    };
  }

  // Unknown fallback
  return {
    id,
    transcript,
    language,
    intent: "UNKNOWN",
    entities: {},
    confidence: 0.65,
    spokenResponse: language === "hi"
      ? "माफ़ कीजिए, मैं समझ नहीं पाया। कृपया कीमत, नाम, फिल्टर या विवरण बदलने के लिए बोलें।"
      : "Sorry, I could not recognize that command. Please try speaking a price, name, filter, or description update.",
    timestamp: new Date().toISOString(),
  };
}

export function speakResponse(text: string, lang: "hi" | "en" = "hi") {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}
