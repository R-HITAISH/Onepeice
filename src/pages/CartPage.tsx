import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Link, useRouter } from '@/router/Router';
import { formatINR, formatTimeRemaining } from '@/lib/utils';
import { Trash2, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';

export function CartPage() {
  const { cartItems, loading, removeFromCart } = useCart();
  const { navigate } = useRouter();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const total = cartItems.reduce((sum, ci) => sum + ci.item.price_inr, 0);
  const allExpired = cartItems.every((ci) => new Date(ci.lock.expires_at) < new Date());

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 bg-ivory-200 animate-pulse w-1/3 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 bg-ivory-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl mb-10" style={{ fontWeight: 400 }}>Your bag</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 border border-hairline p-8">
          <ShoppingBag size={40} className="mx-auto mb-4 text-muted-light" />
          <p className="font-display text-2xl mb-2" style={{ fontWeight: 400 }}>Bag is empty</p>
          <p className="label-quiet mb-6">
            Items you add will show up here. Each one is held for 10 minutes.
          </p>
          <Link to="/shop" className="btn btn-dark">
            Shop the drop
          </Link>
        </div>
      ) : (
        <div>
          {allExpired && cartItems.length > 0 && (
            <div className="flex items-start gap-2 p-4 text-warning font-body text-sm mb-6">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              Some items in your bag have expired. They may be released back to the shop.
              Proceed to checkout quickly or remove expired items.
            </div>
          )}

          <div className="space-y-0 mb-8">
            {cartItems.map((ci, idx) => {
              const expired = new Date(ci.lock.expires_at) < new Date();
              return (
                <div
                  key={ci.lock.id}
                  className={`flex gap-5 py-5 ${idx !== cartItems.length - 1 ? 'border-b border-hairline' : ''} ${
                    expired ? 'opacity-50' : ''
                  }`}
                >
                  <Link to={`/item/${ci.item.id}`} className="shrink-0">
                    <div className="w-24 h-32 bg-ivory-200 overflow-hidden">
                      <img
                        src={ci.item.photos[0] ?? ''}
                        alt={ci.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/item/${ci.item.id}`}>
                      <h3 className="font-body text-sm leading-snug mb-1 hover:text-brass transition-colors">
                        {ci.item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="label-quiet">{ci.item.size}</span>
                      <span className="text-hairline">·</span>
                      <span className="label-quiet">{ci.item.condition}</span>
                    </div>
                    <p className="font-body text-base font-medium mb-2">{formatINR(ci.item.price_inr)}</p>
                    {!expired ? (
                      <p className="label-quiet text-brass flex items-center gap-1">
                        Held for {formatTimeRemaining(ci.lock.expires_at)}
                      </p>
                    ) : (
                      <p className="label-quiet text-error">Lock expired</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(ci.lock.id)}
                    className="self-start text-muted-light hover:text-error transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="bg-ink text-ivory p-8">
            <div className="flex items-center justify-between mb-5">
              <span className="label-quiet text-ivory/50">
                Total ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </span>
              <span className="font-display text-3xl" style={{ fontWeight: 400 }}>{formatINR(total)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              disabled={allExpired}
              className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Proceed to checkout
              <ArrowRight size={16} />
            </button>
            <p className="mt-4 label-quiet text-ivory/30 text-center">
              Payment secured by Razorpay. Items are marked sold after payment verification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
