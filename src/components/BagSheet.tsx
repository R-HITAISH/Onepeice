import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { Link, useRouter } from '@/router/Router';
import { formatINR, formatTimeRemaining } from '@/lib/utils';
import { X, Trash2, AlertTriangle } from 'lucide-react';

type BagSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function BagSheet({ open, onClose }: BagSheetProps) {
  const { cartItems, loading, removeFromCart } = useCart();
  const { navigate } = useRouter();
  const [, setTick] = useState(0);
  const dragControlsRef = useRef(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const total = cartItems.reduce((sum, ci) => sum + ci.item.price_inr, 0);
  const allExpired = cartItems.length > 0 && cartItems.every((ci) => new Date(ci.lock.expires_at) < new Date());

  const handleCheckout = () => {
    onClose();
    setTimeout(() => navigate('/checkout'), 200);
  };

  const handleRemove = async (lockId: string) => {
    await removeFromCart(lockId);
  };

  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <p className="label">Loading…</p>
        </div>
      );
    }

    if (cartItems.length === 0) {
      return (
        <div className="p-8 text-center">
          <h2 className="font-display text-2xl mb-2" style={{ fontWeight: 400 }}>Your bag is empty.</h2>
          <Link to="/shop" onClick={onClose} className="text-link">
            Shop new pieces
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-display text-xl" style={{ fontWeight: 400 }}>
            {cartItems.length} {cartItems.length === 1 ? 'piece' : 'pieces'} in your bag
          </h2>
        </div>

        {allExpired && (
          <div className="mx-6 mb-4 flex items-start gap-2 p-3 text-sm" style={{ color: 'var(--error)' }}>
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            Some items have expired and may be released back to the shop.
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.map((ci, idx) => {
            const expired = new Date(ci.lock.expires_at) < new Date();
            return (
              <div
                key={ci.lock.id}
                className={`flex gap-4 py-5 ${idx !== cartItems.length - 1 ? 'hairline-b' : ''} ${expired ? 'opacity-50' : ''}`}
              >
                <Link to={`/item/${ci.item.id}`} onClick={onClose} className="shrink-0">
                  <div className="w-16 h-20 product-media overflow-hidden">
                    <img
                      src={ci.item.photos[0] ?? ''}
                      alt={ci.item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/item/${ci.item.id}`} onClick={onClose}>
                    <h3 className="text-sm leading-snug mb-1 truncate text-ink">
                      {ci.item.name}
                    </h3>
                  </Link>
                  <p className="label mb-1">Size {ci.item.size} · {ci.item.condition}</p>
                  <p className="price text-sm font-medium text-ink">{formatINR(ci.item.price_inr)}</p>
                  {!expired ? (
                    <p className="label mt-1" style={{ color: 'var(--brass-text)' }}>
                      Held for {formatTimeRemaining(ci.lock.expires_at)}
                    </p>
                  ) : (
                    <p className="label mt-1" style={{ color: 'var(--error)' }}>Lock expired</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(ci.lock.id)}
                  className="self-start p-2 transition-colors"
                  style={{ color: 'var(--ink-2)' }}
                  aria-label="Remove from bag"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-6 hairline-t">
          <div className="flex items-center justify-between mb-4">
            <span className="label">Subtotal</span>
            <span className="price font-display text-xl" style={{ fontWeight: 400 }}>{formatINR(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={allExpired}
            className="btn btn-primary w-full"
          >
            Checkout
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Scrim */}
      <div className="scrim" data-open={open} onClick={onClose} />

      {/* Desktop drawer (md+) */}
      <div
        className="bag-drawer bag-surface fixed top-0 right-0 bottom-0 z-50 w-[420px] max-w-[100vw] shadow-[0_24px_60px_rgba(20,20,20,0.12)] hidden md:flex flex-col"
        data-open={open}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2"
          aria-label="Close bag"
        >
          <X size={20} style={{ color: 'var(--ink)' }} />
        </button>
        {renderContent()}
      </div>

      {/* Mobile bottom sheet (below md) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="bag-surface fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl shadow-[0_24px_60px_rgba(20,20,20,0.12)] flex flex-col md:hidden"
            style={{ maxHeight: '85vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={prefersReducedMotion
              ? { duration: 0.01 }
              : { type: 'spring', bounce: 0, duration: 0.35 }
            }
            drag={prefersReducedMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={prefersReducedMotion ? 0 : { top: 0, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                setDismissed(true);
                onClose();
              }
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--hairline)' }} />
            </div>

            <button
              onClick={onClose}
              className="absolute top-3 right-4 p-2"
              aria-label="Close bag"
            >
              <X size={18} style={{ color: 'var(--ink)' }} />
            </button>

            <div className="overflow-y-auto flex-1">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset dismissed flag when reopened */}
      {open && dismissed && setDismissed(false)}
    </>
  );
}
