import { Link, useRouter } from '@/router/Router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Shop', to: '/shop' },
    { label: 'Sell to us', to: '/sell' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link to="/" className="font-display text-xl text-ink leading-none tracking-tight" style={{ fontWeight: 400 }}>
              Onepiece
            </Link>
            <nav className="hidden md:flex items-center gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="font-body text-sm text-muted hover:text-brass transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to={user ? '/account' : '/auth'}
              className="hidden sm:flex items-center gap-1.5 font-body text-sm text-muted hover:text-brass transition-colors"
            >
              <User size={16} />
              {user ? 'Account' : 'Sign in'}
            </Link>
            {user && (
              <button
                onClick={() => signOut()}
                className="hidden sm:flex items-center gap-1.5 font-body text-sm text-muted hover:text-brass transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 font-body text-sm text-ink hover:text-brass transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brass text-ivory text-[10px] font-medium w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-ink"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-ivory border-b border-hairline animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block font-body text-sm text-muted hover:text-brass"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={user ? '/account' : '/auth'}
              onClick={() => setMobileOpen(false)}
              className="block font-body text-sm text-muted hover:text-brass"
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
                className="block font-body text-sm text-muted hover:text-brass"
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
