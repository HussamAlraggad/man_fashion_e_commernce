# MAN FASHION E-COMMERCE — TECHNICAL SPECIFICATION
Version: 1.0 | Stack: Next.js 15 + Medusa v2 + Supabase + Netlify + Render

---

## 1. PROJECT STRUCTURE

```bash
man_fashion_e_commerce/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, typecheck, test
│       ├── deploy-frontend.yml # Netlify deploy
│       └── deploy-backend.yml  # Render deploy
├── docker-compose.yml          # Local: Postgres + Medusa
├── frontend/                   # Next.js 15 App Router
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Auth group (login, register)
│   │   │   ├── (shop)/         # Shop group (products, cart, checkout)
│   │   │   ├── (profile)/      # Profile group (measurements, try-on history)
│   │   │   ├── api/            # API routes (webhooks, try-on proxy)
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── commerce/       # ProductCard, Cart, Checkout
│   │   │   ├── tryon/          # TryOnButton, TryOnModal, TryOnHistory
│   │   │   └── layout/         # Header, Footer, MobileNav
│   │   ├── lib/
│   │   │   ├── medusa.ts       # Medusa SDK client
│   │   │   ├── auth.ts         # NextAuth config
│   │   │   ├── cloudinary.ts   # Image upload helpers
│   │   │   ├── fal.ts          # fal.ai API client
│   │   │   └── utils.ts
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript types
│   │   └── styles/             # Global CSS, Tailwind config
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── netlify.toml
├── backend/                    # Medusa v2 (separate repo or monorepo)
│   ├── src/
│   │   ├── modules/            # Custom modules (try-on, measurements)
│   │   ├── api/                # Custom API routes
│   │   ├── subscribers/        # Event subscribers
│   │   └── workflows/          # Custom workflows
│   ├── medusa-config.ts
│   ├── package.json
│   └── Dockerfile
├── prisma/
│   ├── schema.prisma           # Custom tables (extends Medusa)
│   └── migrations/
├── shared/
│   └── types/                  # Shared TypeScript types
├── .env.example
├── .env.local.example
├── README.md
└── SPEC.md (this file)
```

---

## 2. DATABASE SCHEMA (Prisma + Medusa Extensions)

### Medusa Core Tables (Managed by Medusa — Do Not Modify)

- `product`, `product_variant`, `product_option`, `product_option_value`
- `product_category`, `product_collection`, `product_tag`
- `product_image`, `product_variant_inventory_item`
- `cart`, `line_item`, `address`, `customer`
- `order`, `order_line_item`, `payment_collection`, `payment_session`
- `region`, `currency`, `country`, `tax_rate`
- `sales_channel`, `publishable_api_key`
- `user`, `invite`, `api_token`

### Custom Prisma Schema (extends Medusa)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER PROFILE & MEASUREMENTS
// ============================================

model UserProfile {
  id              String    @id @default(cuid())
  userId          String    @unique @map("user_id")  // Links to Medusa customer
  firstName       String?   @map("first_name")
  lastName        String?   @map("last_name")
  phone           String?
  dateOfBirth     DateTime? @map("date_of_birth")
  avatarUrl       String?   @map("avatar_url")
  marketingOptIn  Boolean   @default(false) @map("marketing_opt_in")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Measurements (all nullable - user controls)
  heightCm        Float?    @map("height_cm")
  weightKg        Float?    @map("weight_kg")
  chestCm         Float?    @map("chest_cm")
  waistCm         Float?    @map("waist_cm")
  hipCm           Float?    @map("hip_cm")
  shoulderCm      Float?    @map("shoulder_cm")
  sleeveCm        Float?    @map("sleeve_cm")
  inseamCm        Float?    @map("inseam_cm")
  neckCm          Float?    @map("neck_cm")
  wristCm         Float?    @map("wrist_cm")
  bicepCm         Float?    @map("bicep_cm")
  thighCm         Float?    @map("thigh_cm")
  calfCm          Float?    @map("calf_cm")
  shoeSizeEu      Float?    @map("shoe_size_eu")
  shoeSizeUs      Float?    @map("shoe_size_us")
  shoeSizeUk      Float?    @map("shoe_size_uk")
  headCircumferenceCm Float? @map("head_circumference_cm")
  handCircumferenceCm   Float? @map("hand_circumference_cm")

  // Measurement metadata
  measurementSource String?  @default("manual") @map("measurement_source") // manual, scanned, estimated
  lastMeasuredAt    DateTime? @map("last_measured_at")
  measurementNotes  String?  @map("measurement_notes")

  // Relations
  tryOnHistory     TryOnHistory[]
  wishlist         WishlistItem[]
  sizePreferences  SizePreference[]

  @@map("user_profiles")
}

