import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Award, TrendingUp } from 'lucide-react';

const AboutPage = () => {
    const team = [
        {
            name: "Govind Prasad Bansal",
            role: "Founder",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop", // Placeholder
            desc: "The visionary who started the oil business in the 1980s. With his dedication and commitment to purity, he laid the strong foundation of B Forever Foods."
        },
        {
            name: "Sanjay Bansal",
            role: "Managing Director",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop", // Placeholder
            desc: "Joined the business at an early age and has been the driving force behind its exponential growth. Under his leadership, the company has scaled new heights."
        },
        {
            name: "Bharat Bansal",
            role: "Executive Director",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop", // Placeholder
            desc: "A Master of Business Administration from O.P. Jindal Global University. Bharat brings fresh energy, modern strategies, and deep market knowledge."
        }
    ];

    const milestones = [
        { year: "1980s", title: "The Inception", desc: "Started by Shri Govind Prasad Bansal as a small trading unit." },
        { year: "1995", title: "First Mill", desc: "Established the first mustard oil milling unit." },
        { year: "2010", title: "Expansion", desc: "Expanded capacity to 100 tons per day under Sanjay Bansal." },
        { year: "2023", title: "Modern Era", desc: "Reached 250 tons/day capacity. Launched PARITY brand." }
    ];

    return (
        <div className="bg-brand-light">
            {/* Hero Header */}
            <section className="relative pt-40 pb-32 bg-brand-dark text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-serif font-bold mb-8"
                    >
                        Our Legacy
                    </motion.h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                        From a humble beginning in the 1980s to a household name. This is the story of purity, perseverance, and PARITY.
                    </p>
                </div>
            </section>

            {/* History & Timeline */}
            <section className="py-32 container mx-auto px-6">
                <div className="text-center mb-20">
                    <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Our Journey</h3>
                    <h2 className="text-5xl font-serif font-bold text-brand-dark">Milestones of Excellence</h2>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-brand-gold/30 hidden md:block" />

                    <div className="space-y-20">
                        {milestones.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col md:flex-row items-center justify-between gap-10 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full md:w-5/12" />

                                <div className="w-10 h-10 bg-brand-gold rounded-full border-4 border-white shadow-xl z-10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 bg-white rounded-full" />
                                </div>

                                <div className="w-full md:w-5/12 bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center md:text-left">
                                    <span className="text-4xl font-serif font-bold text-brand-gold/20 mb-2 block">{item.year}</span>
                                    <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CSR / Values */}
            <section className="py-24 bg-brand-green text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div>
                            <Leaf size={48} className="mx-auto mb-6 text-brand-gold" />
                            <h3 className="text-2xl font-serif font-bold mb-4">Sustainable Future</h3>
                            <p className="text-white/80 leading-relaxed">Committed to eco-friendly manufacturing and zero-waste processes.</p>
                        </div>
                        <div>
                            <Award size={48} className="mx-auto mb-6 text-brand-gold" />
                            <h3 className="text-2xl font-serif font-bold mb-4">Quality First</h3>
                            <p className="text-white/80 leading-relaxed">Lab-tested products ensuring 100% purity in every drop.</p>
                        </div>
                        <div>
                            <TrendingUp size={48} className="mx-auto mb-6 text-brand-gold" />
                            <h3 className="text-2xl font-serif font-bold mb-4">Community Growth</h3>
                            <p className="text-white/80 leading-relaxed">Empowering local farmers through fair trade and support.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Leadership</h3>
                        <h2 className="text-5xl font-serif font-bold text-brand-dark">Meet The Visionaries</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative"
                            >
                                <div className="h-[500px] rounded-[2rem] overflow-hidden mb-8 relative">
                                    <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors duration-500 z-10" />
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                </div>

                                <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">{member.name}</h3>
                                <p className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-6">{member.role}</p>
                                <p className="text-gray-600 leading-relaxed border-l-2 border-brand-gold pl-6">
                                    {member.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
