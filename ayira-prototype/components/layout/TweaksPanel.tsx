'use client';

import { useStore } from '@/lib/cart-context';
import { Settings2, X } from 'lucide-react';
import { useState } from 'react';

export function TweaksPanel() {
  const s = useStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 bg-ink-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-ink-700 transition-colors tooltip-trigger group"
        aria-label="Theme Tweaks"
      >
        <span className="absolute right-[110%] bg-ink-900 text-cream-50 text-xs py-1.5 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Theme Tweaks
        </span>
        <Settings2 size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[320px] bg-white/95 backdrop-blur-md border border-ink-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col ay-page-fade">
      <div className="flex justify-between items-center p-3.5 border-b border-ink-200 bg-cream-50">
        <div className="font-bold text-ink-900 flex items-center gap-2 text-[13px] uppercase tracking-wider">
          <Settings2 size={16} /> Component Modes
        </div>
        <button onClick={() => setIsOpen(false)} className="text-ink-500 hover:text-ink-900 bg-white border border-ink-200 rounded-md p-1">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-ink-500 uppercase tracking-widest">Header Layout</label>
          <select className="border border-ink-200 rounded-lg p-2 text-sm outline-none text-ink-900 font-medium" value={s.theme.header} onChange={e => s.setTheme({header: e.target.value as any})}>
            <option value="logo-left">Logo Left (Single Row)</option>
            <option value="logo-center">Logo Center (Two Rows)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-ink-500 uppercase tracking-widest">Hero Banner</label>
          <select className="border border-ink-200 rounded-lg p-2 text-sm outline-none text-ink-900 font-medium" value={s.theme.hero} onChange={e => s.setTheme({hero: e.target.value as any})}>
            <option value="left">Content Left-Aligned</option>
            <option value="centered">Content Centered</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-ink-500 uppercase tracking-widest">Product Card Template</label>
          <select className="border border-ink-200 rounded-lg p-2 text-sm outline-none text-ink-900 font-medium" value={s.theme.card} onChange={e => s.setTheme({card: e.target.value as any})}>
            <option value="default">Icon Quick-Add (Default)</option>
            <option value="outline-qa">Outline Button Add</option>
            <option value="bar-qa">Full-Width Bar Add</option>
            <option value="minimal">Minimal (No Badges/Add)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-ink-500 uppercase tracking-widest">Announcement Bar</label>
          <select className="border border-ink-200 rounded-lg p-2 text-sm outline-none text-ink-900 font-medium" value={s.theme.announcement} onChange={e => s.setTheme({announcement: e.target.value as any})}>
            <option value="rotating">Rotating Messages</option>
            <option value="single">Single Static</option>
            <option value="cta">Static containing CTA</option>
            <option value="scrolling">Scrolling Marquee</option>
          </select>
        </div>
      </div>
    </div>
  );
}
