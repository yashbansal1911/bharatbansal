import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const About = () => {
    const features = [
        "100% Natural Ingredients",
        "Traditional Extraction Methods",
        "No Added Preservatives",
        "Lab Tested for Purity"
    ];

    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop"
                                alt="Cooking with Oil"
                                className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-brand-gold p-8 rounded-xl shadow-lg hidden md:block">
                                <p className="text-4xl font-serif font-bold text-white mb-2">25+</p>
                                <p className="text-white/90 font-medium">Years of Trust</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2"
                    >
                        <h3 className="text-brand-gold font-medium tracking-wider uppercase mb-4">About Us</h3>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
                            B Forever Foods Pvt Ltd
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            At B Forever Foods, we believe that good health starts in the kitchen. Our flagship brand,
                            <span className="font-bold text-brand-dark"> PARITY</span>, represents our commitment to equality in quality and price.
                            We source the finest raw materials to bring you products that are pure, wholesome, and full of natural goodness.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <CheckCircle className="text-brand-green flex-shrink-0" size={20} />
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className="text-brand-gold font-bold border-b-2 border-brand-gold pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                            Learn More About Our Process
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
