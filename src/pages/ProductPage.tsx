import { useEffect, useState } from 'react';
import { supabase, type Item } from '@/lib/supabase';
import { Link, useRouter } from '@/router/Router';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { ArrowLeft, ShoppingBag, AlertTriangle, ChevronDown } from 'lucide-react';

export function ProductPage({ itemId }: { itemId: string }) {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inBag, setInBag] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .maybeSingle()
      .then(({ data }) => {
        setItem(data);
        setLoading(false);
      });
  }, [itemId]);

  useEffect(() => {
    if (!item) return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('items')
        .select('status')
        .eq('id', itemId)
        .maybeSingle();
      if (data && data.status !== item.status) {
        setItem({ ...item, status: data.status });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [item, itemId]);

  const handleAddToCart = async () => {
    if (!item) return;
    setAdding(true);
    setError(null);
    setInBag(false);
    const result = await addToCart(item.id);
    setAdding(false);
    if (result.success) {
      setInBag(true);
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-[4/5] animate-pulse" style={{ background: 'var(--sunken)' }} />
          <div className="space-y-4">
            <div className="h-8 animate-pulse w-3/4" style={{ background: 'var(--sunken)' }} />
            <div className="h-6 animate-pulse w-1/2" style={{ background: 'var(--sunken)' }} />
            <div className="h-32 animate-pulse" style={{ background: 'var(--sunken)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page text-center py-24">
        <h1 style={{ fontWeight: 400 }}>Item not found</h1>
        <p className="label mt-4 mb-6">This piece doesn't exist or was removed.</p>
        <Link to="/shop" className="btn btn-secondary">Back to shop</Link>
      </div>
    );
  }

  const sold = item.status === 'sold';
  const locked = item.status === 'locked';

  return (
    <div className="page" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ink-2)' }}>
        <ArrowLeft size={15} />
        Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery */}
        <div>
          {/* Desktop: stacked gallery */}
          <div className="hidden md:block space-y-4">
            <div className="product-media aspect-[4/5]">
              <img
                src={item.photos[activePhoto] ?? item.photos[0] ?? ''}
                alt={item.name}
                className={`w-full h-full object-cover ${sold ? 'grayscale opacity-60' : ''}`}
              />
            </div>
            {item.photos.length > 1 && (
              <div className="flex gap-3">
                {item.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`product-media w-20 h-20 overflow-hidden border-2 ${i === activePhoto ? '' : 'opacity-60'}`}
                    style={{ borderColor: i === activePhoto ? 'var(--ink)' : 'transparent' }}
                  >
                    <img src={photo} alt={`${item.name} photo ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: horizontal scroll-snap strip */}
          <div className="md:hidden scroll-snap-x flex gap-2 -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)]">
            {item.photos.length > 0 ? item.photos.map((photo, i) => (
              <div key={i} className="scroll-snap-item product-media aspect-[3/4] w-[75vw]">
                <img
                  src={photo}
                  alt={`${item.name} photo ${i + 1}`}
                  className={`w-full h-full object-cover ${sold ? 'grayscale opacity-60' : ''}`}
                />
              </div>
            )) : (
              <div className="scroll-snap-item product-media aspect-[3/4] w-[75vw]" />
            )}
          </div>
        </div>

        {/* Info column */}
        <div className="md:sticky md:top-24 md:self-start">
          <p className="label mb-2" style={{ color: 'var(--brass-text)' }}>1 of 1</p>
          <h1 className="font-display text-3xl md:text-4xl mb-4" style={{ fontWeight: 400 }}>
            {item.name}
          </h1>

          {!sold && (
            <p className="price text-xl text-ink mb-8">{formatINR(item.price_inr)}</p>
          )}

          {/* Info table */}
          <div className="hairline-t hairline-b mb-8">
            <div className="grid grid-cols-2">
              <div className="py-4 pr-4 hairline-r hairline-b">
                <p className="label mb-1">Size</p>
                <p className="text-sm text-ink">{item.size}</p>
              </div>
              <div className="py-4 pl-4 hairline-b">
                <p className="label mb-1">Brand</p>
                <p className="text-sm text-ink">{item.brand ?? '—'}</p>
              </div>
              <div className="py-4 pr-4 hairline-r">
                <p className="label mb-1">Condition</p>
                <p className="text-sm text-ink">{item.condition}</p>
              </div>
              <div className="py-4 pl-4">
                <p className="label mb-1">Measurements</p>
                <p className="text-sm text-ink">{item.measurements ?? '—'}</p>
              </div>
            </div>
          </div>

          {item.description && (
            <div className="mb-8">
              <p className="text-sm leading-relaxed text-ink">{item.description}</p>
            </div>
          )}

          {/* Action area */}
          <div className="mb-8">
            {sold ? (
              <div className="space-y-4">
                <p className="font-display text-2xl" style={{ fontWeight: 400, color: 'var(--ink-2)' }}>Sold</p>
                <Link to="/shop" className="text-link">See similar pieces</Link>
              </div>
            ) : inBag ? (
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-success w-full md:w-[320px]"
              >
                In your bag — Checkout
              </button>
            ) : locked ? (
              <div className="space-y-3">
                <button disabled className="btn btn-secondary w-full md:w-[320px]">
                  Reserved by another shopper
                </button>
                <Link to="/shop" className="text-link block">Back to shop</Link>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="btn btn-primary w-full md:w-[320px]"
              >
                {adding ? 'Reserving…' : (
                  <>
                    <ShoppingBag size={15} />
                    Add to bag
                  </>
                )}
              </button>
            )}

            {error && (
              <p className="mt-4 text-sm" style={{ color: 'var(--error)' }}>
                <AlertTriangle size={14} className="inline mr-1" />
                {error}
              </p>
            )}

            {!sold && !locked && !inBag && (
              <p className="label mt-4">Adding to bag reserves this item for 10 minutes.</p>
            )}
          </div>

          {/* Accordion: Delivery and returns */}
          <div className="hairline-t">
            <button
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="flex items-center justify-between w-full py-4 text-sm font-medium text-ink"
            >
              Delivery and returns
              <ChevronDown
                size={16}
                style={{ transform: accordionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }}
              />
            </button>
            <div className="accordion-content" data-open={accordionOpen}>
              <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                <p className="mb-2">We ship across India within 2–7 business days. 7-day returns for items that arrive damaged or don't match the description.</p>
                <Link to="/refund-shipping" className="text-link">Read the full policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
