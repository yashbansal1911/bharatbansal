import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Target, Sparkles, ArrowRight } from 'lucide-react';

const cards = [
    {
        id: 'vision',
        eyebrow: 'Our Vision',
        icon: Eye,
        headline: 'Purity is a Right,\nNot a Privilege.',
        body: 'To create a future where purity is a right, not a privilege.',
        accent: '#D19E31',
        bg: 'from-[#2A3013] to-[#4B5930]',
        glow: 'rgba(209,158,49,0.25)',
        delay: 0,
    },
    {
        id: 'mission',
        eyebrow: 'Our Mission',
        icon: Target,
        headline: 'Crafted Pure.\nPriced Fair.',
        body: 'To craft everyday essentials with uncompromising purity, fair value, and complete transparency — sourcing responsibly, testing rigorously, and putting consumer well-being at the heart of every decision.',
        accent: '#4B5930',
        bg: 'from-[#C5920A] to-[#D19E31]',
        glow: 'rgba(75,89,48,0.30)',
        delay: 0.15,
    },
];

const stats = [
    { value: '25+', label: 'Years of Legacy' },
    { value: '100%', label: 'Kachi Ghani Process' },
    { value: '0', label: 'Preservatives Added' },
    { value: '3×', label: 'Filtered for Purity' },
];

const VisionMission = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #FDFBF7 0%, #f5f0e8 50%, #FDFBF7 100%)' }}
        >
            {/* Parallax decorative blobs */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 pointer-events-none"
            >
                <div
                    className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(209,158,49,0.08) 0%, transparent 65%)' }}
                />
                <div
                    className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(75,89,48,0.10) 0%, transparent 65%)' }}
                />
            </motion.div>

            {/* Grain texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }}
            />

            <div className="relative z-10 container mx-auto px-6">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 bg-brand-dark/5 border border-brand-gold/30 px-4 py-2 rounded-full mb-6">
                        <Sparkles size={14} className="text-brand-gold" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-dark">Our Purpose</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark leading-tight">
                        What Drives Us <br />
                        <span className="text-brand-gold italic">Every Single Day</span>
                    </h2>
                    <div className="w-16 h-1 bg-brand-gold mx-auto mt-6 rounded-full" />
                </motion.div>

                {/* Vision & Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
                    {cards.map(({ id, eyebrow, icon: Icon, headline, body, accent, bg, glow, delay }) => (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.7, delay, ease: 'easeOut' }}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            className={`relative rounded-[2rem] bg-gradient-to-br ${bg} p-10 overflow-hidden text-white shadow-2xl cursor-default text-center`}
                        >
                            {/* Glow blob inside card */}
                            <div
                                className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
                                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
                            />

                            {/* Decorative corner lines */}
                            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-white/10 rounded-tr-2xl" />
                            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-white/10 rounded-bl-2xl" />

                            {/* No Icon badge */}

                            {/* Eyebrow — larger */}
                            <p
                                className="text-lg font-bold tracking-[0.25em] uppercase mb-4 text-center"
                                style={{ color: accent === '#D19E31' ? '#D19E31' : 'rgba(255,255,255,0.7)' }}
                            >
                                {eyebrow}
                            </p>

                            {/* Divider — centered */}
                            <div
                                className="w-10 h-0.5 mb-6 rounded-full mx-auto"
                                style={{ background: 'rgba(255,255,255,0.3)' }}
                            />

                            {/* Body — Times New Roman, bold, left-aligned */}
                            <p
                                className="text-white font-bold text-xl md:text-2xl leading-relaxed text-left"
                                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                            >
                                {body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-dark/10 rounded-3xl overflow-hidden shadow-lg">
                        {stats.map(({ value, label }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                className="bg-white/80 backdrop-blur-sm px-6 py-8 text-center group hover:bg-brand-dark transition-colors duration-300"
                            >
                                <div className="text-4xl md:text-5xl font-serif font-bold text-brand-green group-hover:text-brand-gold transition-colors duration-300 mb-1">
                                    {value}
                                </div>
                                <div className="text-xs font-bold tracking-widest uppercase text-gray-500 group-hover:text-white/70 transition-colors duration-300">
                                    {label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default VisionMission;
