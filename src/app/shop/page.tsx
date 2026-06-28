import React, { Suspense } from 'react';
import { dbQuery } from '@/lib/db';
import ShopClient from './ShopClient';

export const revalidate = 0; // Dynamic data loading

export default async function ShopPage() {
  const products = dbQuery.getProducts();

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 relative pt-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,120,34,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
      <Suspense fallback={
        <div className="text-center py-20 text-zinc-500 font-serif tracking-widest animate-pulse">
          LOADING COLLECTION...
        </div>
      }>
        <ShopClient initialProducts={products} />
      </Suspense>
    </div>
  );
}

