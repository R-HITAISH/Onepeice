import { useEffect, useRef, useState } from 'react';
import { supabase, type Item } from '@/lib/supabase';
import { Link } from '@/router/Router';
import { ItemCard } from '@/components/ItemCard';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        setTilt({ x: dy * 18, y: dx * 18 });
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      setTilt({ x: 0, y: 0 });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-ink">
      {/* 3D Animated Hero */}
      <section
        ref={heroRef}
        className="hero-3d relative bg-ink border-b-2 border-brass min-h-[100vh] flex items-center justify-center overflow-hidden px-4 py-20"
        style={{ perspective: '1200px' }}
      >
        {/* Ambient grain particles */}
        <div className="hero-particles" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${(i * 0.4) % 6}s`,
                animationDuration: `${5 + (i % 5)}s`,
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div className="hero-glow" aria-hidden="true" />

        {/* 3D Brand Mark */}
        <div
          className="hero-3d-mark"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Outer ring */}
          <div className="hero-3d-ring hero-3d-ring-outer" />
          {/* Hexagon frame */}
          <div className="hero-3d-hexagon" />
          {/* Mid ring */}
          <div className="hero-3d-ring hero-3d-ring-mid" />
          {/* Inner ring */}
          <div className="hero-3d-ring hero-3d-ring-inner" />
          {/* Core dot */}
          <div className="hero-3d-core" />
          {/* Shadow plane */}
          <div className="hero-3d-shadow" />
        </div>

        {/* Text content */}
        <div className="hero-content-3d relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-ivory mb-4 uppercase tracking-wider animate-slide-up">
            Premium Thrifted Streetwear
          </h1>
          <p className="font-body text-sm md:text-base text-grey-light mb-10 tracking-wide animate-slide-up" style={{ animationDelay: '0.15s' }}>
            One-of-one pieces. Never restocked. Always authentic.
          </p>
          <Link to="/shop" className="btn btn-primary inline-flex animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Shop Now
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator" aria-hidden="true">
          <span className="hero-scroll-line" />
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
