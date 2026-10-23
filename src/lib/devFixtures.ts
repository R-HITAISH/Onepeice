import type { Item, CartLock } from '@/lib/supabase';

export type DevDataMode = 'demo' | 'worst' | 'empty' | 'one' | '300';

export function getDevMode(): DevDataMode | null {
  if (!import.meta.env.DEV) return null;
  const params = new URLSearchParams(window.location.search);
  const val = params.get('data');
  if (val === 'demo' || val === 'worst' || val === 'empty' || val === 'one' || val === '300') return val;
  return 'demo';
}

const longName = 'Vintage 1990s Levi\u2019s 501 Denim Trucker Jacket, Faded Wash, Oversized Fit, Distressed Hem';
const shortName = 'Tee';
const nonLatinName = '\u092A\u0941\u0930\u093E\u0928\u0940 \u0921\u0947\u0928\u092E \u091C\u0948\u0915\u0947\u091F';
const emojiName = 'Oversized Tee \u{1F5A4} Black';
const longBrand = 'Ralph Lauren Polo Sport Vintage';
const longSize = 'XXXL / 2XL (EU 58)';
const longCondition = 'Good condition with a small ink stain on the left sleeve near the cuff. There is a repaired tear on the back right shoulder, sewn with matching thread. Overall fading is consistent with age.';
const longDesc = 'A truly exceptional piece of vintage Americana. This jacket has lived a full life and shows it beautifully. The denim has faded to a soft blue with characteristic whiskering at the hips and lap. The hem is distressed with fraying that follows the natural wear lines. Two chest pockets with button flaps, two hand-warmer pockets at the waist. Button-front closure with all original buttons present and functional. The leather Levi\u2019s patch on the back waistband is cracked but legible. Made in the USA. This is a collector-grade example of 1990s production. Pit to pit: 24in, Length: 28in, Shoulder: 19in, Sleeve: 25in. Tagged size Large but fits oversized, true to the era.';

const brokenImg = 'https://images.pexels.com/photos/nonexistent-broken-url.jpg';
const realImg = 'https://images.pexels.com/photos/5675657/pexels-photo-5675657.jpeg?auto=compress&cs=tinysrgb&w=800';

export const worstCaseItems: Item[] = [
  { id: 'w1', name: longName, category: 'jackets', size: longSize, condition: 'good condition', price_inr: 149999, description: longDesc, photos: [realImg, brokenImg, realImg, realImg, realImg, realImg, realImg, realImg, realImg, realImg, realImg, realImg], status: 'available', brand: longBrand, measurements: 'Pit to pit: 24in, Length: 28in, Shoulder: 19in, Sleeve: 25in', created_at: new Date().toISOString() },
  { id: 'w2', name: shortName, category: 'tshirts', size: 'S', condition: 'like new', price_inr: 800, description: 'Plain white tee.', photos: [realImg], status: 'available', brand: 'Uniqlo', measurements: 'Pit to pit: 18in', created_at: new Date().toISOString() },
  { id: 'w3', name: nonLatinName, category: 'jackets', size: 'M', condition: 'well worn', price_inr: 3200, description: '\u0913\u0930\u093F\u091C\u093F\u0928\u0932 \u0921\u0947\u0928\u092E \u091C\u0948\u0915\u0947\u091F\u0964', photos: [realImg], status: 'available', brand: null, measurements: null, created_at: new Date().toISOString() },
  { id: 'w4', name: emojiName, category: 'tshirts', size: 'L', condition: 'good condition', price_inr: 1800, description: 'Black oversized tee.', photos: [], status: 'available', brand: 'Unknown', measurements: 'Pit to pit: 23in', created_at: new Date().toISOString() },
  { id: 'w5', name: 'Sold Piece Example With A Reasonably Long Name', category: 'shirts', size: 'M', condition: 'good condition', price_inr: 2500, description: 'This one is sold.', photos: [realImg], status: 'sold', brand: 'Nike', measurements: 'Pit to pit: 22in', created_at: new Date().toISOString() },
  { id: 'w6', name: 'Reserved by another shopper', category: 'shoes', size: 'US 10', condition: 'like new', price_inr: 9500, description: 'Reserved item.', photos: [realImg], status: 'locked', brand: 'New Balance', measurements: 'US 10', created_at: new Date().toISOString() },
];

export const singleItem: Item[] = [
  worstCaseItems[0],
];

export const emptyItems: Item[] = [];

export function generate300Items(): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < 300; i++) {
    items.push({
      id: `gen-${i}`,
      name: i % 7 === 0 ? longName : i % 5 === 0 ? shortName : `Vintage Piece ${i + 1}`,
      category: (['jackets', 'shirts', 'tshirts', 'pants', 'shoes', 'accessories'] as const)[i % 6],
      size: (['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'] as const)[i % 7],
      condition: (['like new', 'good condition', 'well worn'] as const)[i % 3],
      price_inr: 800 + (i * 137) % 14200,
      description: i % 3 === 0 ? longDesc : 'A nice piece.',
      photos: [realImg],
      status: 'available',
      brand: i % 4 === 0 ? longBrand : `Brand ${i}`,
      measurements: 'Pit to pit: 22in',
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
    });
  }
  return items;
}

// Worst-case cart lock
export const worstCaseLock: CartLock = {
  id: 'lock-w1',
  item_id: 'w1',
  session_id: 'dev-session',
  status: 'active',
  locked_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
};

export const worstCaseCheckoutForm = {
  name: 'Aleksandra Wi\u015Bniewska-Kowalczyk',
  email: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
  phone: '07829 294 422',
  address: 'Flat 4B, Sai Krupa Apartments, Opposite Reva University Gate 2, 3rd Cross, Kattigenahalli, Bengaluru, Karnataka 560064',
  flat: 'Flat 4B, Sai Krupa Apartments, Opposite Reva University Gate 2',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560064',
};

export const worstCaseSellForm = {
  submitter_name: 'Aleksandra Wi\u015Bniewska-Kowalczyk',
  submitter_email: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
  submitter_phone: '07829 294 422',
  category: 'jackets',
  size: 'XXXL / 2XL (EU 58)',
  condition: longCondition,
  asking_price_inr: '149999',
};
