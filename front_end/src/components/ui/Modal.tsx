'use client';

import { Fragment, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-[360px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[720px]',
    xl: 'max-w-[960px]',
    full: 'max-w-[90vw]',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  };

  return (
    <Fragment>
      <div
        className={cn(
          'fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4',
          'bg-[var(--color-overlay)] backdrop-blur-[8px]',
          'animate-fade-in'
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="presentation"
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-[var(--z-modal)] w-full bg-[var(--color-bg)] rounded-[var(--radius-modal)] border border-[var(--color-border)]',
          'shadow-[0_25px_50px_-12px_var(--color-overlay)]',
          'animate-scale-in',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizeStyles[size]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        onKeyDown={handleKeyDown}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-[var(--color-border)]">
            <div>
              {title && (
                <h2 id="modal-title" className="font-display font-normal text-[var(--text-xl)] text-[var(--color-ink-strong)]">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-[var(--text-sm)] text-[var(--color-muted)]">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full hover:bg-[var(--color-surface-hover)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">{children}</div>
      </div>
    </Fragment>
  );
}

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}: AlertDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title} description={description}>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'accent' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}