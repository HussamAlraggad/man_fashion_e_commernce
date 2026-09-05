// Shared TypeScript types between frontend and backend

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  avatarUrl?: string | null;
  marketingOptIn: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Measurements
  heightCm?: number | null;
  weightKg?: number | null;
  chestCm?: number | null;
  waistCm?: number | null;
  hipCm?: number | null;
  shoulderCm?: number | null;
  sleeveCm?: number | null;
  inseamCm?: number | null;
  neckCm?: number | null;
  wristCm?: number | null;
  bicepCm?: number | null;
  thighCm?: number | null;
  calfCm?: number | null;
  shoeSizeEu?: number | null;
  shoeSizeUs?: number | null;
  shoeSizeUk?: number | null;
  headCircumferenceCm?: number | null;
  handCircumferenceCm?: number | null;

  measurementSource?: string;
  lastMeasuredAt?: Date | null;
  measurementNotes?: string | null;
}

export interface SizePreference {
  id: string;
  userProfileId: string;
  category: string;
  preferredSize: string;
  brand?: string | null;
  fitPreference?: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TryOnHistoryItem {
  id: string;
  userProfileId: string;
  productId: string;
  productVariantId?: string | null;
  garmentType: string;
  inputImageUrl: string;
  garmentImageUrl: string;
  resultImageUrl: string;
  savedImageUrl?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTimeMs?: number | null;
  falRequestId?: string | null;
  errorMessage?: string | null;
  isFavorite: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  userProfileId: string;
  productId: string;
  productVariantId?: string | null;
  notes?: string | null;
  priority: number;
  createdAt: Date;
}

export interface ProductExtension {
  id: string;
  productId: string;
  fitType?: string;
  sizeChartUrl?: string | null;
  sizeChartData?: Record<string, unknown> | null;
  modelMeasurements?: Record<string, unknown> | null;
  tryOnEnabled: boolean;
  tryOnType: string;
  tryOnGarmentImageUrl?: string | null;
  fabricComposition?: Array<{ material: string; percentage: number }> | null;
  careInstructions?: string | null;
  originCountry?: string | null;
  sustainabilityTags?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SizeRecommendationLog {
  id: string;
  userProfileId: string;
  productId: string;
  productVariantId?: string | null;
  recommendedSize: string;
  confidenceScore: number;
  method: 'size_chart_match' | 'ml_model' | 'user_history' | 'manual';
  userMeasurements: Record<string, unknown>;
  productSizeChart?: Record<string, unknown> | null;
  accepted?: boolean | null;
  actualSize?: string | null;
  createdAt: Date;
}

export interface TryOnInput {
  human_image_url: string;
  garment_image_url: string;
  description: string;
  garment_type?: 'upper_body' | 'lower_body' | 'full_body' | 'headwear' | 'footwear' | 'handwear';
  num_inference_steps?: number;
  seed?: number;
}

export interface TryOnResult {
  image: {
    url: string;
    content_type: string;
    width: number;
    height: number;
    file_name: string;
    file_size: number;
  };
  mask: {
    url: string;
    content_type: string;
    width: number;
    height: number;
    file_name: string;
    file_size: number;
  };
}

export interface SizeRecommendationInput {
  productId: string;
  variantId?: string;
  userMeasurements: {
    chestCm?: number;
    waistCm?: number;
    hipCm?: number;
    heightCm?: number;
    weightKg?: number;
    shoulderCm?: number;
    sleeveCm?: number;
    inseamCm?: number;
  };
}

export interface SizeRecommendationResult {
  recommendedSize: string;
  confidenceScore: number;
  method: string;
  sizeChart: Record<string, Record<string, number>>;
  reasoning: string;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  title: string;
  price: number;
  currency: string;
  image?: string;
  variantTitle?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  currency: string;
}