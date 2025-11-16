# Phone Verification Service Platform

## Overview

This is a SaaS platform that provides virtual phone numbers for SMS and voice verification services. Users can purchase credits, rent phone numbers, and receive verification codes for various third-party services (Google, Tinder, PayPal, etc.). The platform features a public landing page and an authenticated dashboard for managing verifications and rentals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type safety and modern React patterns
- **Vite** as the build tool and development server with HMR support
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management, caching, and data fetching
- Single Page Application (SPA) with client-side routing and protected routes

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives (configured in components.json)
- **Tailwind CSS** for utility-first styling with custom design system
- Custom color system with HSL variables for theming (light/dark mode support)
- Design inspired by TextVerified's landing pages and Linear/Stripe's dashboard patterns (see design_guidelines.md)
- Path aliases configured: `@/` for client/src, `@shared/` for shared code, `@assets/` for assets

**Page Structure**
- Landing page (public) - marketing site with features, pricing, FAQ
- Dashboard (protected) - user account overview, credit balance, transaction history
- Services (protected) - browse available verification services
- Verification (protected) - active verification flow with phone number and code retrieval
- Admin (protected) - pricing settings and system configuration

**Authentication Flow**
- Replit Auth integration via OpenID Connect (OIDC)
- Session-based authentication with PostgreSQL session storage
- Protected routes redirect to `/api/login` when unauthenticated
- User context available via `useAuth()` hook

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with TypeScript
- ESM (ES Modules) throughout the codebase
- Development mode uses `tsx` for TypeScript execution
- Production build uses `esbuild` for bundling

**API Design**
- RESTful API endpoints under `/api` prefix
- Authentication middleware (`isAuthenticated`) protects sensitive routes
- Request/response logging for API endpoints
- JSON body parsing with raw body capture for webhooks (Stripe)

**Key API Endpoints**
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/transactions` - User transaction history
- `GET /api/services` - List available verification services
- `GET /api/services/:id` - Get specific service details
- `POST /api/verifications` - Create new verification request
- `GET /api/verifications` - User's verifications
- `POST /api/rentals` - Create phone number rental
- `GET /api/rentals` - User's active rentals
- `GET /api/settings/pricing` - Admin pricing configuration
- `PUT /api/settings/pricing/:serviceType` - Update pricing

**Authentication System**
- Replit Auth via OpenID Connect with Passport.js strategy
- Session storage in PostgreSQL using `connect-pg-simple`
- Session cookie with 7-day TTL, httpOnly, secure flags
- User sessions include claims, access_token, refresh_token from OIDC

### Data Storage Solutions

**Database**
- **PostgreSQL** as primary database (via Neon serverless)
- **Drizzle ORM** for type-safe database queries and schema management
- Connection pooling via `@neondatabase/serverless` with WebSocket support
- Schema-first approach with TypeScript types generated from Drizzle schema

**Database Schema**
- `users` - User accounts with credit balance, profile info
- `transactions` - Credit purchases and deductions (purchase/deduction types)
- `services` - Available verification services with pricing by category
- `verifications` - One-time SMS verification records with status tracking
- `rentals` - Phone number rentals (non-renewable 1-14 day, renewable monthly)
- `pricing_settings` - Global pricing configuration by service type
- `sessions` - Server-side session storage for authentication

**Data Access Layer**
- Storage interface abstraction (`IStorage`) for database operations
- Repository pattern implementation in `server/storage.ts`
- All database queries use Drizzle ORM with type safety
- Relations defined between tables (users → transactions, verifications, rentals)

### External Dependencies

**Payment Processing**
- **Stripe** integration for credit purchases (@stripe/stripe-js, @stripe/react-stripe-js)
- Webhook endpoint for payment confirmations (uses raw body for signature verification)
- Credit balance system stored in database (numeric type for precision)

**Authentication Provider**
- **Replit Auth** (OpenID Connect) for user authentication
- Configured via environment variables: `ISSUER_URL`, `REPL_ID`
- No password management - delegated to Replit's OAuth system

**UI Dependencies**
- **Radix UI** primitives for accessible components
- **Lucide React** for icon system
- **React Icons** for brand logos (Google, Tinder, PayPal, etc.)
- **date-fns** for date formatting and manipulation
- **class-variance-authority** for component variant styling

**Development Tools**
- Replit-specific Vite plugins for development experience
- Error overlay, cartographer, and dev banner in development mode
- PostCSS with Tailwind and Autoprefixer for CSS processing

**Environment Configuration**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `SESSION_SECRET` - Session encryption secret (required)
- `ISSUER_URL` - OIDC issuer URL (defaults to replit.com/oidc)
- `REPL_ID` - Replit environment identifier
- `NODE_ENV` - Environment mode (development/production)

**Seed Data**
- Initial services catalog (Google, Tinder, PayPal, Uber, etc.)
- Pricing settings for verification types (verification, non_renewable_rental, renewable_rental)
- Categories: Social Media, Dating, Finance, Rideshare, Messaging, Professional, Technology, Entertainment, E-commerce