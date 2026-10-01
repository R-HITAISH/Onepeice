import type { Item } from '@/lib/supabase';
import { formatINR } from '@/lib/utils';
import { Link } from '@/router/Router';

export function ItemCard({ item }: { item: Item }) {
  const sold = item.status === 'sold';
  const locked = item.status === 'locked';

  return (
    <Link to={`/item/${item.id}`} className="block group">
      <div className="card p-5 animate-fade-in">
        <div className="aspect-[3/4] bg-ink-700 overflow-hidden relative mb-4">
          <img
            src={item.photos[0] ?? ''}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
              sold ? 'grayscale opacity-70' : ''
            }`}
            loading="lazy"
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
  );
}
