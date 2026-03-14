import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Droplet, Sun } from 'lucide-react';

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
        icon: Droplet,
        title: "Cold Pressed",
        desc: "Extracted at low temperatures to retain natural antioxidants and flavor."
    },
    {
        icon: Sun,
        title: "Vitamin Enriched",
        desc: "Naturally fortified with Vitamin A & D for better immunity."
    }
];

const HealthBenefits = () => {
    return (
        <section className="py-24 bg-brand-light relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 C 50 100 80 100 100 0 Z" fill="#0F3D2E" />
                </svg>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h3 className="text-brand-green font-bold tracking-widest uppercase mb-4">Why Choose Parity?</h3>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">
                        Purity You Can Trust
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] shadow-lg hover:shadow-xl transition-shadow text-center group border border-transparent hover:border-brand-gold/20"
                        >
                            <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors text-brand-green">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
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
