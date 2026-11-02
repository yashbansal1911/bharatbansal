import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Leaf, Droplets, Award, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const features = [
    { icon: Leaf, label: 'Double Filtered' },
    { icon: Droplets, label: 'Omega 3 & 6 (PUFA)' },
    { icon: Award, label: 'Zero Preservatives' },
    { icon: Sparkles, label: '100% Kachi Ghani' }
];

const ProductShowcase = () => {
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);
    const [visibleCards, setVisibleCards] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(products.length); // Start at middle copy
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // 3 repetitions for seamless infinite looping
    const extendedProducts = [...products, ...products, ...products];

    // Detect responsive cards count
    useEffect(() => {
        const updateVisibleCards = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setVisibleCards(1);
            } else if (width < 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(3);
            }
        };
        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    // Active product index (0 to products.length - 1)
    const activeProductIndex = ((currentIndex % products.length) + products.length) % products.length;

    // Auto-scroll effect
    useEffect(() => {
        if (isHovered || !isAutoScrollEnabled) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((prev) => prev + 1);
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered, isAutoScrollEnabled]);

    // Re-enable transition after instant snap
    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    // Handle seamless wrap-around when CSS transition finishes
    const handleTransitionEnd = () => {
        if (currentIndex >= products.length * 2) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex - products.length);
        } else if (currentIndex < products.length) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex + products.length);
        }
    };

    const handlePrev = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleDotClick = (targetIdx) => {
        const diff = targetIdx - activeProductIndex;
        if (diff !== 0) {
            setIsTransitioning(true);
            setCurrentIndex((prev) => prev + diff);
        }
    };

    const handleAdd = (product) => {
        addToCart({ ...product });
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1800);
    };

    // Touch swipe handlers
    const handleTouchStart = (e) => {
        setIsHovered(true);
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchStartX.current - touchEndX.current;
            if (diff > 45) {
                handleNext();
            } else if (diff < -45) {
                handlePrev();
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
        setIsHovered(false);
    };

    return (
        <section id="products" className="py-20 sm:py-32 bg-gradient-to-b from-white via-amber-50/20 to-white relative overflow-hidden w-full max-w-full">
            {/* Background decorative glows */}
            <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #c8960c 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full opacity-5 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #2d4a1e 0%, transparent 70%)' }} />

            <div className="container mx-auto px-4 sm:px-6 relative max-w-full">
                {/* Heading */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <Sparkles size={14} /> Our Product Collection
                    </div>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-dark leading-tight mb-4 sm:mb-6">
                        Pure Parity <br className="hidden sm:inline" />Mustard Oil Packs
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
                        From everyday 1L bottles and pouches to 5L family jars and bulk 15kg tins — pure cold-pressed stone-milled kachi ghani for every kitchen.
                    </p>
                </div>

                {/* Feature Pills */}
                <div className="flex justify-center gap-3 sm:gap-4 flex-wrap mb-12 sm:mb-16">
                    {features.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 bg-white/90 border border-amber-100 shadow-sm px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-brand-dark">
                            <Icon size={14} className="text-brand-gold" />
                            {label}
                        </div>
                    ))}
                </div>

                {/* Slider Wrapper Container */}
                <div
                    className="relative max-w-6xl mx-auto px-2 sm:px-4 lg:px-10"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Viewport */}
                    <div className="overflow-hidden w-full py-6">
                        <div
                            className="flex"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                                transition: isTransitioning
                                    ? 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)'
                                    : 'none'
                            }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {extendedProducts.map((product, idx) => {
                                const isFeatured = product.id === 2; // 5L is featured
                                const isAdded = addedId === product.id;

                                return (
                                    <div
                                        key={`${product.id}-${idx}`}
                                        className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3 sm:px-4 flex"
                                    >
                                        <div
                                            className={`group relative w-full bg-gradient-to-b ${
                                                isFeatured
                                                    ? 'from-amber-50/80 via-white to-amber-50/30 border-2 border-brand-gold shadow-xl shadow-brand-gold/10'
                                                    : 'from-gray-50/80 via-white to-gray-50/40 border border-gray-200/80 shadow-md hover:border-brand-gold/50'
                                            } rounded-[2rem] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden`}
                                        >
                                            {/* Top badges */}
                                            <div className="flex items-center justify-between p-5 pb-0 z-20">
                                                {isFeatured ? (
                                                    <div className="bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                                                        <Award size={13} /> Best Value
                                                    </div>
                                                ) : product.badge ? (
                                                    <div className="bg-white/95 border border-amber-200/80 text-brand-dark text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                                        {product.badge}
                                                    </div>
                                                ) : <div />}

                                                <div className="bg-white/95 border border-gray-200 text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                    {product.size}
                                                </div>
                                            </div>

                                            {/* Image area */}
                                            <div
                                                className="relative flex items-center justify-center px-6 pt-6 pb-2"
                                                style={{ height: '300px' }}
                                            >
                                                {/* Ambient subtle glow */}
                                                <div
                                                    className="absolute inset-4 rounded-full opacity-60 pointer-events-none"
                                                    style={{
                                                        background: isFeatured
                                                            ? 'radial-gradient(circle, rgba(200,150,12,0.14) 0%, transparent 70%)'
                                                            : 'radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)'
                                                    }}
                                                />
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className="relative z-10 object-contain w-full h-full transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
                                                />
                                            </div>

                                            {/* Card Info */}
                                            <div className="p-6 pt-2 flex flex-col justify-between flex-grow">
                                                <div>
                                                    <span className="text-[11px] font-bold text-brand-gold uppercase tracking-widest block mb-1">
                                                        {product.category}
                                                    </span>
                                                    <h3 className="text-xl font-serif font-bold text-brand-dark leading-snug mb-2 group-hover:text-brand-gold transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs sm:text-sm mb-5 leading-relaxed line-clamp-2 min-h-[38px]">
                                                        {product.desc}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                                    <div>
                                                        <div className="text-2xl font-bold text-brand-green leading-tight">
                                                            {product.currency}{product.price.toLocaleString('en-IN')}
                                                        </div>
                                                        {product.unitPrice && (
                                                            <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                                                                {product.unitPrice}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <motion.button
                                                        whileTap={{ scale: 0.94 }}
                                                        onClick={() => handleAdd(product)}
                                                        className={`flex items-center gap-2 ${
                                                            isFeatured
                                                                ? 'bg-brand-gold hover:bg-brand-dark shadow-brand-gold/30'
                                                                : 'bg-brand-dark hover:bg-brand-gold shadow-gray-400/20'
                                                        } text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300`}
                                                    >
                                                        {isAdded ? (
                                                            <>
                                                                <Check size={15} className="text-white" /> Added
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShoppingBag size={15} /> Add to Cart
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-gray-200 bg-white/95 backdrop-blur flex items-center justify-center text-brand-dark shadow-lg hover:shadow-xl hover:border-brand-gold hover:text-brand-gold hover:scale-105 active:scale-95 transition-all"
                        aria-label="Previous Product"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-gray-200 bg-white/95 backdrop-blur flex items-center justify-center text-brand-dark shadow-lg hover:shadow-xl hover:border-brand-gold hover:text-brand-gold hover:scale-105 active:scale-95 transition-all"
                        aria-label="Next Product"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>

                {/* Full-length continuous slide indicator line */}
                <div className="relative w-full max-w-xl sm:max-w-2xl mx-auto mt-8 px-4">
                    {/* Background track line */}
                    <div className="relative w-full h-1 bg-gray-200/90 rounded-full overflow-hidden">
                        {/* Smoothly sliding active indicator */}
                        <div
                            className="h-full bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold rounded-full transition-all duration-450 ease-out shadow-sm"
                            style={{
                                width: `${100 / products.length}%`,
                                transform: `translateX(${activeProductIndex * 100}%)`,
                            }}
                        />
                    </div>

                    {/* Invisible full-width clickable trigger zones */}
                    <div className="absolute inset-0 px-4 flex">
                        {products.map((product, idx) => (
                            <button
                                key={product.id}
                                onClick={() => handleDotClick(idx)}
                                className="flex-1 h-6 -top-2.5 relative cursor-pointer focus:outline-none group"
                                aria-label={`Jump to ${product.name}`}
                                title={product.name}
                            >
                                <span className="sr-only">{product.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;

