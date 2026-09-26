import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react';
import { recipes } from '../data/recipes';
import SEOHead from '../components/SEOHead';

const RecipePage = () => {
    const { id } = useParams();
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-36 bg-brand-light">
                <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Recipe not found</h2>
                <Link to="/recipes" className="text-brand-gold font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Recipes
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            <SEOHead
                title={`${recipe.title} Recipe with Parity Mustard Oil`}
                description={recipe.desc || recipe.intro}
                keywords={`${recipe.title}, ${recipe.tags ? recipe.tags.join(', ') : ''}, Mustard Oil Recipe, Parity Cold Pressed Oil`}
                image={recipe.image.startsWith('http') ? recipe.image : `https://bforeverfoods.com${recipe.image}`}
                path={`/recipes/${recipe.id}`}
                recipeData={recipe}
            />

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
                        to="/recipes"
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
                            className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight drop-shadow-md speakable-title"
                        >
                            {recipe.title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Quick Info Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap items-center justify-around gap-6 mb-12"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                            <Clock size={20} />
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Cook Time</span>
                            <span className="text-lg font-bold text-brand-dark">{recipe.time}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                            <Users size={20} />
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Servings</span>
                            <span className="text-lg font-bold text-brand-dark">{recipe.serves} people</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                            <Lightbulb size={20} />
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Key Ingredient</span>
                            <span className="text-lg font-bold text-brand-dark">Parity Mustard Oil</span>
                        </div>
                    </div>
                </motion.div>

                {/* Intro Story */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-14"
                >
                    <p className="text-xl text-gray-700 leading-relaxed font-serif italic border-l-4 border-brand-gold pl-6 py-2 speakable-summary">
                        {recipe.intro}
                    </p>
                </motion.div>

                {/* Grid: Ingredients & Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
                    {/* Ingredients Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="md:col-span-1 bg-white rounded-2xl p-7 border border-gray-100 shadow-sm h-fit"
                    >
                        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                            <span>Ingredients</span>
                        </h2>
                        <ul className="space-y-3">
                            {recipe.ingredients.map((ing, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm leading-snug">
                                    <CheckCircle2 size={16} className="text-brand-gold shrink-0 mt-0.5" />
                                    <span>{ing}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Steps Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 pb-3 border-b border-gray-100">
                            Step-by-Step Instructions
                        </h2>
                        {recipe.steps.map((step, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 speakable-answer">
                                <div className="w-9 h-9 rounded-full bg-brand-dark text-brand-gold font-serif font-bold text-lg flex items-center justify-center shrink-0">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-brand-dark text-lg mb-1">{step.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Chef's Tip */}
                {recipe.tip && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-brand-dark text-white rounded-2xl p-8 border border-brand-gold/30 flex items-start gap-4 shadow-xl"
                    >
                        <Lightbulb size={28} className="text-brand-gold shrink-0 mt-1" />
                        <div>
                            <h3 className="font-serif font-bold text-xl text-brand-gold mb-2">Pro Chef's Tip</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{recipe.tip}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RecipePage;
