import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SHOP } from '@/lib/data';

export function CollectionList() {
  const featured = SHOP.collections.filter(c => c.featured).slice(0, 5);
  
  return (
    <section className="py-5 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[11px] tracking-[0.1em] uppercase font-bold text-primary/70 mb-2">Shop by aisle</div>
            <h2 className="font-display text-2xl md:text-[32px] font-bold tracking-[-0.018em] text-primary leading-[1.1]">Browse our collections</h2>
          </div>
          <Link href="/collections" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline underline-offset-4">
            All collections <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
          {featured.map((c, i) => (
            <Link key={i} href={`/collections/${c.handle}`} className="relative rounded-[18px] overflow-hidden aspect-[4/5] bg-cream-200 flex items-end cursor-pointer transition-transform duration-200 hover:-translate-y-1 group">
              {c.image ? (
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105" style={{ backgroundImage: `url(${c.image})` }}></div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                  <span className="font-display font-extrabold text-[64px] text-primary/20 tracking-tighter">{c.title[0]}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#062E29]/70 to-[#062E29]/5"></div>
              <div className="relative z-10 p-4 md:p-4 text-cream-50 w-full flex items-end justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg md:text-[22px] font-bold tracking-[-0.014em] leading-[1.1]">{c.title}</h3>
                  <div className="text-xs opacity-80 mt-1">{c.product_count} items</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-cream-50 text-primary inline-flex items-center justify-center flex-none">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
