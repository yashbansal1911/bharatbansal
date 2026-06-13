import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Leaf, Droplets, Award, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const handleAdd = (product) => {
        addToCart({ ...product });
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1800);
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const visibleCards = isMobile ? 1 : 2;
    const maxIndex = products.length - visibleCards;

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    return (
        <section id="products" className="py-32 bg-white relative overflow-hidden">
            {/* Subtle background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
                style={{ background: 'radial-gradient(circle, #c8960c 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
                style={{ background: 'radial-gradient(circle, #2d4a1e 0%, transparent 70%)' }} />

            <div className="container mx-auto px-6 relative">
                {/* Heading */}
                <div className="text-center mb-20">
                    <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Our Products</h3>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark leading-tight mb-6">
                        Pure Parity <br />Mustard Oil
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-lg">
                        Choose the pack size that fits your kitchen. Slide to view all options.
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

                {/* Slider Wrapper Container */}
                <div className="relative max-w-5xl mx-auto px-4 lg:px-12">
                    {/* Slider Viewport */}
                    <div className="overflow-hidden w-full py-6">
                        <div
                            className="flex gap-8 transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * (isMobile ? 100 : 50)}%)` }}
                        >
                            {products.map((product) => {
                                const isFeatured = product.id === 2; // 5L is featured
                                return (
                                    <div
                                        key={product.id}
                                        className="w-full md:w-[calc(50%-16px)] flex-shrink-0 flex justify-center"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6 }}
                                            className={`group relative w-full max-w-sm bg-gradient-to-b ${
                                                isFeatured
                                                    ? 'from-amber-50 to-white border-2 border-brand-gold shadow-xl'
                                                    : 'from-gray-50 to-white border border-gray-100 shadow-md'
                                            } rounded-[2rem] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between`}
                                        >
                                            {/* Best value badge */}
                                            {isFeatured && (
                                                <div className="absolute top-5 left-5 bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20">
                                                    Best Value
                                                </div>
                                            )}
                                            <div className="absolute top-5 right-5 bg-white border border-gray-200 text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20">
                                                {product.size}
                                            </div>

                                            {/* Image area */}
                                            <div className="relative flex items-center justify-center px-6 pt-12 pb-4" style={{ height: '360px' }}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="p-6 pt-2 flex flex-col justify-between flex-grow">
                                                <div>
                                                    <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">{product.category}</span>
                                                    <h3 className="text-xl font-serif font-bold text-brand-dark mt-1 mb-2">{product.name}</h3>
                                                    <p className="text-gray-400 text-sm mb-5 leading-relaxed min-h-[48px]">{product.desc}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div>
                                                        <span className="text-2xl font-bold text-brand-green">{product.currency}{product.price}</span>
                                                        {product.id === 2 && (
                                                            <span className="text-xs text-gray-400 ml-2">₹170/L</span>
                                                        )}
                                                    </div>
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleAdd(product)}
                                                        className={`flex items-center gap-2 ${
                                                            isFeatured ? 'bg-brand-gold hover:bg-brand-dark' : 'bg-brand-dark hover:bg-brand-gold'
                                                        } text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors`}
                                                    >
                                                        {addedId === product.id
                                                            ? <><Check size={14} /> Added</>
                                                            : <><ShoppingBag size={14} /> Add to Cart</>
                                                        }
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {maxIndex > 0 && (
                        <>
                            {/* Prev Button */}
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-brand-dark shadow-md hover:shadow-lg hover:border-brand-gold transition-all disabled:opacity-30 disabled:pointer-events-none"
                                aria-label="Previous Products"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= maxIndex}
                                className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-brand-dark shadow-md hover:shadow-lg hover:border-brand-gold transition-all disabled:opacity-30 disabled:pointer-events-none"
                                aria-label="Next Products"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
