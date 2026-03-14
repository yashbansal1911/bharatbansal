import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="footer" className="bg-brand-dark text-white pt-24 pb-12 rounded-t-[3rem] mt-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20">
                    <div className="max-w-md mb-10 md:mb-0">
                        <h3 className="text-4xl font-serif font-bold mb-8">
                            PARITY<span className="text-brand-gold">.</span>
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Elevating your culinary experience with purity and tradition. B Forever Foods Pvt Ltd - Since 1980s.
                        </p>
                        <div className="flex space-x-6">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-dark transition-all">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-16 md:gap-24">
                        <div>
                            <h4 className="text-brand-gold font-bold uppercase tracking-widest mb-8 text-sm">Explore</h4>
                            <ul className="space-y-4">
                                {['Home', 'Our Story', 'Products', 'Contact'].map((item) => {
                                    const links = {
                                        'Home': '/',
                                        'Our Story': '/about',
                                        'Products': '/shop',
                                        'Contact': '/contact'
                                    };
                                    return (
                                        <li key={item}>
                                            <Link to={links[item] || '#'} className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                                {item}
                                                <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-brand-gold font-bold uppercase tracking-widest mb-8 text-sm">Contact</h4>
                            <ul className="space-y-6">
                                <li className="flex items-start">
                                    <MapPin size={20} className="text-brand-gold mr-4 mt-1 flex-shrink-0" />
                                    <span className="text-gray-400">Industrial Area Morena,<br />Madhya Pradesh, India</span>
                                </li>
                                <li className="flex items-center">
                                    <Phone size={20} className="text-brand-gold mr-4 flex-shrink-0" />
                                    <span className="text-gray-400">+91 91115 12398</span>
                                </li>
                                <li className="flex items-center">
                                    <Mail size={20} className="text-brand-gold mr-4 flex-shrink-0" />
                                    <span className="text-gray-400">info@bforeverfoods.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} B Forever Foods Pvt Ltd.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
