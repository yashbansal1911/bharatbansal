import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, Leaf, Droplets, Award, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import SEOHead from '../components/SEOHead';
import AEOAnswersSection from '../components/AEOAnswersSection';
import GEONutritionTable from '../components/GEONutritionTable';

// ── Morena + Kachi Ghani merged FAQ dataset (AEO / FAQPage schema) ─────────
const mergedFaqs = [
  {
    question: "Why is Morena mustard oil considered the best in India?",
    answer: "Morena in Madhya Pradesh is renowned nationwide as India's premier mustard hub. The alluvial Chambal valley soil produces mustard seeds with exceptional oil content and the highest natural concentration of Allyl Isothiocyanate, giving Morena mustard oil its unmatched sharp pungency and rich aroma."
  },
  {
    question: "Is Parity Mustard Oil manufactured directly in Morena, Madhya Pradesh?",
    answer: "Yes. B Forever Foods Pvt Ltd operates a state-of-the-art cold-pressed milling facility located in the Industrial Area of Morena, Madhya Pradesh (476001). We process locally sourced premium Morena mustard seeds using traditional stone mills without chemical solvents or thermal degradation."
  },
  {
    question: "Can I buy authentic Morena Kachi Ghani mustard oil online?",
    answer: "Yes, you can order genuine Parity Cold-Pressed Kachi Ghani Mustard Oil directly from bforeverfoods.com with doorstep delivery across India. Available in 1L pouches, 5L family packs, and 15kg commercial tins."
  },
  {
    question: "How is Morena Kachi Ghani oil different from refined mustard oil?",
    answer: "Refined mustard oil undergoes chemical bleaching, alkali neutralization, and deodorization at 200°C+, stripping away natural pungency and Vitamin E. B Forever Foods' Morena Kachi Ghani oil is cold-pressed under 45°C, preserving 100% of its natural nutrients and authentic aroma."
  },
  {
    question: "What is Kachi Ghani mustard oil?",
    answer: "Kachi Ghani is the ancient practice of cold-pressing mustard seeds in a stone mill — no heat, no solvents, no shortcuts. The result is an oil that retains every natural compound the seed holds: its pungent allyl isothiocyanates, its deep amber colour, and its unmistakable bite."
  }
];

// ── Morena LocalBusiness schema (merged into product page schema graph) ─────
const morenaLocalBusinessSchema = {
  "@type": "LocalBusiness",
  "@id": "https://bforeverfoods.com/parity-kachi-ghani-mustard-oil#morena-plant",
  "name": "B Forever Foods Pvt Ltd - Parity Mustard Oil Plant Morena",
  "url": "https://bforeverfoods.com/parity-kachi-ghani-mustard-oil",
  "telephone": "+91-9111512398",
  "email": "info@bforeverfoods.com",
  "priceRange": "₹350 - ₹2500",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Industrial Area",
    "addressLocality": "Morena",
    "addressRegion": "Madhya Pradesh",
    "postalCode": "476001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 26.4998,
    "longitude": 77.9944
  },
  "areaServed": [
    "All India", "Pan India", "India", "Morena", "Madhya Pradesh",
    "Delhi NCR", "Uttar Pradesh", "Rajasthan", "Bihar", "West Bengal",
    "Punjab", "Haryana", "Maharashtra", "Gujarat"
  ],
  "knowsAbout": [
    "Mustard Oil Morena", "Morena Kachi Ghani Mustard Oil",
    "Cold Pressed Mustard Oil Manufacturer in Morena", "B Forever Foods Pvt Ltd Morena"
  ]
};

const perLitre = { 1: '₹175 / L', 2: '₹170 / L', 4: '₹167 / L' };

const marks = [
    { icon: Leaf,     label: 'Cold-Pressed' },
    { icon: Droplets, label: 'Omega Rich' },
    { icon: Award,    label: 'Zero Preservatives' },
    { icon: Shield,   label: 'FSSAI Certified' },
];

