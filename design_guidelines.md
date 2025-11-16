# Design Guidelines: Phone Verification Service Platform

## Design Approach

**Reference-Based with SaaS Dashboard Patterns**
- Landing pages: Inspired by TextVerified's modern, conversion-focused design with clean aesthetics
- Dashboard/App: Drawing from Linear's clarity and Stripe's professional SaaS patterns
- Principle: Professional credibility meets ease of use

## Typography System

**Font Families:**
- Primary: Inter (headers, UI elements) - via Google Fonts
- Secondary: System UI fallback for body text

**Hierarchy:**
- Hero headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section headers: text-3xl md:text-4xl, font-bold
- Subsection headers: text-2xl md:text-3xl, font-semibold
- Card titles: text-xl font-semibold
- Body text: text-base md:text-lg
- Small text/captions: text-sm
- Dashboard metrics: text-4xl font-bold (numbers), text-sm uppercase tracking-wide (labels)

## Layout System

**Spacing Primitives:** Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-16 md:py-24 lg:py-32
- Card gaps: gap-6 to gap-8
- Element margins: m-2, m-4, m-6

**Container Strategy:**
- Landing sections: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Dashboard content: max-w-6xl mx-auto
- Forms/modals: max-w-md to max-w-lg

## Component Library

### Navigation
**Landing Header:**
- Fixed top position with subtle backdrop blur
- Logo left, navigation center (Features, Pricing, FAQ), auth buttons right
- Mobile: Hamburger menu with slide-in drawer
- Height: h-16 md:h-20

**Dashboard Sidebar:**
- Fixed left sidebar w-64 with navigation links
- Icons from Heroicons (outline style)
- Active state with subtle left border accent
- Collapsible on mobile

### Hero Section
**Layout:** Full viewport height (min-h-screen), centered content
- Large hero image background with overlay gradient
- Headline + subheadline centered
- Two prominent CTAs side-by-side (Sign In, Sign Up)
- "Learn More" scroll indicator at bottom
- Use gradient overlays for text readability on images

### Service Showcase Grid
- 2x2 grid on mobile (grid-cols-2), 4 columns on desktop (md:grid-cols-4)
- Logo cards with equal aspect ratio, subtle border
- Platform logos: Google, Tinder, PayPal, Uber + 8-12 more
- "And hundreds more..." text below

### Feature Cards
- 2-column layout on desktop (grid-cols-1 md:grid-cols-2)
- Each card: Icon (Heroicons), bold title, descriptive text
- Features: Text/SMS, Voice, Number Rentals, Easy Payments
- Padding: p-8, rounded-xl borders

### Tutorial/Product Demo
- Full-width section with screenshot mockup
- Desktop screenshot left, content right (2-column md layout)
- Screenshot has subtle shadow and rounded corners
- Mobile: Stacked layout with different screenshot variant

### Pricing Cards
- 3-column grid (grid-cols-1 md:grid-cols-3)
- Each card: Plan name, starting price (large), feature list with checkmarks, CTA button
- Middle card elevated/featured with subtle scale
- Equal height cards using flex
- Pricing: text-4xl font-bold for price, text-sm for "starting at"

### Testimonials
- Horizontal scroll on mobile, 2-3 columns on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Quote card: Quote text, name, location, rating stars (5.0)
- Avatar placeholder with initials
- Subtle border, rounded-lg, p-6

### FAQ Accordion
- Single column, max-w-3xl centered
- Each item: Question (font-semibold), expandable answer
- Click to expand with smooth transition
- Chevron icon rotates on open
- Dividers between items

### Dashboard Components

**Credit Balance Card:**
- Large number display (text-5xl font-bold)
- "Current Balance" label above
- "Buy Credits" prominent button
- Compact, top of dashboard

**Service Selection:**
- Search bar with icon (magnifying glass from Heroicons)
- Grid of service cards (grid-cols-2 md:grid-cols-4 lg:grid-cols-6)
- Each card: Service logo, service name, price
- Hover state with subtle elevation

**Transaction History:**
- Table layout on desktop, card stack on mobile
- Columns: Date, Service, Type, Amount, Status
- Status badges with appropriate styling (success, pending)

**Active Rentals:**
- Card list showing phone number, expiry date, renew button
- Countdown timer for expiration
- Quick actions dropdown

### Forms
**Auth Forms (Login/Register):**
- Centered modal/card max-w-md
- Social login buttons at top (Google, GitHub, Apple icons)
- Divider with "or" text
- Email/password inputs with visible labels
- Submit button full-width, prominent
- Footer links (Forgot password, Sign up instead)

**Payment Modal:**
- Stripe Elements integration styling
- Credit amount selector (preset buttons: $10, $25, $50, Custom)
- Card input fields
- Order summary sidebar
- Secure badge icons (lock, credit card logos)

**Verification Flow:**
- Step indicator (1. Select Service, 2. Get Number, 3. Receive Code)
- Service dropdown/search
- Display assigned number in large, copyable format (click to copy)
- SMS code display when received
- Timer countdown
- Refund notice if code not received

### Buttons
- Primary CTA: px-6 py-3, rounded-lg, font-semibold
- Secondary: Same size, outlined variant
- Small actions: px-4 py-2, text-sm
- Icon buttons: p-2, rounded-md
- Disabled state: reduced opacity, cursor-not-allowed
- Buttons on images: backdrop-blur-sm with semi-transparent background

### Payment Method Badges
- Horizontal row of logo images
- Equal height (h-8), grayscale with opacity
- Credit cards: Visa, Mastercard, Amex
- Crypto: Bitcoin, Ethereum, Litecoin, USDC, Tether, Monero

## Icons
**Library:** Heroicons (outline for navigation, solid for emphasis)
- Feature icons: 24×24 (w-6 h-6)
- Navigation icons: 20×20 (w-5 h-5)
- Button icons: 16×16 (w-4 h-4)

## Images

**Hero Section:**
- Large background image showing phone/security concept with gradient overlay
- Dimensions: 1920×1080, optimized WebP format
- Overlay: gradient from semi-transparent to opaque for text readability

**Product Screenshots:**
- Desktop mockup (1200×800): Dashboard interface showing verification process
- Mobile mockup (400×800): Same interface in mobile view
- Placed in tutorial section with subtle shadow (shadow-2xl)

**Service Logos:**
- Platform logos in grid (Google, Tinder, PayPal, Uber, etc.)
- Consistent sizing: 80×80px on desktop, 60×60px mobile
- Use actual logo images or SVG placeholders

**Testimonial Avatars:**
- Circular placeholders with initials (64×64px)
- Positioned top-left of testimonial card

## Responsive Breakpoints
- Mobile: default (< 768px) - single column, stacked layouts
- Tablet: md (768px+) - 2-column grids
- Desktop: lg (1024px+) - 3-4 column grids, full navigation
- Wide: xl (1280px+) - max content width, generous spacing

## Animations
Use sparingly:
- Page transitions: Subtle fade-in
- Accordion expand/collapse: Smooth height transition (duration-300)
- Hover states: Scale on cards (hover:scale-105), opacity changes
- Modal entry: Fade + slight slide-up
- NO scroll-triggered animations
- NO auto-playing carousels

## Accessibility
- All interactive elements have focus states (ring-2)
- Form inputs with visible labels and error states
- Sufficient contrast ratios throughout
- ARIA labels for icon-only buttons
- Keyboard navigation support for modals and dropdowns