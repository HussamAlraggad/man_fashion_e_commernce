'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Download, Heart, Share2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { TryOnResult } from '@/lib/fal';

interface TryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TryOnResult;
  product: {
    id: string;
    title: string;
    handle: string;
    images: Array<{ id: string; url: string }>;
  };
  userImageUrl: string;
  onSave?: (savedUrl: string) => void;
  onShare?: (url: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function TryOnModal({
  isOpen,
  onClose,
  result,
  product,
  userImageUrl,
  onSave,
  onShare,
  isFavorite = false,
  onToggleFavorite,
}: TryOnModalProps) {
  const [saving, setSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(result.image.url);
      const blob = await response.blob();
      const file = new File([blob], `tryon-${product.handle}-${Date.now()}.png`, { type: 'image/png' });
      const { url } = await uploadToCloudinary(file, 'try-on-results');
      setSavedUrl(url);
      onSave?.(url);
    } catch (error) {
      console.error('Failed to save try-on result:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(result.image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tryon-${product.handle}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(result.image.url);
      const blob = await response.blob();
      const file = new File([blob], `tryon-${product.handle}.png`, { type: 'image/png' });
      const shareData = {
        title: `Trying on ${product.title}`,
        text: `Check out this virtual try-on of ${product.title} from MAN Fashion!`,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        await navigator.share({
          title: `Trying on ${product.title}`,
          text: `Check out this virtual try-on of ${product.title} from MAN Fashion!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
      onShare?.(window.location.href);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to share:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Try On: ${product.title}`}
      size="lg"
      showCloseButton
    >
      <div className="space-y-4">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface)]">
          <Image
            src={result.image.url}
            alt={`${product.title} virtual try-on result`}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              aria-label="Download result"
              className="p-2"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
            </Button>
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                isLoading={saving}
                aria-label={savedUrl ? 'Saved' : 'Save to profile'}
                className="p-2"
              >
                <Heart
                  className={cn('h-5 w-5', savedUrl ? 'fill-current text-[var(--color-error)]' : '')}
                  aria-hidden="true"
                />
              </Button>
            )}
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite}
                className="p-2"
              >
                <Heart
                  className={cn('h-5 w-5', isFavorite ? 'fill-current text-[var(--color-error)]' : '')}
                  aria-hidden="true"
                />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              aria-label="Share result"
              className="p-2"
            >
              <Share2 className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose()}
              aria-label="Close"
              className="p-2 ml-auto"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" fullWidth onClick={onClose}>
              Continue Shopping
            </Button>
            <Button variant="secondary" fullWidth onClick={onClose}>
              Try Another
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}