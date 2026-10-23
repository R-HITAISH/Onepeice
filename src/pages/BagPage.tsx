import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Link, useRouter } from '@/router/Router';
import { formatINR, formatTimeRemaining } from '@/lib/utils';
import { Trash2, ArrowRight, AlertTriangle } from 'lucide-react';

export function BagPage() {
  const { cartItems, loading, removeFromCart } = useCart();
  const { navigate } = useRouter();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const total = cartItems.reduce((sum, ci) => sum + ci.item.price_inr, 0);
  const allExpired = cartItems.length > 0 && cartItems.every((ci) => new Date(ci.lock.expires_at) < new Date());

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
        <p className="label">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 'clamp(2.5rem,5vw,5rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
      <h1 style={{ fontWeight: 400 }}>Bag</h1>
      <p className="label mt-2 mb-10">
        {cartItems.length === 0
          ? '0 pieces'
          : `${cartItems.length} ${cartItems.length === 1 ? 'piece' : 'pieces'} in your bag`}
      </p>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl mb-4" style={{ fontWeight: 400 }}>Your bag is empty.</p>
          <Link to="/shop" className="text-link">Shop new pieces</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_360px] gap-10 lg:gap-16">
          {/* Items */}
          <div>
            {allExpired && (
              <div className="flex items-start gap-2 p-4 mb-6 text-sm" style={{ color: 'var(--error)' }}>
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                Some items have expired and may be released back to the shop.
              </div>
            )}

            {cartItems.map((ci, idx) => {
              const expired = new Date(ci.lock.expires_at) < new Date();
              return (
                <div
                  key={ci.lock.id}
                  className={`flex gap-4 py-5 ${idx !== cartItems.length - 1 ? 'hairline-b' : ''} ${expired ? 'opacity-50' : ''}`}
                >
                  <Link to={`/item/${ci.item.id}`} className="shrink-0">
                    <div className="w-20 h-28 product-media overflow-hidden">
                      <img src={ci.item.photos[0] ?? ''} alt={ci.item.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/item/${ci.item.id}`}>
                      <h3 className="text-sm leading-snug mb-1 text-ink">{ci.item.name}</h3>
                    </Link>
                    <p className="label mb-1">Size {ci.item.size} · {ci.item.condition}</p>
                    <p className="price text-sm font-medium text-ink mb-1">{formatINR(ci.item.price_inr)}</p>
                    {!expired ? (
                      <p className="label" style={{ color: 'var(--brass-text)' }}>
                        Held for {formatTimeRemaining(ci.lock.expires_at)}
                      </p>
                    ) : (
                      <p className="label" style={{ color: 'var(--error)' }}>Lock expired</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(ci.lock.id)}
                    className="self-start p-2"
                    style={{ color: 'var(--ink-2)' }}
                    aria-label="Remove from bag"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="hairline-t hairline-b py-6">
              <div className="flex items-center justify-between mb-4">
                <span className="label">Subtotal</span>
                <span className="price font-display text-xl" style={{ fontWeight: 400 }}>{formatINR(total)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                disabled={allExpired}
                className="btn btn-primary w-full"
              >
                Checkout
                <ArrowRight size={16} />
              </button>
              <p className="label mt-4 text-center">Payment secured by Razorpay.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
