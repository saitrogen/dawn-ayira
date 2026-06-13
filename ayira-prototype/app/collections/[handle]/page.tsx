'use client';

import { useParams } from 'next/navigation';
import { SHOP } from '@/lib/data';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export default function CollectionPage() {
  const { handle } = useParams();
  const handleString = Array.isArray(handle) ? handle[0] : handle || 'all';
  
  const [showFilters, setShowFilters] = useState(false);
  
  const collection = SHOP.collections.find(c => c.handle === handleString) || { title: 'All products', handle: 'all', description: 'Everything we stock — beverages, snacks, frozen and essentials.', product_count: SHOP.products.length };
  const products = handleString === 'all' ? SHOP.products : SHOP.products.filter(p => p.collection === handleString);

  return (
    <main className="ay-page-fade flex-1 py-4 md:py-8 max-w-7xl mx-auto px-4 md:px-12 w-full">
      <div className="flex gap-1.5 items-center text-[13px] text-ink-500 py-4 mb-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="text-ink-300">/</span>
        <Link href="/collections/all" className="hover:text-primary">Shop</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-900 font-medium">{collection.title}</span>
      </div>
      <div>
        <h1 className="font-display text-[38px] font-bold text-primary tracking-[-0.022em] mb-1.5">{collection.title}</h1>
        <p className="text-[15px] text-ink-500 max-w-[540px]">{collection.description}</p>
      </div>
      <div className="flex items-center justify-between border-y border-ink-200 py-3.5 my-6">
        <div className="text-sm text-ink-500">{products.length} products</div>
        <div className="flex items-center gap-3">
          <button className="md:hidden ay-btn ay-btn-secondary ay-btn-sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={14} /> Filter
          </button>
          <span className="text-[13px] text-ink-500 hidden md:inline">Sort by</span>
          <select className="font-inherit text-sm py-2 pl-3 pr-8 rounded-[10px] border-[1.5px] border-ink-200 bg-white text-ink-900 cursor-pointer outline-none appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width=%2212%22%20height=%228%22%20viewBox=%220%200%2012%208%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M1%201.5L6%206.5L11%201.5%22%20stroke=%22%23344054%22%20stroke-width=%221.5%22%20fill=%22none%22%20stroke-linecap=%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]">
            <option>Featured</option>
            <option>Price: Low to high</option>
            <option>Price: High to low</option>
            <option>Best selling</option>
            <option>A–Z</option>
            <option>Newest</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block flex flex-col gap-6`}>
          {/* Active filters */}
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="text-[12.5px] py-1 px-2.5 rounded-full bg-primary-soft text-primary font-semibold inline-flex items-center gap-1.5">
              {collection.title} <span className="opacity-60 hover:opacity-100 cursor-pointer"><X size={12} /></span>
            </span>
            <button className="text-[12.5px] text-ink-500 py-1 px-2 font-medium hover:text-danger">Clear all</button>
          </div>
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[13px] font-bold text-ink-900 tracking-[0.04em] uppercase mb-1">Availability</h5>
            <label className="flex items-center gap-2.5 py-1.5 text-[13.5px] text-ink-700 cursor-pointer group">
              <input type="checkbox" defaultChecked className="appearance-none w-[18px] h-[18px] border-[1.5px] border-ink-300 rounded-[5px] checked:bg-primary checked:border-primary flex-none cursor-pointer grid place-items-center relative before:content-[''] before:w-1.5 before:h-2.5 before:border-r-2 before:border-b-2 before:border-white before:rotate-45 before:-translate-y-px before:hidden checked:before:block" /> 
              In stock <span className="ml-auto text-[13px] text-ink-400 group-hover:text-ink-600">{products.filter(p => p.available).length}</span>
            </label>
            <label className="flex items-center gap-2.5 py-1.5 text-[13.5px] text-ink-700 cursor-pointer group">
              <input type="checkbox" className="appearance-none w-[18px] h-[18px] border-[1.5px] border-ink-300 rounded-[5px] checked:bg-primary checked:border-primary flex-none cursor-pointer grid place-items-center relative before:content-[''] before:w-1.5 before:h-2.5 before:border-r-2 before:border-b-2 before:border-white before:rotate-45 before:-translate-y-px before:hidden checked:before:block" /> 
              Out of stock <span className="ml-auto text-[13px] text-ink-400 group-hover:text-ink-600">{products.filter(p => !p.available).length}</span>
            </label>
          </div>
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[13px] font-bold text-ink-900 tracking-[0.04em] uppercase mb-1">Price (QAR)</h5>
            <div className="flex items-center gap-2">
              <input placeholder="From" defaultValue="1" className="w-full py-2 px-2.5 border-[1.5px] border-ink-200 rounded-lg text-[13px] outline-none focus:border-primary" />
              <span className="text-ink-400">→</span>
              <input placeholder="To" defaultValue="10" className="w-full py-2 px-2.5 border-[1.5px] border-ink-200 rounded-lg text-[13px] outline-none focus:border-primary" />
            </div>
            <button className="ay-btn ay-btn-secondary ay-btn-sm self-start mt-1">Apply</button>
          </div>
        </aside>
        
        <div>
          {products.length === 0 ? (
            <div className="text-center py-12 px-6 flex flex-col items-center gap-3">
              <span className="w-16 h-16 rounded-full bg-cream-100 text-primary flex items-center justify-center">
                <X size={28} />
              </span>
              <h3 className="font-display text-[22px] font-bold text-primary tracking-[-0.012em]">No products in this collection yet</h3>
              <p className="text-sm text-ink-500 max-w-[280px]">Try browsing one of our featured aisles.</p>
              <Link href="/collections/soft-drinks" className="ay-btn ay-btn-primary mt-2">Shop soft drinks</Link>
            </div>
          ) : (
            <div className={`grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5`}>
              {products.map((p, i) => (
                <ProductCard key={i} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
