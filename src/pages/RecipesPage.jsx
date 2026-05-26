import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';
import { Search, Clock, Users, ArrowRight, BookOpen, UtensilsCrossed, Sparkles } from 'lucide-react';

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
                        className="text-4xl md:text-6xl font-serif font-black text-brand-dark mb-6 leading-tight"
                    >
                        Cook With <span className="text-brand-gold italic">Parity</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-gray-600 text-lg md:text-xl leading-relaxed font-light mb-10"
                    >
                        Immerse yourself in authentic Indian heritage. Elevate your everyday culinary creations using our signature Cold-Pressed Mustard Oil.
                    </motion.p>

                    {/* Quick Stats Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="grid grid-cols-3 gap-4 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-brand-dark/5 mb-12 max-w-xl mx-auto"
                    >
                        <div className="text-center border-r border-gray-100">
                            <span className="block text-3xl font-black text-brand-gold mb-1 font-serif">{recipes.length}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Recipes</span>
                        </div>
                        <div className="text-center border-r border-gray-100">
                            <span className="block text-3xl font-black text-brand-green mb-1 font-serif">100%</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Authentic</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-3xl font-black text-brand-dark mb-1 font-serif">Pure</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Cold-Pressed</span>
                        </div>
                    </motion.div>
                </header>

                {/* Filter and Search Bar Controller */}
                <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-brand-dark/5 mb-16">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                        {/* Search Input */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-gold transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search recipes, ingredients, tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 group-hover:border-gray-300 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-brand-dark placeholder-gray-400 text-sm"
                            />
                        </div>

                        {/* Filter Tags List */}
                        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                        selectedTag === tag
                                            ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/10 scale-105'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-brand-dark'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recipes Dynamic Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
                    <AnimatePresence mode="popLayout">
                        {filteredRecipes.map((recipe, index) => (
                            <motion.div
                                key={recipe.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-dark/5 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
                            >
                                <Link to={`/recipes/${recipe.id}`} className="block flex-grow">
                                    {/* Image Wrapper */}
                                    <div className="relative h-72 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity" />
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                                        />
                                        
                                        {/* Recipe stats badges inside image */}
                                        <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center">
                                            <div className="flex gap-2.5">
                                                <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                                                    <Clock size={12} /> {recipe.time}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                                                    <Users size={12} /> Serves {recipe.serves}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="p-8">
                                        {/* Tags line */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {recipe.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] font-extrabold uppercase tracking-widest text-brand-gold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-gold transition-colors leading-snug">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {recipe.desc}
                                        </p>
                                    </div>
                                </Link>

                                {/* Card Footer Link */}
                                <div className="px-8 pb-8 pt-0 mt-auto">
                                    <Link 
                                        to={`/recipes/${recipe.id}`}
                                        className="inline-flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-widest border-b-2 border-brand-green/30 hover:border-brand-gold hover:text-brand-gold pb-1 transition-all"
                                    >
                                        <span>View Cooking Method</span>
                                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty Search Result State */}
                {filteredRecipes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm shadow-brand-dark/5"
                    >
                        <UtensilsCrossed className="mx-auto text-brand-gold mb-6 animate-bounce" size={48} />
                        <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">No Recipes Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8 font-light">
                            We couldn't find any recipes matching "{searchQuery}". Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedTag('All');
                            }}
                            className="bg-brand-dark text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-gold transition-colors shadow-lg shadow-brand-dark/10"
                        >
                            Reset Search Filters
                        </button>
                    </motion.div>
                )}

                {/* Bottom Promo Shop Panel */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden bg-gradient-to-br from-brand-dark to-[#272D1E] text-white rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="max-w-xl text-center md:text-left z-10">
                        <span className="text-brand-gold text-xs font-black uppercase tracking-widest mb-3 block">Elevate Your Cooking</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
                            The secret behind authentic Indian taste?
                        </h2>
                        <p className="text-gray-300 leading-relaxed font-light mb-0">
                            Our Cold-Pressed Mustard Oil is naturally extracted without heat, preserving full nutrition, sharp traditional aroma, and a healthy bold taste.
                        </p>
                    </div>

                    <div className="flex-shrink-0 z-10">
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-3 bg-brand-gold text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-brand-dark transition-all shadow-xl shadow-brand-gold/10 hover:shadow-white/10 hover:scale-105"
                        >
                            <BookOpen size={16} />
                            <span>Shop Core Ingredients</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default RecipesPage;
