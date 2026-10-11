import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';


const Hero = () => {
    return (
        <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden w-full max-w-full">
            {/* Animated Premium Liquid Gold Background */}
            <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c05 0%, #1a160b 40%, #2a1f0a 100%)' }}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] left-[-10%] w-[60vw] max-w-[500px] h-[60vw] max-h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 65%)' }}
                />
                <motion.div
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[-15%] right-[-10%] w-[55vw] max-w-[450px] h-[55vw] max-h-[450px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,150,0,0.3) 0%, transparent 65%)' }}
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-[20%] right-[15%] w-[40vw] max-w-[350px] h-[40vw] max-h-[350px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(250,200,80,0.2) 0%, transparent 60%)' }}
                />
            </div>
            {/* Background image overlay with clean, warm visibility */}
            <div className="absolute inset-0 z-10 overflow-hidden">
                <img
                    src="/images/family-meal.jpg"
                    alt="Family Meal"
                    className="w-full h-full object-cover opacity-25 object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/75 to-brand-dark/85" />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center justify-center w-full max-w-full pt-16 sm:pt-20 md:pt-24 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-3xl w-full flex flex-col items-center"
                >
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 md:mb-8 border border-white/20">
                        <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                        <span className="text-xs sm:text-sm font-medium tracking-widest uppercase">Pure & Natural</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight">
                        Parity <br />
                        <span className="text-brand-gold italic">Mustard Oil</span>
                    </h1>

                    <p className="text-base sm:text-xl md:text-2xl text-gray-200 max-w-2xl mb-8 sm:mb-12 font-light leading-relaxed px-2">
                        Good food starts with what you put in it.<br className="hidden sm:inline" />
                        Kachi Ghani mustard oil, made with care for the food you make every day.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none">
                        <a
                            href="#products"
                            className="w-full sm:w-auto bg-brand-gold text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-brand-dark transition-all flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                            Explore Products
                            <ArrowRight className="ml-2" size={18} />
                        </a>
                        <a
                            href="/parity-kachi-ghani-mustard-oil"
                            className="w-full sm:w-auto group px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg border-2 border-white hover:bg-white hover:text-brand-dark transition-all flex items-center justify-center backdrop-blur-sm"
                        >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-brand-dark rounded-full flex items-center justify-center mr-2.5 sm:mr-3 group-hover:bg-brand-dark group-hover:text-white transition-colors">
                                <Play size={11} fill="currentColor" />
                            </div>
                            Our Oil
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="hidden sm:flex absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center"
            >
                <span className="text-xs uppercase tracking-widest mb-2 text-white/70">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </motion.div>
        </section>
    );
};

export default Hero;
