import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users } from 'lucide-react';

const recipes = [
    {
        title: "Traditional Mustard Fish Curry",
        image: "https://images.unsplash.com/photo-1626776420079-fa5e175f0068?q=80&w=1887&auto=format&fit=crop",
        time: "45 mins",
        serves: "4",
        desc: "A bengali delicacy cooked in Parity Mustard Oil for that authentic zing."
    },
    {
        title: "Crispy Vegetable Pakoras",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop",
        time: "30 mins",
        serves: "6",
        desc: "Golden fried fritters made with Parity Besan, perfect for tea time."
    },
    {
        title: "Desi Ghee Motichoor Ladoo",
        image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=2080&auto=format&fit=crop",
        time: "60 mins",
        serves: "10",
        desc: "Melt-in-mouth sweets prepared with pure Parity Desi Ghee."
    }
];

const Recipes = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Culinary Corner</h3>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">
                            Cook with Parity
                        </h2>
                    </div>
                    <button className="hidden md:flex items-center text-brand-dark font-bold hover:text-brand-gold transition-colors">
                        View All Recipes <ArrowRight className="ml-2" size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-72 rounded-[2rem] overflow-hidden mb-6">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4 z-20 flex space-x-4 text-white text-sm font-medium">
                                    <span className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                                        <Clock size={14} className="mr-1" /> {recipe.time}
                                    </span>
                                    <span className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                                        <Users size={14} className="mr-1" /> {recipe.serves}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-gold transition-colors">
                                {recipe.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed mb-4">
                                {recipe.desc}
                            </p>
                            <span className="text-brand-green font-bold text-sm uppercase tracking-wider border-b border-brand-green pb-0.5">Read Recipe</span>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold">
                        View All Recipes
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Recipes;
