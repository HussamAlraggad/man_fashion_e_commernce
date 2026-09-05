const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export function getCloudinaryUploadUrl(): string {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
    gravity?: 'auto' | 'face' | 'center';
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto', crop = 'fill', gravity = 'auto' } = options;
  const transformations = [
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    gravity !== 'auto' ? `g_${gravity}` : null,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}

export function getProductImageUrl(
  publicId: string,
  variant: 'card' | 'detail' | 'tryon' | 'hero' = 'detail'
): string {
  const presets: Record<string, { width?: number; height?: number; crop?: 'fill' | 'scale' | 'fit' | 'thumb'; gravity?: 'auto' | 'face' | 'center' }> = {
    card: { width: 400, height: 533, crop: 'fill', gravity: 'center' },
    detail: { width: 800, height: 1066, crop: 'fill', gravity: 'center' },
    tryon: { width: 768, height: 1024, crop: 'fill', gravity: 'center' },
    hero: { width: 1920, crop: 'scale' },
  };
  return getOptimizedImageUrl(publicId, presets[variant]);
}

export async function uploadToCloudinary(
  file: File,
  folder = 'user-uploads'
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(getCloudinaryUploadUrl(), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return { url: data.secure_url, publicId: data.public_id };
}

export function getCloudinarySrcSet(publicId: string, widths: number[] = [375, 640, 768, 1024, 1280]): string {
  return widths
    .map((w) => `${getOptimizedImageUrl(publicId, { width: w })} ${w}w`)
    .join(', ');
}

export function getCloudinarySizes(breakpoints: Record<string, string> = {
  '(max-width: 640px)': '50vw',
  '(max-width: 1024px)': '33vw',
  default: '20vw',
}): string {
  return Object.entries(breakpoints)
    .map(([query, size]) => query === 'default' ? size : `${size} ${query}`)
    .join(', ');
}