model SizePreference {
  id            String   @id @default(cuid())
  userProfileId String   @map("user_profile_id")
  category      String   // e.g., "outerwear", "formal_wear", "footwear"
  preferredSize String   @map("preferred_size") // e.g., "M", "42", "10.5"
  brand         String?  // Brand-specific sizing
  fitPreference String?  @default("regular") @map("fit_preference") // slim, regular, relaxed, oversized
  notes         String?
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  userProfile UserProfile @relation(fields: [userProfileId], references: [id], onDelete: Cascade)

  @@unique([userProfileId, category, brand])
  @@map("size_preferences")
}

// ============================================
// VIRTUAL TRY-ON HISTORY
// ============================================

model TryOnHistory {
  id              String   @id @default(cuid())
  userProfileId   String   @map("user_profile_id")
  productId       String   @map("product_id")       // Medusa product ID
  productVariantId String? @map("product_variant_id")
  garmentType     String   @map("garment_type")     // upper_body, lower_body, full_body, headwear, footwear, handwear
  inputImageUrl   String   @map("input_image_url")  // User's photo (Cloudinary)
  garmentImageUrl String   @map("garment_image_url") // Product image (Cloudinary)
  resultImageUrl  String   @map("result_image_url") // fal.ai result (temp URL)
  savedImageUrl   String?  @map("saved_image_url")  // Permanent copy in Cloudinary
  status          String   @default("completed")    // pending, processing, completed, failed
  processingTimeMs Int?    @map("processing_time_ms")
  falRequestId    String?  @map("fal_request_id")
  errorMessage    String?  @map("error_message")
  isFavorite      Boolean  @default(false) @map("is_favorite")
  isShared        Boolean  @default(false) @map("is_shared")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  userProfile UserProfile @relation(fields: [userProfileId], references: [id], onDelete: Cascade)

  @@index([userProfileId, createdAt])
  @@index([productId])
  @@map("try_on_history")
}

// ============================================
// WISHLIST
// ============================================

model WishlistItem {
  id              String   @id @default(cuid())
  userProfileId   String   @map("user_profile_id")
  productId       String   @map("product_id")
  productVariantId String? @map("product_variant_id")
  notes           String?
  priority        Int      @default(0) // 0=low, 1=medium, 2=high
  createdAt       DateTime @default(now()) @map("created_at")

  userProfile UserProfile @relation(fields: [userProfileId], references: [id], onDelete: Cascade)

  @@unique([userProfileId, productId, productVariantId])
  @@map("wishlist_items")
}

// ============================================
// PRODUCT EXTENSIONS (Custom fields for Medusa products)
// ============================================

model ProductExtension {
  id              String   @id @default(cuid())
  productId       String   @unique @map("product_id") // Medusa product ID
  // Fit & Sizing
  fitType         String?  @default("regular") @map("fit_type") // slim, regular, relaxed, oversized
  sizeChartUrl    String?  @map("size_chart_url") // Cloudinary URL to size chart image
  sizeChartData   Json?    @map("size_chart_data") // Structured size chart data
  modelMeasurements Json?  @map("model_measurements") // What size model wears + their measurements
  // Try-On
  tryOnEnabled    Boolean  @default(true) @map("try_on_enabled")
  tryOnType       String   @default("upper_body") @map("try_on_type") // upper_body, lower_body, full_body, headwear, footwear, handwear
  tryOnGarmentImageUrl String? @map("try_on_garment_image_url") // Pre-processed garment image for try-on
  // Attributes
  fabricComposition Json?  @map("fabric_composition") // [{"material": "cotton", "percentage": 100}]
  careInstructions  String? @map("care_instructions")
  originCountry     String? @map("origin_country")
  sustainabilityTags String[] @map("sustainability_tags")
  // SEO
  metaTitle         String? @map("meta_title")
  metaDescription   String? @map("meta_description")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("product_extensions")
}

