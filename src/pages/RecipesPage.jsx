import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';
import { Search, Clock, Users, ArrowRight, BookOpen, UtensilsCrossed, Sparkles } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import AEOAnswersSection from '../components/AEOAnswersSection';

const RecipesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');

    // Extract all unique tags across all recipes dynamically
    const allTags = useMemo(() => {
        const tagsSet = new Set(['All']);
        recipes.forEach(recipe => {
            recipe.tags.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet);
    }, []);

    // Filter recipes based on search query and selected tag
    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesTag = selectedTag === 'All' || recipe.tags.includes(selectedTag);

            return matchesSearch && matchesTag;
        });
    }, [searchQuery, selectedTag]);

    return (
        <div className="min-h-screen bg-[#FDFCF7] pt-28 pb-24">
            <SEOHead
                title="Traditional Indian Recipes with Parity Mustard Oil"
                description="Explore authentic North Indian & Bengali recipes crafted with Parity Cold-Pressed Mustard Oil. Sarson Ka Saag, Shorshe Maach, Aloo Sabzi, Mango Pickle, and more."
                keywords="Mustard Oil Recipes, Sarson Ka Saag Recipe, Bengali Shorshe Maach, Aam Ka Achar Recipe, Cold Pressed Cooking Recipes, Indian Kachi Ghani Recipes"
                path="/recipes"
            />

            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-[40vh] left-0 w-[30rem] h-[30rem] bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl">
                {/* Hero / Header Section */}
                <header className="relative text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-bold tracking-widest uppercase mb-6"
                    >
                        <Sparkles size={14} className="animate-pulse" />
                        <span>Culinary Corner</span>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-black text-brand-dark mb-6 leading-tight speakable-title"
                    >
                        Cook With <span className="text-brand-gold italic">Parity</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-10 speakable-summary"
                    >
                        Discover hand-crafted regional Indian recipes elevated by the pungent aroma and rich golden warmth of pure Parity Cold-Pressed Mustard Oil.
                    </motion.p>

                    {/* Interactive Search & Filter Toolbar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Search Input Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search recipes by name or ingredient (e.g., Fish, Saag, Potato)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-brand-gold/20 shadow-lg shadow-brand-gold/5 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 transition-all text-gray-800 placeholder-gray-400 font-medium"
                            />
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                            {allTags.map((tag) => {
                                const isActive = selectedTag === tag;
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-300 ${
                                            isActive
                                                ? 'bg-brand-dark text-brand-gold shadow-md scale-105'
                                                : 'bg-white text-gray-600 hover:bg-brand-gold/10 border border-gray-200'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </header>

                {/* Recipe Grid */}
                <AnimatePresence mode="wait">
                    {filteredRecipes.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredRecipes.map((recipe, idx) => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                        {/* Recipe Meta Badges */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {recipe.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-brand-dark shadow">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-8 flex flex-col flex-grow justify-between">
                                        <div>
                                            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-brand-gold" />
                                                    <span>{recipe.time}</span>
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={14} className="text-brand-gold" />
                                                    <span>Serves {recipe.serves}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-gold transition-colors">
                                                {recipe.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6">
                                                {recipe.desc}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/recipes/${recipe.id}`}
                                            className="inline-flex items-center justify-between w-full pt-4 border-t border-gray-100 text-sm font-bold text-brand-dark group-hover:text-brand-gold transition-colors"
                                        >
                                            <span>View Full Recipe</span>
                                            <div className="w-8 h-8 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold group-hover:text-white flex items-center justify-center transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-12 max-w-lg mx-auto"
                        >
                            <UtensilsCrossed size={48} className="mx-auto text-brand-gold/40 mb-4" />
                            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2">No Recipes Found</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                We couldn't find any recipes matching "{searchQuery}". Try searching for another ingredient or clearing your filters.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
                                className="px-6 py-2.5 bg-brand-dark text-white text-sm font-bold rounded-full hover:bg-brand-gold transition-colors"
                            >
                                Reset Search Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AEO Culinary FAQs */}
                <div className="mt-20">
                    <AEOAnswersSection
                        title="Mustard Oil Cooking Techniques & Answers"
                        subtitle="Key culinary tips for cooking with cold-pressed Kachi Ghani mustard oil."
                    />
                </div>
            </div>
        </div>
    );
};

export default RecipesPage;
