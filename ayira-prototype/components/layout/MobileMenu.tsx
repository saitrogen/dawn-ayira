'use client';

import { useStore } from '@/lib/cart-context';
import { X } from 'lucide-react';
import Link from 'next/link';
import { SHOP } from '@/lib/data';

export function MobileMenu() {
  const s = useStore();
  
  return (
    <div className={`fixed inset-0 bg-cream-100 z-[100] flex flex-col transform transition-transform duration-300 ease-out md:hidden ${s.mobMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center px-4 py-4 border-b border-ink-200 bg-cream-50">
        <span className="inline-flex items-center gap-1.5 font-display text-[22px] font-bold tracking-tight text-primary">
          <span className="text-accent text-[26px] leading-none mb-1">☼</span> ayira
        </span>
        <button className="w-10 h-10 flex items-center justify-center text-ink-700 rounded-xl hover:bg-cream-200" onClick={() => s.setMobMenuOpen(false)}>
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <Link href="/" onClick={() => s.setMobMenuOpen(false)} className="block p-4 text-[17px] font-medium text-ink-900 rounded-xl hover:bg-cream-200">Home</Link>
        {SHOP.mainMenu.filter(m => m.title !== 'Home' && m.title !== 'Contact Us').map((m, i) => (
          <div key={i}>
            <div className="px-4 pt-4 pb-1.5 text-[11px] tracking-widest uppercase text-ink-500 font-bold">{m.title}</div>
            <div className="flex flex-col pl-4 pb-2">
              {m.children?.map((c, j) => (
                <Link key={j} href={c.url} onClick={() => s.setMobMenuOpen(false)} className="text-[14.5px] font-medium px-3.5 py-2.5 text-ink-700 rounded-lg hover:bg-cream-200">
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link href="/pages/contact-us" onClick={() => s.setMobMenuOpen(false)} className="block p-4 text-[17px] font-medium text-ink-900 rounded-xl hover:bg-cream-200">Contact us</Link>
      </div>
    </div>
  );
}