// ============================================
// SIZE RECOMMENDATION LOG
// ============================================

model SizeRecommendationLog {
  id              String   @id @default(cuid())
  userProfileId   String   @map("user_profile_id")
  productId       String   @map("product_id")
  productVariantId String? @map("product_variant_id")
  recommendedSize String   @map("recommended_size")
  confidenceScore Float    @map("confidence_score") // 0-1
  method          String   // size_chart_match, ml_model, user_history, manual
  userMeasurements Json    @map("user_measurements") // Snapshot at time of recommendation
  productSizeChart Json?   @map("product_size_chart")
  accepted        Boolean? // Did user buy this size?
  actualSize      String?  @map("actual_size") // What they actually ordered
  createdAt       DateTime @default(now()) @map("created_at")

  @@index([userProfileId, productId])
  @@map("size_recommendation_logs")
}
```

---

## 3. API CONTRACTS

### Medusa REST Endpoints (Standard)

```bash
GET    /store/products                    # List products (filter, paginate)
GET    /store/products/:id                # Product detail
GET    /store/products/:id/variants       # Variants with inventory
GET    /store/product-categories          # Category tree
GET    /store/collections                 # Collections
POST   /store/carts                       # Create cart
GET    /store/carts/:id                   # Get cart
POST   /store/carts/:id/line-items        # Add to cart
POST   /store/carts/:id/line-items/:id    # Update line item
DELETE /store/carts/:id/line-items/:id    # Remove from cart
POST   /store/carts/:id/complete          # Complete checkout
GET    /store/customers/me                # Authenticated customer
POST   /store/auth                        # Login
POST   /store/auth/register               # Register
POST   /store/auth/token                  # Refresh token
```

### Custom API Routes (Next.js API Routes → Medusa Custom Endpoints)

#### Virtual Try-On

```bash
POST   /api/tryon/generate
Request:
{
  "productId": "prod_123",
  "variantId": "variant_456",  // optional
  "userImageUrl": "https://res.cloudinary.com/.../user_abc.jpg",
  "garmentType": "upper_body" | "lower_body" | "full_body" | "headwear" | "footwear" | "handwear"
}
Response:
{
  "tryOnId": "tryon_789",
  "resultImageUrl": "https://fal.ai/.../result.png",
  "maskUrl": "https://fal.ai/.../mask.png",
  "processingTimeMs": 12450,
  "status": "completed"
}

GET    /api/tryon/history?limit=20&offset=0
Response:
{
  "history": [...],
  "total": 42,
  "hasMore": true
}

POST   /api/tryon/save
{
  "tryOnId": "tryon_789",
  "isFavorite": true
}

DELETE /api/tryon/:id
```

#### User Profile & Measurements

```bash
GET    /api/profile/me
PUT    /api/profile/me
{
  "firstName": "John",
  "lastName": "Doe",
  "measurements": {
    "heightCm": 180,
    "chestCm": 102,
    "waistCm": 86,
    ...
  }
}

GET    /api/profile/measurements/guide
Response: { diagrams: [...], videoUrl: "...", instructions: "..." }
```

#### Size Recommendation

```bash
POST   /api/size-recommendation
{
  "productId": "prod_123",
  "variantId": "variant_456",
  "userMeasurements": { "chestCm": 102, "waistCm": 86, ... }
}
Response:
{
  "recommendedSize": "L",
  "confidenceScore": 0.87,
  "method": "size_chart_match",
  "sizeChart": { "S": { "chest": 96 }, "M": { "chest": 100 }, "L": { "chest": 104 } },
  "reasoning": "Your chest (102cm) falls between M (100cm) and L (104cm). Based on fit type 'regular', L is recommended."
}
```

#### Wishlist

```bash
GET    /api/wishlist
POST   /api/wishlist
{
  "productId": "prod_123",
  "variantId": "variant_456",
  "priority": 1
}
DELETE /api/wishlist/:productId/:variantId?
```

---

## 4. ENVIRONMENT VARIABLES

### Frontend (.env.local)

```bash
# App
NEXT_PUBLIC_APP_URL=https://your-domain.netlify.app
NEXT_PUBLIC_APP_NAME="MAN Fashion"

