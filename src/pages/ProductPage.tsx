import { useEffect, useState } from 'react';
import { supabase, type Item } from '@/lib/supabase';
import { Link, useRouter } from '@/router/Router';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { ArrowLeft, ShoppingBag, Check, AlertTriangle, Clock } from 'lucide-react';

export function ProductPage({ itemId }: { itemId: string }) {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

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
    setSuccess(false);
    const result = await addToCart(item.id);
    setAdding(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/cart'), 1200);
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-ivory-200 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-ivory-200 animate-pulse w-3/4" />
            <div className="h-6 bg-ivory-200 animate-pulse w-1/2" />
            <div className="h-32 bg-ivory-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-3xl mb-4" style={{ fontWeight: 400 }}>Item not found</h1>
        <p className="label-quiet mb-6">
          This piece doesn't exist or was removed.
        </p>
        <Link to="/shop" className="btn btn-dark">
          Back to shop
        </Link>
      </div>
    );
  }

  const sold = item.status === 'sold';
  const locked = item.status === 'locked';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 font-body text-sm text-muted hover:text-brass mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Photos */}
        <div>
          <div className="aspect-[3/4] bg-ivory-200 overflow-hidden relative">
            <img
              src={item.photos[activePhoto] ?? item.photos[0] ?? ''}
              alt={item.name}
              className={`w-full h-full object-cover ${sold ? 'grayscale opacity-70' : ''}`}
            />
            {sold && (
              <div className="absolute top-5 left-5">
                <span className="tag tag-sold">Sold</span>
              </div>
            )}
          </div>
          {item.photos.length > 1 && (
            <div className="flex gap-3 mt-4">
              {item.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`w-20 h-20 overflow-hidden border transition-colors ${
                    i === activePhoto ? 'border-brass' : 'border-hairline hover:border-ink'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="pt-2">
          {item.brand && (
            <p className="label-quiet mb-3">{item.brand}</p>
          )}
          <h1 className="font-display text-3xl md:text-4xl leading-tight mb-5" style={{ fontWeight: 400 }}>
            {item.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-body text-2xl font-medium">{formatINR(item.price_inr)}</span>
            <span className="label-quiet">1 of 1</span>
            {locked && !sold && (
              <span className="flex items-center gap-1 label-quiet text-brass ml-2">
                <Clock size={13} />
                Reserved by another buyer
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-0 mb-8 border-t border-b border-hairline">
            <div className="py-4 pr-4 border-r border-hairline">
              <p className="label-quiet mb-1">Size</p>
              <p className="font-body text-sm">{item.size}</p>
            </div>
            <div className="py-4 px-4 border-r border-hairline">
              <p className="label-quiet mb-1">Category</p>
              <p className="font-body text-sm">{item.category}</p>
            </div>
            <div className="py-4 pl-4">
              <p className="label-quiet mb-1">Condition</p>
              <p className="font-body text-sm">{item.condition}</p>
            </div>
          </div>

          {item.description && (
            <div className="mb-8">
              <h3 className="label-quiet mb-2">Description</h3>
              <p className="font-body text-sm leading-relaxed text-ink/80">{item.description}</p>
            </div>
          )}

          {item.measurements && (
            <div className="mb-8">
              <h3 className="label-quiet mb-2">Measurements</h3>
              <p className="font-body text-sm leading-relaxed text-ink/80">{item.measurements}</p>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-10">
            {sold ? (
              <button disabled className="btn btn-dark w-full opacity-50 cursor-not-allowed">
                Sold
              </button>
            ) : success ? (
              <div className="flex items-center justify-center gap-2 p-4 text-brass font-body text-sm">
                <Check size={18} />
                Added to bag — redirecting...
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={adding || locked}
                className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {adding ? (
                  'Reserving...'
                ) : locked ? (
                  'Currently reserved'
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    Add to bag
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 p-3 text-error font-body text-sm">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {!sold && !locked && (
              <p className="mt-4 label-quiet text-center">
                Adding to bag reserves this item for 10 minutes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
