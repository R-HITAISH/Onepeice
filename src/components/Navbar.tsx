import { Link, useRouter } from '@/router/Router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';

export function Navbar({ onBagClick }: { onBagClick: () => void }) {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { path, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 150);
      return () => clearTimeout(t);
    }
  }, [itemCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Shop', to: '/shop' },
    { label: 'Sell to us', to: '/sell' },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="nav-bar sticky top-0 z-50" data-scrolled={scrolled}>
        <div className="max-w-[1280px] mx-auto px-[clamp(1.25rem,4vw,3rem)]">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-8 md:gap-12">
              <Link to="/" className="flex items-center">
                <Logo height={36} />
              </Link>
              <nav className="hidden md:flex items-center gap-7">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="nav-link"
                    aria-current={path === item.to ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4 md:gap-5">
              <Link
                to={user ? '/account' : '/auth'}
                className="flex items-center gap-1.5 nav-link"
                aria-current={path === (user ? '/account' : '/auth') ? 'page' : undefined}
              >
                <User size={16} />
                <span className="hidden sm:inline">Account</span>
              </Link>

              <button
                onClick={onBagClick}
                className="relative flex items-center gap-1.5 nav-link"
                aria-label="Open bag"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Bag</span>
                {itemCount > 0 && (
                  <span className={`cart-badge absolute -top-2 -right-2 bg-brass text-paper text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${bump ? 'bump' : ''}`}>
                    {itemCount}
                  </span>
                )}
              </button>

              {user && (
                <button
                  onClick={() => signOut()}
                  className="hidden md:flex items-center nav-link"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              )}

              <button
                className="md:hidden flex items-center text-ink"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav sheet */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-paper" style={{ paddingTop: '64px' }}>
          <nav className="px-[clamp(1.25rem,4vw,3rem)] py-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className="block py-4 text-2xl font-display text-ink border-b border-[color:var(--hairline)]"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => { signOut(); closeMobile(); navigate('/'); }}
                className="block w-full text-left py-4 text-2xl font-display text-ink border-b border-[color:var(--hairline)]"
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
