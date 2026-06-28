import React from 'react';
import { dbQuery } from '@/lib/db';
import FeaturedCollections from '@/components/FeaturedCollections';
import ProductShowcase from '@/components/ProductShowcase';
import ReviewsSection from '@/components/ReviewsSection';
import InstagramGallery from '@/components/InstagramGallery';
import HeroSection from '@/components/HeroSection';


export const revalidate = 3600; // Cache page for an hour, ISR-ready

export default async function Home() {
  // Fetch products on the server side
  const products = dbQuery.getProducts();
  const flagshipProduct = dbQuery.getProductBySlug('the-burj-gold-elite') || products[0];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-zinc-950">
      {/* Background Ambience / Smoke simulation overlay */}
      <div className="absolute inset-0 smoke-overlay pointer-events-none z-0" />
      <div className="smoke-cloud absolute top-[-10%] left-[-20%] opacity-20" />
      <div className="smoke-cloud absolute bottom-[-15%] right-[-10%] opacity-35" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <HeroSection />

      {/* ========================================================================= */}
      {/* 2. FEATURED COLLECTIONS SECTION */}
      {/* ========================================================================= */}
      <FeaturedCollections />

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE PRODUCT SHOWCASE SECTION */}
      {/* ========================================================================= */}
      <ProductShowcase product={flagshipProduct} />

      {/* ========================================================================= */}
      {/* 4. CUSTOMER REVIEWS SECTION */}
      {/* ========================================================================= */}
      <ReviewsSection />

      {/* ========================================================================= */}
      {/* 5. INSTAGRAM GALLERY SECTION */}
      {/* ========================================================================= */}
      <InstagramGallery />

    </div>
  );
}
