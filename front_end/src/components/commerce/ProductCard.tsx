'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingBag, Shirt } from 'lucide-react';
import { getProductImageUrl } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/utils';

export interface Product {
  id: string;
  title: string;
  handle: string;
  subtitle?: string;
  description?: string;
  images: Array<{ id: string; url: string }>;
  variants: Array<{
    id: string;
    title: string;
    prices: Array<{ amount: number; currency_code: string }>;
    options: Array<{ value: string }>;
  }>;
  categories?: Array<{ name: string; handle: string }>;
  collection?: { title: string };
  product_extension?: {
    fit_type?: string;
    try_on_enabled?: boolean;
  };
}

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  onTryOn?: (product: Product) => void;
  onAddToCart?: (variantId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  variant = 'default',
  onTryOn,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const primaryImage = product.images[0];
  const defaultVariant = product.variants[0];
  const price = defaultVariant?.prices[0]?.amount || 0;
  const currency = defaultVariant?.prices[0]?.currency_code || 'USD';
  const categoryHandle = product.categories?.[0]?.handle || '';

  const imageUrl = primaryImage
    ? getProductImageUrl(primaryImage.id, 'card')
    : '/placeholder-product.jpg';

  const tryOnEnabled = product.product_extension?.try_on_enabled !== false;

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.handle}`} className="group flex gap-3">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface-hover)]">
          {primaryImage ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-[var(--duration-smooth)] group-hover:scale-105"
              sizes="80px"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--color-muted)]">No image</div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="font-ui text-[var(--text-xs)] font-medium tracking-wider uppercase text-[var(--color-muted)]">
              {product.categories?.[0]?.name || 'Product'}
            </p>
            <h3 className="font-display font-normal text-[var(--text-base)] leading-snug text-[var(--color-ink)] truncate group-hover:text-[var(--color-primary)] transition-colors">
              {product.title}
            </h3>
          </div>
          <p className="font-mono font-medium text-[var(--text-sm)] text-[var(--color-ink-strong)]">
            {formatPrice(price, currency)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article className="group product-card">
      <Link href={`/products/${product.handle}`} className="block" aria-label={`View ${product.title}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-surface-hover)]">
          {primaryImage ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-[var(--duration-smooth)] group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-[var(--color-muted)]">
              No image
            </div>
          )}

          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-y-2 transition-all duration-[var(--duration-base)] group-hover:opacity-100 group-hover:translate-y-0">
            {tryOnEnabled && onTryOn && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-[var(--color-bg)]/90 backdrop-blur-sm shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTryOn(product);
                }}
                aria-label={`Try on ${product.title}`}
              >
                <Shirt className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
            {onToggleWishlist && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'bg-[var(--color-bg)]/90 backdrop-blur-sm shadow-lg',
                  isInWishlist && 'text-[var(--color-error)]'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
                aria-label={isInWishlist ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
                aria-pressed={isInWishlist}
              >
                <Heart
                  className={cn('h-5 w-5', isInWishlist ? 'fill-current' : '')}
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>

          {product.subtitle && (
            <div className="absolute bottom-2 left-2 right-2 bg-[var(--color-overlay)] backdrop-blur-sm px-3 py-1.5 rounded-[var(--radius-badge)] text-center">
              <span className="font-ui text-[var(--text-xs)] font-medium text-[var(--color-bg)]">
                {product.subtitle}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-ui text-[var(--text-xs)] font-medium tracking-wider uppercase text-[var(--color-muted)]">
              {product.categories?.[0]?.name || product.collection?.title || 'Product'}
            </p>
            <h3 className="font-display font-normal text-[var(--text-lg)] leading-snug text-[var(--color-ink)] truncate group-hover:text-[var(--color-primary)] transition-colors">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-mono font-medium text-[var(--text-base)] text-[var(--color-ink-strong)]">
            {formatPrice(price, currency)}
          </p>
          {defaultVariant && onAddToCart && (
            <Button
              size="sm"
              rightIcon={<ShoppingBag className="h-4 w-4" aria-hidden="true" />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(defaultVariant.id);
              }}
              aria-label={`Add ${product.title} to cart`}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

import Link from 'next/link';