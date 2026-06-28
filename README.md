# Hukka Dubai - Luxury E-Commerce Website

Hukka Dubai is a premium, high-converting, and visually stunning e-commerce web application built for a Dubai-based luxury hookah brand targeting the Indian market. The design aesthetics draw inspiration from premium luxury perfume, fashion, and lifestyle brands (e.g., Rolex, Lamborghini, Apple) to create an elite, immersive user experience.

---

## 💎 Brand Positioning & Design Aesthetics
* **Visual Theme:** Matte Black background, deep charcoal panels, luxury metallic gold accents (`#b47822`), bronze, and silver.
* **Atmosphere:** Floating glassmorphic cards, smooth page transitions, custom glowing hotspot overlays, and premium smoke wave animations.
* **Typography:** Elegant serif headings (*Playfair Display*) paired with modern sans-serif body text (*Poppins*).
* **Target Audience:** Connoisseurs and luxury lifestyle collectors in the Indian metropolitan market.

---

## 🛠️ Technology Stack
* **Framework:** Next.js (version 16/canary with App Router)
* **Libraries:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React
* **Backend:** Next.js Route Handlers (API endpoints)
* **Authentication:** Stateless session JWT token stored in HTTP-Only, Secure cookies via `jose` and `bcryptjs`.
* **Database Strategy:**
  * **Development (Local):** `better-sqlite3` database engine executing queries against a local `hukka.db` file (with automatic table schema generation and product seeding).
  * **Production:** Extensible database interface ready to map SQLite operations to Supabase (PostgreSQL) or MongoDB.

---

## 📦 Project Architecture
```txt
/src
├── app/
│   ├── api/                   # Server API Endpoints
│   │   ├── admin/             # Restricted administrative endpoints
│   │   │   ├── analytics/     # Gross revenue and customer analytics
│   │   │   └── orders/        # Order transactions viewer and status updates
│   │   ├── auth/              # Membership sign-in, signup, and logout
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── me/            # Session validation
│   │   │   └── register/
│   │   ├── coupons/           # Promotional code validations
│   │   ├── orders/            # Customer checkouts and order history
│   │   ├── products/          # Catalog retrieval
│   │   │   └── [slug]/        # Single product & review listings
│   │   └── reviews/           # Review posting
│   ├── auth/                  # Membership gateway page
│   ├── checkout/              # One-page secure checkout form
│   ├── dashboard/             # Member portal (Orders, Wishlist, Rewards)
│   ├── admin/                 # Executive Control Center dashboard
│   ├── products/
│   │   └── [slug]/            # flagships details page
│   ├── shop/                  # Filterable collection list page
│   ├── globals.css            # Custom CSS animations & luxury design tokens
│   └── layout.tsx             # Root layout wrapping Context Providers & Age Gate
├── components/                # Modular reusable elements
│   ├── AgeGate.tsx            # Regulatory age gateway (18+ COTPA)
│   ├── Header.tsx             # Sticky Glassmorphic navigation
│   ├── Footer.tsx             # Compliance links & email subscription
│   ├── CartDrawer.tsx         # Slide-in cart sidebar with cross-sell upsells
│   ├── BestSellers.tsx        # Horizontal product slider
│   ├── FeaturedCollections.tsx# Grid of category banners
│   ├── ProductShowcase.tsx    # Flagship hotspot details visualizer
│   ├── WhyChooseUs.tsx        # Card display of trust badges
│   ├── ReviewsSection.tsx     # Testimonial slider
│   └── InstagramGallery.tsx   # Social proof grid
├── context/
│   └── AppContext.tsx         # Global cart, auth, coupon, and age state
└── lib/
    ├── db.ts                  # SQLite DB Client, schemas, and seeding
    └── jwt.ts                 # JWT signing and verifying helpers
```

---

## 🛢️ Database Schema (SQLite / Production Mapping)

### 1. `users` Table
Stores registered member details and rewards balances.
* `id` (TEXT PRIMARY KEY)
* `name` (TEXT)
* `email` (TEXT UNIQUE)
* `password` (TEXT)
* `role` (TEXT DEFAULT 'user')
* `rewards_points` (INTEGER DEFAULT 0)

### 2. `products` Table
Holds the catalog of premium hookahs, accessories, and consumables.
* `id` (TEXT PRIMARY KEY)
* `name` (TEXT)
* `slug` (TEXT UNIQUE)
* `description` (TEXT)
* `price` (REAL)
* `image_url` (TEXT)
* `images` (TEXT - JSON Array of detail images)
* `rating` (REAL DEFAULT 0)
* `reviews_count` (INTEGER DEFAULT 0)
* `category` (TEXT)
* `style` (TEXT)
* `material` (TEXT)
* `height` (TEXT)
* `brand` (TEXT)
* `stock` (INTEGER)
* `is_bestseller` (INTEGER DEFAULT 0)
* `is_new_arrival` (INTEGER DEFAULT 0)
* `specs` (TEXT - JSON Object of spec parameters)

### 3. `orders` Table
Captures guest and member transactions.
* `id` (TEXT PRIMARY KEY)
* `user_id` (TEXT NULLABLE)
* `total_amount` (REAL)
* `status` (TEXT DEFAULT 'pending')
* `payment_method` (TEXT)
* `payment_status` (TEXT DEFAULT 'pending')
* `address` (TEXT - JSON Object of shipment address)
* `items` (TEXT - JSON Array of purchased products)

### 4. `reviews` Table
Stores customer ratings, comments, and optional media attachments.
* `id` (TEXT PRIMARY KEY)
* `product_id` (TEXT FOREIGN KEY)
* `user_name` (TEXT)
* `rating` (INTEGER)
* `comment` (TEXT)
* `title` (TEXT)
* `image_url` (TEXT NULLABLE)
* `video_url` (TEXT NULLABLE)

### 5. `coupons` Table
Stores promotional discount parameters.
* `code` (TEXT PRIMARY KEY)
* `discount_percent` (INTEGER)
* `expiry_date` (TEXT)
* `is_active` (INTEGER DEFAULT 1)

---

## ⚙️ How to Run Locally

### 1. Install Dependencies
Run the package installation:
```bash
npm install
```

### 2. Startup Development Server
Run the local dev command. On startup, it automatically executes database table creations and seeds the product catalog inside the new `hukka.db` file.
```bash
npm run dev
```
Open `http://localhost:3000` to view the luxury website.

### 3. Test Administrative Mode
Sign in with the seeded administrator credentials:
* **Email:** `admin@hukka.com`
* **Password:** `admin123`
Navigate to `/admin` or click **Admin** in the navigation header to view revenue metrics and update customer orders.
