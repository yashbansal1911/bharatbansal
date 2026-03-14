import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { setIsCartOpen, cart } = useCart();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Our Story', path: '/about' },
        { name: 'Why Us', path: '/why-us' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleLinkClick = (e, path) => {
        if (path.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(path);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else if (path.includes('#')) {
            if (location.pathname === '/' && path.startsWith('/#')) {
                e.preventDefault();
                const id = path.split('#')[1];
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'
                }`}
        >
            <div className="container mx-auto px-6">
                <div
                    className={`rounded-full px-8 py-3 flex justify-between items-center transition-all duration-500 ${isScrolled
                        ? 'bg-white/90 backdrop-blur-xl shadow-lg border border-white/20'
                        : 'bg-white/80 backdrop-blur-md shadow-sm'
                        }`}
                >
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <img src="/images/parity-icon-transparent.png" alt="Icon" className="h-16 w-auto mr-3" />
                        <img src="/images/parity-text-logo.png" alt="PARITY" className="h-10 w-auto" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(e) => handleLinkClick(e, link.path)}
                                className="text-brand-dark font-bold text-sm tracking-widest uppercase hover:text-brand-gold transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-brand-dark hover:text-brand-gold transition-colors"
                            >
                                <ShoppingBag size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-brand-green text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            <Link
                                to="/shop"
                                className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-gold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative text-brand-dark"
                        >
                            <ShoppingBag size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="text-brand-dark"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full px-6 pt-2"
                    >
                        <div className="bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col space-y-6 border border-gray-100">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-xl font-serif font-bold text-brand-dark hover:text-brand-gold"
                                    onClick={(e) => {
                                        handleLinkClick(e, link.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/shop"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="bg-brand-dark text-white px-6 py-4 rounded-xl font-bold w-full text-center"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
