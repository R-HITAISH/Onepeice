import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from '@/router/Router';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';
import { formatINR, timeAgo } from '@/lib/utils';
import { Loader2, Package } from 'lucide-react';

type OrderWithItems = Order & {
  order_items: (OrderItem & { item: { id: string; name: string; photos: string[] } | null })[];
};

export function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { navigate } = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?returnTo=/account');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('orders')
      .select('*, order_items(*, item:item_id(id, name, photos))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as OrderWithItems[]);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="page py-12">
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--ink-2)' }} />
      </div>
    );
  }

  if (!user) return null;

  const firstName = (user.email ?? '').split('@')[0].replace(/[._-]/g, ' ').trim() || 'Account';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // Derive phone from user metadata if available
  const phone = (user as any).phone ?? (user as any).user_metadata?.phone ?? '—';
  const email = user.email ?? '—';

  return (
    <div className="page" style={{ paddingTop: 'clamp(2.5rem,5vw,5rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
      <h1 style={{ fontWeight: 400 }}>Account</h1>
      <p className="font-display text-2xl mt-2" style={{ fontWeight: 400 }}>{displayName}</p>

      {/* Orders */}
      <section className="mt-12 hairline-t pt-8">
        <h2 className="font-display text-xl mb-6" style={{ fontWeight: 400 }}>Orders</h2>

        {loading ? (
          <Loader2 size={22} className="animate-spin" style={{ color: 'var(--ink-2)' }} />
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={32} className="mx-auto mb-3" style={{ color: 'var(--ink-2)' }} />
            <p className="label mb-4">No orders yet.</p>
            <Link to="/shop" className="text-link">Shop new pieces</Link>
          </div>
        ) : (
          <div className="space-y-0">
            {orders.map((order, idx) => (
              <div key={order.id} className={`py-6 ${idx !== orders.length - 1 ? 'hairline-b' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="label-ink">Order {order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="label mt-1">{timeAgo(order.created_at)}</p>
                  </div>
                  <span
                    className="label px-2 py-1"
                    style={
                      order.status === 'paid'
                        ? { background: 'var(--success)', color: 'var(--paper)' }
                        : { background: 'var(--sunken)', color: 'var(--ink-2)' }
                    }
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-3">
                  {order.order_items.map((oi) => (
                    <Link key={oi.id} to={`/item/${oi.item_id}`} className="flex items-center gap-3">
                      {oi.item?.photos?.[0] && (
                        <div className="w-12 h-16 product-media shrink-0 overflow-hidden">
                          <img src={oi.item.photos[0]} alt={oi.item?.name ?? ''} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate text-ink">{oi.item?.name ?? 'Item removed'}</p>
                        <p className="label price mt-0.5">{formatINR(oi.price_inr)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 hairline-t">
                  <span className="label">Total</span>
                  <span className="price font-display text-lg" style={{ fontWeight: 400 }}>{formatINR(order.total_inr)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Details */}
      <section className="mt-12 hairline-t pt-8">
        <h2 className="font-display text-xl mb-6" style={{ fontWeight: 400 }}>Details</h2>
        <div className="space-y-4 max-w-[400px]">
          <div>
            <label className="label-field">Name</label>
            <input type="text" value={displayName} readOnly className="input" style={{ color: 'var(--ink-2)' }} />
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input type="text" value={phone} readOnly className="input" style={{ color: 'var(--ink-2)' }} />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input type="text" value={email} readOnly className="input" style={{ color: 'var(--ink-2)' }} />
          </div>
        </div>
      </section>

      {/* Sign out */}
      <section className="mt-12 hairline-t pt-8">
        <button
          onClick={() => { signOut(); navigate('/'); }}
          className="text-sm underline"
          style={{ color: 'var(--ink-2)' }}
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
