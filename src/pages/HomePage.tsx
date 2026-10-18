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
      .limit(4)
      .then(({ data }) => {
        if (data) setFeatured(data);
        setLoading(false);
      });
  }, []);

  const heroPhoto = featured[0]?.photos?.[0] ?? 'https://images.pexels.com/photos/5675657/pexels-photo-5675657.jpeg?auto=compress&cs=tinysrgb&w=1600';

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full" style={{ height: '90vh', minHeight: '480px' }}>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroPhoto}
            alt={featured[0]?.name ?? 'Thrifted streetwear'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-end" style={{ background: 'linear-gradient(to top, rgba(246,244,239,0.9) 0%, rgba(246,244,239,0.3) 40%, transparent 70%)' }}>
          <div className="page w-full pb-12 md:pb-16">
            <div className="max-w-2xl">
              <h1 className="font-display text-ink mb-3" style={{ fontWeight: 400 }}>
                One of one.
              </h1>
              <p className="text-lg md:text-xl text-ink-2 mb-8" style={{ color: 'var(--ink-2)' }}>
                Thrifted pieces, never restocked.
              </p>
              <Link to="/shop" className="btn btn-primary">
                Shop the drop
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New in */}
      <section className="page" style={{ paddingTop: 'clamp(60px, 10vw, 120px)', paddingBottom: 'clamp(60px, 10vw, 120px)' }}>
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <h2 style={{ fontWeight: 400 }}>New in</h2>
          <Link to="/shop" className="text-link">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[14px] md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse" style={{ background: 'var(--sunken)' }} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <p className="label">The drop is empty. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[14px] md:gap-6">
            {featured.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Night band */}
      <section style={{ backgroundColor: 'var(--night)', color: 'var(--night-ink)' }}>
        <div className="page" style={{ paddingTop: 'clamp(60px, 10vw, 120px)', paddingBottom: 'clamp(60px, 10vw, 120px)' }}>
          <div className="grid md:grid-cols-3 gap-0">
            {[
              { title: 'Found once.', body: 'Every piece is sourced by hand from thrift racks, estate sales, and private collections across India.' },
              { title: 'Yours alone.', body: 'No restocks, no reissues, no waitlists. When you buy it, it becomes the only one that exists in the world.' },
              { title: 'Never restocked.', body: 'Once sold, it is gone for good. We do not reproduce, reorder, or source a replacement.' },
            ].map((col, i) => (
              <div
                key={col.title}
                className={`py-8 md:py-0 md:px-10 ${i > 0 ? 'md:border-l' : ''}`}
                style={{ borderColor: 'rgba(246,244,239,0.12)', borderTop: i > 0 ? '1px solid rgba(246,244,239,0.12)' : undefined }}
              >
                <h3 className="font-display text-2xl mb-3" style={{ fontWeight: 400 }}>{col.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,244,239,0.6)' }}>{col.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sell to us CTA */}
      <section className="page" style={{ paddingTop: 'clamp(60px, 10vw, 120px)', paddingBottom: 'clamp(60px, 10vw, 120px)' }}>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="mb-4" style={{ fontWeight: 400 }}>Have something to sell?</h2>
            <p className="text-base mb-8" style={{ color: 'var(--ink-2)' }}>
              Send us your pieces. Tell us the size, condition and your price.
            </p>
            <Link to="/sell" className="btn btn-primary">
              Sell to us
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-media aspect-[4/5] md:aspect-[4/3]">
            <img
              src="https://images.pexels.com/photos/3998648/pexels-photo-3998648.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Folded vintage clothing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
