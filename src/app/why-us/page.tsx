import React from 'react';
import WhyChooseUs from '@/components/WhyChooseUs';

export const dynamic = 'force-static';

export default function WhyUsPage() {
  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 relative pt-24 pb-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,120,34,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
      <WhyChooseUs />
    </div>
  );
}
