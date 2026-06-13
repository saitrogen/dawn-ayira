'use client';

import Link from 'next/link';
import { Heart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/cart-context';
import { fmtPrice } from '@/lib/data';
import Image from 'next/image';

export function ProductCard({ p }: { p: any }) {
  const s = useStore();
  const [adding, setAdding] = useState(false);
  const onSale = p.compareAt && p.compareAt > p.price;
  const isSoldOut = !p.available;
  const isNew = p.badges?.includes("new");
  const sizes = p.options?.Size || [];
  
  const isMinimal = s.theme.card === 'minimal';
  const isBarQA = s.theme.card === 'bar-qa';
  const isOutlineQA = s.theme.card === 'outline-qa';
  const showBadges = !isMinimal;
  const showSwatches = !isMinimal;
  const showQuickAdd = !isMinimal;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    setAdding(true);
    s.addToCart(p, 1);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <Link href={`/products/${p.handle}`} className="ay-prod block min-h-[300px] flex flex-col justify-between">
      <div className={`ay-prod-img ${isSoldOut ? 'unavail' : ''}`}>
        <Image src={p.image} alt={p.title} width={400} height={400} loading="lazy" referrerPolicy="no-referrer" />
        {showBadges && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
            {onSale && <span className="ay-badge sale">Save {Math.round((1 - p.price/p.compareAt) * 100)}%</span>}
            {isNew && <span className="ay-badge new">New</span>}
            {isSoldOut && <span className="ay-badge sold-out">Sold out</span>}
          </div>
        )}
        <button 
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white flex items-center justify-center text-ink-500 shadow-xs hover:text-danger z-10 transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={16} />
        </button>
      </div>
      <div className="flex-1 mt-3">
        <div className="text-[11px] text-ink-500 font-semibold tracking-wider uppercase">{p.type}</div>
        <div className="text-[14.5px] font-semibold text-ink-900 leading-snug mt-0.5">{p.title}</div>
      </div>
      {showSwatches && sizes.length > 0 && (
        <div className="flex gap-1.5 items-center flex-wrap my-3">
          {sizes.slice(0, 3).map((sz: string, i: number) => (
            <span key={i} className={`text-[11px] px-2 py-0.5 rounded-full border border-ink-200 font-semibold leading-none ${i === 0 ? 'bg-primary text-on-primary border-primary' : 'bg-white text-ink-700'}`}>{sz}</span>
          ))}
          {sizes.length > 3 && <span className="text-[11px] px-2 py-0.5 rounded-full border border-ink-200 bg-white text-ink-700 font-semibold leading-none">+{sizes.length - 3}</span>}
        </div>
      )}
      
      {showQuickAdd && isBarQA && (
         <button 
           onClick={handleAdd}
           disabled={isSoldOut}
           className={`mt-3 w-full py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-[13px] transition-colors ${isSoldOut ? 'bg-ink-100 text-ink-400 border border-ink-200 cursor-not-allowed' : adding ? 'bg-success text-white border border-success' : 'bg-primary text-on-primary border border-primary hover:bg-primary-hover'}`}
         >
           {adding ? <Check size={16} /> : <Plus size={16} />} 
           {adding ? 'Added' : isSoldOut ? 'Sold out' : 'Quick add'}
         </button>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto pt-2">
        <div className={`text-[17px] font-bold text-primary tracking-tight leading-none ${isSoldOut && isBarQA ? 'text-ink-400' : ''}`}>
          {fmtPrice(p.price)}{onSale && <span className="text-[13px] text-ink-400 line-through ml-2 font-medium">{fmtPrice(p.compareAt)}</span>}
        </div>
        
        {showQuickAdd && !isBarQA && (
          <button 
            onClick={handleAdd}
            disabled={isSoldOut}
            className={
              isOutlineQA 
                ? `px-3.5 py-2 rounded-[10px] flex-none inline-flex items-center justify-center gap-1 text-[13px] font-semibold transition-colors border-[1.5px] ${isSoldOut ? 'border-ink-200 text-ink-400 cursor-not-allowed bg-ink-50' : adding ? 'bg-success text-white border-success' : 'border-primary text-primary hover:bg-primary hover:text-white'}`
                : `w-9 h-9 rounded-[10px] flex-none inline-flex items-center justify-center transition-colors ${isSoldOut ? 'bg-ink-200 text-ink-400 cursor-not-allowed' : adding ? 'bg-success text-white' : 'bg-primary text-on-primary hover:bg-primary-hover'}`
            }
          >
            {isOutlineQA ? (isSoldOut ? 'Sold out' : adding ? 'Added' : 'Add') : (adding ? <Check size={16} /> : <Plus size={16} />)}
          </button>
        )}
      </div>
    </Link>
  );
}
