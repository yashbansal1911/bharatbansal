import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';


const Hero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Premium Liquid Gold Background */}
            <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #0f0c05 0%, #1a160b 40%, #2a1f0a 100%)' }}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 65%)' }}
                />
                <motion.div
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,150,0,0.3) 0%, transparent 65%)' }}
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-[20%] right-[15%] w-[40vw] h-[40vw] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(250,200,80,0.2) 0%, transparent 60%)' }}
                />
            </div>
            {/* Darker overlay for text crispness */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 text-center text-white mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
                        <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                        <span className="text-sm font-medium tracking-widest uppercase">Pure & Natural</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
                        The Taste of <br />
                        <span className="text-brand-gold italic">Tradition</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Cold-pressed kachi ghani mustard oil — straight from the fields to your kitchen. Pure, bold, and unadulterated.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a
                            href="#products"
                            className="bg-brand-gold text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-dark transition-all flex items-center shadow-lg hover:shadow-xl"
                        >
                            Explore Products
                            <ArrowRight className="ml-2" size={20} />
                        </a>
                        <button
                            className="group px-10 py-4 rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-brand-dark transition-all flex items-center backdrop-blur-sm"
                        >
                            <div className="w-8 h-8 bg-white text-brand-dark rounded-full flex items-center justify-center mr-3 group-hover:bg-brand-dark group-hover:text-white transition-colors">
                                <Play size={12} fill="currentColor" />
                            </div>
                            Watch Our Story
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
                <span className="text-xs uppercase tracking-widest mb-2 text-white/70">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </motion.div>
        </section>
    );
};

export default Hero;
