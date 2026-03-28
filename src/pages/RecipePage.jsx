import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react';
import { recipes } from '../data/recipes';

const RecipePage = () => {
    const { id } = useParams();
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-36 bg-brand-light">
                <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Recipe not found</h2>
                <Link to="/" className="text-brand-gold font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero Image */}
            <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-brand-light z-10" />
                <motion.img
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                {/* Back button overlay */}
                <div className="absolute top-28 left-6 z-20">
                    <Link
                        to="/#recipes"
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full font-semibold text-sm hover:bg-white hover:text-brand-dark transition-all"
                    >
                        <ArrowLeft size={14} /> All Recipes
                    </Link>
                </div>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8 md:px-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {recipe.tags.map(tag => (
                                <span key={tag} className="bg-brand-gold/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight drop-shadow-md"
                        >
                            {recipe.title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 md:px-10 pb-24">
                {/* Meta strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-6 py-8 border-b border-gray-200 mb-10"
                >
                    <div className="flex items-center gap-2 text-brand-dark font-semibold">
                        <Clock size={18} className="text-brand-gold" />
                        <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-brand-dark font-semibold">
                        <Users size={18} className="text-brand-gold" />
                        <span>Serves {recipe.serves}</span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Left: Intro + Steps */}
                    <div className="md:col-span-2">
                        {/* Intro */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-lg text-gray-600 leading-relaxed mb-12 font-light"
                        >
                            {recipe.intro}
                        </motion.p>

                        {/* Steps */}
                        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-8">Method</h2>
                        <div className="space-y-8">
                            {recipe.steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    className="flex gap-5"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-brand-gold text-white font-bold text-lg flex items-center justify-center shadow-md">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-dark text-lg mb-1">{step.title}</h3>
                                        <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Chef's Tip */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-12 bg-amber-50 border border-brand-gold/30 rounded-2xl p-6 flex gap-4"
                        >
                            <Lightbulb className="text-brand-gold flex-shrink-0 mt-1" size={22} />
                            <div>
                                <span className="font-bold text-brand-dark block mb-1">Chef's Tip</span>
                                <p className="text-gray-600 text-sm leading-relaxed">{recipe.tip}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Ingredients */}
                    <div className="md:col-span-1">
                        <div className="sticky top-28">
                            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-serif font-bold text-brand-dark mb-6 pb-4 border-b border-gray-100">
                                    Ingredients
                                </h2>
                                <ul className="space-y-3">
                                    {recipe.ingredients.map((ing, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: i * 0.04 }}
                                            className="flex items-start gap-3 text-sm text-gray-700"
                                        >
                                            <CheckCircle2 size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                                            {ing}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="mt-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 border border-brand-gold/20 text-center">
                                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Made with</p>
                                <p className="font-serif font-bold text-brand-dark text-lg mb-4">Parity Mustard Oil</p>
                                <Link
                                    to="/shop"
                                    className="block bg-brand-gold text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePage;
