import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const products = [
    {
        id: 1,
        name: "Premium Mustard Oil",
        category: "Oils",
        image: "/images/mustard-oil.png",
        price: "₹185",
        desc: "Cold-pressed kachi ghani mustard oil for authentic flavor."
    },
    {
        id: 2,
        name: "Pure Desi Ghee",
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1887&auto=format&fit=crop", // Placeholder
        price: "₹650",
        desc: "Aromatic and granular ghee made from fresh cream."
    },
    {
        id: 3,
        name: "Chana Besan",
        category: "Flours",
        image: "/images/besan-packet.png",
        price: "₹90",
        desc: "Fine ground gram flour perfect for pakoras and sweets."
    },
    {
        id: 4,
        name: "Premium Basmati Rice",
        category: "Staples",
        image: "/images/basmati-rice.jpg",
        price: "₹120",
        desc: "Long grain aromatic rice for your special biryanis."
    }
];

const ProductCard = ({ product }) => (
    <motion.div
        whileHover={{ y: -15 }}
        className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
        <div className="h-80 overflow-hidden relative bg-brand-light">
            <div className="absolute inset-0 bg-brand-accent/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out" />
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-110"
            />


        </div>

        <div className="p-8">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">{product.category}</span>
                    <h3 className="text-2xl font-serif font-bold text-brand-dark mt-2">{product.name}</h3>
                </div>
                <span className="text-xl font-bold text-brand-green">{product.price}</span>
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{product.desc}</p>

            <button className="w-full py-3 border border-gray-200 rounded-xl font-bold text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all flex items-center justify-center">
                View Details <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
        </div>
    </motion.div>
);

const ProductShowcase = () => {
    return (
        <section id="products" className="py-32 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <div className="max-w-2xl">
                        <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-4">Our Products</h3>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark leading-tight">
                            Curated for the <br /> Modern Kitchen
                        </h2>
                    </div>
                    <button className="hidden md:flex items-center text-lg font-bold text-brand-dark hover:text-brand-gold transition-colors border-b-2 border-brand-dark hover:border-brand-gold pb-1">
                        View Full Catalog <ArrowRight className="ml-2" size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-16 md:hidden">
                    <button className="bg-brand-dark text-white px-10 py-4 rounded-full font-bold">
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
