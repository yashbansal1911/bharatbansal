import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';

const Recipes = () => {
    return (
        <section id="recipes" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Culinary Corner</h3>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">
                            Cook with Parity
                        </h2>
                    </div>
                    <Link to="/recipes" className="hidden md:flex items-center text-brand-dark font-bold hover:text-brand-gold transition-colors">
                        View All Recipes <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group cursor-pointer"
                        >
                            <Link to={`/recipes/${recipe.id}`} className="block">
                                <div className="relative h-72 rounded-[2rem] overflow-hidden mb-6">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20 flex space-x-3 text-white text-sm font-medium">
                                        <span className="flex items-center bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                                            <Clock size={13} className="mr-1.5" /> {recipe.time}
                                        </span>
                                        <span className="flex items-center bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                                            <Users size={13} className="mr-1.5" /> Serves {recipe.serves}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-gold transition-colors">
                                    {recipe.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed mb-4">
                                    {recipe.desc}
                                </p>
                                <span className="inline-flex items-center text-brand-green font-bold text-sm uppercase tracking-wider border-b border-brand-green pb-0.5 group-hover:text-brand-gold group-hover:border-brand-gold transition-colors">
                                    Read Recipe <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link to="/recipes" className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold inline-block">
                        View All Recipes
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Recipes;
