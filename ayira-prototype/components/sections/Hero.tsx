'use client';

import Link from 'next/link';
import { useStore } from '@/lib/cart-context';

export function Hero() {
  const s = useStore();
  const isCenter = s.theme.hero === 'centered';

  return (
    <section className="py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className={`relative rounded-[18px] md:rounded-[24px] overflow-hidden bg-primary min-h-[480px] flex items-center text-on-primary ${isCenter ? 'justify-center text-center' : ''}`}>
          <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600)` }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#062E29]/85 via-[#062E29]/30 to-[#062E29]/60"></div>
          <div className={`relative z-10 p-8 md:p-14 lg:p-16 max-w-[640px] ay-page-fade ${isCenter ? 'flex flex-col items-center mx-auto' : ''}`}>
            <span className="text-mustard-300 text-xs tracking-[0.1em] uppercase font-bold mb-4 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span> Same-day delivery
            </span>
            <h1 className="font-display font-extrabold text-[38px] md:text-[60px] leading-[1.02] tracking-[-0.025em] mb-4 md:mb-5">
              The everyday minimart, online.
            </h1>
            <p className="text-[15px] md:text-[18px] leading-relaxed text-cream-50/90 max-w-[460px] mb-7 mt-0">
              Beverages, snacks and pantry essentials from Ayira Mini Mart in Al Khor — saved to your cart and on the way in under two hours.
            </p>
            <div className={`flex gap-3 flex-wrap ${isCenter ? 'justify-center' : ''}`}>
              <Link href="/collections/soft-drinks" className="ay-btn ay-btn-accent ay-btn-lg">Shop weekly specials</Link>
              <Link href="/collections/all" className="ay-btn ay-btn-secondary ay-btn-lg !bg-transparent !text-on-primary border !border-white/40 hover:!bg-white/10">Browse all</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
