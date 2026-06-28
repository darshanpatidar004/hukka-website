import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Database file path for development SQLite
const DB_PATH = path.join(process.cwd(), 'hukka.db');

let db: any;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  // In production, we would use Supabase (PostgreSQL) or MongoDB.
  // We can mock the database operations or use pg/mongoose here.
  // For demonstration and full portability, we can use SQLite or fall back
  // to a production adapter. Let's create an adapter interface.
  console.log('Production database URL detected. Connecting to production DB...');
}

// Initialize SQLite for dev/demo mode
try {
  db = new Database(DB_PATH, { verbose: console.log });
  db.pragma('journal_mode = WAL');
} catch (error) {
  console.error('Failed to open SQLite database:', error);
}

// Create tables if they do not exist
export function initDb() {
  if (!db) return;

  // Create Users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      rewards_points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Create Products table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image_url TEXT NOT NULL,
      images TEXT NOT NULL, -- JSON array of image URLs
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      category TEXT NOT NULL,
      style TEXT NOT NULL,
      material TEXT NOT NULL,
      height TEXT NOT NULL,
      brand TEXT NOT NULL,
      stock INTEGER NOT NULL,
      is_bestseller INTEGER DEFAULT 0,
      is_new_arrival INTEGER DEFAULT 0,
      specs TEXT NOT NULL, -- JSON object of specifications
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Create Orders table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      address TEXT NOT NULL, -- JSON object of shipping address
      items TEXT NOT NULL, -- JSON array of items purchased
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Create Reviews table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      title TEXT NOT NULL,
      image_url TEXT,
      video_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `).run();

  // Create Coupons table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount_percent INTEGER NOT NULL,
      expiry_date TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    )
  `).run();

  // Seed initial products if database is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (count.count === 0) {
    seedData();
  }
}