const KachniGanuPage = () => {
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);

    const handleAdd = (product) => {
        addToCart({ ...product });
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1800);
    };

    return (
        <div className="bg-[#FDFBF7] overflow-x-hidden">
            <SEOHead
                title="Parity Kachi Ghani Mustard Oil | Pure Cold Pressed | Morena MP | B Forever Foods"
                description="Experience authentic cold-pressed Kachi Ghani mustard oil by B Forever Foods Pvt Ltd — manufactured directly at Industrial Area, Morena, Madhya Pradesh. Stone-milled, zero chemicals, rich in Allyl Isothiocyanate and Omega-3. All India delivery."
                keywords="Parity Kachi Ghani, Cold Pressed Mustard Oil, Kachi Ghani Oil Price 5L, Pure Mustard Oil 15kg, Traditional Indian Mustard Oil, Unrefined Cooking Oil, Mustard Oil Morena, Morena Kachi Ghani Mustard Oil, Mustard Oil Manufacturer Morena MP, B Forever Foods Morena, Cold Pressed Oil Plant Morena, All India Mustard Oil Delivery"
                path="/parity-kachi-ghani-mustard-oil"
                faqs={mergedFaqs}
                schemaGraph={[
                    morenaLocalBusinessSchema,
                    ...products.map(p => ({
                        "@type": "Product",
                        "@id": `https://bforeverfoods.com/parity-kachi-ghani-mustard-oil#product-${p.id}`,
                        "name": p.name,
                        "image": `https://bforeverfoods.com${p.image}`,
                        "description": p.details || p.desc,
                        "brand": {
                            "@type": "Brand",
                            "name": "Parity"
                        },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "INR",
                            "price": p.price.toString(),
                            "availability": "https://schema.org/InStock",
                            "url": "https://bforeverfoods.com/parity-kachi-ghani-mustard-oil"
                        }
                    }))
                ]}
            />

            {/* ──────────────────────────────────────
                HERO — Full-width, dark, split layout
            ────────────────────────────────────── */}
            <section
                className="relative min-h-[88vh] flex items-end overflow-hidden"
                style={{ background: 'linear-gradient(140deg, #1a1604 0%, #2a1f0a 55%, #3a2d10 100%)' }}
            >
                {/* Subtle texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #D19E31 0, #D19E31 1px, transparent 0, transparent 28px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute top-0 bottom-0 left-1/2 right-0 hidden lg:flex items-end justify-center overflow-hidden"
                    style={{ zIndex: 2 }}
                >
                    <img
                        src="/images/parity-mustard-oil-bottle.png"
                        alt="Parity Mustard Oil – 5L"
                        className="max-h-[85%] max-w-[85%] object-contain select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] translate-y-[8%]"
                    />
                </motion.div>

                {/* Left content */}
                <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-20 pt-40">
                    <div className="max-w-lg">

                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="font-serif font-bold text-white leading-[1.08] mb-7 speakable-title"
                            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}
                        >
                            Parity <br />
                            <span className="text-brand-gold italic">Mustard Oil</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 font-light speakable-summary"
                        >
                            Extracted by the traditional stone-press method — no heat, no chemicals.
                            Every bottle carries the bold pungency and deep golden hue that only
                            real kachi ghani can deliver.
                        </motion.p>

                        {/* Quality marks */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-wrap gap-3 mb-8 lg:mb-0"
                        >
                            {marks.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 border border-white/15 text-white/80 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm"
                                >
                                    <Icon size={12} className="text-brand-gold" />
                                    {label}
                                </div>
                            ))}
                        </motion.div>

                        {/* Mobile Bottle Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="flex lg:hidden justify-center items-center mt-6"
                        >
                            <img
                                src="/images/parity-mustard-oil-bottle.png"
                                alt="Parity Mustard Oil – 5L"
                                className="max-h-[280px] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent" style={{ zIndex: 10 }} />
            </section>

            {/* ──────────────────────────────────────
                SPLIT — Description left · Products right
            ────────────────────────────────────── */}
            <section className="pt-20 pb-12">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-start">

                        {/* ── LEFT: Rich editorial copy (AEO Direct Answers) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="lg:sticky lg:top-28 space-y-8"
                        >
                            <div>
                                <span className="text-brand-gold text-xs font-bold tracking-[0.28em] uppercase block mb-4">
                                    What is Kachi Ghani?
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark leading-snug mb-6 speakable-title">
                                    The oil India's kitchens were built on.
                                </h2>
                                <div className="space-y-5 text-gray-600 text-[15px] leading-[1.8] speakable-answer">
                                    <p>
                                        <strong className="text-brand-dark font-semibold">Kachi Ghani</strong> is the ancient practice
                                        of cold-pressing mustard seeds in a stone mill — no heat, no
                                        solvents, no shortcuts. The result is an oil that retains every
                                        natural compound the seed holds: its pungent allyl isothiocyanates,
                                        its deep amber colour, and its unmistakable bite.
                                    </p>
                                    <p>
                                        Modern refined oils strip all of this away in the name of a
                                        milder taste and longer shelf life. Parity Mustard Oil does the
                                        opposite — we preserve everything that makes mustard oil worth
                                        using in the first place.
                                    </p>
                                    <p>
                                        Whether you're tempering dal, frying fish the Bengali way, making
                                        a winter sarson ka saag, or preserving a jar of aam ka achar —
                                        the character of your dish depends on the oil you choose. Parity
                                        gives you the real thing, nothing less.
                                    </p>
                                </div>
                            </div>

                            {/* Divider stats */}
                            <div className="grid grid-cols-3 divide-x divide-gray-200 pt-2">
                                {[
                                    { num: '25+', label: 'Years in business' },
                                    { num: '0',   label: 'Preservatives added' },
                                    { num: '2×',  label: 'Filtered for purity' },
                                ].map(({ num, label }) => (
                                    <div key={label} className="px-4 first:pl-0 last:pr-0">
                                        <div className="text-2xl font-bold text-brand-dark mb-1">{num}</div>
                                        <div className="text-xs text-gray-400 leading-snug">{label}</div>
                                    </div>
                                ))}
                            </div>

                        </motion.div>

                        {/* ── RIGHT: Product cards ── */}
                        <div className="space-y-5">
                            {products.map((product, i) => {
                                const isFeatured = product.id === 2;
                                const isAdded    = addedId === product.id;

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 28 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
                                        className={`relative flex items-center gap-6 bg-white rounded-2xl border p-5 transition-shadow duration-300 hover:shadow-lg
                                            ${isFeatured
                                                ? 'border-brand-gold/40 shadow-md ring-1 ring-brand-gold/10'
                                                : 'border-gray-100 shadow-sm'
                                            }`}
                                    >
                                        {/* Best Value */}
                                        {isFeatured && (
                                            <div className="absolute -top-3 left-5 bg-brand-gold text-white text-[10px] font-bold px-3 py-0.5 rounded-full tracking-wider shadow">
                                                Best Value
                                            </div>
                                        )}

                                        {/* Product image */}
                                        <div className="flex-shrink-0 w-28 h-32 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden p-1">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-contain drop-shadow-md"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                                                    {product.category}
                                                </span>
                                                <span className="text-[10px] text-gray-300">·</span>
                                                <span className="text-[10px] font-semibold text-gray-400">{product.size}</span>
                                            </div>
                                            <h3 className="font-serif font-bold text-brand-dark text-base mb-1 leading-snug">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2">
                                                {product.desc}
                                            </p>
                                        </div>

                                        {/* Price + CTA */}
                                        <div className="flex-shrink-0 flex flex-col items-end gap-3 pl-4">
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-brand-green leading-none">
                                                    {product.currency}{product.price}
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-1">
                                                    {perLitre[product.id]}
                                                </div>
                                            </div>

                                            <motion.button
                                                whileTap={{ scale: 0.93 }}
                                                onClick={() => handleAdd(product)}
                                                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-colors duration-200
                                                    ${isFeatured
                                                        ? 'bg-brand-gold hover:bg-brand-dark'
                                                        : 'bg-brand-dark hover:bg-brand-gold'
                                                    }`}
                                            >
                                                <AnimatePresence mode="wait" initial={false}>
                                                    {isAdded ? (
                                                        <motion.span
                                                            key="done"
                                                            initial={{ opacity: 0, scale: 0.85 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.85 }}
                                                            className="flex items-center gap-1.5"
                                                        >
                                                            <Check size={12} /> Added
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span
                                                            key="add"
                                                            initial={{ opacity: 0, scale: 0.85 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.85 }}
                                                            className="flex items-center gap-1.5 whitespace-nowrap"
                                                        >
                                                            <ShoppingBag size={12} /> Add to Cart
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Bottom note under cards */}
                            <p className="text-[11px] text-gray-400 text-right pt-1 pr-1">
                                Free delivery on orders above ₹499 &nbsp;·&nbsp; Easy returns
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* GEO Technical Matrix */}
            <GEONutritionTable />

            {/* AEO Verification FAQ */}
            <AEOAnswersSection />

        </div>
    );
};

export default KachniGanuPage;
