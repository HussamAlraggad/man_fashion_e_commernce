'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-ui font-semibold rounded-[var(--radius-button)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-focus)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] touch-target';

    const variantStyles = {
      primary: 'bg-[var(--color-primary)] text-[var(--color-bg)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]',
      secondary: 'bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]',
      ghost: 'bg-transparent text-[var(--color-ink)] border-2 border-transparent hover:bg-[var(--color-surface-hover)]',
      accent: 'bg-[var(--color-accent)] text-[var(--color-bg)] border-2 border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]',
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-[var(--text-xs)]',
      md: 'px-5 py-3 text-[var(--text-sm)]',
      lg: 'px-7 py-4 text-[var(--text-base)]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';