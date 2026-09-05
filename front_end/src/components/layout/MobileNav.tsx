'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Home,
  Grid,
  ShoppingBag,
  User,
  Shirt,
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Categories', href: '/categories', icon: Grid },
  { name: 'Try On', href: '/try-on', icon: Shirt },
  { name: 'Cart', href: '/cart', icon: ShoppingBag },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] grid grid-cols-5 bg-[var(--color-bg)] border-t border-[var(--color-border)] px-1 pb-safe shadow-[0_-4px_20px_-8px_var(--color-overlay)]"
      role="navigation"
      aria-label="Main navigation"
    >
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 min-h-[var(--space-touch-target)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]',
              isActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
            <span className="text-[var(--text-xs)] font-ui font-medium tracking-wider">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNavSpacer() {
  return <div className="h-16 md:hidden" aria-hidden="true" />;
}