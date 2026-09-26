import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WhyUsPage from './pages/WhyUsPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import RecipePage from './pages/RecipePage';
import RecipesPage from './pages/RecipesPage';
import KachniGanuPage from './pages/KachniGanuPage';
import WhatsAppWidget from './components/WhatsAppWidget';

// ScrollToTop component to ensure page starts at top on navigation
const ScrollToTopWrapper = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout = () => {
  const location = useLocation();
  const isKachiGhani = location.pathname === '/parity-kachi-ghani-mustard-oil';

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipePage />} />
          <Route path="/parity-kachi-ghani-mustard-oil" element={<KachniGanuPage />} />
          {/* 301-equivalent redirects — preserve any indexed Morena URLs */}
          <Route path="/mustard-oil-morena" element={<Navigate to="/parity-kachi-ghani-mustard-oil" replace />} />
          <Route path="/mustard-oil-in-morena" element={<Navigate to="/parity-kachi-ghani-mustard-oil" replace />} />
        </Routes>
      </main>
      <Footer className={isKachiGhani ? "mt-0" : "mt-20"} />
      {/* WhatsApp floating widget — renders on every page */}
      <WhatsAppWidget />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        {/* ScrollToTop logic inline or as component */}
        <ScrollToTopWrapper />
        <MainLayout />
      </Router>
    </CartProvider>
  );
}

export default App;
