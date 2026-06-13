'use client';

import { useSearchParams } from 'next/navigation';
import { SHOP } from '@/lib/data';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchX, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const matches = SHOP.products.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    p.type.toLowerCase().includes(q.toLowerCase()) ||
    (p.collection || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="ay-page-fade flex-1 py-6 md:py-10 max-w-7xl mx-auto px-4 md:px-12 w-full">
      <div className="py-6 pb-4">
        <h1 className="font-display text-[32px] font-bold text-primary tracking-[-0.018em]">Search results</h1>
        <p className="text-sm text-ink-500 mt-1.5">{matches.length} products for &quot;<strong className="text-ink-900">{q}</strong>&quot;</p>
      </div>
      
      <div className="flex gap-1 border-b border-ink-200 mt-4 mb-6">
        <div className="px-4 py-3 text-sm font-semibold text-primary relative">
          Products <span className="font-medium text-ink-400 ml-1">{matches.length}</span>
          <div className="absolute left-3 right-3 -bottom-px h-[2px] bg-primary rounded-t-full"></div>
        </div>
        <div className="px-4 py-3 text-sm font-semibold text-ink-500 cursor-not-allowed">
          Collections <span className="font-medium text-ink-400 ml-1">0</span>
        </div>
        <div className="px-4 py-3 text-sm font-semibold text-ink-500 cursor-not-allowed">
          Pages <span className="font-medium text-ink-400 ml-1">0</span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 px-6 flex flex-col items-center gap-3">
          <span className="w-16 h-16 rounded-full bg-cream-100 text-primary flex items-center justify-center">
             <SearchX size={28} />
          </span>
          <h3 className="font-display text-[22px] font-bold text-primary tracking-[-0.012em]">No matches for &quot;{q}&quot;</h3>
          <p className="text-sm text-ink-500 max-w-[280px]">Try a different search term, or browse one of our collections below.</p>
          <Link href="/" className="ay-btn ay-btn-primary mt-2">Back to home</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {matches.map((p, i) => (
              <ProductCard key={i} p={p} />
            ))}
          </div>
          <div className="flex justify-center items-center gap-1 pt-8 pb-4">
            <button className="w-9 h-9 rounded-[10px] inline-flex items-center justify-center text-[13.5px] text-ink-700 font-medium hover:bg-cream-200"><ChevronLeft size={14} /></button>
            <button className="w-9 h-9 rounded-[10px] inline-flex items-center justify-center text-[13.5px] font-bold bg-primary text-on-primary">1</button>
            <button className="w-9 h-9 rounded-[10px] inline-flex items-center justify-center text-[13.5px] text-ink-700 font-medium hover:bg-cream-200 hidden">2</button>
            <button className="w-9 h-9 rounded-[10px] inline-flex items-center justify-center text-[13.5px] text-ink-700 font-medium hover:bg-cream-200"><ChevronRight size={14} /></button>
          </div>
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-ink-500">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
