import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        </Routes>
      </main>
      <Footer className={isKachiGhani ? "mt-0" : "mt-20"} />
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
