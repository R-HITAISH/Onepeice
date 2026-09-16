import { useEffect, useState } from 'react';
import { supabase, type Item } from '@/lib/supabase';
import { Link } from '@/router/Router';
import { ItemCard } from '@/components/ItemCard';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('items')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setFeatured(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl animate-slide-up">
            <p className="label-quiet text-brass-light mb-6">
              Thrifted · Secondhand · One of One
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-8" style={{ fontWeight: 300 }}>
              One of one.
              <br />
              Never restocked.
            </h1>
            <p className="font-body text-base text-ivory/50 max-w-lg mb-10 leading-relaxed">
              Every piece on Onepiece is a single physical unit. When it sells, it's gone
              for good. No restocks, no reproductions, no lies.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn btn-primary">
                Shop the drop
                <ArrowRight size={16} />
              </Link>
              <Link to="/sell" className="btn btn-ghost text-ivory hover:text-brass-light">
                Sell to us
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-x-8 gap-y-2 justify-center md:justify-between">
            {['Real photos', 'Real condition', 'Real stock', 'No reproductions'].map((t) => (
              <span key={t} className="label-quiet text-ivory/30">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Current drop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="label-quiet mb-2">Current drop</p>
            <h2 className="font-display text-3xl md:text-4xl" style={{ fontWeight: 400 }}>Fresh stock</h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 font-body text-sm text-muted hover:text-brass transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-ivory-200 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <p className="label-quiet">Drop is empty. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-10 sm:hidden">
          <Link to="/shop" className="btn btn-dark w-full">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                num: '01',
                title: 'Browse the drop',
                body: 'Every item is photographed and condition-graded honestly. What you see is what you get.',
              },
              {
                num: '02',
                title: 'Lock it for 10 min',
                body: 'Add to bag and we hold the item for you for 10 minutes. Nobody else can buy it while it is locked.',
              },
              {
                num: '03',
                title: 'Pay and own',
                body: 'Checkout with Razorpay. Once paid, the item is marked sold — permanently. No restocks.',
              },
            ].map((step) => (
              <div key={step.num} className="border-l border-ivory/15 pl-6">
                <span className="font-display text-3xl text-brass-light block mb-4" style={{ fontWeight: 300 }}>{step.num}</span>
                <h3 className="font-display text-lg mb-2" style={{ fontWeight: 400 }}>{step.title}</h3>
                <p className="font-body text-sm text-ivory/50 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
