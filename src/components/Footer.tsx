import { Link } from '@/router/Router';
import { Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display text-2xl mb-3" style={{ fontWeight: 400 }}>Onepiece</h3>
            <p className="font-body text-sm text-ivory/50 leading-relaxed">
              One of one. Never restocked. Thrifted streetwear, resold with intent.
            </p>
          </div>

          <div>
            <h4 className="label-quiet text-ivory/40 mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/shop" className="font-body text-sm text-ivory/70 hover:text-brass-light transition-colors">
                  Shop the drop
                </Link>
              </li>
              <li>
                <Link to="/sell" className="font-body text-sm text-ivory/70 hover:text-brass-light transition-colors">
                  Sell to us
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-body text-sm text-ivory/70 hover:text-brass-light transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/account" className="font-body text-sm text-ivory/70 hover:text-brass-light transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="label-quiet text-ivory/40 mb-4">Contact</h4>
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="flex items-center gap-2 font-body text-sm text-ivory/70 hover:text-brass-light transition-colors"
              >
                <Instagram size={16} />
                @onepiece
              </a>
              <a
                href="mailto:hey@onepiece.in"
                className="flex items-center gap-2 font-body text-sm text-ivory/70 hover:text-brass-light transition-colors"
              >
                <Mail size={16} />
                hey@onepiece.in
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ivory/10">
          <p className="label-quiet text-ivory/30">
            © {new Date().getFullYear()} Onepiece. All items one-of-one. No restocks, no exceptions.
          </p>
        </div>
      </div>
    </footer>
  );
}
