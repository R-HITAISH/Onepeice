import { useEffect, useState } from 'react';
import { supabase, type Item } from '@/lib/supabase';
import { Link } from '@/router/Router';
import { ItemCard } from '@/components/ItemCard';
import { Logo } from '@/components/Logo';
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
    <div className="bg-ink">
      {/* Hero */}
      <section className="bg-ink border-b-2 border-brass min-h-[500px] flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl text-center animate-brand-in">
          <div className="flex justify-center mb-8">
            <Logo variant="mark" height={150} className="animate-brand-in" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-ivory mb-4 uppercase tracking-wider">
            Premium Thrifted Streetwear
          </h1>
          <p className="font-body text-sm text-grey-light mb-10 tracking-wide">
            One-of-one pieces. Never restocked. Always authentic.
          </p>
          <Link to="/shop" className="btn btn-primary inline-flex">
            Shop Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Current drop */}
      <section className="bg-ink py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="label-quiet mb-2">Current drop</p>
              <h2 className="font-display text-2xl md:text-3xl text-ivory uppercase tracking-wider">Fresh Stock</h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 font-body text-xs font-semibold text-ivory uppercase tracking-wider hover:text-brass transition-colors"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-ink-800 animate-pulse" />
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
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink border-t border-grey-dark py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              <div key={step.num} className="border-l border-brass pl-6">
                <span className="font-display text-3xl text-brass block mb-4">{step.num}</span>
                <h3 className="font-display text-lg text-ivory mb-2 uppercase tracking-wider">{step.title}</h3>
                <p className="font-body text-sm text-grey-light leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
