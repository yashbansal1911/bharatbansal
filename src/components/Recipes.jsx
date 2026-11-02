import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';

const Recipes = () => {
    const [visibleCards, setVisibleCards] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(recipes.length); // Start at middle copy
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // 3 repetitions for seamless infinite looping
    const extendedRecipes = [...recipes, ...recipes, ...recipes];

    // Detect responsive cards count
    useEffect(() => {
        const updateVisibleCards = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setVisibleCards(1);
            } else if (width < 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(3);
            }
        };
        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    // Active recipe index (0 to recipes.length - 1)
    const activeRecipeIndex = ((currentIndex % recipes.length) + recipes.length) % recipes.length;

    // Auto-scroll effect
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((prev) => prev + 1);
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered]);

    // Re-enable transition after instant snap
    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    // Handle seamless wrap-around when CSS transition finishes
    const handleTransitionEnd = () => {
        if (currentIndex >= recipes.length * 2) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex - recipes.length);
        } else if (currentIndex < recipes.length) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex + recipes.length);
        }
    };

    const handlePrev = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleIndicatorClick = (targetIdx) => {
        const diff = targetIdx - activeRecipeIndex;
        if (diff !== 0) {
            setIsTransitioning(true);
            setCurrentIndex((prev) => prev + diff);
        }
    };

    // Touch swipe handlers
    const handleTouchStart = (e) => {
        setIsHovered(true);
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchStartX.current - touchEndX.current;
            if (diff > 45) {
                handleNext();
            } else if (diff < -45) {
                handlePrev();
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
        setIsHovered(false);
    };

    return (
        <section id="recipes" className="py-20 sm:py-24 bg-white overflow-hidden w-full max-w-full">
            <div className="container mx-auto px-4 sm:px-6 max-w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6">
                    <div>
                        <h3 className="text-brand-gold font-bold tracking-widest uppercase mb-3 sm:mb-4 text-xs sm:text-sm">Culinary Corner</h3>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark">
                            Cook with Parity
                        </h2>
                    </div>
                    <Link to="/recipes" className="hidden md:flex items-center text-brand-dark font-bold hover:text-brand-gold transition-colors">
                        View All Recipes <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>

                {/* Carousel Container */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Carousel Track Wrapper */}
                    <div className="overflow-hidden -mx-3 sm:-mx-4 py-4">
                        <div
                            className="flex"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                                transition: isTransitioning
                                    ? 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)'
                                    : 'none',
                            }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {extendedRecipes.map((recipe, index) => (
                                <div
                                    key={`${recipe.id}-${index}`}
                                    className="flex-shrink-0 px-3 sm:px-4"
                                    style={{ width: `${100 / visibleCards}%` }}
                                >
                                    <div className="group h-full bg-gradient-to-b from-gray-50/70 to-white border border-gray-100 rounded-[2rem] p-4 sm:p-5 hover:shadow-2xl hover:border-brand-gold/40 transition-all duration-500 flex flex-col justify-between">
                                        <Link to={`/recipes/${recipe.id}`} className="block">
                                            <div className="relative h-64 sm:h-72 rounded-[1.5rem] overflow-hidden mb-5">
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                                <img
                                                    src={recipe.image}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute bottom-3 left-3 z-20 flex space-x-2 text-white text-xs sm:text-sm font-medium">
                                                    <span className="flex items-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                                                        <Clock size={12} className="mr-1.5" /> {recipe.time}
                                                    </span>
                                                    <span className="flex items-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                                                        <Users size={12} className="mr-1.5" /> Serves {recipe.serves}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-2.5 group-hover:text-brand-gold transition-colors line-clamp-1">
                                                {recipe.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                                {recipe.desc}
                                            </p>
                                        </Link>

                                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                                            <Link
                                                to={`/recipes/${recipe.id}`}
                                                className="inline-flex items-center text-brand-green font-bold text-sm uppercase tracking-wider hover:text-brand-gold transition-colors"
                                            >
                                                Read Recipe <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                            {recipe.tags && recipe.tags[0] && (
                                                <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                                                    {recipe.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-gray-200 bg-white/95 backdrop-blur flex items-center justify-center text-brand-dark shadow-lg hover:shadow-xl hover:border-brand-gold hover:text-brand-gold hover:scale-105 active:scale-95 transition-all"
                        aria-label="Previous Recipe"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-gray-200 bg-white/95 backdrop-blur flex items-center justify-center text-brand-dark shadow-lg hover:shadow-xl hover:border-brand-gold hover:text-brand-gold hover:scale-105 active:scale-95 transition-all"
                        aria-label="Next Recipe"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>

                {/* Full-length continuous slide indicator line */}
                <div className="relative w-full max-w-xl sm:max-w-2xl mx-auto mt-8 px-4">
                    {/* Background track line */}
                    <div className="relative w-full h-1 bg-gray-200/90 rounded-full overflow-hidden">
                        {/* Smoothly sliding active indicator */}
                        <div
                            className="h-full bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold rounded-full transition-all duration-450 ease-out shadow-sm"
                            style={{
                                width: `${100 / recipes.length}%`,
                                transform: `translateX(${activeRecipeIndex * 100}%)`,
                            }}
                        />
                    </div>

                    {/* Invisible full-width clickable trigger zones */}
                    <div className="absolute inset-0 px-4 flex">
                        {recipes.map((recipe, idx) => (
                            <button
                                key={recipe.id}
                                onClick={() => handleIndicatorClick(idx)}
                                className="flex-1 h-6 -top-2.5 relative cursor-pointer focus:outline-none group"
                                aria-label={`Jump to ${recipe.title}`}
                                title={recipe.title}
                            >
                                <span className="sr-only">{recipe.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Link to="/recipes" className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold inline-block hover:bg-brand-gold transition-colors">
                        View All Recipes
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Recipes;
