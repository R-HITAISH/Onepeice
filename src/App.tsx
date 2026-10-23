import { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { RouterProvider, useRouter } from '@/router/Router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BagSheet } from '@/components/BagSheet';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { BagPage } from '@/pages/BagPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { SellPage } from '@/pages/SellPage';
import { AboutPage } from '@/pages/AboutPage';
import { AuthPage } from '@/pages/AuthPage';
import { AccountPage } from '@/pages/AccountPage';
import { TermsPage } from '@/pages/legal/TermsPage';
import { PrivacyPage } from '@/pages/legal/PrivacyPage';
import { RefundShippingPage } from '@/pages/legal/RefundShippingPage';

function Routes() {
  const { path } = useRouter();
  const [bagOpen, setBagOpen] = useState(false);

  let page;
  if (path === '/') page = <HomePage />;
  else if (path === '/shop') page = <ShopPage />;
  else if (path.startsWith('/item/')) page = <ProductPage itemId={path.split('/item/')[1]} />;
  else if (path === '/bag' || path === '/cart') page = <BagPage />;
  else if (path === '/checkout') page = <CheckoutPage />;
  else if (path === '/sell') page = <SellPage />;
  else if (path === '/about') page = <AboutPage />;
  else if (path === '/auth') page = <AuthPage />;
  else if (path === '/account') page = <AccountPage />;
  else if (path === '/terms') page = <TermsPage />;
  else if (path === '/privacy') page = <PrivacyPage />;
  else if (path === '/refund-shipping') page = <RefundShippingPage />;
  else page = <HomePage />;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--paper)' }}>
      <Navbar onBagClick={() => setBagOpen(true)} />
      <main key={path} className="page-in flex-1">{page}</main>
      <Footer />
      <BagSheet open={bagOpen} onClose={() => setBagOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
