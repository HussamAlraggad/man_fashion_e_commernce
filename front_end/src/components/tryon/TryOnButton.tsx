'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { generateTryOn, getGarmentType, getGarmentDescription, type TryOnResult } from '@/lib/fal';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface TryOnButtonProps {
  product: {
    id: string;
    title: string;
    handle: string;
    images: Array<{ id: string; url: string }>;
    categories?: Array<{ name: string; handle: string }>;
    product_extension?: {
      try_on_enabled?: boolean;
      try_on_type?: string;
      try_on_garment_image_url?: string;
    };
  };
  userImageUrl?: string | null;
  onTryOnComplete?: (result: TryOnResult) => void;
}

export function TryOnButton({
  product,
  userImageUrl,
  onTryOnComplete,
}: TryOnButtonProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tryOnEnabled = product.product_extension?.try_on_enabled !== false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image must be less than 10MB.');
      return;
    }

    setStatus('uploading');
    setErrorMessage(null);
    uploadUserImage(file);
  };

  const uploadUserImage = async (file: File) => {
    try {
      const { url } = await uploadToCloudinary(file, 'try-on-inputs');
      await generateTryOnWithUrl(url);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    }
  };

  const generateTryOnWithUrl = useCallback(async (userImageUrl: string) => {
    setStatus('processing');

    const garmentImage = product.product_extension?.try_on_garment_image_url
      || product.images[0]?.url;

    if (!garmentImage) {
      setStatus('error');
      setErrorMessage('Product image not available for try-on.');
      return;
    }

    try {
      const categoryPath = product.categories?.[0]?.handle || '';
      const garmentType = product.product_extension?.try_on_type || getGarmentType(categoryPath);
      const description = getGarmentDescription(categoryPath, product.title);

      const result = await generateTryOn({
        human_image_url: userImageUrl,
        garment_image_url: garmentImage,
        description,
        garment_type: garmentType as 'upper_body' | 'lower_body' | 'full_body' | 'headwear' | 'footwear' | 'handwear',
      });

      setResultUrl(result.image.url);
      setStatus('done');
      onTryOnComplete?.(result);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Try-on failed. Please try again.');
    }
  }, [product, onTryOnComplete]);

  const handleTryOnClick = () => {
    if (!userImageUrl) {
      fileInputRef.current?.click();
      return;
    }

    if (status === 'idle' || status === 'error' || status === 'done') {
      setStatus('processing');
      generateTryOnWithUrl(userImageUrl);
    }
  };

  const handleCloseModal = () => {
    setStatus('idle');
    setResultUrl(null);
    setErrorMessage(null);
  };

  if (!tryOnEnabled) {
    return (
      <Button variant="ghost" disabled className="w-full">
        Try On Unavailable
      </Button>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="sr-only"
        aria-label="Upload your photo for virtual try-on"
      />

      <Button
        variant={status === 'done' ? 'accent' : 'primary'}
        size="md"
        fullWidth
        onClick={handleTryOnClick}
        disabled={status === 'uploading' || status === 'processing'}
        leftIcon={
          status === 'processing' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : status === 'uploading' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : status === 'done' ? (
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
          )
        }
        className={cn('w-full', status === 'done' && 'bg-[var(--color-accent)] border-[var(--color-accent)]')}
      >
        {status === 'uploading' && 'Uploading…'}
        {status === 'processing' && 'AI is dressing you…'}
        {status === 'done' && 'View Result'}
        {(status === 'idle' || status === 'error') && (userImageUrl ? 'Try On Again' : 'Upload Photo & Try On')}
      </Button>

      {status === 'error' && (
        <p className="mt-2 text-[var(--text-sm)] text-[var(--color-error)]" role="alert">
          {errorMessage}
        </p>
      )}

      {status === 'done' && resultUrl && (
        <Modal
          isOpen
          onClose={handleCloseModal}
          title={`Try On: ${product.title}`}
          size="lg"
          showCloseButton
        >
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface)] relative">
              <Image
                src={resultUrl}
                alt={`${product.title} virtual try-on result`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex gap-3">
              <Button variant="primary" fullWidth onClick={handleCloseModal}>
                Try Another
              </Button>
              <Button variant="secondary" fullWidth onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}