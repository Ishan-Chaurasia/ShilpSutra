import { Buyer, BuyerMatch } from "@/types";

export const initialBuyers: Buyer[] = [
  {
    id: "buyer-fabindia",
    businessName: "FabIndia Home & Lifestyle Procurement",
    contactPerson: "Ananya Deshmukh (Sourcing Lead)",
    buyerType: "WHOLESALE",
    location: "New Delhi & Indore",
    state: "Delhi NCR",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=faces",
    targetCategories: ["Bamboo Handicrafts", "Home Décor", "Handwoven Textiles"],
    targetMaterials: ["Bamboo", "Cane", "Cotton", "Silk"],
    minOrderQuantity: 50,
    budgetRange: "₹25,000 - ₹2,00,000",
  },
  {
    id: "buyer-trifed",
    businessName: "TRIFED - Tribes India Apex Federation",
    contactPerson: "Virendra Singh (State Cluster Officer)",
    buyerType: "INSTITUTION",
    location: "Bhopal",
    state: "Madhya Pradesh",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces",
    targetCategories: ["Bamboo Handicrafts", "Terracotta & Pottery", "Dhokra Metalcraft"],
    targetMaterials: ["Bamboo", "Clay", "Brass", "Wood"],
    minOrderQuantity: 100,
    budgetRange: "₹50,000 - ₹5,00,000",
  },
  {
    id: "buyer-dastkar",
    businessName: "Dastkar Crafts Society",
    contactPerson: "Radhika Sen (Curator)",
    buyerType: "RETAILER",
    location: "Bengaluru",
    state: "Karnataka",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces",
    targetCategories: ["Handwoven Textiles", "Terracotta & Pottery", "Home Décor"],
    targetMaterials: ["Silk", "Cotton", "Clay", "Terracotta"],
    minOrderQuantity: 25,
    budgetRange: "₹20,000 - ₹1,20,000",
  },
  {
    id: "buyer-urban",
    businessName: "EcoHabitat Artisan Living",
    contactPerson: "Kunal Mehra (Creative Director)",
    buyerType: "WHOLESALE",
    location: "Mumbai",
    state: "Maharashtra",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    targetCategories: ["Bamboo Handicrafts", "Home Décor"],
    targetMaterials: ["Bamboo", "Cane", "Jute"],
    minOrderQuantity: 40,
    budgetRange: "₹30,000 - ₹1,50,000",
  },
];

export const initialBuyerMatches: BuyerMatch[] = [
  {
    id: "match-1",
    productId: "prod-bamboo-basket-1",
    productName: "Handcrafted Gond Bamboo Serving Tray",
    productPrice: 650,
    productImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=85",
    buyer: initialBuyers[0], // FabIndia
    matchScore: 89,
    matchReasons: [
      "Target Category Match: Home Décor & Bamboo Tableware",
      "Material Match: Natural Bamboo & Brass",
      "Target Price Window: ₹550 - ₹750 per unit",
      "Artisan Capacity: Can fulfill 50+ units within 3 weeks",
      "Verified State Artisan: Madhya Pradesh Cluster"
    ],
    status: "MATCHED",
    potentialOrderValue: 52000,
  },
  {
    id: "match-2",
    productId: "prod-bamboo-basket-1",
    productName: "Handcrafted Gond Bamboo Serving Tray",
    productPrice: 650,
    productImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=85",
    buyer: initialBuyers[1], // TRIFED
    matchScore: 93,
    matchReasons: [
      "Institutional Tribal Craft Mandate: TRIFED Tribal Cluster",
      "Direct Geo Proximity: Betul to Bhopal Hub (170km)",
      "Bulk Requirement: 100+ units for State Emporiums",
      "GI / Pehchan ID Certified Artisan: Ramesh Kumar"
    ],
    status: "MATCHED",
    potentialOrderValue: 50000,
  },
  {
    id: "match-3",
    productId: "prod-bamboo-lamp-2",
    productName: "GlowGrid Bamboo Pendant Lamp",
    productPrice: 850,
    productImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1600&auto=format&fit=crop&q=85",
    buyer: initialBuyers[3], // EcoHabitat
    matchScore: 82,
    matchReasons: [
      "Urban Cafe & Hospitality Lighting Demand",
      "Eco Living & Plastic Alternative Certification",
      "Price & Quality Spec Approved"
    ],
    status: "MATCHED",
    potentialOrderValue: 34000,
  }
];
