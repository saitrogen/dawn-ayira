import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';

export function FeaturedCollection({ title, eyebrow, viewAllLink, products, cols = 4 }: { title: string, eyebrow: string, viewAllLink: string, products: any[], cols?: number }) {
  return (
    <section className="py-5 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[11px] tracking-[0.1em] uppercase font-bold text-primary/70 mb-2">{eyebrow}</div>
            <h2 className="font-display text-2xl md:text-[32px] font-bold tracking-[-0.018em] text-primary leading-[1.1]">{title}</h2>
          </div>
          <Link href={viewAllLink} className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline underline-offset-4">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className={`grid grid-cols-2 lg:grid-cols-${cols} gap-3 md:gap-6`}>
          {products.map((p, i) => (
            <ProductCard key={i} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
