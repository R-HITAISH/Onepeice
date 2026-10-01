import { Link } from '@/router/Router';
import { Instagram, Mail, Twitter } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-ink border-t-2 border-brass">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
        <div className="flex justify-center mb-5">
          <Logo height={35} />
        </div>

        <p className="font-body text-xs font-semibold text-ivory uppercase tracking-wider mb-2">
          Premium Thrifted Streetwear
        </p>
        <p className="font-body text-[10px] text-grey-medium mb-6">
          &copy; {new Date().getFullYear()} ONEPEICE &middot; Bengaluru, India
        </p>

        <div className="flex justify-center items-center gap-5 mb-4">
          <a
            href="mailto:support@onepeice.in"
            className="font-body text-xs font-semibold text-brass hover:opacity-80 transition-opacity"
          >
            support@onepeice.in
          </a>
        </div>

        <div className="flex justify-center items-center gap-5 mb-4">
          <a
            href="https://instagram.com/onepeice"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-body text-xs font-semibold text-brass hover:opacity-80 transition-opacity"
          >
            <Instagram size={14} />
            Instagram
          </a>
          <a
            href="https://twitter.com/onepeice"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-body text-xs font-semibold text-brass hover:opacity-80 transition-opacity"
          >
            <Twitter size={14} />
            Twitter
          </a>
        </div>

        <div className="flex justify-center items-center gap-5">
          <Link to="/terms" className="font-body text-xs font-semibold text-brass hover:opacity-80 transition-opacity">
            Terms of Service
          </Link>
          <Link to="/privacy" className="font-body text-xs font-semibold text-brass hover:opacity-80 transition-opacity">
            Privacy Policy
          </Link>
          <Link to="/refund-shipping" className="font-body text-xs font-semibold text-brass hover:opacity-80 transition-opacity">
            Refund &amp; Shipping
          </Link>
        </div>
      </div>
    </footer>
  );
}
