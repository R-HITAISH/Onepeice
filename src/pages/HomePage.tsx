import { useEffect, useRef, useState } from 'react';
import { supabase, type Item } from '@/lib/supabase';
import { Link } from '@/router/Router';
import { ItemCard } from '@/components/ItemCard';
import { Logo } from '@/components/Logo';
import { ArrowDown, ArrowRight } from 'lucide-react';

export function HomePage() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('items')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (!active) return;
        if (data) setFeatured(data);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reducedMotion) {
      revealNodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealNodes.forEach((node) => observer.observe(node));

    const hero = heroRef.current;
    let frame = 0;
    const onScroll = () => {
      if (!hero || frame) return;
      frame = window.requestAnimationFrame(() => {
        const distance = Math.max(0, window.scrollY - hero.offsetTop);
        hero.style.setProperty('--hero-scroll', `${Math.min(distance * 0.22, 150)}px`);
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [featured.length]);

  return (
    <div className="home-editorial">
      <section ref={heroRef} className="campaign-hero" aria-labelledby="hero-title">
        <div className="campaign-hero__visual" aria-label="ONEEEPIIECE animated brand emblem">
          <div className="brand-orbit brand-orbit--outer" aria-hidden="true" />
          <div className="brand-orbit brand-orbit--inner" aria-hidden="true" />
          <div className="brand-emblem-3d">
            <div className="brand-emblem-3d__face"><Logo variant="mark" height={210} className="campaign-hero__mark" /></div>
          </div>
          <Logo className="campaign-hero__wordmark" height={34} />
          <p className="campaign-hero__signature">FOUND ONCE <span>·</span> KEPT FOREVER</p>
          <span className="brand-serial brand-serial--top" aria-hidden="true">O.P. / 01</span>
          <span className="brand-serial brand-serial--bottom" aria-hidden="true">ONE OF ONE, ALWAYS</span>
        </div>
        <div className="campaign-hero__copy">
          <p className="eyebrow campaign-hero__eyebrow"><span /> An independent clothing label · India</p>
          <h1 id="hero-title">Found once.<br /><em>Kept forever.</em></h1>
          <p className="campaign-hero__intro">Singular pieces, chosen with intention.<br className="hidden sm:block" /> A little history. A life still ahead.</p>
          <Link to="/shop" className="campaign-link">
            Explore the collection <span className="campaign-link__icon"><ArrowRight size={16} /></span>
          </Link>
          <div className="campaign-hero__edition"><span>01</span><i /> Clothing with a past, made for what comes next</div>
        </div>
        <a className="campaign-hero__scroll" href="#new-in" aria-label="Scroll to new arrivals"><span>Scroll to discover</span><ArrowDown size={15} /></a>
      </section>

      <section id="new-in" className="home-section new-in-section">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">The current edit <span> / 01</span></p>
            <h2>Newly found</h2>
          </div>
          <Link to="/shop" className="text-link section-heading__link">View all pieces <ArrowRight size={15} /></Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse" style={{ background: 'var(--sunken)' }} />)}
          </div>
        ) : featured.length === 0 ? (
          <div className="empty-edit" data-reveal><Logo variant="mark" height={48} /><p className="label">The next edit is being gathered. Check back soon.</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((item, i) => <div key={item.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }}><ItemCard item={item} index={i} /></div>)}
          </div>
        )}
      </section>

      <section className="story-section" data-reveal>
        <div className="story-section__texture" aria-hidden="true" />
        <div className="story-section__mark" aria-hidden="true"><Logo variant="mark" height={96} /></div>
        <div className="story-section__inner">
          <p className="eyebrow">A different kind of wardrobe</p>
          <h2>Made by time.<br /><em>Found by chance.</em></h2>
          <p>We seek out garments with a little life in them. Each one is selected for its character, quality and quiet ability to feel like yours.</p>
          <Link to="/about" className="campaign-link campaign-link--light">Our point of view <span className="campaign-link__icon"><ArrowRight size={16} /></span></Link>
        </div>
        <div className="story-section__caption"><span>ONEEEPIIECE</span><span>Every piece has a story.</span></div>
      </section>

      <section className="principles-section home-section">
        <div className="principles-heading" data-reveal>
          <p className="eyebrow">The ONEEEPIIECE approach</p>
          <h2>Wear what<br className="sm:hidden" /> speaks to you.</h2>
        </div>
        <div className="principles-grid">
          {[
            { number: '01', title: 'Found with care', body: 'Sourced slowly from thrift racks, estate sales and private collections across India.' },
            { number: '02', title: 'One of one', body: 'A singular find, chosen for its feel, its story and the life still waiting in it.' },
            { number: '03', title: 'Yours to keep', body: 'When a piece finds its person, it leaves our edit for good. No restocks, ever.' },
          ].map((item, i) => (
            <article className="principle" data-reveal key={item.number} style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="principle__number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="source-section">
        <div className="source-section__image" role="img" aria-label="Carefully selected vintage clothing" />
        <div className="source-section__copy" data-reveal>
          <p className="eyebrow">The next story could be yours</p>
          <h2>Pass something<br /><em>good along.</em></h2>
          <p>Have a piece that deserves another chapter? We would love to see it.</p>
          <Link to="/sell" className="campaign-link">Sell to us <span className="campaign-link__icon"><ArrowRight size={16} /></span></Link>
        </div>
        <span className="source-section__index">A small circle of good things · 2026</span>
      </section>
    </div>
  );
}

