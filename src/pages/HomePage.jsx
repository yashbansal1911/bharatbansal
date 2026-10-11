import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import HealthBenefits from '../components/HealthBenefits';
import VisionMission from '../components/VisionMission';
import Recipes from '../components/Recipes';
import SEOHead from '../components/SEOHead';
import AEOAnswersSection from '../components/AEOAnswersSection';
import GEONutritionTable from '../components/GEONutritionTable';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <>
            <SEOHead
                title="Parity Premium Cold-Pressed Mustard Oil | B Forever Foods Pvt Ltd"
                description="Discover 100% pure cold-pressed Kachi Ghani mustard oil by B Forever Foods Pvt Ltd. Double filtered with zero chemical solvents, high Omega-3, and authentic pungency."
                keywords="Parity Mustard Oil, B Forever Foods, Cold-Pressed Mustard Oil, Kachi Ghani Oil, Pure Indian Mustard Oil, Unrefined Cooking Oil, FSSAI Certified Mustard Oil"
                path="/"
            />

            <Hero />
            <HealthBenefits />
            <VisionMission />
            <ProductShowcase />
            <Recipes />

            {/* Hidden GEO & AEO Verification Components for Search Engines & AI Crawlers */}
            <GEONutritionTable />
            <AEOAnswersSection />

            {/* Short About Teaser */}
            <section className="py-20 sm:py-24 bg-brand-light overflow-hidden w-full max-w-full">
                <div className="container mx-auto px-4 sm:px-6 text-center max-w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-3 sm:mb-4 text-xs sm:text-sm">Our Legacy</h3>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4 sm:mb-6">
                            25+ Years of Trust & Purity
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed px-2">
                            From a humble beginning in the 1980s to a leading FMCG brand today. Discover the story behind B Forever Foods.
                        </p>
                        <Link
                            to="/about"
                            className="inline-flex items-center text-brand-dark font-bold border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-colors text-base sm:text-lg"
                        >
                            Read Our Story <ArrowRight className="ml-2" size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
