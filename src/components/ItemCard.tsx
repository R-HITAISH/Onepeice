import { useEffect, useRef, useState } from 'react';
import type { Item } from '@/lib/supabase';
import { formatINR } from '@/lib/utils';
import { Link } from '@/router/Router';

export function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  const sold = item.status === 'sold';
  const locked = item.status === 'locked';
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const altText = `${item.name} — ${item.condition}`;

  return (
    <Link to={`/item/${item.id}`} className="product-card block">
      <div className="product-media aspect-[4/5] relative">
        <img
          ref={imgRef}
          src={item.photos[0] ?? ''}
          alt={altText}
          className={`product-img w-full h-full object-cover ${loaded ? 'is-loaded' : ''} ${sold ? 'grayscale opacity-60' : ''}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        {sold && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-ink text-paper text-xs font-medium uppercase tracking-wider">
            Sold
          </span>
        )}
        {locked && !sold && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-paper text-ink text-xs font-medium uppercase tracking-wider">
            Reserved
          </span>
        )}
      </div>
      <div className="pt-3">
        <h3 className="text-sm leading-snug truncate text-ink">{item.name}</h3>
        <p className="label mt-1">Size {item.size} · {item.condition}</p>
        <div className="flex items-baseline justify-between mt-2">
          <span className="price text-sm text-ink">{formatINR(item.price_inr)}</span>
          <span className="label" style={{ color: 'var(--brass-text)' }}>1 of 1</span>
        </div>
      </div>
    </Link>
  );
}
