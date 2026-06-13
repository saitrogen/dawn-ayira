'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function StaticPage() {
  const { handle } = useParams();
  const handleStr = Array.isArray(handle) ? handle[0] : handle || '';
  
  return (
    <main className="ay-page-fade flex-1 py-6 md:py-10 max-w-7xl mx-auto px-4 md:px-12 w-full">
      <div className="flex gap-1.5 items-center text-[13px] text-ink-500 py-4 mb-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-900 font-medium capitalize">{handleStr.replace(/-/g, ' ')}</span>
      </div>
      
      <div className="py-8 md:py-12">
        <h1 className="font-display text-[32px] md:text-[40px] font-bold text-primary tracking-[-0.018em] capitalize mb-6">
          {handleStr.replace(/-/g, ' ')}
        </h1>
        <div className="max-w-3xl">
          <p className="text-[17px] leading-relaxed mb-4 text-ink-700">
            This is a placeholder for the {handleStr.replace(/-/g, ' ')} page content.
          </p>
          <p className="text-[15px] leading-relaxed text-ink-500">
            Navigate back to the home page or browse the collections to explore the interactive storefront features.
          </p>
        </div>
      </div>
    </main>
  );
}
