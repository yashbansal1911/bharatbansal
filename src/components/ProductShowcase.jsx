import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Leaf, Droplets, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const features = [
    { icon: Leaf, label: 'Double Filtered' },
    { icon: Droplets, label: 'Omega 3 & 6 (PUFA)' },
    { icon: Award, label: 'Zero Preservatives' },
];

const ProductShowcase = () => {
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);

    const handleAdd = (product) => {
        addToCart({ ...product });
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1800);
    };

    return (
        <section id="products" className="py-32 bg-white relative overflow-hidden">
            {/* Subtle background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
                style={{ background: 'radial-gradient(circle, #c8960c 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
                style={{ background: 'radial-gradient(circle, #2d4a1e 0%, transparent 70%)' }} />

            <div className="container mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-20">
                    <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Our Products</h3>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark leading-tight mb-6">
                        Pure Mustard Oil, <br />Cold-Pressed
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-lg">
                        One oil, two sizes. Choose the pack that fits your kitchen.
                    </p>
                </div>

                {/* Feature Pills */}
                <div className="flex justify-center gap-4 flex-wrap mb-16">
                    {features.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 bg-brand-light border border-gray-100 px-5 py-2 rounded-full text-sm font-bold text-brand-dark">
                            <Icon size={14} className="text-brand-gold" />
                            {label}
                        </div>
                    ))}
                </div>

                {/* Bottles showcase — side by side with natural size difference */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-center gap-10 md:gap-12">

                        {/* 500ml card — shorter bottle, smaller card feel */}
                        {products[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="group relative w-full md:w-80 bg-gradient-to-b from-gray-50 to-white rounded-[2rem] border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 z-10"
                            >
                                {/* Size badge */}
                                <div className="absolute top-5 left-5 bg-white border border-gray-200 text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20">
                                    2 Litres
                                </div>

                                {/* Image area — tall enough to show full jar incl. bottom claims */}
                                <div className="relative flex items-center justify-center px-6 pt-10 pb-4" style={{ height: '400px' }}>
                                    <img
                                        src={products[0].image}
                                        alt={products[0].name}
                                        className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-6 pt-2">
                                    <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">{products[0].category}</span>
                                    <h3 className="text-xl font-serif font-bold text-brand-dark mt-1 mb-2">Premium Mustard Oil</h3>
                                    <p className="text-gray-400 text-sm mb-5 leading-relaxed">{products[0].desc}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-brand-green">{products[0].currency}{products[0].price}</span>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAdd(products[0])}
                                            className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-gold transition-colors"
                                        >
                                            {addedId === products[0].id
                                                ? <><Check size={14} /> Added</>
                                                : <><ShoppingBag size={14} /> Add to Cart</>
                                            }
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 1L card — taller bottle, featured/prominent */}
                        {products[1] && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.15 }}
                                className="group relative w-full md:w-96 bg-gradient-to-b from-amber-50 to-white rounded-[2rem] border-2 border-brand-gold shadow-xl hover:shadow-2xl transition-all duration-500 z-20"
                            >
                                {/* Best value badge */}
                                <div className="absolute top-5 left-5 bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20">
                                    Best Value
                                </div>
                                <div className="absolute top-5 right-5 bg-white border border-gray-200 text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20">
                                    5 Litres
                                </div>

                                {/* Image area — tall enough to show full jar incl. bottom claims */}
                                <div className="relative flex items-center justify-center px-6 pt-10 pb-4" style={{ height: '480px' }}>
                                    <img
                                        src={products[1].image}
                                        alt={products[1].name}
                                        className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-6 pt-2">
                                    <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">{products[1].category}</span>
                                    <h3 className="text-xl font-serif font-bold text-brand-dark mt-1 mb-2">Premium Mustard Oil</h3>
                                    <p className="text-gray-400 text-sm mb-5 leading-relaxed">{products[1].desc}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-brand-green">{products[1].currency}{products[1].price}</span>
                                            <span className="text-xs text-gray-400 ml-2">₹170/L</span>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAdd(products[1])}
                                            className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors"
                                        >
                                            {addedId === products[1].id
                                                ? <><Check size={14} /> Added</>
                                                : <><ShoppingBag size={14} /> Add to Cart</>
                                            }
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
