import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://videos.pexels.com/video-files/3196344/3196344-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

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
                        From our fields to your kitchen. Experience the authentic flavor of cold-pressed oils and premium staples.
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
