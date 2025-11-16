# GemasGo Design Guidelines

## Design Approach
**Reference-Based Design** inspired by modern social gaming platforms (Facebook UI patterns, Discord community feel, Steam game library aesthetics). This platform requires high visual engagement while maintaining functional clarity for gaming and monetization features.

## Typography System

**Font Families:**
- Primary: Inter (UI elements, body text)
- Display: Poppins (headings, game titles, GemasGo branding)
- Monospace: JetBrains Mono (point counters, statistics)

**Hierarchy:**
- Hero/Landing: text-4xl to text-6xl (Poppins Bold)
- Section Headers: text-2xl to text-3xl (Poppins SemiBold)
- Game Titles: text-lg (Poppins Medium)
- Body Text: text-base (Inter Regular)
- Captions/Meta: text-sm (Inter Regular)
- Point Displays: text-xl to text-3xl (JetBrains Mono Bold)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Compact spacing: p-2, gap-2
- Standard spacing: p-4, gap-4, m-6
- Section spacing: p-8, py-12, gap-8
- Large spacing: p-16, py-16

**Grid Structure:**
- Game Gallery: 4-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Store Items: 3-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Admin Dashboard: 2-column layout for stats
- Mobile: All grids collapse to single column

**Container Widths:**
- Main content: max-w-7xl mx-auto
- Forms: max-w-md
- Admin panels: max-w-6xl

## Component Library

### Navigation & Header
- **Facebook-style hamburger menu** (top-left, 3 horizontal lines icon)
- Fixed top bar with platform branding "GemasGo" and point counter always visible
- Slide-out sidebar menu with: Juegos, Anuncios, Tienda, Promociones sections
- Language selector with flag icons (5 languages) in top-right
- User avatar/profile button in top-right corner

### Landing Page (Pre-Login)
- **Hero Section**: Clean centered layout with GemasGo logo/branding
- **Language flags** prominently displayed (ES, EN, PT, ZH, HI) as clickable options
- **Welcome message** with clear value proposition
- **Registration form**: Card-style with soft shadows, inputs for name, email (optional), password
- Brief description and privacy policy links at bottom
- Simple, trustworthy design without overwhelming visuals

### Game Gallery
- **Card Design**: Each game in rounded card (rounded-lg) with hover lift effect
- Game thumbnail/icon at top
- Game title below
- "Play Now" button at bottom of card
- Consistent aspect ratio for all thumbnails
- Loading states for games

### Ad Display System
- **Fullscreen modal** for ad viewing with countdown timer
- "Skip Ad" button appears after initial seconds
- GemasGo points earned animation after ad completion
- Non-intrusive ad notification before game starts

### Point Display
- **Persistent counter** in top bar showing current GemasGo balance
- Animated increment when points are earned
- Large display in profile/wallet section
- Clear breakdown of earnings (20% user, 80% admin display for transparency)

### Store Interface
- **Four distinct sections** with clear visual separation:
  1. Free Fire Diamonds: 3 tier cards with pricing
  2. Game Lives: Multiple tier options
  3. Buy GemasGo: Crypto payment options with icons
  4. Payment Receipts: Upload/view area for admin proofs
- Each tier as prominent card with price, quantity, and action button
- Success/pending states for purchases

### Video Promotion Section
- **Form-based interface** with platform selection (YouTube/TikTok/Facebook icons)
- Duration slider with visual feedback
- Goal inputs (likes, views) with dynamic cost calculation display
- Video preview area showing thumbnail
- "Submit for Approval" prominent button
- Status badges for pending/approved/rejected promotions

### Admin Panel
- **Dashboard layout** with stat cards showing:
  - Total ad views
  - Revenue breakdown
  - Active users
  - Pending promotions
- **Management sections** with tables for:
  - Game uploads (drag-drop area)
  - Price/tier editing (inline editing)
  - Promotion approvals (approve/reject buttons)
  - User messages (chat-style interface)
- Clean data tables with sorting/filtering
- Upload areas for receipts/comprobantes with preview

### Forms & Inputs
- Rounded inputs (rounded-md) with clear labels
- Focus states with subtle outline
- Error states in red with helper text
- Success states in green
- Consistent button styles:
  - Primary: Bold, prominent for main actions
  - Secondary: Outlined for secondary actions
  - Danger: Red for destructive actions

### Notifications & Messaging
- Toast notifications sliding from top-right
- In-app message center with unread badges
- Image preview in messages for payment receipts
- Clear timestamp and sender identification

## Images

**Hero Image**: Not applicable - landing uses clean branding-focused layout

**Game Thumbnails**: Each game requires square thumbnail (300x300px minimum)
- Colorful, eye-catching game screenshots
- Consistent aspect ratio across all games
- Placeholder: Generic game controller icon with gradient background

**Platform Icons**: 
- YouTube logo for video promotions
- TikTok logo
- Facebook logo
- Crypto icons (Bitcoin, Ethereum, USDT, BNB)

**Admin Receipts**: User-uploaded payment proof images displayed in message threads

**Flag Icons**: Country flags for language selection (ES, EN, PT, ZH, HI)

## Interactions

**Minimal Animations:**
- Smooth page transitions between sections (200ms)
- Button hover states (subtle scale/shadow)
- Point counter increment animation
- Card hover lift (translate-y-1)
- Menu slide-in/out (300ms)
- NO complex scroll animations or excessive effects

**Game Loading**: Simple spinner with "Loading..." text

**Ad Display**: Countdown timer with smooth seconds decrement

## Accessibility
- High contrast text throughout
- Clear focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Keyboard navigation support for all features
- Form validation with screen-reader friendly error messages