import React from 'react';
import { notFound } from 'next/navigation';
import { dbQuery } from '@/lib/db';
import ProductDetailsClient from './ProductDetailsClient';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const products = dbQuery.getProducts();
  return products.map((p: any) => ({
    slug: p.slug
  }));
}


interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = dbQuery.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = dbQuery.getReviewsByProductId(product.id);
  const allProducts = dbQuery.getProducts();
  
  // Recommend items from the same category or different ones (cross-sell accessories/coals)
  const recommendations = allProducts
    .filter((p: any) => p.id !== product.id)
    .slice(0, 3);


  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 relative pt-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,120,34,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
      <ProductDetailsClient
        product={product}
        initialReviews={reviews}
        recommendations={recommendations}
      />
    </div>
  );
}
