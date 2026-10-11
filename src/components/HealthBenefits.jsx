import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Wind, Sun } from 'lucide-react';

const benefits = [
    {
        icon: Heart,
        title: "Heart Healthy",
        desc: "Rich in MUFA & PUFA that help maintain healthy cholesterol levels."
    },
    {
        icon: ShieldCheck,
        title: "Zero Impurities",
        desc: "100% natural extraction process ensures no chemicals or additives."
    },
    {
        icon: Wind,
        title: "Rich Aroma",
        desc: "A bold, sharp aroma that reflects authentic mustard oil."
    },
    {
        icon: Sun,
        title: "Vitamin Enriched",
        desc: "Naturally fortified with Vitamin A & D for better immunity."
    }
];

const HealthBenefits = () => {
    return (
        <section className="py-16 sm:py-24 bg-brand-light relative overflow-hidden w-full max-w-full">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 C 50 100 80 100 100 0 Z" fill="#0F3D2E" />
                </svg>
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-full">
                <div className="text-center mb-12 sm:mb-20">
                    <h3 className="text-brand-green font-bold tracking-widest uppercase mb-3 sm:mb-4 text-xs sm:text-sm">Why Choose Parity?</h3>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark">
                        Purity You Can Trust
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 sm:p-8 rounded-[1.75rem] sm:rounded-[2rem] shadow-lg hover:shadow-xl transition-shadow text-center group border border-transparent hover:border-brand-gold/20"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors text-brand-green">
                                <item.icon size={28} className="sm:w-8 sm:h-8" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-dark mb-2.5 sm:mb-3">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-xs sm:text-sm">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HealthBenefits;
