# Project Blueprint: Hukka Dubai Luxury E-Commerce

This document provides a detailed overview of the modules, file structures, schemas, and workflows implemented for the **Hukka Dubai** luxury hookah e-commerce platform.

---

## 🎨 Visual Identity & UI Guidelines

* **Visual Theme:** Matte Black background, deep charcoal panels, luxury metallic gold accents (`#b47822`), bronze, and silver.
* **Atmosphere:** Floating glassmorphic cards, smooth page transitions, custom glowing hotspot overlays, and premium smoke wave animations.
* **Typography:** Elegant serif headings (*Playfair Display*) paired with modern sans-serif body text (*Poppins*).
* **Target Audience:** Connoisseurs and luxury lifestyle collectors in the Indian metropolitan market.

---

## 🏗️ Core Application Modules

### 🚨 Age Gate Verification (`/src/components/AgeGate.tsx`)
* **Purpose:** Cotton/Tobacco guidelines (COTPA) and regulatory compliance (18+).
* **Behavior:** Modal cover blocking the entire screen. Sets `hukka_age_verified = true` in `localStorage` upon confirmation.

### 🧭 Navigation & Cart (`/src/components/Header.tsx` & `/src/components/CartDrawer.tsx`)
* **Behavior:** Sticky glassmorphic navbar with active notifications. Toggles a right-side sliding Cart Drawer with Framer Motion slide-in animations.
* **Upsells:** Recommends "Sultan's Premium Charcoals" or other compatible items directly in the cart drawer if not already present.

### 🛍️ Filterable Collection Listing (`/src/app/shop/ShopClient.tsx`)
* **Behavior:** Sidebar filter for category choices and price ranges. Search input with instant client-side filtering. Sort options (low-to-high, high-to-low, top-rated).

### 🔍 Flagship Details & Reviews (`/src/app/products/[slug]/ProductDetailsClient.tsx`)
* **Hotspots:** Interactive hotspot indicators on the flagship "Burj Gold Elite" detailing gold plating, stem channel tubes, and base craftsmanship.
* **Reviews:** Form to submit verified collector reviews directly onto the product.

### 💸 Members portal & Admin Panel (`/src/app/dashboard` & `/src/app/admin`)
* **Rewards:** 1 points awarded for every ₹100 spent. Displays balance.
* **Fulfillment:** Administrators can view gross sales revenue metrics, look up customer delivery addresses, and mark order stages (shipped / delivered).

---

## 💾 SQLite Database Schemas

All schemas are initialized automatically inside the `hukka.db` file upon startup.

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

## 🔑 Administrative Access

To log into the administrator portal:
* **Route:** Go to `/auth`
* **Email:** `admin@hukka.com`
* **Password:** `admin123`
* **Features:** Accesses the administrative overview dashboard for updating ship states or viewing total sales.
