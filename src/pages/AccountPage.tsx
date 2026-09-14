import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from '@/router/Router';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';
import { formatINR, timeAgo } from '@/lib/utils';
import { Loader2, Package, ShoppingBag } from 'lucide-react';

export function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const { navigate } = useRouter();
  const [orders, setOrders] = useState<(Order & { order_items: (OrderItem & { item: { id: string; name: string; photos: string[] } | null })[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
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
        if (data) setOrders(data as typeof orders);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Loader2 size={28} className="animate-spin text-muted" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <p className="label-quiet mb-2">Account</p>
        <h1 className="font-display text-4xl" style={{ fontWeight: 400 }}>{user.email}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-0 mb-10 border-t border-b border-hairline">
        <div className="py-5 pr-4 border-r border-hairline">
          <p className="label-quiet mb-1">Orders</p>
          <p className="font-display text-2xl" style={{ fontWeight: 400 }}>{orders.length}</p>
        </div>
        <div className="py-5 px-4 border-r border-hairline">
          <p className="label-quiet mb-1">Paid</p>
          <p className="font-display text-2xl" style={{ fontWeight: 400 }}>
            {orders.filter((o) => o.status === 'paid').length}
          </p>
        </div>
        <div className="py-5 pl-4">
          <p className="label-quiet mb-1">Spent</p>
          <p className="font-display text-2xl" style={{ fontWeight: 400 }}>
            {formatINR(orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.total_inr, 0))}
          </p>
        </div>
      </div>

      {/* Order history */}
      <h2 className="font-display text-2xl mb-6" style={{ fontWeight: 400 }}>Order history</h2>

      {loading ? (
        <Loader2 size={22} className="animate-spin text-muted" />
      ) : orders.length === 0 ? (
        <div className="border border-hairline p-10 text-center">
          <Package size={36} className="mx-auto mb-3 text-muted-light" />
          <p className="label-quiet mb-5">No orders yet.</p>
          <Link to="/shop" className="btn btn-dark">
            <ShoppingBag size={15} />
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-0">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className={`py-6 ${idx !== orders.length - 1 ? 'border-b border-hairline' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="label-quiet">
                    Order {order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="label-quiet text-muted-light">{timeAgo(order.created_at)}</p>
                </div>
                <span
                  className={`tag ${
                    order.status === 'paid'
                      ? 'tag-sold'
                      : order.status === 'pending'
                      ? 'tag-dark'
                      : 'tag'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-3">
                {order.order_items.map((oi) => (
                  <Link
                    key={oi.id}
                    to={`/item/${oi.item_id}`}
                    className="flex items-center gap-3 hover:text-brass transition-colors"
                  >
                    {oi.item?.photos?.[0] && (
                      <div className="w-14 h-14 overflow-hidden shrink-0">
                        <img
                          src={oi.item.photos[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm truncate">{oi.item?.name ?? 'Item removed'}</p>
                      <p className="label-quiet">{formatINR(oi.price_inr)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-hairline">
                <span className="label-quiet">Total</span>
                <span className="font-display text-lg" style={{ fontWeight: 400 }}>{formatINR(order.total_inr)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
