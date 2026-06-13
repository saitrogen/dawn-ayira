'use client';

import { useStore } from '@/lib/cart-context';
import { Camera, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const s = useStore();
  
  return (
    <footer className="bg-primary text-primary-soft-2 pt-14 md:pt-14 pb-4 md:pb-7 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-10 mb-8 md:mb-12">
          
          <div className="flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 font-display text-2xl font-bold tracking-tight text-white mb-4">
              <span className="text-accent text-[28px] leading-none mb-1">☼</span> ayira
            </span>
            <p className="text-[13.5px] leading-relaxed max-w-[280px] text-white/70 mb-5">
              Your neighbourhood minimart in Al Khor — beverages, snacks, frozen and everyday essentials.
            </p>
            <div className="flex gap-2">
              <a className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-on-accent transition-colors"><Camera size={16} /></a>
              <a className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-on-accent transition-colors"><MessageCircle size={16} /></a>
              <a className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-on-accent transition-colors"><Mail size={16} /></a>
            </div>
          </div>

          <div>
            <h5 className="text-[12px] font-bold tracking-widest uppercase text-white mb-4">Shop</h5>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/collections/soft-drinks" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Soft Drinks</Link></li>
              <li><Link href="/collections/juice" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Juice</Link></li>
              <li><Link href="/collections/chocolates-1" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Chocolates</Link></li>
              <li><Link href="/collections/ice-cream-1" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Ice Cream</Link></li>
              <li><Link href="/collections/noodles" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Noodles</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[12px] font-bold tracking-widest uppercase text-white mb-4">Help</h5>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/pages/contact-us" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Contact us</Link></li>
              <li><Link href="/pages/faq" className="text-sm text-primary-soft-2 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/pages/shipping" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Shipping & delivery</Link></li>
              <li><Link href="/pages/returns" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Returns & refunds</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[12px] font-bold tracking-widest uppercase text-white mb-4">Company</h5>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/pages/about" className="text-sm text-primary-soft-2 hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/pages/privacy" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Privacy policy</Link></li>
              <li><Link href="/pages/terms" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Terms of service</Link></li>
              <li><Link href="/search" className="text-sm text-primary-soft-2 hover:text-white transition-colors">Search</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[12px] font-bold tracking-widest uppercase text-white mb-4">Get our weekly specials</h5>
            <p className="text-[13px] text-white/70 mb-3">One short email every Saturday. Unsubscribe any time.</p>
            <input type="email" placeholder="you@example.com" className="w-full px-3.5 py-3 rounded-[10px] border-[1.5px] border-forest-600 bg-forest-800 text-white font-inherit text-[13.5px] outline-none placeholder:text-white/50 focus:border-accent" />
            <button className="ay-btn ay-btn-accent w-full mt-2 font-bold text-[13.5px] py-3 rounded-[10px]">Subscribe</button>
          </div>

        </div>

        <div className="pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[12.5px] text-white/55">
          <div>© 2026 Ayira Mini Mart · Al Khor, Qatar</div>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {['VISA','MC','AMEX','APAY','GPAY','COD'].map(t => (
              <span key={t} className="bg-white/10 px-2.5 py-1 rounded-[5px] text-[10.5px] font-bold tracking-wider">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
