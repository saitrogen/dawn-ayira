import { Truck, ShieldCheck, CreditCard, Phone } from 'lucide-react';

export function MultiColumn() {
  const items = [
    { icon: Truck, title: "Same-day delivery", text: "Order before 4pm. We deliver across Al Khor by evening." },
    { icon: ShieldCheck, title: "Quality assured", text: "Hand-picked stock. Easy returns within 48 hours." },
    { icon: CreditCard, title: "Secure checkout", text: "Apple Pay, Google Pay and all major cards accepted." },
    { icon: Phone, title: "We're here", text: "Call or WhatsApp our store any time during opening hours." },
  ];

  return (
    <section className="py-5 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map((it, i) => (
            <div key={i} className="bg-cream-50 rounded-2xl p-6 flex flex-col gap-2.5">
              <span className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-1">
                <it.icon size={22} strokeWidth={2} />
              </span>
              <h4 className="text-base font-bold text-ink-900 tracking-[-0.005em]">{it.title}</h4>
              <p className="text-[13.5px] text-ink-500 leading-relaxed m-0">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
