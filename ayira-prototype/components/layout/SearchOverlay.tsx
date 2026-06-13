'use client';

import { useStore } from '@/lib/cart-context';
import { Search, X, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { SHOP, fmtPrice } from '@/lib/data';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function SearchOverlay() {
  const s = useStore();
  const [q, setQ] = useState("");
  const router = useRouter();
  
  if (!s.searchOpen) return null;

  const matches = q.trim().length >= 2
    ? SHOP.products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.type.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
    : SHOP.products.slice(0, 4);
    
  const collMatches = q.trim().length >= 2
    ? SHOP.collections.filter(c => c.title.toLowerCase().includes(q.toLowerCase())).slice(0, 3)
    : SHOP.collections.filter(c => c.featured).slice(0, 3);
    
  return (
    <div className="absolute top-[100%] left-0 right-0 bg-bg-app border-t border-ink-200 z-50 max-h-[480px] overflow-y-auto shadow-lg" onClick={e => e.stopPropagation()}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-5 text-left pb-4">
        <div className="relative w-full mb-2">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search products, collections…"
            className="w-full py-2.5 pl-10 pr-3 rounded-xl border-[1.5px] border-ink-200 bg-white text-sm focus:border-primary focus:ring-4 focus:ring-primary-soft outline-none transition-all"
            onKeyDown={e => { if (e.key === 'Enter') { s.setSearchOpen(false); router.push(`/search?q=${q}`); } }}
          />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 md:px-8 pb-8 text-left">
        {q.length < 2 && (
          <div className="py-2">
            <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-bold px-2 mb-1">Popular searches</div>
            {['pepsi 1.25L', 'cola', 'ice cream', 'kdd mango'].map(t => (
              <div key={t} className="p-2 rounded-lg cursor-pointer hover:bg-cream-100 flex gap-2 items-center text-sm text-ink-700" onClick={() => { s.setSearchOpen(false); router.push(`/search?q=${t}`); }}>
                <TrendingUp size={14} className="text-ink-400" /> {t}
              </div>
            ))}
          </div>
        )}

        <div className="py-2 border-t border-ink-200 mt-1 pt-3">
          <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-bold px-2 mb-1">Products{matches.length > 0 ? ` · ${matches.length}` : ''}</div>
          {matches.length === 0 && <div className="p-3 text-[13px] text-ink-500">No products match &quot;{q}&quot;</div>}
          {matches.map((p, i) => (
            <Link key={i} href={`/products/${p.handle}`} onClick={() => s.setSearchOpen(false)} className="grid grid-cols-[auto_1fr_auto] gap-3 p-2 rounded-lg cursor-pointer hover:bg-cream-100 items-center">
              <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center p-1">
                <Image src={p.image} alt={p.title} width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-ink-900 leading-[1.3]">{p.title}</div>
                <div className="text-[12px] text-ink-500">{p.type} · {p.options?.Size[0]}</div>
              </div>
              <div className="font-bold text-primary text-sm">{fmtPrice(p.price)}</div>
            </Link>
          ))}
        </div>

        {collMatches.length > 0 && (
          <div className="py-2 border-t border-ink-200 mt-1 pt-3">
            <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-bold px-2 mb-1">Collections</div>
            {collMatches.map((c, i) => (
              <Link key={i} href={`/collections/${c.handle}`} onClick={() => s.setSearchOpen(false)} className="grid grid-cols-[auto_1fr] gap-3 p-2 rounded-lg cursor-pointer hover:bg-cream-100 items-center">
                <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-ink-900 leading-[1.3]">{c.title}</div>
                  <div className="text-[12px] text-ink-500">{c.product_count} products</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="pt-3 pb-2 text-center">
          <button className="ay-btn ay-btn-ghost ay-btn-sm" onClick={() => { s.setSearchOpen(false); router.push(`/search?q=${q}`); }}>
            View all results
          </button>
        </div>
      </div>

      <div className="absolute top-3 right-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream-200 text-ink-700" onClick={() => s.setSearchOpen(false)}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
