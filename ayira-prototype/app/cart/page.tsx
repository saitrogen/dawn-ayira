'use client';

import { useStore } from '@/lib/cart-context';
import { fmtPrice } from '@/lib/data';
import { Minus, Plus, ShoppingBag, Truck, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const s = useStore();
  const remaining = Math.max(0, s.threshold - s.subtotal);
  const pct = Math.min(100, (s.subtotal / s.threshold) * 100);

  if (s.cart.length === 0) {
    return (
      <main className="ay-page-fade flex-1 py-16 md:py-24 max-w-3xl mx-auto px-4 w-full">
        <div className="flex flex-col items-center justify-center p-6 text-center gap-3.5">
          <span className="w-16 h-16 rounded-full bg-cream-100 text-primary flex items-center justify-center">
            <ShoppingBag size={32} />
          </span>
          <h3 className="font-display text-[28px] font-bold text-primary tracking-tight">Your cart is empty</h3>
          <p className="text-base text-ink-500 max-w-[320px]">Looks like you haven&apos;t added anything yet. Browse our featured collections to get started.</p>
          <Link href="/" className="ay-btn ay-btn-primary mt-4">Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ay-page-fade flex-1 py-6 md:py-12 max-w-7xl mx-auto px-4 md:px-12 w-full">
      <div className="flex gap-1.5 items-center text-[13px] text-ink-500 py-4 mb-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-900 font-medium">Your cart</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-14">
        <div>
          <h1 className="font-display text-[38px] font-bold text-primary tracking-[-0.022em] mb-6">Your cart</h1>
          
          <div className={`bg-cream-100 border border-cream-200 rounded-[14px] p-4 mb-6`}>
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
          
          <div className="hidden md:grid grid-cols-[84px_1fr_100px_100px_60px] gap-4 px-3.5 pb-3 text-[11px] tracking-[0.08em] uppercase text-ink-500 font-bold">
            <div></div><div>Product</div><div>Price</div><div className="text-right">Total</div><div></div>
          </div>
          
          <div className="flex flex-col gap-3">
            {s.cart.map((l, i) => (
              <div key={i} className="grid grid-cols-[72px_1fr] md:grid-cols-[84px_1fr_100px_100px_60px] gap-3 md:gap-4 p-3.5 bg-white border border-ink-200 rounded-[12px] items-center">
                <Link href={`/products/${l.p.handle}`} className="aspect-square rounded-[10px] bg-cream-100 flex items-center p-2 cursor-pointer">
                  <Image src={l.p.image} alt={l.p.title} width={80} height={80} className="w-full h-full object-contain" />
                </Link>
                <div className="flex flex-col">
                  <Link href={`/products/${l.p.handle}`} className="text-sm font-semibold text-ink-900 hover:text-primary cursor-pointer">{l.p.title}</Link>
                  <div className="text-xs text-ink-500 mt-0.5">Size: {l.size}</div>
                  
                  {/* Mobile inner layout */}
                  <div className="md:hidden flex items-center justify-between gap-3 mt-2">
                    <div className="inline-flex items-center border-[1.5px] border-ink-200 rounded-lg bg-white overflow-hidden h-7">
                      <button className="w-7 h-full flex justify-center items-center text-primary hover:bg-cream-100" onClick={() => s.updateQty(i, -1)}><Minus size={12} /></button>
                      <span className="w-7 text-center font-bold text-ink-900 text-xs leading-7 block">{l.qty}</span>
                      <button className="w-7 h-full flex justify-center items-center text-primary hover:bg-cream-100" onClick={() => s.updateQty(i, 1)}><Plus size={12} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-primary text-[14.5px]">{fmtPrice(l.p.price * l.qty)}</div>
                      <button className="text-ink-400 hover:text-danger p-1" onClick={() => s.removeLine(i)}><X size={16} /></button>
                    </div>
                  </div>
                </div>
                
                {/* Desktop columns */}
                <div className="hidden md:block">
                  <div className="inline-flex items-center border-[1.5px] border-ink-200 rounded-xl bg-white overflow-hidden h-9">
                    <button className="w-9 h-full flex justify-center items-center text-primary hover:bg-cream-100" onClick={() => s.updateQty(i, -1)}><Minus size={14} /></button>
                    <span className="w-8 text-center font-bold text-ink-900 text-[13px] leading-9 block">{l.qty}</span>
                    <button className="w-9 h-full flex justify-center items-center text-primary hover:bg-cream-100" onClick={() => s.updateQty(i, 1)}><Plus size={14} /></button>
                  </div>
                </div>
                <div className="hidden md:block text-right font-bold text-ink-900">{fmtPrice(l.p.price * l.qty)}</div>
                <div className="hidden md:flex justify-end">
                  <button className="text-ink-400 hover:text-danger p-1" onClick={() => s.removeLine(i)} aria-label="Remove"><X size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <Link href="/" className="ay-btn ay-btn-ghost font-medium">Continue shopping</Link>
            <button className="ay-btn ay-btn-ghost text-ink-500 hover:text-danger font-medium" onClick={s.clearCart}>Clear cart</button>
          </div>
        </div>
        
        <div className="bg-cream-50 rounded-2xl p-6 border border-ink-200 h-fit self-start">
          <h3 className="text-base font-bold text-ink-900 mb-4">Order summary</h3>
          <div className="flex justify-between text-[13.5px] text-ink-700 mb-2">
            <span className="text-ink-500">Subtotal · {s.itemCount} items</span><span>{fmtPrice(s.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[13.5px] text-ink-700 mb-2">
            <span className="text-ink-500">Delivery</span><span>{s.delivery === 0 ? <span className="text-success font-semibold">Free</span> : fmtPrice(s.delivery)}</span>
          </div>
          <div className="flex justify-between text-[17px] font-bold text-primary mt-4 pt-3 border-t border-ink-200">
            <span>Total (QAR)</span><span>{fmtPrice(s.total)}</span>
          </div>
          <button className="ay-btn ay-btn-primary ay-btn-lg w-full mt-5">Continue to checkout</button>
          
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {['VISA','MC','AMEX','APAY','GPAY','COD'].map(t => (
              <span key={t} className="bg-ink-100 text-ink-500 border border-ink-200 px-2 py-0.5 rounded-[4px] text-[9px] font-bold tracking-wider">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
