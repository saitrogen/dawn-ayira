'use client';

import { useStore } from '@/lib/cart-context';
import { CheckCircle } from 'lucide-react';

export function Toast() {
  const s = useStore();
  
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-4 py-3 rounded-2xl bg-forest-900 text-cream-50 text-sm font-semibold inline-flex items-center gap-2.5 shadow-lg pointer-events-none transition-all duration-300 ease-out ${s.toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      <span className="text-mustard-500 flex"><CheckCircle size={18} /></span>
      <span>{s.toast || ''}</span>
    </div>
  );
}
