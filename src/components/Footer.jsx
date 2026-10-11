import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ className = "mt-20" }) => {
    return (
        <footer id="footer" className={`bg-brand-dark text-white pt-16 sm:pt-24 pb-12 rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden w-full max-w-full ${className}`}>
            <div className="container mx-auto px-5 sm:px-6 max-w-full">
                <div className="flex flex-col lg:flex-row justify-between items-start mb-16 sm:mb-20 gap-12">
                    <div className="max-w-md w-full">
                        <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-6 sm:mb-8">
                            PARITY<span className="text-brand-gold">.</span>
                        </h3>
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
                            Elevating your culinary experience with purity and tradition. B Forever Foods Pvt Ltd - Since 1980s.
                        </p>
                        <div className="flex space-x-5">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-dark transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 w-full lg:w-auto">
                        <div>
                            <h4 className="text-brand-gold font-bold uppercase tracking-widest mb-6 sm:mb-8 text-xs sm:text-sm">Explore</h4>
                            <ul className="space-y-3.5 sm:space-y-4">
                            {['Home', 'Our Story', 'Products', 'Kachi Ghani Oil', 'Contact'].map((item) => {
                                    const links = {
                                        'Home': '/',
                                        'Our Story': '/about',
                                        'Products': '/shop',
                                        'Kachi Ghani Oil': '/parity-kachi-ghani-mustard-oil',
                                        'Contact': '/contact'
                                    };
                                    return (
                                        <li key={item}>
                                            <Link to={links[item] || '#'} className="text-gray-400 hover:text-white transition-colors flex items-center group text-sm sm:text-base">
                                                {item}
                                                <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-brand-gold font-bold uppercase tracking-widest mb-6 sm:mb-8 text-xs sm:text-sm">Contact</h4>
                            <ul className="space-y-4 sm:space-y-6">
                                <li className="flex items-start">
                                    <MapPin size={18} className="text-brand-gold mr-3 mt-1 flex-shrink-0" />
                                    <span className="text-gray-400 text-sm sm:text-base leading-snug">Industrial Area Morena,<br />Madhya Pradesh, India</span>
                                </li>
                                <li className="flex items-center">
                                    <Phone size={18} className="text-brand-gold mr-3 flex-shrink-0" />
                                    <span className="text-gray-400 text-sm sm:text-base">+91 91115 12398</span>
                                </li>
                                <li className="flex items-center">
                                    <Mail size={18} className="text-brand-gold mr-3 flex-shrink-0" />
                                    <span className="text-gray-400 text-sm sm:text-base break-all">info@bforeverfoods.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 sm:pt-10 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs sm:text-sm gap-4">
                    <p>&copy; {new Date().getFullYear()} B Forever Foods Pvt Ltd.</p>
                    <div className="flex space-x-6 sm:space-x-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
