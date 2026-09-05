# MAN Fashion E-Commerce

Men's fashion e-commerce platform with AI virtual fitting room.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Medusa v2 (headless commerce)
- **Database**: PostgreSQL (Supabase in production, Docker locally)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (Google + Email/Password)
- **Payments**: Stripe (test mode)
- **Images**: Cloudinary
- **Virtual Try-On**: fal.ai (IDM-VTON model)
- **Deployment**: Netlify (frontend) + Render (backend)
- **CI/CD**: GitHub Actions

## Project Structure

```
man_fashion_e_commernce/
├── .github/workflows/       # CI/CD pipelines
├── docker-compose.yml       # Local dev: Postgres + Medusa + Redis
├── front_end/               # Next.js 15 frontend
├── back_end/                # Medusa v2 backend
├── prisma/                  # Custom Prisma schema
├── shared/                  # Shared TypeScript types
├── .env.example             # Environment template
└── SPEC.md (in history/)    # Technical specification
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

### Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/HussamAlraggad/man_fashion_e_commernce.git
   cd man_fashion_e_commernce
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (Cloudinary, Stripe, fal.ai, etc.)
   ```

3. **Start local services**
   ```bash
   docker-compose up -d
   # Postgres on localhost:5432
   # Medusa on localhost:9000
   # Redis on localhost:6379
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   # Frontend: http://localhost:3000
   # Backend:  http://localhost:9000
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend |
| `npm run build` | Build both workspaces |
| `npm run lint` | Lint both workspaces |
| `npm run typecheck` | TypeScript check both workspaces |
| `npm run test` | Run tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Medusa backend URL | Yes |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Medusa publishable key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `COOKIE_SECRET` | Cookie signing secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `FAL_KEY` | fal.ai API key | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | Yes |
| `AUTH_GOOGLE_SECRET` | Google OAuth secret | Yes |
| `NEXTAUTH_URL` | App URL (for NextAuth) | Yes |
| `SENDGRID_API_KEY` | SendGrid API key | No |
| `SENDGRID_FROM_EMAIL` | Sender email | No |

## Deployment

### Frontend (Netlify)

1. Connect repository to Netlify
2. Set build command: `npm run build` (base: `front_end`)
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Backend (Render)

1. Create new Web Service on Render
2. Connect repository
3. Set build command: `npm run build` (base: `back_end`)
4. Set start command: `npm run start`
5. Add environment variables in Render dashboard
6. Deploy

### Database (Supabase)

1. Create Supabase project
2. Run migrations: `npx prisma migrate deploy`
3. Add `DATABASE_URL` to environment variables

## Features

- **Product Catalog**: Outerwear, Formal, Casual, Workwear, Headwear, Footwear, Accessories
- **Virtual Try-On**: Upload photo, try on any garment (upper-body MVP)
- **Size Recommendation**: Measurement-based size matching
- **User Profiles**: Editable measurements, size preferences, wishlist
- **Cart & Checkout**: Stripe-powered, server-side cart
- **Mobile-First**: Bottom tab nav, touch targets ≥44px, PWA-ready

## Design System

Defined in `front_end/src/styles/globals.css`:
- **Palette**: OKLCH (Committed strategy - petrol teal primary, brass accent)
- **Typography**: Didot (display) + IBM Plex Sans (UI) + IBM Plex Mono (prices)
- **Spacing**: 4px base unit, semantic spacing tokens
- **Motion**: Expressive with reduced-motion support
- **Components**: Custom Button, Input, Card, Modal, MobileNav, ProductCard, TryOnButton, TryOnModal

## License

MIT