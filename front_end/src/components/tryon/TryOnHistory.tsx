'use client';

import Image from 'next/image';
import { Heart, Trash2, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

export interface TryOnHistoryItem {
  id: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  productImageUrl: string;
  garmentType: string;
  resultImageUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

interface TryOnHistoryProps {
  items: TryOnHistoryItem[];
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (item: TryOnHistoryItem) => void;
  onShare?: (item: TryOnHistoryItem) => void;
  emptyMessage?: string;
}

export function TryOnHistory({
  items,
  onToggleFavorite,
  onDelete,
  onDownload,
  onShare,
  emptyMessage = 'No try-on history yet. Try on a product to see your results here.',
}: TryOnHistoryProps) {
  if (items.length === 0) {
    return (
      <Card variant="outlined" padding="lg" className="text-center py-12">
        <Heart className="h-12 w-12 mx-auto text-[var(--color-muted)] mb-4" aria-hidden="true" />
        <h3 className="font-display font-normal text-[var(--text-xl)] text-[var(--color-ink)] mb-2">
          No Try-On History
        </h3>
        <p className="text-[var(--color-muted)] max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.id}
          variant="outlined"
          padding="none"
          className="overflow-hidden flex flex-col"
        >
          <Link href={`/products/${item.productHandle}`} className="block relative aspect-[3/4] overflow-hidden bg-[var(--color-surface-hover)]">
            <Image
              src={item.resultImageUrl}
              alt={`${item.productTitle} try-on result`}
              fill
              className="object-cover transition-transform duration-[var(--duration-smooth)] hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-y-2 transition-all duration-[var(--duration-base)] hover:opacity-100 hover:translate-y-0 group-hover/parent:opacity-100 group-hover/parent:translate-y-0">
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[var(--color-bg)]/90 backdrop-blur-sm shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={item.isFavorite}
                >
                  <Heart
                    className={cn('h-5 w-5', item.isFavorite ? 'fill-current text-[var(--color-error)]' : '')}
                    aria-hidden="true"
                  />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[var(--color-bg)]/90 backdrop-blur-sm shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDownload(item);
                  }}
                  aria-label="Download result"
                >
                  <Download className="h-5 w-5" aria-hidden="true" />
                </Button>
              )}
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[var(--color-bg)]/90 backdrop-blur-sm shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onShare(item);
                  }}
                  aria-label="Share result"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[var(--color-bg)]/90 backdrop-blur-sm shadow-lg text-[var(--color-error)] hover:text-[var(--color-error)]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('Delete this try-on result?')) {
                      onDelete(item.id);
                    }
                  }}
                  aria-label="Delete result"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                </Button>
              )}
            </div>
          </Link>

          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <p className="font-ui text-[var(--text-xs)] font-medium tracking-wider uppercase text-[var(--color-muted)]">
                  {item.garmentType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <h3 className="font-display font-normal text-[var(--text-lg)] leading-snug text-[var(--color-ink)] truncate">
                  {item.productTitle}
                </h3>
              </div>
            </div>

            <p className="text-[var(--text-sm)] text-[var(--color-muted)] mb-3">
              {formatDate(item.createdAt)}
            </p>

            <div className="flex gap-2 mt-auto">
              {onDownload && (
                <Button variant="ghost" size="sm" fullWidth onClick={() => onDownload?.(item)}>
                  <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                  Download
                </Button>
              )}
              {onShare && (
                <Button variant="ghost" size="sm" fullWidth onClick={() => onShare?.(item)}>
                  <Share2 className="h-4 w-4 mr-1" aria-hidden="true" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import Link from 'next/link';