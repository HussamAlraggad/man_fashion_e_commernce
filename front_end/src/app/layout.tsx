import type { Metadata, Viewport } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MAN Fashion — Clothing That Fits',
    template: '%s | MAN Fashion',
  },
  description: 'Men\'s fashion e-commerce with AI virtual fitting room. Outerwear, formal, casual, workwear, and accessories. Try before you buy.',
  keywords: ['menswear', 'fashion', 'virtual try-on', 'clothing', 'outerwear', 'formal wear', 'workwear'],
  authors: [{ name: 'MAN Fashion' }],
  creator: 'MAN Fashion',
  publisher: 'MAN Fashion',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://man-fashion.netlify.app',
    siteName: 'MAN Fashion',
    title: 'MAN Fashion — Clothing That Fits',
    description: 'Men\'s fashion e-commerce with AI virtual fitting room. Try before you buy.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MAN Fashion — Virtual fitting room for men\'s clothing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAN Fashion',
    description: 'Men\'s fashion with AI virtual fitting room.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(1.000 0.000 0)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.055 0.000 0)' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fal.ai" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://fal.ai" />
      </head>
      <body className="font-ui antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}