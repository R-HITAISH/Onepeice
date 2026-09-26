import { Link } from '@/router/Router';
import { ArrowLeft } from 'lucide-react';

export function PrivacyPage() {
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
        Privacy Policy
      </h1>

      <div className="space-y-10 font-body text-sm leading-relaxed text-ink/75">
        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>1. Information We Collect</h2>
          <p className="mb-3"><strong>Personal information you provide directly:</strong></p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Phone number:</strong> Used for OTP-based authentication. We send a one-time password via SMS to verify your number.</li>
            <li><strong>Email address:</strong> Collected if you sign in with Google, or if you provide it when submitting an item for sale.</li>
            <li><strong>Shipping address:</strong> Name, address, city, state, pincode, and phone number, collected at checkout for order fulfillment.</li>
            <li><strong>Payment data:</strong> Processed entirely by Razorpay. We do not store card numbers, UPI IDs, or banking credentials. We retain only the Razorpay order ID and payment ID for record-keeping.</li>
            <li><strong>Sell submission data:</strong> Your name, email, phone, item category, size, condition, asking price, and uploaded photos.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>2. Automatic Data Collection</h2>
          <p className="mb-3">When you visit the Platform, we automatically collect:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Usage data:</strong> Pages visited, time spent, items viewed, and actions taken (add to bag, checkout initiated).</li>
            <li><strong>Device data:</strong> Browser type, operating system, screen resolution, and IP address.</li>
            <li><strong>Cookies:</strong> Session cookies for authentication and cart functionality. See Section 7 for details.</li>
            <li><strong>Analytics data:</strong> Aggregate and anonymized usage statistics to understand how the Platform is used.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To process and fulfill your orders, including shipping and delivery.</li>
            <li>To authenticate your account via OTP or Google Sign-In.</li>
            <li>To communicate with you about orders, returns, and account matters.</li>
            <li>To review and respond to sell submissions.</li>
            <li>To analyze Platform usage and improve our service.</li>
            <li>To comply with legal obligations under Indian law.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>4. Data Storage and Security</h2>
          <p className="mb-3">
            Your data is stored with Supabase, our database provider, which uses industry-standard encryption
            and access controls. Authentication data (phone numbers, session tokens) is managed through
            Supabase Auth. Payment data is handled exclusively by Razorpay, which is PCI-DSS Level 1
            certified. We do not have access to your raw payment instrument details at any point.
          </p>
          <p>
            Access to personal data within ONEPIECE is restricted to authorized personnel who require it for
            order fulfillment and support. We use row-level security policies to ensure that users can only
            access their own order and account data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>5. Third-Party Sharing</h2>
          <p className="mb-3">We share data with the following service providers strictly for operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Razorpay:</strong> Payment processing. Receives your payment amount and order reference. Does not receive your browsing data.</li>
            <li><strong>Shiprocket / Delhivery:</strong> Order fulfillment and delivery. Receive your shipping address, phone number, and order details.</li>
            <li><strong>Google Analytics:</strong> Aggregate, anonymized usage statistics. Does not receive your name, phone, or payment data.</li>
            <li><strong>Supabase:</strong> Database and authentication infrastructure. Stores your account and order data.</li>
          </ul>
          <p className="mt-3">
            <strong>We do not sell, rent, or trade your personal data to any third party.</strong> We do not
            share your data for advertising purposes. Service providers are bound by contractual obligations
            to protect your data and use it only for the purposes we specify.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>6. Your Rights</h2>
          <p className="mb-3">Under applicable Indian data protection regulations, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data, subject to legal retention requirements for order records.</li>
            <li><strong>Opt-out:</strong> Opt out of analytics tracking and marketing communications at any time.</li>
            <li><strong>Data portability:</strong> Receive your data in a structured, machine-readable format.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email support@onepeice.in. We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>7. Cookies and Tracking</h2>
          <p className="mb-3">We use the following categories of cookies and tracking technologies:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Essential cookies:</strong> Required for authentication, cart functionality, and session management. Cannot be disabled.</li>
            <li><strong>Analytics cookies:</strong> Used by Google Analytics to collect anonymized usage data. You can opt out via browser settings or the Google Analytics opt-out browser add-on.</li>
            <li><strong>Marketing cookies:</strong> We do not currently use marketing or advertising cookies. If we do in the future, we will update this policy and seek your consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>8. Google Sign-In Data Handling</h2>
          <p>
            If you choose to sign in with Google, we receive your Google account email address and basic
            profile information (name, profile picture URL) through Google's OAuth 2.0 API. We use this
            information solely for account identification. We do not access your Google contacts, Gmail,
            Google Drive, or any other Google services. You can revoke ONEPIECE's access to your Google
            account at any time through your Google Account security settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>9. Data Retention</h2>
          <p>
            We retain order records (including shipping address and payment references) for 7 years as
            required by Indian tax and accounting regulations. Account data is retained until you request
            deletion. Sell submission photos are retained for 90 days after a decision is made, then deleted.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl mb-3 text-ink" style={{ fontWeight: 400 }}>10. Contact</h2>
          <p>
            For privacy questions or to exercise your data rights, email support@onepeice.in.
          </p>
        </section>
      </div>
    </div>
  );
}
