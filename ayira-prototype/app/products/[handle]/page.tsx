'use client';

import { useStore } from '@/lib/cart-context';
import { SHOP, fmtPrice } from '@/lib/data';
import { Truck, PackageCheck, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';

export default function ProductPage() {
  const { handle } = useParams();
  const handleString = Array.isArray(handle) ? handle[0] : handle || '';
  const s = useStore();
  
  const p = SHOP.products.find(x => x.handle === handleString) || SHOP.products[0];
  const collection = SHOP.collections.find(x => x.handle === p.collection);
  const related = SHOP.products.filter(x => x.collection === p.collection && x.handle !== p.handle).slice(0, 4);
  const thumbs = [p, ...related].slice(0, 4);
  
  const [thumbIdx, setThumbIdx] = useState(0);
  const active = thumbs[thumbIdx] || p;
  
  const sizes = p.options?.Size || ["Default"];
  const [size, setSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);
  const onSale = p.compareAt && p.compareAt > p.price;

  return (
    <main className="ay-page-fade flex-1 py-4 md:py-8 max-w-7xl mx-auto px-4 md:px-12 w-full">
      <div className="flex gap-1.5 items-center text-[13px] text-ink-500 py-4 mb-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="text-ink-300">/</span>
        <Link href={`/collections/${p.collection}`} className="hover:text-primary">{collection?.title || p.type}</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-900 font-medium">{p.title}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-6 md:gap-12 relative pb-8 md:pb-14">
        <div className="flex flex-col gap-3">
          <div className="aspect-square rounded-2xl bg-white border border-ink-200 flex items-center justify-center relative overflow-hidden p-[12.5%]">
            {onSale && (
              <div className="absolute top-4 left-4 z-10">
                <span className="ay-badge sale">Save {Math.round((1 - p.price/p.compareAt) * 100)}%</span>
              </div>
            )}
            <Image src={active.image} alt={p.title} width={800} height={800} className="w-full h-full object-contain" />
          </div>
          <div className="hidden md:grid grid-cols-4 gap-3">
            {thumbs.map((t, i) => (
              <div key={i} className={`aspect-square rounded-xl bg-white border-2 cursor-pointer flex items-center justify-center overflow-hidden p-2 transition-all ${i === thumbIdx ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-80'}`} onClick={() => setThumbIdx(i)}>
                 <Image src={t.image} alt={t.title} width={200} height={200} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="text-[13px] font-semibold text-ink-500">{p.sourcing || 'Ayira Mini Mart'} · {p.type}</div>
          <h1 className="font-display text-[28px] md:text-[38px] font-bold text-primary tracking-[-0.022em] leading-[1.1]">{p.title}</h1>
          <div className="flex items-center gap-2 text-[13px] text-ink-500">
            <span className="text-accent">★ ★ ★ ★ ★</span>
            <span>4.8 (124 reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <div className="text-[32px] font-bold text-primary tracking-[-0.018em] leading-none">
              {fmtPrice(p.price)}{onSale && <span className="text-[18px] text-ink-400 line-through ml-2.5 font-medium">{fmtPrice(p.compareAt)}</span>}
            </div>
            <div className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${p.available ? 'text-success' : 'text-ink-500'}`}>
              <span className={`w-2 h-2 rounded-full ${p.available ? 'bg-success' : 'bg-ink-400'}`}></span>
              {p.available ? 'In stock · Ready to ship' : 'Out of stock — restocking soon'}
            </div>
          </div>
          <p className="text-[14.5px] text-ink-700 leading-[1.6]">
            {productCopy(p)}
          </p>
          
          <div className="py-2">
            <div className="text-[13px] font-semibold text-ink-900 mb-2.5 flex gap-1.5">Size <span className="text-ink-500 font-medium">· {size}</span></div>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((sz: string, i: number) => (
                <button key={i} className={`px-4 py-2 rounded-[10px] border-[1.5px] text-sm font-semibold cursor-pointer transition-all ${sz === size ? 'bg-primary-soft border-primary text-primary' : 'bg-white border-ink-200 text-ink-700 hover:border-primary'}`} onClick={() => setSize(sz)}>{sz}</button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2.5 items-stretch py-3">
             <div className="inline-flex items-center border-[1.5px] border-ink-200 rounded-xl bg-white overflow-hidden h-12">
               <button className="w-11 h-full flex justify-center items-center text-primary text-lg hover:bg-cream-100" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
               <span className="w-9 text-center font-bold text-ink-900 text-[15px] leading-[48px] block">{qty}</span>
               <button className="w-11 h-full flex justify-center items-center text-primary text-lg hover:bg-cream-100" onClick={() => setQty(q => q + 1)}><Plus size={16} /></button>
             </div>
             <button className="ay-btn ay-btn-primary ay-btn-lg flex-1" disabled={!p.available} onClick={() => s.addToCart(p, qty, size)}>
               <ShoppingBag size={18} /> Add to cart · {fmtPrice(p.price * qty)}
             </button>
          </div>
          <button className="ay-btn ay-btn-accent ay-btn-lg w-full" disabled={!p.available} onClick={() => s.addToCart(p, qty, size)}>Buy it now</button>
          
          <div className="grid grid-cols-2 gap-3 py-3">
            <div className="bg-cream-50 rounded-xl p-3 flex gap-2.5 items-start">
              <span className="text-primary flex-none mt-0.5"><Truck size={20} /></span>
              <div><div className="text-[13px] font-bold text-ink-900 leading-snug">Same-day delivery</div><div className="text-xs text-ink-500 leading-snug mt-0.5">Order before 4pm in Al Khor</div></div>
            </div>
            <div className="bg-cream-50 rounded-xl p-3 flex gap-2.5 items-start">
              <span className="text-primary flex-none mt-0.5"><PackageCheck size={20} /></span>
              <div><div className="text-[13px] font-bold text-ink-900 leading-snug">Easy returns</div><div className="text-xs text-ink-500 leading-snug mt-0.5">Within 48 hours of delivery</div></div>
            </div>
          </div>
          
          <div className="border-t border-ink-200 mt-2">
            <details className="border-b border-ink-200 group" open>
              <summary className="py-4 text-[15px] font-semibold text-ink-900 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                Description <span className="text-primary text-[22px] leading-none font-normal inline-block group-open:hidden">+</span><span className="text-primary text-[22px] leading-none font-normal hidden group-open:inline-block">–</span>
              </summary>
              <p className="pb-4 text-sm text-ink-700 leading-[1.6]">
                {productCopy(p)}
              </p>
            </details>
            <details className="border-b border-ink-200 group">
              <summary className="py-4 text-[15px] font-semibold text-ink-900 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                Shipping & returns <span className="text-primary text-[22px] leading-none font-normal inline-block group-open:hidden">+</span><span className="text-primary text-[22px] leading-none font-normal hidden group-open:inline-block">–</span>
              </summary>
              <p className="pb-4 text-sm text-ink-700 leading-[1.6]">
                Same-day delivery in Al Khor for orders placed before 4pm. Returns accepted within 48 hours for sealed, undamaged items. Frozen and chilled items are not returnable once opened.
              </p>
            </details>
          </div>
        </div>
      </div>
      
      {related.length > 0 && (
        <section className="py-5 md:py-10">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <div className="text-[11px] tracking-[0.1em] uppercase font-bold text-primary/70 mb-2">You might also like</div>
              <h2 className="font-display text-2xl md:text-[32px] font-bold tracking-[-0.018em] text-primary leading-[1.1]">More from {collection?.title || p.type}</h2>
            </div>
          </div>
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6`}>
            {related.map((rp, i) => (
              <ProductCard key={i} p={rp} />
            ))}
          </div>
        </section>
      )}
      
      {/* Mobile Sticky ATC */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ink-200 p-3 flex gap-2.5 items-center shadow-[0_-4px_16px_-8px_rgba(13,79,71,0.18)] z-30">
         <div className="flex-none">
           <div className="font-bold text-base text-primary">{fmtPrice(p.price * qty)}</div>
           <div className="text-[11px] text-ink-500">{size} · qty {qty}</div>
         </div>
         <button className="ay-btn ay-btn-primary flex-1" disabled={!p.available} onClick={() => s.addToCart(p, qty, size)}>Add to cart</button>
      </div>
    </main>
  );
}

function productCopy(p: any) {
  const copies: Record<string, string> = {
    "soft-drinks": "Classic carbonated refreshment, ice-cold ready. Sold per bottle — choose your size below. Stock up by the case for parties and gatherings.",
    "juice": "Real fruit juice, lightly chilled. A grab-and-go drink that's right at home in a school lunch or office fridge.",
    "ice-cream-1": "Indulgent frozen dessert, kept at -18°C from store to your door. Best eaten within 10 minutes of arrival — or popped straight in the freezer.",
    "chocolates-1": "Smooth, milk-chocolate treat for everyday cravings or last-minute gifts. Pairs well with a hot coffee.",
    "gums": "Long-lasting flavor for after meals or busy mornings. Sugar-free options available.",
    "candy": "Sweet, bright and snackable — perfect for kids' party bags and pick-and-mix moments.",
    "noodles": "Quick-cook noodles for those nights when dinner needs to be ready in 5 minutes.",
    "water": "Pure, lightly mineralized water bottled in Qatar. Carry a few for the gym, keep a case at home.",
    "dairy": "Fresh, refrigerated daily. Trusted dairy essentials for breakfast, baking and everything in between.",
  };
  return copies[p.collection] || "Hand-picked from our shelves for quality and freshness. Sold individually.";
}
