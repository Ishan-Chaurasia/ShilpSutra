export type CraftCategory = 
  | "Bamboo Handicrafts"
  | "Handwoven Textiles"
  | "Terracotta & Pottery"
  | "Woodcarving"
  | "Dhokra Metalcraft"
  | "Handmade Jewellery"
  | "Home Décor";

export type ProductStatus = 
  | "DRAFT"
  | "PROCESSING"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "ARCHIVED";

export interface Artisan {
  id: string;
  name: string;
  phone: string;
  craftCategory: CraftCategory;
  location: string;
  district: string;
  state: string;
  bio: string;
  profileImage: string;
  verified: boolean;
  pehchanId: string;
  yearsOfExperience: number;
  rating: number;
  totalProducts: number;
  totalViews: number;
  totalEnquiries: number;
  preferredLanguage: "hi" | "en";
}

export interface Product {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  artisanPhone: string;
  name: string;
  slug: string;
  category: CraftCategory;
  material: string;
  description: string;
  culturalStory: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  rawMaterialCost: number;
  productionCost: number;
  confidence: number;
  currency: string;
  status: ProductStatus;
  tags: string[];
  originalImageUrl: string;
  processedImageUrl: string;
  studioBackground?: string;
  dimensions?: string;
  weight?: string;
  leadTimeDays?: number;
  ondcReady: boolean;
  views: number;
  enquiries: number;
  createdAt: string;
  publishedAt?: string;
}

export type BuyerType = "WHOLESALE" | "RETAILER" | "INSTITUTION" | "INDIVIDUAL";

export interface Buyer {
  id: string;
  businessName: string;
  contactPerson: string;
  buyerType: BuyerType;
  location: string;
  state: string;
  verified: boolean;
  avatar: string;
  targetCategories: CraftCategory[];
  targetMaterials: string[];
  minOrderQuantity: number;
  budgetRange: string;
}

export interface BuyerMatch {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  buyer: Buyer;
  matchScore: number;
  matchReasons: string[];
  status: "MATCHED" | "CONTACTED" | "ACCEPTED";
  potentialOrderValue: number;
}

export interface VoiceCommand {
  id: string;
  transcript: string;
  language: "hi" | "en";
  intent: "UPDATE_PRICE" | "UPDATE_NAME" | "UPDATE_FILTER" | "UPDATE_DESCRIPTION" | "NEXT_STEP" | "GET_ENQUIRIES" | "PUBLISH" | "UNKNOWN";
  entities: {
    price?: number;
    name?: string;
    category?: string;
    preset?: string;
    description?: string;
  };
  confidence: number;
  spokenResponse: string;
  timestamp: string;
}

export interface OfflineQueueItem {
  id: string;
  operationType: "CREATE_PRODUCT" | "UPDATE_PRICE" | "UPDATE_NAME" | "PUBLISH_PRODUCT" | "DELETE_PRODUCT";
  entityName: string;
  payload: any;
  timestamp: string;
  status: "QUEUED" | "SYNCING" | "SYNCED";
}

export interface PriceAnalysis {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  rawMaterialCost: number;
  productionCost: number;
  factors: {
    name: string;
    impact: string;
    description: string;
  }[];
}

export interface AICatalogResult {
  productName: string;
  category: CraftCategory;
  material: string;
  description: string;
  culturalStory: string;
  tags: string[];
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  rawMaterialCost?: number;
  productionHours?: number;
}

export interface ExtractedProductDetails {
  productName: string;
  category: string;
  craftType: string;
  material: string;
  color: string;
  design: string;
  origin: string;
  dimensions?: string;
  price?: number;
  quantity?: string;
  description: string;
  additionalCharacteristics?: string;
}


export interface BuyerEnquiry {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerType: BuyerType;
  quantity: number;
  message: string;
  createdAt: string;
  status: "NEW" | "READ" | "REPLIED";
}

export type UserRole = "buyer" | "seller";