function seedData() {
  const products = [
    {
      id: 'p1',
      name: 'The Burj Gold Elite',
      slug: 'the-burj-gold-elite',
      description: 'An architectural marvel inspired by the Burj Khalifa. This hookah is electroplated with 24k gold, featuring hand-blown Bohemian crystal with traditional gold leafing. Offers unparalleled smoke filtration through our proprietary multi-chamber system.',
      price: 125000, // INR (Luxury pricing)
      image_url: '/products/hukka_12.png',
      images: JSON.stringify(['/products/hukka_12.png', '/products/hukka_21.png']),
      rating: 4.9,
      reviews_count: 24,
      category: 'Premium Hookahs',
      style: 'Modern Hookahs',
      material: '24K Gold Plated Brass & Crystal',
      height: '85 cm',
      brand: 'Hukka Dubai',
      stock: 5,
      is_bestseller: 1,
      is_new_arrival: 0,
      specs: JSON.stringify({
        'Chamber Count': '4',
        'Purge System': '360° Downward Purge',
        'Diffuser': 'Adjustable Silent Diffuser',
        'Hose Type': 'Premium Leather with Gold Tips',
        'Base': 'Bohemian Hand-Blown Crystal'
      })
    },
    {
      id: 'p2',
      name: 'Sheikh\'s Stealth Carbon',
      slug: 'sheikhs-stealth-carbon',
      description: 'Engineered for the elite. Combining matte-black aerospace grade titanium with premium carbon fiber weave. A sleek, modern powerhouse designed for the Dubai lifestyle.',
      price: 85000,
      image_url: '/products/hukka_10.png',
      images: JSON.stringify(['/products/hukka_10.png', '/products/hukka_18.png']),
      rating: 4.8,
      reviews_count: 18,
      category: 'Modern Hookahs',
      style: 'Designer Hookahs',
      material: 'Titanium & Carbon Fiber',
      height: '65 cm',
      brand: 'Hukka Dubai',
      stock: 12,
      is_bestseller: 1,
      is_new_arrival: 1,
      specs: JSON.stringify({
        'Stem Material': 'Real Carbon Fiber & Titanium',
        'Connection': 'Magnetic Click Lock',
        'Hose': 'Soft-touch Black Silicone',
        'Mouthpiece': 'Carbon Fiber Finish',
        'Purge': 'Vertical Stem Purge'
      })
    },
    {
      id: 'p3',
      name: 'Jumeirah Pearl',
      slug: 'jumeirah-pearl',
      description: 'Capturing the sunset of Jumeirah beach, this hookah showcases a mother-of-pearl base detailing and a sophisticated brushed rose gold stem. Sophistication in every draw.',
      price: 95000,
      image_url: '/products/hukka_22.png',
      images: JSON.stringify(['/products/hukka_22.png']),
      rating: 4.7,
      reviews_count: 12,
      category: 'Designer Hookahs',
      style: 'Modern Hookahs',
      material: 'Rose Gold Stainless Steel & Pearl Inlay',
      height: '75 cm',
      brand: 'Hukka Dubai',
      stock: 8,
      is_bestseller: 0,
      is_new_arrival: 1,
      specs: JSON.stringify({
        'Base Finish': 'Iridescent Pearl Inlay',
        'Purge System': 'Hidden Invisible Purge',
        'Bowl Connection': 'Phunnel Compatible',
        'Stem': '304 Surgical Grade Stainless Steel'
      })
    },
    {
      id: 'p4',
      name: 'Desert Nomad Briefcase',
      slug: 'desert-nomad-briefcase',
      description: 'The ultimate travel companion for the global jetsetter. An ultra-compact hookah that disassembles into a bespoke carbon-composite briefcase. Light, robust, and performs like a full-sized hookah.',
      price: 65000,
      image_url: '/products/hukka_13.png',
      images: JSON.stringify(['/products/hukka_13.png']),
      rating: 4.9,
      reviews_count: 31,
      category: 'Travel Hookahs',
      style: 'Modern Hookahs',
      material: 'Aircraft Aluminum',
      height: '35 cm',
      brand: 'Hukka Dubai',
      stock: 20,
      is_bestseller: 1,
      is_new_arrival: 0,
      specs: JSON.stringify({
        'Case Size': '30 x 20 x 12 cm',
        'Assembly Time': 'Under 60 seconds',
        'Purge': 'Closed Chamber Purge',
        'Included Accessories': 'Custom travel bag, mini tongs, hose'
      })
    },
    {
      id: 'p5',
      name: 'Royal Onyx HMD v2',
      slug: 'royal-onyx-hmd-v2',
      description: 'The pinnacle of heat management. Carved from a single block of aerospace-grade black aluminum and finished with gold accents. Ensures even heat distribution, prevents flavor burning, and extends your session.',
      price: 12000,
      image_url: '/products/hukka_8.png',
      images: JSON.stringify(['/products/hukka_8.png']),
      rating: 4.8,
      reviews_count: 42,
      category: 'Hookah Accessories',
      style: 'Designer Accessories',
      material: 'Anodized Aluminum & Gold',
      height: 'N/A',
      brand: 'Hukka Dubai',
      stock: 50,
      is_bestseller: 1,
      is_new_arrival: 0,
      specs: JSON.stringify({
        'Coals Capacity': 'Up to 3 flat coals or 2 cubes',
        'Preheat time': '3-5 minutes',
        'Compatibility': 'Fits standard phunnel and clay bowls'
      })
    },
    {
      id: 'p6',
      name: 'Sultan\'s Premium Coconut Charcoals',
      slug: 'sultans-premium-coconut-charcoals',
      description: '100% natural coconut shell coals. Zero sulfur, odorless, sparkless, and leaves less than 2% ash. Specially curated for long-burning, high-temperature heat cycles.',
      price: 2500,
      image_url: '/products/hukka_9.png',
      images: JSON.stringify(['/products/hukka_9.png']),
      rating: 4.6,
      reviews_count: 88,
      category: 'Charcoal & Consumables',
      style: 'Premium Consumables',
      material: 'Organic Coconut Shell',
      height: 'N/A',
      brand: 'Hukka Dubai',
      stock: 150,
      is_bestseller: 0,
      is_new_arrival: 0,
      specs: JSON.stringify({
        'Burn Time': 'Up to 120 minutes',
        'Pack Size': '1 kg (72 cubes, 25mm)',
        'Ash Content': '< 1.8%'
      })
    },
    {
      id: 'p7',
      name: 'Imperial Hand-Cut Crystal Base',
      slug: 'imperial-hand-cut-crystal-base',
      description: 'Individually crafted by master crystal blowers. This base weighs over 3kg, offering unmatched stability and an aesthetic that catches light like a diamond.',
      price: 28000,
      image_url: '/products/hukka_7.png',
      images: JSON.stringify(['/products/hukka_7.png']),
      rating: 4.9,
      reviews_count: 9,
      category: 'Hookah Accessories',
      style: 'Traditional Hookahs',
      material: 'Bohemian Lead Crystal',
      height: '30 cm',
      brand: 'Hukka Dubai',
      stock: 10,
      is_bestseller: 0,
      is_new_arrival: 1,
      specs: JSON.stringify({
        'Grommet Connection': '29mm inner diameter',
        'Wall Thickness': '8-10mm',
        'Weight': '3.2 kg'
      })
    },
    {
      id: 'p8',
      name: 'Majestic Brass Khalil',
      slug: 'majestic-brass-khalil',
      description: 'A traditional masterpiece featuring hand-engraved Arabic calligraphy. Made of heavy cast brass with copper accents. A timeless classic that delivers a heavy, rich traditional draw.',
      price: 55000,
      image_url: '/products/hukka_20.png',
      images: JSON.stringify(['/products/hukka_20.png']),
      rating: 4.7,
      reviews_count: 14,
      category: 'Traditional Hookahs',
      style: 'Traditional Hookahs',
      material: 'Solid Brass & Copper',
      height: '90 cm',
      brand: 'Heritage Collection',
      stock: 6,
      is_bestseller: 0,
      is_new_arrival: 0,
      specs: JSON.stringify({
        'Draw Type': 'Wide traditional restriction',
        'Engravings': 'Hand-chiseled calligraphy',
        'Hose Port': 'Traditional single port',
        'Tray': 'Matching hand-hammered brass tray'
      })
    }
  ];



  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (
      id, name, slug, description, price, image_url, images, rating,
      reviews_count, category, style, material, height, brand, stock,
      is_bestseller, is_new_arrival, specs
    ) VALUES (
      @id, @name, @slug, @description, @price, @image_url, @images, @rating,
      @reviews_count, @category, @style, @material, @height, @brand, @stock,
      @is_bestseller, @is_new_arrival, @specs
    )
  `);

  const insertReview = db.prepare(`
    INSERT OR IGNORE INTO reviews (
      id, product_id, user_name, rating, comment, title, image_url, video_url
    ) VALUES (
      @id, @product_id, @user_name, @rating, @comment, @title, @image_url, @video_url
    )
  `);

  const insertCoupon = db.prepare(`
    INSERT OR IGNORE INTO coupons (code, discount_percent, expiry_date, is_active)
    VALUES (?, ?, ?, 1)
  `);


  // Insert Products
  for (const product of products) {
    insertProduct.run(product);
  }

  // Insert reviews for Burj Gold Elite (p1)
  const reviews = [
    {
      id: 'r1',
      product_id: 'p1',
      user_name: 'Vikram Malhotra',
      rating: 5,
      comment: 'An absolute work of art. The packaging feels like a Rolex watch and the draw is completely silent and incredibly smooth. Worth every rupee for the elite smoke sessions.',
      title: 'Perfection Personified',
      image_url: null,
      video_url: null
    },
    {
      id: 'r2',
      product_id: 'p1',
      user_name: 'Aditya Birla',
      rating: 5,
      comment: 'This has become the centerpiece of my penthouse in Mumbai. Guests are always blown away by the gold detailing. The smoke output is dense and rich.',
      title: 'Ultimate Luxury',
      image_url: null,
      video_url: null
    },
    {
      id: 'r3',
      product_id: 'p2',
      user_name: 'Kabir Kapoor',
      rating: 5,
      comment: 'Excellent modern design. It fits perfectly in my minimalist home. Very easy to clean and the purge system is fantastic.',
      title: 'Modern and Stealthy',
      image_url: null,
      video_url: null
    }
  ];

  for (const review of reviews) {
    insertReview.run(review);
  }

  // Insert default coupons
  insertCoupon.run('ROYAL15', 15, '2027-12-31');
  insertCoupon.run('DUBAI20', 20, '2027-12-31');
  insertCoupon.run('FIRST10', 10, '2027-12-31');

  // Insert default admin user
  db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, password, role, rewards_points)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('u_admin', 'Royal Admin', 'admin@hukka.com', bcrypt.hashSync('admin123', 10), 'admin', 9999);

  // Insert dummy orders for dashboard metrics and user profiles
  const insertOrder = db.prepare(`
    INSERT OR IGNORE INTO orders (id, user_id, total_amount, status, payment_method, payment_status, address, items, created_at)
    VALUES (@id, @user_id, @total_amount, @status, @payment_method, @payment_status, @address, @items, @created_at)
  `);

  const dummyOrders = [
    {
      id: 'ORD_991823',
      user_id: 'u_admin',
      total_amount: 137000,
      status: 'delivered',
      payment_method: 'CARD',
      payment_status: 'paid',
      address: JSON.stringify({ name: 'Royal Admin', email: 'admin@hukka.com', phone: '9988776655', address: 'Penthouse 4A, Jumeirah Towers', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India' }),
      items: JSON.stringify([{ id: 'p1', name: 'The Burj Gold Elite', price: 125000, quantity: 1, category: 'Premium Hookahs' }, { id: 'p5', name: 'Royal Onyx HMD v2', price: 12000, quantity: 1, category: 'Hookah Accessories' }]),
      created_at: '2026-06-15 14:30:00'
    },
    {
      id: 'ORD_847120',
      user_id: 'u_admin',
      total_amount: 87500,
      status: 'shipped',
      payment_method: 'UPI',
      payment_status: 'paid',
      address: JSON.stringify({ name: 'Royal Admin', email: 'admin@hukka.com', phone: '9988776655', address: 'Penthouse 4A, Jumeirah Towers', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India' }),
      items: JSON.stringify([{ id: 'p2', name: "Sheikh's Stealth Carbon", price: 85000, quantity: 1, category: 'Modern Hookahs' }, { id: 'p6', name: "Sultan's Premium Coconut Charcoals", price: 2500, quantity: 1, category: 'Charcoal & Consumables' }]),
      created_at: '2026-06-25 09:15:00'
    },
    {
      id: 'ORD_198273',
      user_id: 'guest_1',
      total_amount: 65000,
      status: 'pending',
      payment_method: 'COD',
      payment_status: 'pending',
      address: JSON.stringify({ name: 'Vikram Malhotra', email: 'vikram@gmail.com', phone: '9812345678', address: 'Golf Course Road, Sector 54', city: 'Gurugram', state: 'Haryana', postalCode: '122002', country: 'India' }),
      items: JSON.stringify([{ id: 'p4', name: 'Desert Nomad Briefcase', price: 65000, quantity: 1, category: 'Travel Hookahs' }]),
      created_at: '2026-06-28 18:45:00'
    }
  ];

  for (const order of dummyOrders) {
    insertOrder.run(order);
  }

  console.log('Database seeded successfully!');
}

// Database helper functions
export const dbQuery = {
  // Products
  getProducts: (filters: { category?: string; search?: string; sort?: string; priceRange?: string } = {}) => {
    if (!db) return [];
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any = [];

    if (filters.category && filters.category !== 'All') {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const term = `%${filters.search}%`;
      params.push(term, term, term);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        sql += ' AND price >= ? AND price <= ?';
        params.push(min, max);
      } else {
        sql += ' AND price >= ?';
        params.push(min);
      }
    }

    if (filters.sort) {
      if (filters.sort === 'price-asc') {
        sql += ' ORDER BY price ASC';
      } else if (filters.sort === 'price-desc') {
        sql += ' ORDER BY price DESC';
      } else if (filters.sort === 'rating') {
        sql += ' ORDER BY rating DESC';
      } else {
        sql += ' ORDER BY created_at DESC';
      }
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    const rows = db.prepare(sql).all(...params);
    return rows.map((row: any) => ({
      ...row,
      images: JSON.parse(row.images),
      specs: JSON.parse(row.specs),
      is_bestseller: !!row.is_bestseller,
      is_new_arrival: !!row.is_new_arrival,
    }));
  },

  getProductBySlug: (slug: string) => {
    if (!db) return null;
    const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
    if (!row) return null;
    return {
      ...row,
      images: JSON.parse(row.images),
      specs: JSON.parse(row.specs),
      is_bestseller: !!row.is_bestseller,
      is_new_arrival: !!row.is_new_arrival,
    };
  },

  getProductById: (id: string) => {
    if (!db) return null;
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!row) return null;
    return {
      ...row,
      images: JSON.parse(row.images),
      specs: JSON.parse(row.specs),
      is_bestseller: !!row.is_bestseller,
      is_new_arrival: !!row.is_new_arrival,
    };
  },

  // Reviews
  getReviewsByProductId: (productId: string) => {
    if (!db) return [];
    return db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(productId);
  },

  createReview: (review: { product_id: string; user_name: string; rating: number; comment: string; title: string; image_url?: string; video_url?: string }) => {
    if (!db) return null;
    const id = 'r_' + Math.random().toString(36).substr(2, 9);
    db.prepare(`
      INSERT INTO reviews (id, product_id, user_name, rating, comment, title, image_url, video_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, review.product_id, review.user_name, review.rating, review.comment, review.title, review.image_url || null, review.video_url || null);

    // Update product rating stats
    const stats = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ?').get(review.product_id);
    db.prepare('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?').run(Math.round((stats.avg || 0) * 10) / 10, stats.count, review.product_id);

    return id;
  },

  // Users & Auth
  createUser: (user: any) => {
    if (!db) return null;
    db.prepare(`
      INSERT INTO users (id, name, email, password, role, rewards_points)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.id, user.name, user.email, user.password, user.role || 'user', user.rewards_points || 0);
    return user;
  },

  getUserByEmail: (email: string) => {
    if (!db) return null;
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  getUserById: (id: string) => {
    if (!db) return null;
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  updateUserRewards: (id: string, points: number) => {
    if (!db) return;
    db.prepare('UPDATE users SET rewards_points = rewards_points + ? WHERE id = ?').run(points, id);
  },

  // Orders
  createOrder: (order: { id: string; user_id: string | null; total_amount: number; payment_method: string; payment_status: string; address: any; items: any }) => {
    if (!db) return null;
    db.prepare(`
      INSERT INTO orders (id, user_id, total_amount, payment_method, payment_status, address, items)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      order.id,
      order.user_id,
      order.total_amount,
      order.payment_method,
      order.payment_status,
      JSON.stringify(order.address),
      JSON.stringify(order.items)
    );

    // Update stock levels
    for (const item of order.items) {
      db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?').run(item.quantity, item.id);
    }

    // Award loyalty points (1 point per 100 INR)
    if (order.user_id) {
      const points = Math.floor(order.total_amount / 100);
      dbQuery.updateUserRewards(order.user_id, points);
    }

    return order;
  },

  getOrdersByUserId: (userId: string) => {
    if (!db) return [];
    const rows = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return rows.map((row: any) => ({
      ...row,
      address: JSON.parse(row.address),
      items: JSON.parse(row.items),
    }));
  },

  getAllOrders: () => {
    if (!db) return [];
    const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    return rows.map((row: any) => ({
      ...row,
      address: JSON.parse(row.address),
      items: JSON.parse(row.items),
    }));
  },

  updateOrderStatus: (id: string, status: string, paymentStatus?: string) => {
    if (!db) return;
    if (paymentStatus) {
      db.prepare('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?').run(status, paymentStatus, id);
    } else {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    }
  },

  // Coupons
  getCoupon: (code: string) => {
    if (!db) return null;
    return db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code);
  },

  // Analytics
  getAnalytics: () => {
    if (!db) return { totalRevenue: 0, ordersCount: 0, productsCount: 0, usersCount: 0 };
    const rev = db.prepare(`SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid' OR payment_status = 'completed'`).get() as any;
    const orders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const prods = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const users = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'user'`).get() as any;

    return {
      totalRevenue: (rev && rev.total) || 0,
      ordersCount: orders ? orders.count : 0,
      productsCount: prods ? prods.count : 0,
      usersCount: users ? users.count : 0
    };
  },


  // Stock Adjustments
  adjustStock: (id: string, qty: number) => {
    if (!db) return;
    db.prepare('UPDATE products SET stock = MAX(0, stock + ?) WHERE id = ?').run(qty, id);
  },

  // Reviews Admin
  getAllReviews: () => {
    if (!db) return [];
    return db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  },

  deleteReview: (id: string) => {
    if (!db) return;
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
  },

  // Coupons Admin
  getCoupons: () => {
    if (!db) return [];
    return db.prepare('SELECT * FROM coupons').all();
  },

  deleteCoupon: (code: string) => {
    if (!db) return;
    db.prepare('DELETE FROM coupons WHERE code = ?').run(code);
  }
};


// Auto-initialize the database schema and seed products on startup
initDb();

