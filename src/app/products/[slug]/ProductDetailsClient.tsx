'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingBag, CreditCard, Star, Plus, Minus, ArrowRight, ShieldCheck, ChevronRight, MessageSquare, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductDetailsClientProps {
  product: any;
  initialReviews: any[];
  recommendations: any[];
}

export default function ProductDetailsClient({
  product,
  initialReviews,
  recommendations,
}: ProductDetailsClientProps) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviews, setReviews] = useState(initialReviews);
  const [isRotating, setIsRotating] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput || !commentInput) {
      setReviewError('Please complete all required fields.');
      return;
    }

    setReviewError('');
    setReviewSuccess('');
    setIsSubmittingReview(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: ratingInput,
          comment: commentInput,
          title: titleInput,
          customName: nameInput || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccess('Thank you! Your review has been added.');
        // Add to local state for instant feedback
        setReviews((prev) => [
          {
            id: data.reviewId,
            product_id: product.id,
            user_name: nameInput || 'Guest User',
            rating: ratingInput,
            comment: commentInput,
            title: titleInput,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setTitleInput('');
        setCommentInput('');
        setNameInput('');
        setShowReviewForm(false);
      } else {
        setReviewError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewError('Connection error.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const toggleRotate = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest mb-10">
        <Link href="/" className="hover:text-gold-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-gold-400">Collection</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-gold-400">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-300 truncate max-w-[150px]">{product.name}</span>
      </nav>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
        
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full h-[400px] md:h-[500px] bg-zinc-950 border border-zinc-900 rounded-sm flex items-center justify-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute w-64 h-64 rounded-full bg-gold-500/5 filter blur-2xl pointer-events-none" />
            
            {/* Main Visual representation of product */}
            {product.images && product.images.length > 0 ? (
              <motion.img
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ duration: 3, ease: 'easeInOut' }}
                src={product.images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-contain p-6 transition-all duration-300"
              />
            ) : (
              <motion.div
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ duration: 3, ease: 'easeInOut' }}
                className="relative text-center select-none"
              >
                <span className="font-serif text-3xl md:text-4xl text-gold-200 block mb-2 italic">
                  {product.name}
                </span>
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 block">
                  {product.material}
                </span>
              </motion.div>
            )}

            {/* Floating 360 viewer trigger */}
            <button
              onClick={toggleRotate}
              className="absolute bottom-4 right-4 px-4 py-2 bg-zinc-900/80 hover:bg-gold-500 hover:text-black border border-zinc-800 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5"
            >
              {isRotating ? 'Rotating 360°...' : '360° Experience'}
            </button>
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-4">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-20 h-20 bg-zinc-950 border overflow-hidden rounded-sm flex items-center justify-center transition-all ${
                  activeImageIdx === idx ? 'border-gold-500 bg-gold-500/5' : 'border-zinc-900 hover:border-zinc-800'
                }`}
              >
                <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Product Purchase Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold-500 font-semibold block mb-2">
              {product.brand}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-zinc-100 uppercase tracking-wide">
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-2 text-gold-400 text-xs mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-currentColor' : 'text-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <span className="text-zinc-400 font-medium">
                {product.rating} / 5 ({reviews.length} Verified Reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-zinc-900">
            <span className="text-2xl font-bold text-gold-300">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mt-1">
              Includes GST. Free air delivery on order value above ₹50,000.
            </span>
          </div>

          {/* Short description */}
          <p className="text-zinc-400 text-xs leading-relaxed font-light">
            {product.description}
          </p>

          {/* Specifications mini grid */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-sm grid grid-cols-2 gap-4 text-xs">
            {Object.entries(product.specs).map(([key, val]: any) => (
              <div key={key}>
                <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">{key}</span>
                <span className="text-zinc-300 font-medium">{val}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              {/* Quantity selector */}
              <div className="flex items-center border border-zinc-800 bg-zinc-900/30 rounded-sm overflow-hidden h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:text-gold-400 text-zinc-400 text-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm text-zinc-200 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:text-gold-400 text-zinc-400 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 text-gold-400 hover:text-gold-300 border border-zinc-800 hover:border-gold-500 font-bold uppercase tracking-widest text-xs rounded-sm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
            </div>

            {/* Buy Now & Wishlist */}
            <div className="flex gap-3">
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 h-12 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" /> Buy It Now
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 border border-zinc-800 rounded-sm flex items-center justify-center transition-all hover:bg-zinc-900 ${
                  isWishlisted ? 'text-red-500 border-red-500/20 bg-red-950/10' : 'text-zinc-400 hover:text-gold-400'
                }`}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Brand trust stamp */}
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-900/10 p-3 border border-zinc-900/50 rounded-sm">
            <ShieldCheck className="w-5 h-5 text-gold-500" />
            <span>Guaranteed Secure checkout &bull; 100% Genuine product seals</span>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETE YOUR SETUP (Upsell Recommendations) */}
      {/* ========================================================================= */}
      <section className="mb-20">
        <h3 className="font-serif text-xl text-gold-300 uppercase tracking-wider mb-6 pb-2 border-b border-zinc-900">
          COMPLETE YOUR SETUP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-zinc-900/20 border border-zinc-800/80 rounded-sm flex gap-4 items-center hover:border-gold-500/20 transition-all group"
            >
              <div className="w-16 h-16 bg-zinc-950 border border-zinc-900 overflow-hidden flex items-center justify-center rounded-sm flex-shrink-0">
                {rec.image_url ? (
                  <img src={rec.image_url} alt={rec.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-zinc-500 font-serif">{rec.name.split(' ')[0]}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-sm text-zinc-200 truncate group-hover:text-gold-300 transition-colors">
                  {rec.name}
                </h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{rec.category}</p>
                <p className="text-xs font-semibold text-gold-400 mt-1">₹{rec.price.toLocaleString('en-IN')}</p>
              </div>
              <Link
                href={`/products/${rec.slug}`}
                className="w-8 h-8 rounded-full border border-zinc-800 hover:border-gold-500 hover:bg-gold-500 hover:text-black flex items-center justify-center transition-all flex-shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* REVIEWS & VERIFICATION WRAPPER */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <h3 className="font-serif text-xl text-gold-300 uppercase tracking-wider">
            COLLECTORS OPINIONS ({reviews.length})
          </h3>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Share Opinion
          </button>
        </div>

        {/* Review Form Drawer/Accoridon */}
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm max-w-xl"
          >
            <h4 className="font-serif text-sm text-zinc-200 uppercase tracking-wider mb-4">
              Write Your Review
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Guest User"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-2 text-white focus:outline-none focus:border-gold-500 uppercase tracking-widest"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Review Rating</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-2 text-zinc-300 focus:outline-none focus:border-gold-500 uppercase tracking-widest"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Poor)</option>
                    <option value={1}>1 Star (Unacceptable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Review Title</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your experience..."
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Comment</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details of the smoke quality, materials, and draw..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              {reviewError && <p className="text-red-400 text-[10px]">{reviewError}</p>}

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest rounded-sm transition-all disabled:opacity-50"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        )}

        {reviewSuccess && (
          <p className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm text-xs">
            {reviewSuccess}
          </p>
        )}

        {/* Reviews list */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-zinc-500 text-xs italic">No reviews have been written for this product yet.</p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-zinc-900/10 border border-zinc-900/60 rounded-sm flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-serif text-xs text-gold-400 flex-shrink-0">
                  {rev.user_name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-serif text-sm text-zinc-200">{rev.user_name}</h5>
                    <div className="flex text-gold-400 gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-currentColor" />
                      ))}
                    </div>
                  </div>
                  <h6 className="text-xs font-semibold text-gold-200">&ldquo;{rev.title}&rdquo;</h6>
                  <p className="text-zinc-500 text-xs leading-relaxed italic">{rev.comment}</p>
                  <span className="text-[10px] text-zinc-600 block">
                    Posted on {new Date(rev.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
