'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, User, Heart, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/cart-context';
import { SHOP } from '@/lib/data';
import { useState } from 'react';
import { SearchOverlay } from './SearchOverlay';
import { useRouter } from 'next/navigation';

export function Header() {
  const s = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [openNav, setOpenNav] = useState<number | null>(null);

  const Logo = (
    <Link href="/" className="inline-flex items-center gap-1.5 font-display text-2xl font-bold tracking-tight text-primary">
      <span className="text-accent text-[28px] leading-none mb-1">☼</span> ayira
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Desktop */}
        {s.theme.header === 'logo-center' ? (
          <div className="hidden md:flex flex-col ay-page-fade">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-6 py-3.5 items-center">
              <div className="relative w-72 max-w-full">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input 
                  placeholder="Search the store…" 
                  className="w-full py-2 pl-10 pr-3 rounded-xl border-[1.5px] border-ink-200 bg-white text-sm focus:border-primary focus:ring-4 focus:ring-primary-soft outline-none transition-all"
                  onFocus={() => s.setSearchOpen(true)}
                />
              </div>
              <div className="flex justify-center">{Logo}</div>
              <div className="flex gap-1 items-center justify-end">
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-700 hover:bg-cream-200 hover:text-primary transition-colors"><User size={20} /></button>
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-700 hover:bg-cream-200 hover:text-primary transition-colors"><Heart size={20} /></button>
                <button onClick={() => s.setCartOpen(true)} className="relative w-10 h-10 rounded-xl flex items-center justify-center text-ink-700 hover:bg-cream-200 hover:text-primary transition-colors">
                  <ShoppingBag size={20} />
                  {s.itemCount > 0 && <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-on-accent text-[11px] font-bold flex items-center justify-center">{s.itemCount}</span>}
                </button>
              </div>
            </div>
            <nav className="flex gap-8 items-center justify-center pt-2.5 pb-4 border-t border-ink-200">
              {SHOP.mainMenu.map((m, i) => (
                <div 
                  key={i} 
                  className="relative group pb-1"
                  onMouseEnter={() => m.children && setOpenNav(i)}
                  onMouseLeave={() => setOpenNav(null)}
                >
                  <Link 
                    href={m.url} 
                    className={`text-[14.5px] font-medium inline-flex items-center gap-1.5 hover:text-primary transition-colors ${pathname === m.url ? 'text-primary font-semibold' : 'text-ink-700'}`}
                  >
                    {m.title}{m.children && <ChevronDown size={14} />}
                  </Link>
                  {pathname === m.url && (
                    <div className="absolute -bottom-[6px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                  {m.children && openNav === i && (
                    <div className="absolute top-[34px] left-1/2 -translate-x-1/2 min-w-[220px] p-2.5 bg-white border border-ink-200 rounded-xl shadow-md z-30">
                      {m.children.map((c, j) => (
                        <Link key={j} href={c.url} className="block px-3 py-2 rounded-lg text-sm font-medium text-ink-700 hover:bg-cream-100 hover:text-primary text-center">
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        ) : (
          <div className="hidden md:grid grid-cols-[auto_1fr_auto] gap-6 py-4 items-center">
            {Logo}
            <nav className="flex gap-6 items-center">
              {SHOP.mainMenu.map((m, i) => (
                <div 
                  key={i} 
                  className="relative group py-1"
                  onMouseEnter={() => m.children && setOpenNav(i)}
                  onMouseLeave={() => setOpenNav(null)}
                >
                  <Link 
                    href={m.url} 
                    className={`text-sm font-medium inline-flex items-center gap-1 hover:text-primary transition-colors ${pathname === m.url ? 'text-primary font-semibold' : 'text-ink-700'}`}
                  >
                    {m.title}{m.children && <ChevronDown size={14} />}
                  </Link>
                  {pathname === m.url && (
                    <div className="absolute -bottom-[23px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                  {m.children && openNav === i && (
                    <div className="absolute top-[32px] -left-4 min-w-[220px] p-2.5 bg-white border border-ink-200 rounded-xl shadow-md z-30">
                      {m.children.map((c, j) => (
                        <Link key={j} href={c.url} className="block px-3 py-2 rounded-lg text-sm font-medium text-ink-700 hover:bg-cream-100 hover:text-primary">
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex gap-1 items-center">
              <div className="relative w-56 mr-1 hidden lg:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input 
                  placeholder="Search the store…" 
                  className="w-full py-2 pl-10 pr-3 rounded-xl border-[1.5px] border-ink-200 bg-white text-sm focus:border-primary focus:ring-4 focus:ring-primary-soft outline-none transition-all"
                  onFocus={() => s.setSearchOpen(true)}
                />
              </div>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-700 hover:bg-cream-200 hover:text-primary transition-colors"><User size={20} /></button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-700 hover:bg-cream-200 hover:text-primary transition-colors"><Heart size={20} /></button>
              <button onClick={() => s.setCartOpen(true)} className="relative w-10 h-10 rounded-xl flex items-center justify-center text-ink-700 hover:bg-cream-200 hover:text-primary transition-colors">
                <ShoppingBag size={20} />
                {s.itemCount > 0 && <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-on-accent text-[11px] font-bold flex items-center justify-center">{s.itemCount}</span>}
              </button>
            </div>
          </div>
        )}

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-[auto_auto_1fr_auto] gap-2 py-3 items-center">
          <button onClick={() => s.setMobMenuOpen(true)} className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-700"><Menu size={20} /></button>
          <button onClick={() => s.setSearchOpen(!s.searchOpen)} className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-700"><Search size={20} /></button>
          <div className="flex justify-center -ml-8">{Logo}</div>
          <button onClick={() => s.setCartOpen(true)} className="relative w-10 h-10 rounded-xl flex items-center justify-center text-ink-700">
            <ShoppingBag size={20} />
            {s.itemCount > 0 && <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-on-accent text-[11px] font-bold flex items-center justify-center">{s.itemCount}</span>}
          </button>
        </div>
      </div>
      <SearchOverlay />
    </header>
  );
}
