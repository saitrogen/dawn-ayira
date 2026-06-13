'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/cart-context';

const MESSAGES = [
  "Free delivery in Al Khor on orders over QAR 50",
  "Same-day delivery, 7 days a week — order before 4pm",
  "Save 15% on your first order with code AYIRA15",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const s = useStore();
  const mode = s.theme.announcement;

  useEffect(() => {
    if (mode === 'rotating') {
      const t = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 5000);
      return () => clearInterval(t);
    }
  }, [mode]);

  if (mode === 'single') {
    return (
      <div className="bg-primary-deep text-on-primary text-[13px] leading-snug py-2 px-4 text-center font-medium tracking-tight">
        <span>{MESSAGES[0]}</span>
      </div>
    );
  }

  if (mode === 'cta') {
    return (
      <div className="bg-primary-deep text-on-primary text-[13px] leading-snug py-2 px-4 text-center font-medium tracking-tight">
        <span>{MESSAGES[2]}</span>
        <a className="ml-2 text-accent font-bold underline underline-offset-2 cursor-pointer hover:text-mustard-300">Shop now &rarr;</a>
      </div>
    );
  }

  if (mode === 'scrolling') {
    return (
      <div className="bg-primary-deep text-on-primary text-[13px] leading-snug py-2 px-4 font-medium tracking-tight overflow-hidden whitespace-nowrap">
        <style>{`
          @keyframes ay-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-marquee { display: inline-flex; animation: ay-marquee 25s linear infinite; }
        `}</style>
        <div className="animate-marquee gap-[60px]">
           {Array.from({ length: 6 }).map((_, idx) => (
            <span key={idx} className="flex gap-4 items-center">
              <span>{MESSAGES[0]}</span>
              <span className="text-accent">★</span>
              <span>{MESSAGES[1]}</span>
              <span className="text-accent">★</span>
            </span>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-deep text-on-primary text-[13px] leading-snug py-2 px-4 text-center flex items-center justify-center gap-3.5 font-medium tracking-tight">
      <button 
        className="inline-flex px-1 text-white/40 hover:text-white/90 transition-colors" 
        onClick={() => setI((n) => (n - 1 + MESSAGES.length) % MESSAGES.length)}
      >
        <ChevronLeft size={14} />
      </button>
      <span key={i} className="ay-page-fade">{MESSAGES[i]}</span>
      <button 
        className="inline-flex px-1 text-white/40 hover:text-white/90 transition-colors" 
        onClick={() => setI((n) => (n + 1) % MESSAGES.length)}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
