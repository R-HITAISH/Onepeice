import { useEffect, useState, useMemo } from 'react';
import { supabase, type Item, CATEGORIES, CONDITIONS, SIZES } from '@/lib/supabase';
import { ItemCard } from '@/components/ItemCard';
import { X } from 'lucide-react';

type SortOption = 'newest' | 'price-low' | 'price-high';

export function ShopPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [soldItems, setSoldItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('newest');
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('items').select('*');
    if (showArchive) {
      query = query.eq('status', 'sold');
    } else {
      query = query.eq('status', 'available');
    }
    if (category) query = query.eq('category', category);
    if (size) query = query.eq('size', size);
    if (condition) query = query.eq('condition', condition);
    if (sort === 'price-low') query = query.order('price_inr', { ascending: true });
    else if (sort === 'price-high') query = query.order('price_inr', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    query.then(({ data }) => {
      if (data) setItems(data);
      setLoading(false);
    });
  }, [category, size, condition, sort, showArchive]);

  const activeFilters = useMemo(
    () => [
      { key: 'category', label: category, set: setCategory },
      { key: 'size', label: size, set: setSize },
      { key: 'condition', label: condition, set: setCondition },
    ].filter((f) => f.label),
    [category, size, condition]
  );

  const clearAll = () => {
    setCategory(null);
    setSize(null);
    setCondition(null);
  };

  const filterChips = (label: string, options: readonly string[], value: string | null, setter: (v: string | null) => void) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setter(value === opt ? null : opt)}
          className={`chip ${value === opt ? 'chip-active' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="page" style={{ paddingTop: 'clamp(2.5rem, 5vw, 5rem)', paddingBottom: 'clamp(4rem, 8vw, 8rem)' }}>
      {/* Heading */}
      <div className="mb-8 md:mb-12">
        <h1 style={{ fontWeight: 400 }}>Shop</h1>
        <p className="label mt-2">
          {loading ? '' : `${items.length} ${items.length === 1 ? 'piece' : 'pieces'}`}
        </p>
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 hairline-b">
        <div className="flex items-center gap-3">
          <span className="label">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="input"
            style={{ width: 'auto', minHeight: '36px', padding: '0.375rem 0.75rem', borderRadius: '999px' }}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="label">Category</span>
          <select
            value={category ?? ''}
            onChange={(e) => setCategory(e.target.value || null)}
            className="input"
            style={{ width: 'auto', minHeight: '36px', padding: '0.375rem 0.75rem', borderRadius: '999px' }}
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={() => setShowArchive(!showArchive)}
          className={`chip ${showArchive ? 'chip-active' : ''}`}
        >
          {showArchive ? 'Available' : 'Archive (sold)'}
        </button>
      </div>

      {/* Secondary filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="label">Size</span>
          {filterChips('Size', SIZES, size, setSize)}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="label">Condition</span>
          {filterChips('Condition', CONDITIONS, condition, setCondition)}
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => f.set(null)}
              className="chip chip-active flex items-center gap-1"
            >
              {f.label}
              <X size={12} />
            </button>
          ))}
          <button onClick={clearAll} className="text-link text-sm">Clear all</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[14px] md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse" style={{ background: 'var(--sunken)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl mb-2" style={{ fontWeight: 400 }}>Nothing matches.</p>
          <p className="label mb-6">Try clearing your filters or check back when the next drop lands.</p>
          {activeFilters.length > 0 && (
            <button onClick={clearAll} className="btn btn-secondary">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[14px] md:gap-6">
          {items.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
