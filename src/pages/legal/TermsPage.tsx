import { Link } from '@/router/Router';
import { ArrowLeft } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="page" style={{ paddingTop: 'clamp(2.5rem,5vw,5rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ink-2)' }}>
        <ArrowLeft size={15} />
        Back to shop
      </Link>

      <div className="max-w-[680px]">
        <p className="label mb-3">Last updated: 26 September 2026</p>
        <h1 style={{ fontWeight: 400 }} className="mb-10">Terms of Service</h1>

        <div className="space-y-8" style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--ink)' }}>
          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>1. Acceptance of Terms</h2>
            <p>
              By accessing or using ONEPIECE (the "Platform"), you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, please do not use the Platform. ONEPIECE operates
              as a resale platform for one-of-one thrifted and secondhand streetwear. Every item listed is a
              single, unique physical unit. Once an item is sold, it is permanently removed from circulation
              and is never restocked or reproduced.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>2. User Account Requirements</h2>
            <p className="mb-3">
              To purchase items or submit items for sale, you must create an account. By creating an account, you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You are at least 18 years of age.</li>
              <li>You provide accurate and complete information, including a valid Indian mobile number for OTP verification.</li>
              <li>You are legally capable of entering into binding contracts under Indian law.</li>
              <li>You will maintain the security of your account and promptly notify us of any unauthorized use.</li>
            </ul>
            <p className="mt-3">
              You may also sign in using Google OAuth as an alternative to mobile OTP authentication. The same
              account requirements apply regardless of the authentication method chosen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>3. Cart Reservation System</h2>
            <p className="mb-3">
              When you add an item to your bag, ONEPIECE places a 10-minute reservation ("lock") on that item.
              During this lock period:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>No other user can purchase or reserve the locked item.</li>
              <li>The lock is tied to your browsing session and device.</li>
              <li>If you do not complete checkout within 10 minutes, the lock expires automatically and the item returns to available stock.</li>
              <li>You may release a lock manually by removing the item from your bag.</li>
            </ul>
            <p className="mt-3">
              ONEPIECE does not guarantee that an item will remain available after a lock expires. Another user
              may reserve or purchase the item immediately after your lock lapses.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>4. Purchasing and Payment</h2>
            <p className="mb-3">
              All prices are listed in Indian Rupees (INR). Payments are processed through Razorpay, a PCI-DSS
              compliant payment gateway. ONEPIECE does not store your card, UPI, or banking details on its
              servers. By completing a purchase, you:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Authorize Razorpay to charge the total amount shown at checkout.</li>
              <li>Acknowledge that the item is one-of-one and cannot be exchanged for a different size or variant.</li>
              <li>Understand that once payment is verified, the item is marked as sold permanently.</li>
            </ul>
            <p className="mt-3">
              If a payment fails or is interrupted, the lock on the item remains active until it expires or you
              complete checkout. No charge is applied for failed transactions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>5. Returns and Refunds</h2>
            <p className="mb-3">
              We offer a 7-day return window from the date of delivery. The following conditions apply:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Refundable:</strong> Items that arrive damaged, are the wrong item, or do not match the description or condition grade listed on the Platform.</li>
              <li><strong>Non-refundable:</strong> Change of mind, items that no longer fit, or items damaged by the buyer after delivery.</li>
              <li>Returns must be initiated within 7 days of delivery by contacting support@onepeice.in with your order reference and photos of the issue.</li>
              <li>Approved refunds are processed to the original payment method within 5-7 business days.</li>
            </ul>
            <p className="mt-3">
              For full details, please refer to our Refund &amp; Shipping Policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>6. Seller Obligations</h2>
            <p className="mb-3">
              If you submit an item for sale through our sell form, you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You own the item outright and have the right to sell it.</li>
              <li>The item is not counterfeit, stolen, or subject to any legal dispute.</li>
              <li>You have disclosed all defects, damage, and wear honestly in your submission.</li>
              <li>You agree to ONEPIECE's pricing and commission structure, if your submission is approved.</li>
            </ul>
            <p className="mt-3">
              ONEPIECE reserves the right to reject any submission without explanation. Approved submissions
              are inspected in person before listing. If the item does not match the submitted description,
              it may be returned to the seller at the seller's expense.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>7. Dispute Resolution</h2>
            <p className="mb-3">
              If you have a dispute regarding a purchase or sale, please first contact us at support@onepeice.in
              within 3 days of the issue arising. We will attempt to resolve the matter directly. If the dispute
              cannot be resolved within 14 days of your initial contact, the matter shall be referred to
              arbitration in Bengaluru, India, under the Arbitration and Conciliation Act, 1996. The arbitral
              tribunal shall consist of a sole arbitrator appointed by mutual consent. The language of the
              arbitration shall be English.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>8. Limitation of Liability</h2>
            <p>
              ONEPIECE shall not be liable for indirect, incidental, or consequential damages arising from your
              use of the Platform. Our total liability for any claim shall not exceed the amount you paid for
              the specific item that is the subject of the dispute.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. The courts at Bengaluru shall have exclusive
              jurisdiction over any matters not resolved through arbitration.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>10. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Platform after changes are posted
              constitutes acceptance of the revised Terms. The "Last updated" date at the top of this page
              indicates when the Terms were last revised.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-3 pt-6 hairline-t" style={{ fontWeight: 400 }}>11. Contact</h2>
            <p>
              For any questions about these Terms, email us at support@onepeice.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
