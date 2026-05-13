import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import HealthBenefits from '../components/HealthBenefits';
import VisionMission from '../components/VisionMission';
import Recipes from '../components/Recipes';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <>
            <Hero />
            <HealthBenefits />
            <VisionMission />
            <ProductShowcase />
            <Recipes />

            {/* Short About Teaser */}
            <section className="py-24 bg-brand-light">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Our Legacy</h3>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
                            25+ Years of Trust & Purity
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
                            From a humble beginning in the 1980s to a leading FMCG brand today. Discover the story behind B Forever Foods.
                        </p>
                        <Link
                            to="/about"
                            className="inline-flex items-center text-brand-dark font-bold border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-colors text-lg"
                        >
                            Read Our Story <ArrowRight className="ml-2" size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