# Medusa
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.onrender.com
MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# NextAuth
NEXTAUTH_URL=https://your-domain.netlify.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_APPLE_ID=...          # Requires Apple Developer account
AUTH_APPLE_SECRET=...
AUTH_APPLE_TEAM_ID=...
AUTH_APPLE_KEY_ID=...
AUTH_APPLE_PRIVATE_KEY=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default

# fal.ai Virtual Try-On
FAL_KEY=...                # Get from fal.ai dashboard
NEXT_PUBLIC_FAL_KEY=...    # If calling from client (not recommended)

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (for direct Prisma access if needed)
DATABASE_URL=postgresql://...

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...
```

### Backend / Medusa (.env)

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/medusa
# Or Supabase: postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# Medusa
JWT_SECRET=generate-with-openssl-rand-base64-32
COOKIE_SECRET=generate-with-openssl-rand-base64-32
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=pk_...

# Redis (optional, for sessions/cache)
REDIS_URL=redis://localhost:6379

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (for Medusa admin uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (SendGrid, Resend, etc.)
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# File Storage (Cloudinary)
CLOUDINARY_STORAGE_URL=cloudinary://api_key:api_secret@cloud_name

# Workers
MEDUSA_WORKER_MODE=shared
```

### Render Environment Variables (Backend)
Set all backend vars in Render dashboard → Environment.

### Netlify Environment Variables (Frontend)
Set all frontend vars in Netlify dashboard → Site settings → Environment variables.

---

## 5. GITHUB ACTIONS CI/CD

### `.github/workflows/ci.yml`

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test
```

### `.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy Frontend to Netlify
on:
  push:
    branches: [main]
    paths: ['frontend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - working-directory: ./frontend
        run: npm ci && npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=.next
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend to Render
on:
  push:
    branches: [main]
    paths: ['backend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render Deploy
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

---

## 6. MOBILE-FIRST RESPONSIVE DESIGN SYSTEM

### Tailwind Breakpoints (Mobile-First)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      screens: {
        'xs': '375px',   // iPhone SE / small phones
        'sm': '640px',   // Large phones / small tablets
        'md': '768px',   // Tablets
        'lg': '1024px',  // Laptops
        'xl': '1280px',  // Desktops
        '2xl': '1536px', // Large desktops
      },
      spacing: {
        '18': '4.5rem',  // 72px
        '88': '22rem',   // 352px
        '128': '32rem',  // 512px
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 0.875rem + 0vw, 1rem)',
        'fluid-base': 'clamp(1rem, 1rem + 0vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1.125rem + 0.5vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.25rem + 1vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.5rem + 1.5vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.875rem + 2vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 2.25rem + 2.5vw, 3rem)',
      },
    },
  },
}
```

### Touch Target Standards (WCAG 2.1 AA)

```css
/* Global minimum touch target */
.touch-target {
  @apply min-h-[44px] min-w-[44px] flex items-center justify-center;
}

