import { Link } from '@/router/Router';
import { ArrowRight } from 'lucide-react';

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-ivory py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label-quiet text-brass-light mb-6">About Onepeice</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.1] max-w-2xl" style={{ fontWeight: 300 }}>
            We don't sell clothes.
            <br />
            We sell what's left.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          <div className="md:col-span-2 space-y-6">
            <p className="font-body text-base leading-relaxed text-ink/80">
              Onepeice started in a damp basement in Pune with three garbage bags of old
              clothes and a camera phone. No investors, no warehouse, no supply chain. Just
              one question: why does every resale platform look like a luxury boutique when
              the clothes come from a thrift rack?
            </p>
            <p className="font-body text-base leading-relaxed text-ink/80">
              Every piece we list is a single physical unit. We photograph it honestly —
              the stains, the fading, the repairs. We grade the condition in plain language.
              When it sells, it's gone. No restock notification, no waitlist, no "back soon."
              That's the point.
            </p>
            <p className="font-body text-base leading-relaxed text-ink/80">
              We're not trying to be the biggest. We're trying to be the most honest. If a
              jacket has a hole in the pocket, we'll tell you about the hole. If a shoe has
              been worn twice, we'll say twice — not "like new, barely worn." Condition
              isn't a marketing category here. It's the truth.
            </p>
          </div>
          <div className="md:pt-4">
            <p className="label-quiet mb-1">Established</p>
            <p className="font-display text-xl mb-6" style={{ fontWeight: 400 }}>2026 · Pune, India</p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-ink text-ivory py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl mb-12" style={{ fontWeight: 400 }}>What we stand on</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              {
                title: 'One of one',
                body: 'Every item is a single unit. When it sells, it is removed from circulation. No reproductions.',
              },
              {
                title: 'Honest condition',
                body: 'Three grades: like new, good condition, well worn. We tell you exactly what you are getting.',
              },
              {
                title: 'Fair resale',
                body: 'We price based on what a piece is worth, not what we think someone will pay. No artificial scarcity.',
              },
              {
                title: '10-minute lock',
                body: 'When you add to bag, the item is yours for 10 minutes. Nobody else can buy it while you decide.',
              },
            ].map((p) => (
              <div key={p.title} className="border-l border-ivory/15 pl-5">
                <h3 className="font-display text-lg mb-2 text-brass-light" style={{ fontWeight: 400 }}>{p.title}</h3>
                <p className="font-body text-sm text-ivory/50 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl mb-4" style={{ fontWeight: 400 }}>
          Ready to dig through the racks?
        </h2>
        <p className="label-quiet mb-8">
          New pieces drop regularly. Once they're gone, they're gone.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Shop the drop
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
