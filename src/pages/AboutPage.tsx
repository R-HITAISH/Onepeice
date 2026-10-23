import { Link } from '@/router/Router';
import { ArrowRight } from 'lucide-react';

export function AboutPage() {
  return (
    <div>
      {/* Hero — night band */}
      <section style={{ backgroundColor: 'var(--night)', color: 'var(--night-ink)' }}>
        <div className="page" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
          <p className="label mb-6" style={{ color: 'var(--brass)' }}>About ONEPEICE</p>
          <h1 className="max-w-2xl" style={{ fontWeight: 400, color: 'var(--night-ink)' }}>
            We don't sell clothes.
            <br />
            We sell what's left.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="page" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 max-w-[900px]">
          <div className="md:col-span-2 space-y-6">
            <p style={{ color: 'var(--ink)' }}>
              Onepiece started in a damp basement in Pune with three garbage bags of old
              clothes and a camera phone. No investors, no warehouse, no supply chain. Just
              one question: why does every resale platform look like a luxury boutique when
              the clothes come from a thrift rack?
            </p>
            <p style={{ color: 'var(--ink)' }}>
              Every piece we list is a single physical unit. We photograph it honestly —
              the stains, the fading, the repairs. We grade the condition in plain language.
              When it sells, it's gone. No restock notification, no waitlist, no "back soon."
              That's the point.
            </p>
            <p style={{ color: 'var(--ink)' }}>
              We're not trying to be the biggest. We're trying to be the most honest. If a
              jacket has a hole in the pocket, we'll tell you about the hole. If a shoe has
              been worn twice, we'll say twice — not "like new, barely worn." Condition
              isn't a marketing category here. It's the truth.
            </p>
          </div>
          <div className="md:pt-4">
            <p className="label mb-1">Established</p>
            <p className="font-display text-xl" style={{ fontWeight: 400 }}>2026 · Pune, India</p>
          </div>
        </div>
      </section>

      {/* Principles — night band */}
      <section style={{ backgroundColor: 'var(--night)', color: 'var(--night-ink)' }}>
        <div className="page" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
          <h2 style={{ fontWeight: 400, color: 'var(--night-ink)' }} className="mb-12">What we stand on</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              { title: 'One of one', body: 'Every item is a single unit. When it sells, it is removed from circulation. No reproductions.' },
              { title: 'Honest condition', body: 'Three grades: like new, good condition, well worn. We tell you exactly what you are getting.' },
              { title: 'Fair resale', body: 'We price based on what a piece is worth, not what we think someone will pay. No artificial scarcity.' },
              { title: '10-minute lock', body: 'When you add to bag, the item is yours for 10 minutes. Nobody else can buy it while you decide.' },
            ].map((p) => (
              <div key={p.title} className="pl-5" style={{ borderLeft: '1px solid rgba(246,244,239,0.15)' }}>
                <h3 className="font-display text-lg mb-2" style={{ fontWeight: 400, color: 'var(--brass)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,244,239,0.6)' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page text-center" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <h2 style={{ fontWeight: 400 }} className="mb-4">Ready to dig through the racks?</h2>
        <p className="label mb-8">New pieces drop regularly. Once they're gone, they're gone.</p>
        <Link to="/shop" className="btn btn-primary">
          Shop the drop
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
