import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, Link } from '@/router/Router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';
import { ArrowLeft, Check, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';

type CheckoutStep = 'address' | 'processing' | 'success' | 'failed';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

type FormState = {
  name: string;
  phone: string;
  address: string;
  flat: string;
  city: string;
  state: string;
  pincode: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function CheckoutPage() {
  const { cartItems, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [step, setStep] = useState<CheckoutStep>('address');
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    address: '',
    flat: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const total = cartItems.reduce((sum, ci) => sum + ci.item.price_inr, 0);
  const validItems = cartItems.filter((ci) => new Date(ci.lock.expires_at) > new Date());

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && step !== 'success') {
      navigate('/bag');
    }
  }, [cartLoading, cartItems.length, navigate, step]);

  const validateField = (name: keyof FormState, value: string): string | undefined => {
    const v = value.trim();
    if (!v) {
      if (name === 'flat') return undefined;
      return 'This field is required.';
    }
    if (name === 'pincode' && !/^\d{6}$/.test(v)) return 'Enter a 6-digit pincode.';
    if (name === 'phone' && !/^[6-9]\d{9}$/.test(v.replace(/\D/g, '').replace(/^91/, ''))) return 'Enter a valid 10-digit Indian mobile number.';
    if (name === 'name' && v.length < 2) return 'Enter your full name.';
  };

  const handleBlur = (name: keyof FormState) => {
    const msg = validateField(name, form[name]);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const setField = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const isFormValid = () => {
    const fields: (keyof FormState)[] = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    return fields.every((f) => !validateField(f, form[f]));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      const fields: (keyof FormState)[] = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
      const newErrors: FormErrors = {};
      fields.forEach((f) => { const msg = validateField(f, form[f]); if (msg) newErrors[f] = msg; });
      setErrors(newErrors);
      return;
    }
    setError(null);
    setStep('processing');

    try {
      const orderInsert: Record<string, unknown> = {
        status: 'pending',
        total_inr: total,
        session_id: localStorage.getItem('onepiece_session_id'),
        shipping_name: form.name,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_state: form.state,
        shipping_pincode: form.pincode,
        shipping_phone: form.phone,
      };
      if (user) orderInsert.user_id = user.id;

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (orderErr || !order) throw new Error('Could not create order. Please try again.');

      const orderItemsData = validItems.map((ci) => ({
        order_id: order.id,
        item_id: ci.item.id,
        price_inr: ci.item.price_inr,
      }));

      const { error: oiErr } = await supabase.from('order_items').insert(orderItemsData);
      if (oiErr) throw new Error('Could not save order items.');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const createRes = await fetch(`${supabaseUrl}/functions/v1/razorpay-create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${anonKey}` },
        body: JSON.stringify({ order_id: order.id, amount: total * 100 }),
      });

      if (!createRes.ok) {
        const errBody = await createRes.json().catch(() => ({}));
        throw new Error(errBody.error || 'Could not initiate payment.');
      }

      const razorpayData = await createRes.json();
      const razorpayOrderId = razorpayData.razorpay_order_id;

      await supabase.from('orders').update({ razorpay_order_id: razorpayOrderId }).eq('id', order.id);
      setOrderId(order.id);

      if (!window.Razorpay) throw new Error('Payment gateway not loaded. Check your connection and try again.');

      const rzp = new window.Razorpay({
        key: razorpayData.key_id,
        amount: total * 100,
        currency: 'INR',
        name: 'ONEPIECE',
        description: 'One-of-one streetwear purchase',
        order_id: razorpayOrderId,
        prefill: { name: form.name, contact: form.phone },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${supabaseUrl}/functions/v1/razorpay-verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${anonKey}` },
              body: JSON.stringify({
                order_id: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const errBody = await verifyRes.json().catch(() => ({}));
              throw new Error(errBody.error || 'Payment verification failed.');
            }

            await clearCart();
            setStep('success');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed.');
            setStep('failed');
          }
        },
        modal: {
          ondismiss: () => {
            setStep('address');
            setError('Payment was cancelled. Your items are still in your bag.');
          },
        },
      });

      rzp.on('payment.failed', () => {
        setStep('failed');
        setError('Payment failed. Please try a different method.');
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStep('failed');
    }
  };

  if (cartLoading) {
    return (
      <div className="page py-12">
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--ink-2)' }} />
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="page text-center" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="inline-flex items-center justify-center w-14 h-14 mb-6" style={{ background: 'var(--success)', color: 'var(--paper)' }}>
          <Check size={28} />
        </div>
        <h1 style={{ fontWeight: 400 }} className="mb-3">Thank you. Your piece is yours.</h1>
        {orderId && <p className="label mb-2">Order ref: {orderId.slice(0, 8).toUpperCase()}</p>}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/account" className="btn btn-secondary">Orders</Link>
          <Link to="/shop" className="text-link">Shop new pieces</Link>
        </div>
      </div>
    );
  }

  if (step === 'failed') {
    return (
      <div className="page text-center" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="inline-flex items-center justify-center w-14 h-14 mb-6" style={{ background: 'var(--error)', color: 'var(--paper)' }}>
          <AlertTriangle size={28} />
        </div>
        <h1 style={{ fontWeight: 400 }} className="mb-3">Payment didn't go through.</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-2)' }}>You can try again.</p>
        {error && <p className="text-sm mb-6" style={{ color: 'var(--error)' }}>{error}</p>}
        <div className="flex gap-4 justify-center">
          <button onClick={() => { setStep('address'); setError(null); }} className="btn btn-primary">Try again</button>
          <Link to="/bag" className="btn btn-secondary">Back to bag</Link>
        </div>
      </div>
    );
  }

  const inputCls = 'input';

  return (
    <div className="page" style={{ paddingTop: 'clamp(2.5rem,5vw,5rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
      <Link to="/bag" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ink-2)' }}>
        <ArrowLeft size={15} />
        Back to bag
      </Link>

      <h1 style={{ fontWeight: 400 }} className="mb-10">Checkout</h1>

      <div className="grid md:grid-cols-[1fr_340px] gap-10 lg:gap-16">
        {/* Shipping form */}
        <form onSubmit={handleCheckout} className="space-y-5">
          <h2 className="font-display text-xl mb-4" style={{ fontWeight: 400 }}>Shipping address</h2>

          <div>
            <label className="label-field" htmlFor="co-name">Full name</label>
            <input
              id="co-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={inputCls}
              style={errors.name ? { borderColor: 'var(--error)' } : undefined}
            />
            {errors.name && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.name}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="co-phone">Phone</label>
            <input
              id="co-phone"
              type="tel"
              required
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={inputCls}
              style={errors.phone ? { borderColor: 'var(--error)' } : undefined}
            />
            {errors.phone && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.phone}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="co-address">Address line</label>
            <textarea
              id="co-address"
              required
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              className={inputCls}
              style={{ minHeight: '80px', ...(errors.address ? { borderColor: 'var(--error)' } : {}) }}
            />
            {errors.address && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.address}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="co-flat">Flat or apartment <span style={{ color: 'var(--ink-2)', fontWeight: 400 }}>(optional)</span></label>
            <input
              id="co-flat"
              type="text"
              value={form.flat}
              onChange={(e) => setField('flat', e.target.value)}
              onBlur={() => handleBlur('flat')}
              className={inputCls}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field" htmlFor="co-city">City</label>
              <input
                id="co-city"
                type="text"
                required
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                className={inputCls}
                style={errors.city ? { borderColor: 'var(--error)' } : undefined}
              />
              {errors.city && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.city}</p>}
            </div>
            <div>
              <label className="label-field" htmlFor="co-state">State</label>
              <input
                id="co-state"
                type="text"
                required
                value={form.state}
                onChange={(e) => setField('state', e.target.value)}
                onBlur={() => handleBlur('state')}
                className={inputCls}
                style={errors.state ? { borderColor: 'var(--error)' } : undefined}
              />
              {errors.state && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.state}</p>}
            </div>
          </div>

          <div>
            <label className="label-field" htmlFor="co-pin">Pincode</label>
            <input
              id="co-pin"
              type="text"
              required
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              onBlur={() => handleBlur('pincode')}
              className={inputCls}
              style={errors.pincode ? { borderColor: 'var(--error)' } : undefined}
            />
            {errors.pincode && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.pincode}</p>}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 text-sm" style={{ color: 'var(--error)' }}>
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={step === 'processing' || validItems.length === 0}
            className="btn btn-primary w-full"
          >
            {step === 'processing' ? (
              <><Loader2 size={15} className="animate-spin" /> Processing</>
            ) : (
              <span className="price">Pay {formatINR(total)}</span>
            )}
          </button>

          {validItems.length === 0 && (
            <p className="text-sm text-center" style={{ color: 'var(--error)' }}>
              All items in your bag have expired. Go back and add items again.
            </p>
          )}
        </form>

        {/* Order summary */}
        <div className="md:sticky md:top-24 md:self-start">
          {/* Mobile: collapsible */}
          <button
            className="md:hidden flex items-center justify-between w-full py-4 hairline-t hairline-b"
            onClick={() => setSummaryOpen(!summaryOpen)}
          >
            <span className="label-ink">Order summary</span>
            <span className="flex items-center gap-2">
              <span className="price text-sm">{formatINR(total)}</span>
              <ChevronDown size={16} style={{ transform: summaryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }} />
            </span>
          </button>

          <div className={`hidden md:block ${summaryOpen ? 'block' : 'hidden'}`}>
            <div className="hairline-t hairline-b py-6">
              <p className="label mb-4">Order summary</p>
              <div className="space-y-3">
                {validItems.map((ci) => (
                  <div key={ci.lock.id} className="flex items-start gap-3">
                    <div className="w-12 h-16 product-media shrink-0 overflow-hidden">
                      <img src={ci.item.photos[0] ?? ''} alt={ci.item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-ink">{ci.item.name}</p>
                      <p className="label mt-0.5">Size {ci.item.size}</p>
                    </div>
                    <span className="price text-sm text-ink">{formatINR(ci.item.price_inr)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 mt-4 hairline-t">
                <span className="label-ink">Total</span>
                <span className="price font-display text-lg" style={{ fontWeight: 400 }}>{formatINR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
