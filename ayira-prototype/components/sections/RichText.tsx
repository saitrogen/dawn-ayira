import Link from 'next/link';

export function RichText() {
  return (
    <section className="py-5 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center max-w-[680px] mx-auto py-6">
          <div className="text-primary text-[11px] tracking-[0.1em] uppercase font-bold mb-4">Store hours · Al Khor</div>
          <h2 className="font-display text-[26px] md:text-[36px] font-bold tracking-[-0.018em] text-primary mb-4 leading-[1.1]">
            Open seven days, just around the corner.
          </h2>
          <p className="text-base leading-[1.65] text-ink-700 mb-6">
            Stop in for fresh stock, or shop online and we&apos;ll bring it over. We open at 7am Saturday through Thursday, and 8am on Fridays — last delivery slot goes out at 10pm.
          </p>
          <Link href="/pages/contact-us" className="ay-btn ay-btn-secondary">Get directions</Link>
        </div>
      </div>
    </section>
  );
}
