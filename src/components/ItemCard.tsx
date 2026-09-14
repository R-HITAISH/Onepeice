import type { Item } from '@/lib/supabase';
import { formatINR } from '@/lib/utils';
import { Link } from '@/router/Router';

export function ItemCard({ item }: { item: Item }) {
  const sold = item.status === 'sold';
  const locked = item.status === 'locked';

  return (
    <Link to={`/item/${item.id}`} className="block group">
      <div className="card overflow-hidden">
        <div className="aspect-[3/4] bg-ivory-200 overflow-hidden relative">
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
        <div className="pt-3 pb-1">
          <h3 className="font-body text-sm text-ink leading-snug line-clamp-2 mb-1.5">{item.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="label-quiet">{item.size}</span>
            <span className="text-hairline">·</span>
            <span className="label-quiet">{item.condition}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-body text-sm font-medium text-ink">{formatINR(item.price_inr)}</span>
              <span className="label-quiet">1 of 1</span>
            </div>
            {sold && (
              <span className="tag tag-sold">Sold</span>
            )}
            {item.brand && !sold && (
              <span className="label-quiet">{item.brand}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
