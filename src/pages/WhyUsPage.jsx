import React from 'react';
import { motion } from 'framer-motion';
import { Award, Leaf, TrendingUp } from 'lucide-react';

const WhyUsPage = () => {
    return (
        <div className="bg-brand-light min-h-screen">
            {/* Hero Section */}
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
                        Why Us
                    </motion.h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                        Purity and Fairness, Just the Way Home Should Feel.
                    </p>
                </div>
            </section>


            {/* Our Story */}
            <section className="py-24 bg-brand-light">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-12">PARITY — Our Story</h2>
                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-left">
                            <p>
                                Parity was created with one belief — Indian families deserve pure, honest everyday essentials without overpaying or compromising on health.
                                For years, households faced an unfair choice: pay a premium for trust, or settle for products where purity felt uncertain.
                            </p>
                            <p>
                                We wanted to change that. Parity puts the consumer at the centre of every decision.
                                Built on fairness, transparency, and care, our mission is simple — bring clean, trustworthy essentials to every Indian kitchen.
                            </p>
                            <p>
                                We travel to farms, mills, and production units across the country to source the finest grains and purest oils.
                                Every batch is tested, re-tested, and packed in modern, hygienic facilities designed for today’s homes. Because purity is not an option — it’s our responsibility.
                            </p>
                            <p>
                                And we don’t build products in isolation. Your voice shapes everything we create — what works, what needs refining, and what should come next.
                            </p>
                            <div className="bg-white p-8 rounded-2xl border-l-4 border-brand-gold my-8 shadow-sm">
                                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2">Inspired by Tradition. Perfected by Care. Trusted by Families.</h3>
                                <p className="italic">
                                    In every Indian home, purity is not a luxury — it is a responsibility.
                                    A responsibility carried by every mother cooking for her children, every family sharing a meal, and every home that believes in serving food that is honest and wholesome.
                                </p>
                            </div>
                            <p>
                                We began our journey by listening to what families truly wanted:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Food that is pure and safe</li>
                                <li>Quality that stays consistent, every time</li>
                                <li>Packaging that keeps freshness intact</li>
                                <li>Prices that are fair and honest</li>
                                <li>A brand that values the customer’s voice</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Commitment (Swaad, Sehat, Saath) */}
            <section className="py-24 bg-brand-green text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Commitment</h2>
                        <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10"
                        >
                            <Award size={48} className="mx-auto mb-6 text-brand-gold" />
                            <h3 className="text-3xl font-serif font-bold mb-4">Swaad (Taste)</h3>
                            <p className="text-white/80 leading-relaxed text-lg">
                                Ingredients chosen for freshness, aroma, and authentic flavour.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10"
                        >
                            <Leaf size={48} className="mx-auto mb-6 text-brand-gold" />
                            <h3 className="text-3xl font-serif font-bold mb-4">Sehat (Health)</h3>
                            <p className="text-white/80 leading-relaxed text-lg">
                                Clean sourcing, minimal processing, hygienic packaging.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10"
                        >
                            <TrendingUp size={48} className="mx-auto mb-6 text-brand-gold" />
                            <h3 className="text-3xl font-serif font-bold mb-4">Saath (Togetherness)</h3>
                            <p className="text-white/80 leading-relaxed text-lg">
                                Every product designed to support your family’s daily cooking — with care and trust.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WhyUsPage;