/* Button variants */
.btn-primary {
  @apply touch-target px-6 py-3 rounded-lg font-medium
         bg-primary-600 text-white
         active:scale-[0.98] transition-transform duration-100
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply touch-target px-6 py-3 rounded-lg font-medium
         border-2 border-primary-600 text-primary-600
         bg-transparent
         active:bg-primary-50 transition-colors duration-100;
}
```

### Mobile Navigation Pattern

```tsx
// components/layout/MobileNav.tsx
// Bottom tab bar (iOS style) or Hamburger + Slide-over drawer
// Bottom tabs for 4-5 primary destinations:
// Home | Categories | Cart | Try-On | Profile
```

### Responsive Product Grid

```tsx
// Mobile: 2 columns (xs) → 3 columns (sm) → 4 columns (md) → 5 columns (lg)
<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```

### Image Optimization (Cloudinary)

```typescript
// lib/cloudinary.ts
export function getOptimizedImageUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: 'auto' | number; format?: 'auto' | 'webp' | 'avif' } = {}
) {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/q_${quality},f_${format}${width ? `,w_${width}` : ''}${height ? `,h_${height}` : ''},c_fill/${publicId}`;
}

// Usage in ProductImage component
<Image
  src={getOptimizedImageUrl(product.image.publicId, { width: 400, height: 500 })}
  alt={product.title}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
/>
```

---

## 7. VIRTUAL TRY-ON INTEGRATION DETAILS

### fal.ai IDM-VTON API Client

```typescript
// lib/fal.ts
import { fal } from '@fal-ai/serverless-client';

fal.config({ credentials: process.env.FAL_KEY });

interface TryOnInput {
  human_image_url: string;
  garment_image_url: string;
  description: string;
  garment_type?: 'upper_body' | 'lower_body' | 'full_body' | 'headwear' | 'footwear' | 'handwear';
}

interface TryOnResult {
  image: { url: string; content_type: string; width: number; height: number };
  mask: { url: string; content_type: string; width: number; height: number };
}

export async function generateTryOn(input: TryOnInput): Promise<TryOnResult> {
  const result = await fal.subscribe('fal-ai/idm-vton', {
    input,
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_PROGRESS') {
        console.log('Try-on processing:', update.logs?.map(l => l.message).join(', '));
      }
    },
  });
  return result.data as TryOnResult;
}

// Garment type mapping from product category
export function getGarmentType(categoryPath: string): TryOnInput['garment_type'] {
  const upperBody = ['outerwear', 'formal_wear', 'casual', 'workwear', 'shirts', 'knitwear'];
  const lowerBody = ['pants', 'jeans', 'trousers', 'shorts'];
  const headwear = ['headwear'];
  const footwear = ['footwear'];
  const handwear = ['handwear', 'gloves', 'mittens'];

  const cat = categoryPath.toLowerCase();
  if (upperBody.some(c => cat.includes(c))) return 'upper_body';
  if (lowerBody.some(c => cat.includes(c))) return 'lower_body';
  if (headwear.some(c => cat.includes(c))) return 'headwear';
  if (footwear.some(c => cat.includes(c))) return 'footwear';
  if (handwear.some(c => cat.includes(c))) return 'handwear';
  return 'upper_body'; // default
}
```

### Try-On Flow (Client-Side)

```tsx
// components/tryon/TryOnButton.tsx
'use client';

export function TryOnButton({ product }: { product: Product }) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);

  const handleTryOn = async () => {
    if (!userImage) { alert('Please upload your photo first'); return; }
    
    setStatus('uploading');
    // 1. Upload user image to Cloudinary (signed upload)
    const uploadRes = await fetch('/api/upload/user-photo', {
      method: 'POST',
      body: formData, // userImage
    });
    const { url: userImageUrl } = await uploadRes.json();

    setStatus('processing');
    // 2. Call try-on API
    const tryOnRes = await fetch('/api/tryon/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        userImageUrl,
        garmentType: getGarmentType(product.categoryPath),
      }),
    });
    const data = await tryOnRes.json();

    if (data.resultImageUrl) {
      setResultUrl(data.resultImageUrl);
      setStatus('done');
      // Open modal with result
    } else {
      setStatus('error');
    }
  };

  return (
    <>
      <button className="btn-primary w-full" onClick={handleTryOn} disabled={status !== 'idle'}>
        {status === 'processing' && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        {status === 'uploading' ? 'Uploading...' : 
         status === 'processing' ? 'AI is dressing you...' : 
         'Try On'}
      </button>
      {status === 'done' && <TryOnModal resultUrl={resultUrl} onClose={() => setStatus('idle')} />}
    </>
  );
}
```

### Full-Body Try-On Strategy

|  Approach  |  Description  |  Pros  |  Cons  |
|----------|-------------|------|------|
| **Single Model** | CatVTON or future full-body model | One call | Limited availability |
| **Compose** | Upper + Lower separately → stitch | Works today | Alignment challenges |
| **Progressive** | Try upper, then lower, show combined | Better UX | 2x API calls |

**Recommendation**: Start with **upper-body only** (IDM-VTON). Add full-body when CatVTON or similar is production-ready on fal.ai.

---

## 8. SIZE RECOMMENDATION ENGINE

### Algorithm (MVP: Rule-Based)

```typescript
// lib/size-recommendation.ts
interface Measurement {
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  heightCm?: number;
  weightKg?: number;
}

interface SizeChartEntry {
  size: string;
  measurements: Record<string, { min: number; max: number }>;
}

export function recommendSize(
  userMeasurements: Measurement,
  sizeChart: SizeChartEntry[],
  fitType: 'slim' | 'regular' | 'relaxed' | 'oversized' = 'regular'
): { size: string; confidence: number; reasoning: string } {
  // Score each size based on how many measurements fall in range
  const scores = sizeChart.map(entry => {
    let matches = 0;
    let total = 0;
    for (const [key, range] of Object.entries(entry.measurements)) {
      const userValue = userMeasurements[key as keyof Measurement];
      if (userValue !== undefined) {
        total++;
        if (userValue >= range.min && userValue <= range.max) matches++;
      }
    }
    const score = total > 0 ? matches / total : 0;
    return { size: entry.size, score, entry };
  });

  // Sort by score, apply fit preference bias
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Fit preference tiebreaker
    const fitOrder = { slim: 0, regular: 1, relaxed: 2, oversized: 3 };
    return fitOrder[fitType] - fitOrder[fitType]; // Simplified
  });

  const best = scores[0];
  return {
    size: best.size,
    confidence: Math.round(best.score * 100) / 100,
    reasoning: `Based on your measurements, ${best.size} matches ${Math.round(best.score * 100)}% of size chart ranges.`,
  };
}
```

### Future: ML-Based (Post-MVP)

- Train on: user measurements + purchased size + return/fit feedback
- Features: body measurements, product fit type, brand sizing bias, category
- Model: Gradient boosting (XGBoost) or simple neural net
- Deploy: Separate Python service or ONNX runtime in Node

---

## 9. PHASE-BY-PHASE IMPLEMENTATION PLAN

### Phase 0: Foundation (Week 1)

- [ ] Initialize monorepo (or separate frontend/backend repos)
- [ ] Set up Docker Compose (Postgres + Medusa)
- [ ] Next.js 15 + TypeScript + Tailwind + shadcn/ui
- [ ] Prisma schema + migrations
- [ ] Supabase project + connect
- [ ] Netlify + Render accounts + connect GitHub
- [ ] CI/CD pipelines (lint, typecheck, deploy)
- [ ] Environment variable templates

### Phase 1: Commerce Core (Week 2-3)

- [ ] Medusa backend setup + admin user
- [ ] Product categories + collections seeded
- [ ] Product Extension module (custom fields)
- [ ] Next.js product listing (infinite scroll, filters)
- [ ] Product detail page (gallery, variants, size selector)
- [ ] Cart (persisted, server-side)
- [ ] Checkout flow (Stripe test mode)
- [ ] Order confirmation + email (Resend/SendGrid)

### Phase 2: Auth & Profile (Week 3)

- [ ] NextAuth v5: Google + Email/Password
- [ ] Protected routes middleware
- [ ] User profile page (edit info, avatar upload → Cloudinary)
- [ ] Measurement profile (form with guide diagrams/video)
- [ ] Size preference per category/brand

### Phase 3: Virtual Try-On (Week 4)

- [ ] fal.ai account + API key
- [ ] User photo upload (Cloudinary signed uploads)
- [ ] Try-On API route (proxy to fal.ai)
- [ ] TryOnButton component + TryOnModal
- [ ] Try-On history page (grid, favorites, share)
- [ ] ProductExtension.tryOnGarmentImageUrl prep (background job)

### Phase 4: Size Recommendation (Week 5)

- [ ] Size chart data structure (JSON in ProductExtension)
- [ ] Size recommendation API (rule-based)
- [ ] SizeRecommendation component on product page
- [ ] SizeRecommendationLog for analytics
- [ ] "Find My Size" CTA in header (mobile sticky)

### Phase 5: Wishlist & Polish (Week 5-6)

- [ ] Wishlist (heart icon, dedicated page)
- [ ] Recently viewed (localStorage + server sync)
- [ ] Search (Meilisearch plugin for Medusa)
- [ ] Mobile navigation (bottom tabs)
- [ ] PWA manifest + service worker (next-pwa)
- [ ] Accessibility audit (axe-core, manual testing)
- [ ] Performance audit (Lighthouse CI)

### Phase 6: Launch Prep (Week 6)

- [ ] SEO: sitemap, robots.txt, meta tags, JSON-LD
- [ ] Error boundaries + Sentry (free tier)
- [ ] Analytics (Vercel Analytics / Plausible)
- [ ] Load testing (k6)
- [ ] Documentation (README, API docs)
- [ ] Deploy to production domains

---

## 10. KEY DECISIONS & TRADEOFFS

|  Decision  |  Choice  |  Rationale  |
|----------|--------|-----------|
| Monorepo vs Separate | **Separate repos** (frontend/backend) | Independent deploys, clearer ownership, Netlify/Render config simpler |
| Medusa Customizations | **Custom modules + API routes** | Keeps Medusa upgradable, separates concerns |
| Image Upload | **Direct Cloudinary signed uploads** | No backend bandwidth, faster, secure |
| Try-On Processing | **Async (polling/webhook)** | fal.ai takes 10-15s; don't block request |
| State Management | **React Context + Server State (TanStack Query)** | No Redux needed; RSC + Query covers most |
| Forms | **React Hook Form + Zod** | Type-safe, performant |
| Date/Time | **date-fns** | Lightweight, tree-shakeable |
| Icons | **lucide-react** | Tree-shakeable, consistent |
| Notifications | **Sonner (toast)** | Accessible, nice UX |

---

## 11. ESTIMATED TIMELINE & EFFORT

|  Phase  |  Duration  |  Effort  |  Dependencies  |
|-------|----------|--------|--------------|
| 0: Foundation | 1 week | Medium | None |
| 1: Commerce Core | 2 weeks | High | Phase 0 |
| 2: Auth & Profile | 1 week | Medium | Phase 1 |
| 3: Virtual Try-On | 1 week | Medium | Phase 2, fal.ai credits |
| 4: Size Recommendation | 1 week | Low-Med | Phase 2, Product data |
| 5: Polish & PWA | 1 week | Medium | Phase 1-4 |
| 6: Launch Prep | 1 week | Low | Phase 5 |
| **Total** | **~8 weeks** | | |

---

## 12. RISKS & MITIGATIONS

|  Risk  |  Likelihood  |  Impact  |  Mitigation |
|------|------------|--------|------------|
| Medusa v2 breaking changes | Medium | High | Pin version, test upgrades in branch |
| fal.ai API changes / pricing | Low | Medium | Abstract behind interface; monitor changelog |
| Render cold starts (30s) | High | Medium | Warm cron job (ping /health every 10min) |
| Supabase free tier limits | Low | Medium | Monitor usage; plan migration path |
| Apple Sign-In requires $99/yr | High | Low | Defer to post-MVP; Google + Email covers 90%+ |
| Mobile Safari PWA limitations | Medium | Low | Graceful degradation; native app later |
| IDM-VTON quality on diverse bodies | Medium | Medium | Test with diverse photos; add "report bad result" |

---

## 13. PRODUCT CATEGORY HIERARCHY

```bash
🏷️  CATEGORIES
├── 🧥 Outerwear
│   ├── Heavy Duty (workwear, waterproof, insulated)
│   ├── Formal (overcoats, trench coats, blazers)
│   ├── Casual (denim jackets, bomber, hoodies, shackets)
│   └── Statement (patterned, bold colors, designer)
├── 🤵 Formal Wear
│   ├── Suits (2-piece, 3-piece, tuxedos)
│   ├── Dress Shirts (spread, point, button-down collar)
│   ├── Trousers (wool, chino, dress)
│   ├── Waistcoats
│   └── Formal Accessories (ties, bow ties, pocket squares, cufflinks)
├── 👕 Casual
│   ├── T-Shirts (crew, v-neck, henley, longline)
│   ├── Polos
│   ├── Shirts (flannel, chambray, linen, overshirt)
│   ├── Knitwear (sweaters, cardigans, pullovers)
│   ├── Pants (jeans, chinos, joggers, cargo)
│   └── Shorts
├── 🛠️ Workwear
│   ├── Safety (hi-vis, flame-resistant, reinforced)
│   ├── Durable (canvas, duck cloth, heavy denim)
│   ├── Utility (multi-pocket, tool loops, knee pads)
│   └── Footwear (steel-toe, composite-toe, slip-resistant)
├── 🧢 Headwear
│   ├── Caps (baseball, trucker, dad hat, snapback)
│   ├── Beanies (cuffed, slouchy, pom-pom)
│   ├── Hats (fedora, bucket, boonie, flat cap)
│   └── Cold Weather (trapper, balaclava, ear warmers)
├── 👟 Footwear
│   ├── Boots (work, chukka, chelsea, hiking, winter)
│   ├── Sneakers (lifestyle, running, skate, retro)
│   ├── Dress Shoes (oxford, derby, loafer, monk strap)
│   ├── Sandals & Slides
│   └── Socks (dress, athletic, wool, compression)
└── 🧤 Handwear & Accessories
    ├── Gloves (leather, wool, touchscreen, work, driving)
    ├── Mittens
    ├── Belts (leather, canvas, ratchet, dress)
    ├── Wallets (bifold, trifold, cardholder, money clip)
    ├── Bags (backpack, messenger, duffel, tote, sling)
    ├── Watches (analog, smart, dive, dress)
    ├── Jewelry (rings, bracelets, necklaces, tie clips)
    └── Eyewear (sunglasses, blue-light, reading)
```

---

## 14. TECH STACK SUMMARY

|  Layer  |  Technology  |  Version  |  Free Tier  |
|-------|------------|---------|-----------|
| Frontend Framework | Next.js | 15 (App Router) | N/A (OSS) |
| Language | TypeScript | 5.x | N/A |
| Styling | Tailwind CSS | 3.x | N/A |
| UI Components | shadcn/ui | Latest | N/A |
| Commerce Engine | Medusa | v2 | MIT License |
| Database | PostgreSQL | 16 | Supabase Free (500MB) |
| ORM | Prisma | 5.x | N/A |
| Auth | NextAuth.js | v5 | N/A |
| Payments | Stripe | Latest | Test Mode Free |
| Images | Cloudinary | Latest | 25GB Free |
| Virtual Try-On | fal.ai (IDM-VTON) | Latest | ~$10-20 Free Credits |
| Frontend Hosting | Netlify | Latest | 100GB BW / 300 Build Min |
| Backend Hosting | Render | Latest | 750 hrs/mo Free |
| Database Hosting | Supabase | Latest | 500MB + Auth + Storage |
| CI/CD | GitHub Actions | Latest | Free for Public Repos |

---

## 15. NEXT STEPS

1. **Create repository structure** with all config files
2. **Initialize Docker Compose** for local development
3. **Set up Next.js 15 frontend** with TypeScript, Tailwind, shadcn/ui
4. **Configure Prisma schema** and run migrations
5. **Deploy Medusa backend** to Render
6. **Connect Supabase** for database and auth
7. **Set up Netlify** for frontend deployment
8. **Configure GitHub Actions** for CI/CD
9. **Begin Phase 1 implementation**

---

*Document created: 2026-09-03 | Location: history/SPEC.md*
