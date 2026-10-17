import { useEffect, useRef, useState } from 'react';
import type { Item } from '@/lib/supabase';
import { formatINR } from '@/lib/utils';
import { Link } from '@/router/Router';
import { useInView } from '@/hooks/useInView';

export function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  const sold = item.status === 'sold';
  const locked = item.status === 'locked';
  const { ref, inView } = useInView<HTMLDivElement>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${(index % 4) * 50}ms` }}>
      <Link to={`/item/${item.id}`} className="block group">
        <div className="product-card card p-5">
          <div className="product-media aspect-[3/4] bg-ink-700 overflow-hidden relative mb-4">
            <img
              ref={imgRef}
              src={item.photos[0] ?? ''}
              alt={item.name}
              className={`product-img w-full h-full object-cover ${loaded ? 'is-loaded' : ''} ${
                sold ? 'grayscale opacity-70' : ''
              }`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
            {locked && !sold && (
              <div className="absolute top-3 right-3">
                <span className="tag tag-dark">Reserved</span>
              </div>
            )}
          </div>
          <h3 className="font-display text-sm text-ivory uppercase tracking-wide mb-2 line-clamp-2">
            {item.name}
          </h3>
          <p className="tag-one-of-one mb-2">1 of 1</p>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-body text-sm text-grey-light">{formatINR(item.price_inr)}</span>
            {sold && <span className="tag tag-sold">Sold</span>}
            {item.brand && !sold && (
              <span className="font-body text-[11px] text-grey-medium uppercase tracking-wide">{item.brand}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
