import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Filter, Search } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
    const { addToCart } = useCart();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(product => {
        const matchesCategory = filter === 'All' || product.category === filter;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="pt-36 pb-20 min-h-screen bg-brand-light">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark mb-4">
                        Our Production
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Browse our collection of premium, naturally sourced products.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${filter === cat
                                    ? 'bg-brand-dark text-white shadow-lg'
                                    : 'bg-white text-brand-dark hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 pl-12 pr-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-white"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                            <div className="relative h-72 overflow-hidden bg-gray-50/50 p-6 flex items-center justify-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-dark shadow-sm">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2">{product.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">{product.desc}</p>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-2xl font-bold text-brand-green">{product.currency}{product.price}</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-gold transition-colors flex items-center gap-2"
                                    >
                                        Add <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-400">No products found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPage;
