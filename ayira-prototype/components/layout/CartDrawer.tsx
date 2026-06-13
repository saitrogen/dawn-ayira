'use client';

import { useStore } from '@/lib/cart-context';
import { X, Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fmtPrice } from '@/lib/data';

export function CartDrawer() {
  const s = useStore();
  const remaining = Math.max(0, s.threshold - s.subtotal);
  const pct = Math.min(100, (s.subtotal / s.threshold) * 100);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#062E29]/40 z-50 transition-opacity duration-200 ease-out ${s.cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => s.setCartOpen(false)}
      />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-cream-100 shadow-xl border-l border-ink-200 z-50 transform transition-transform duration-300 ease-out flex flex-col ${s.cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center px-5 py-5 border-b border-ink-200 bg-cream-50">
          <h3 className="font-display text-xl font-bold text-primary tracking-tight">Your cart {s.itemCount > 0 ? `· ${s.itemCount} item${s.itemCount === 1 ? '' : 's'}` : ''}</h3>
          <button className="w-9 h-9 rounded-lg text-ink-700 flex items-center justify-center hover:bg-cream-200 transition-colors" onClick={() => s.setCartOpen(false)}>
            <X size={18} />
          </button>
        </div>
        
        {s.cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3.5">
            <span className="w-16 h-16 rounded-full bg-cream-200 text-primary flex items-center justify-center">
              <ShoppingBag size={28} />
            </span>
            <h3 className="font-display text-[22px] font-bold text-primary tracking-tight">Your cart is empty</h3>
            <p className="text-sm text-ink-500 max-w-[280px]">Add some pantry essentials and we&apos;ll bring them over the same day.</p>
            <button className="ay-btn ay-btn-primary mt-2" onClick={() => { s.setCartOpen(false); }}>Browse fresh picks</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              <div className={`bg-cream-50 border border-cream-200 rounded-xl p-3.5 mb-1`}>
                <div className={`flex items-center gap-2 text-[13.5px] mb-2.5 ${s.freeShipping ? 'text-primary font-semibold' : 'text-ink-700'}`}>
                  <span className={s.freeShipping ? 'text-success' : 'text-primary'}><Truck size={16} /></span>
                  {s.freeShipping ? (
                    <span>You unlocked <strong>free delivery</strong> across Al Khor.</span>
                  ) : (
                    <span>Add <strong>{fmtPrice(remaining)}</strong> more for free delivery</span>
                  )}
                </div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ease-out" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
              {s.cart.map((l, i) => (
                <div key={i} className="grid grid-cols-[64px_1fr_auto] gap-3 p-3 bg-white border border-ink-200 rounded-[12px]">
                  <Link href={`/products/${l.p.handle}`} onClick={() => s.setCartOpen(false)} className="aspect-square rounded-lg bg-cream-100 flex items-center justify-center p-1.5 cursor-pointer">
                    <Image src={l.p.image} alt={l.p.title} width={64} height={64} className="w-full h-full object-contain" />
                  </Link>
                  <div>
                    <div className="text-[13.5px] font-semibold text-ink-900 leading-snug">{l.p.title}</div>
                    <div className="text-xs text-ink-500 mt-0.5 mb-2">Size: {l.size}</div>
                    <div className="inline-flex items-center border-[1.5px] border-ink-200 rounded-lg bg-white overflow-hidden h-7">
                      <button className="w-7 h-full flex justify-center items-center text-primary hover:bg-cream-100" onClick={() => s.updateQty(i, -1)}><Minus size={12} /></button>
                      <span className="w-7 text-center font-bold text-ink-900 text-xs leading-7 block">{l.qty}</span>
                      <button className="w-7 h-full flex justify-center items-center text-primary hover:bg-cream-100" onClick={() => s.updateQty(i, 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <div className="text-[14.5px] font-bold text-primary">{fmtPrice(l.p.price * l.qty)}</div>
                    <button className="text-ink-500 p-1 rounded-md hover:text-danger hover:bg-cream-100" onClick={() => s.removeLine(i)} aria-label="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 pb-6 border-t border-ink-200 bg-cream-100 flex flex-col gap-2.5">
              <div className="flex justify-between text-[13.5px] text-ink-700">
                <span className="text-ink-500">Subtotal</span><span>{fmtPrice(s.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13.5px] text-ink-700">
                <span className="text-ink-500">Delivery</span><span>{s.delivery === 0 ? <span className="text-success font-semibold">Free</span> : fmtPrice(s.delivery)}</span>
              </div>
              <div className="flex justify-between text-[17px] font-bold text-primary pt-2 border-t border-ink-200">
                <span>Total</span><span>{fmtPrice(s.total)}</span>
              </div>
              <div className="text-[11.5px] text-ink-500 -mt-1 mb-1">Taxes included where applicable.</div>
              <Link href="/cart" onClick={() => s.setCartOpen(false)} className="ay-btn ay-btn-primary w-full text-center">Checkout · {fmtPrice(s.total)}</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
