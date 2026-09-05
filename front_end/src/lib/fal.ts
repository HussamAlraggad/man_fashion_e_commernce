import { fal } from '@fal-ai/client';

const FAL_KEY = process.env.FAL_KEY;

if (FAL_KEY) {
  fal.config({ credentials: FAL_KEY });
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

export interface TryOnProgress {
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  logs?: Array<{ message: string; level: string }>;
}

export async function generateTryOn(input: TryOnInput): Promise<TryOnResult> {
  if (!FAL_KEY) {
    throw new Error('FAL_KEY not configured. Please add FAL_KEY to environment variables.');
  }

  const result = await fal.subscribe('fal-ai/idm-vton', {
    input: {
      human_image_url: input.human_image_url,
      garment_image_url: input.garment_image_url,
      description: input.description,
      garment_type: input.garment_type || 'upper_body',
      num_inference_steps: input.num_inference_steps || 30,
      seed: input.seed || 42,
    },
    logs: true,
    onQueueUpdate: (update: { status: string; logs?: Array<{ message: string; level: string }> }) => {
      if (update.status === 'IN_PROGRESS' && update.logs) {
        console.log('[TryOn]', update.logs.map((l) => l.message).join(', '));
      }
    },
  });

  return result.data as TryOnResult;
}

// Simplified version without progress tracking for now
export async function generateTryOnWithProgress(
  input: TryOnInput,
  _onProgress?: (progress: { status: string; logs?: Array<{ message: string; level: string }> }) => void
): Promise<TryOnResult> {
  return generateTryOn(input);
}

export function getGarmentType(categoryPath: string): 'upper_body' | 'lower_body' | 'full_body' | 'headwear' | 'footwear' | 'handwear' {
  const upperBody = [
    'outerwear',
    'formal_wear',
    'casual',
    'workwear',
    'shirts',
    'knitwear',
    'blazers',
    'coats',
    'jackets',
    'hoodies',
    'sweaters',
    'cardigans',
    'vests',
  ];
  const lowerBody = ['pants', 'jeans', 'trousers', 'shorts', 'chinos', 'joggers'];
  const headwear = ['headwear', 'caps', 'beanies', 'hats'];
  const footwear = ['footwear', 'boots', 'sneakers', 'shoes', 'sandals', 'loafers'];
  const handwear = ['handwear', 'gloves', 'mittens'];

  const cat = categoryPath.toLowerCase();

  if (upperBody.some((c) => cat.includes(c))) return 'upper_body';
  if (lowerBody.some((c) => cat.includes(c))) return 'lower_body';
  if (headwear.some((c) => cat.includes(c))) return 'headwear';
  if (footwear.some((c) => cat.includes(c))) return 'footwear';
  if (handwear.some((c) => cat.includes(c))) return 'handwear';

  return 'upper_body';
}

export function getGarmentDescription(category: string, variantTitle?: string): string {
  const descriptions: Record<string, string> = {
    outerwear: "Men's jacket or coat",
    formal_wear: "Men's suit or formal shirt",
    casual: "Men's casual shirt or t-shirt",
    workwear: "Men's work jacket or pants",
    headwear: "Men's hat or cap",
    footwear: "Men's boots or sneakers",
    handwear: "Men's gloves",
  };

  const base = descriptions[category.toLowerCase()] || "Men's garment";
  return variantTitle ? `${base}: ${variantTitle}` : base;
}