import { Link } from '@/router/Router';
import { ArrowLeft } from 'lucide-react';

export function RefundShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-body text-sm text-muted hover:text-brass mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to home
      </Link>

      <p className="label-quiet mb-3">Last updated: 26 September 2026</p>
      <h1 className="font-display text-4xl md:text-5xl mb-10" style={{ fontWeight: 300 }}>
        Refund &amp; Shipping Policy
      </h1>

      <div className="space-y-10 font-body text-sm leading-relaxed text-ink/75">
        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>1. Shipping Partners</h2>
          <p>
            We ship across India using Shiprocket and Delhivery. The carrier is selected automatically based
            on your delivery pincode to ensure the fastest and most reliable service. All shipments are
            tracked end-to-end.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>2. Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Metro cities:</strong> 2-3 business days from dispatch.</li>
            <li><strong>Tier 2 cities:</strong> 3-5 business days from dispatch.</li>
            <li><strong>Tier 3 and remote areas:</strong> 5-7 business days from dispatch.</li>
          </ul>
          <p className="mt-3">
            Orders are dispatched within 24 hours of payment verification. You will receive a tracking link
            via SMS and email within 24 hours of dispatch. Delivery timelines are estimates and may vary
            due to weather, public holidays, or carrier delays.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>3. Return Eligibility</h2>
          <p className="mb-3">
            We accept returns within <strong>7 days from the date of delivery</strong>. To be eligible for a
            return, the following conditions must be met:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The item must be in the same condition as received — unworn, with original tags if any were included.</li>
            <li>You must contact support@onepeice.in within 7 days of delivery with your order reference and a description of the issue.</li>
            <li>Photos of the item showing the damage or discrepancy must be provided.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>4. Refundable Scenarios</h2>
          <p className="mb-3">The following are eligible for a full refund or replacement (if available):</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Damaged in transit:</strong> Item arrives with damage that was not present in the listing photos or description.</li>
            <li><strong>Wrong item:</strong> You received a different item than the one you ordered.</li>
            <li><strong>Does not match description:</strong> The condition grade or specifications differ materially from what was listed on the Platform.</li>
          </ul>
          <p className="mt-3">
            Since every item is one-of-one, replacements are only possible if the same item is still available
            (which is unlikely). In most cases, approved returns result in a full refund to the original
            payment method within 5-7 business days of us receiving the returned item.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>5. Non-Refundable Scenarios</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Change of mind:</strong> Deciding you no longer want the item or it does not fit your style.</li>
            <li><strong>Sizing issues:</strong> The item does not fit as expected. We provide measurements and condition descriptions for every item — please review them carefully before purchasing.</li>
            <li><strong>Buyer damage:</strong> Damage caused by the buyer after delivery, including washing, alteration, or wear.</li>
            <li><strong>After 7 days:</strong> Returns requested after the 7-day window from delivery are not accepted.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>6. Return Shipping Costs</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>ONEPIECE error:</strong> If the return is due to our mistake (wrong item, damaged, or misdescribed), return shipping is free. We will arrange a pickup at no cost to you.</li>
            <li><strong>Buyer remorse:</strong> If you are returning due to change of mind or sizing, return shipping costs are borne by the buyer. The original shipping fee is non-refundable.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>7. Dispute Escalation Process</h2>
          <p className="mb-3">
            If you are unsatisfied with your order or our response, follow this escalation process:
          </p>
          <ul className="list-decimal pl-5 space-y-1.5">
            <li><strong>Direct contact (3 days):</strong> Email support@onepeice.in with your order reference and issue. We will respond within 48 hours and attempt to resolve the matter directly.</li>
            <li><strong>ONEPIECE review:</strong> If the matter is not resolved in the first 3 days, it is escalated to our operations lead for a final review. You will receive a decision within 5 business days.</li>
            <li><strong>Final decision:</strong> ONEPIECE's decision after the review is final. For matters that remain unresolved, arbitration provisions in our Terms of Service apply.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>8. Shipping Restrictions</h2>
          <p>
            We currently ship only within India. We do not offer international shipping. Cash on Delivery (COD)
            is not available; all payments must be completed online via Razorpay at checkout.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>9. Contact</h2>
          <p>
            For returns, refunds, or shipping questions, email support@onepeice.in. Support hours are
            Monday to Friday, 10 AM to 6 PM IST. We aim to respond to all queries within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
