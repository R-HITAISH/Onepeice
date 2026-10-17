import { Link, useRouter } from '@/router/Router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';

export function Navbar() {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { path, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 150);
      return () => clearTimeout(t);
    }
  }, [itemCount]);

  const navItems = [
    { label: 'Shop', to: '/shop' },
    { label: 'Sell to us', to: '/sell' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ink border-b-2 border-brass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center">
              <Logo height={50} />
            </Link>
            <nav className="hidden md:flex items-center gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="nav-link font-body text-xs font-semibold text-ivory uppercase tracking-wider hover:text-brass transition-colors"
                  aria-current={path === item.to ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to={user ? '/account' : '/auth'}
              className="hidden sm:flex items-center gap-1.5 font-body text-xs font-semibold text-ivory uppercase tracking-wider hover:text-brass transition-colors"
            >
              <User size={16} />
              {user ? 'Account' : 'Sign in'}
            </Link>
            {user && (
              <button
                onClick={() => signOut()}
                className="hidden sm:flex items-center gap-1.5 font-body text-xs font-semibold text-ivory uppercase tracking-wider hover:text-brass transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 text-brass hover:text-brass-hover transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className={`cart-badge absolute -top-2 -right-2 bg-brass text-ink text-[10px] font-bold w-4 h-4 flex items-center justify-center ${bump ? 'bump' : ''}`}>
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-ivory"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-ink border-b border-grey-dark animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block font-body text-xs font-semibold text-ivory uppercase tracking-wider hover:text-brass"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={user ? '/account' : '/auth'}
              onClick={() => setMobileOpen(false)}
              className="block font-body text-xs font-semibold text-ivory uppercase tracking-wider hover:text-brass"
            >
              {user ? 'Account' : 'Sign in'}
            </Link>
            {user && (
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                  navigate('/');
                }}
                className="block font-body text-xs font-semibold text-ivory uppercase tracking-wider hover:text-brass"
              >
                Sign out
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
