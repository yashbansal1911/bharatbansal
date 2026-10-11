import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = '919111512398';
const WHATSAPP_MESSAGE = encodeURIComponent(
    'Hello! I have a question about Parity Mustard Oil.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const WhatsAppWidget = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipDismissed, setTooltipDismissed] = useState(false);

    // Show tooltip after 2 seconds on first load
    useEffect(() => {
        const dismissed = sessionStorage.getItem('wa_tooltip_dismissed');
        if (dismissed) {
            setTooltipDismissed(true);
            return;
        }
        const timer = setTimeout(() => setShowTooltip(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Auto-hide tooltip after 6 seconds
    useEffect(() => {
        if (!showTooltip) return;
        const timer = setTimeout(() => {
            setShowTooltip(false);
            setTooltipDismissed(true);
            sessionStorage.setItem('wa_tooltip_dismissed', 'true');
        }, 6000);
        return () => clearTimeout(timer);
    }, [showTooltip]);

    const handleDismissTooltip = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowTooltip(false);
        setTooltipDismissed(true);
        sessionStorage.setItem('wa_tooltip_dismissed', 'true');
    };

    return (
        <div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-end gap-2.5 sm:gap-3"
            aria-label="WhatsApp Chat"
        >
            {/* Tooltip Badge */}
            <AnimatePresence>
                {showTooltip && !tooltipDismissed && (
                    <motion.div
                        key="wa-tooltip"
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="relative bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 max-w-[200px]"
                    >
                        {/* Tail */}
                        <span
                            className="absolute -right-2 bottom-4 w-0 h-0"
                            style={{
                                borderTop: '6px solid transparent',
                                borderBottom: '6px solid transparent',
                                borderLeft: '8px solid #fff',
                                filter: 'drop-shadow(1px 0 1px rgba(0,0,0,0.06))',
                            }}
                        />
                        <button
                            onClick={handleDismissTooltip}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-[10px] font-bold transition-colors"
                            aria-label="Dismiss"
                        >
                            ✕
                        </button>
                        <p className="text-[13px] font-semibold text-gray-800 leading-snug">
                            💬 Chat with us!
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                            We reply instantly on WhatsApp.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* WhatsApp Button */}
            <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.93 }}
                onMouseEnter={() => {
                    if (!tooltipDismissed) setShowTooltip(true);
                }}
                className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300/50 transition-shadow"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
                {/* Pulse ring */}
                <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(37, 211, 102, 0.35)' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* WhatsApp SVG Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-7 h-7 relative z-10"
                    fill="white"
                    aria-hidden="true"
                >
                    <path d="M16.003 2C8.28 2 2.008 8.272 2.008 15.997c0 2.474.655 4.893 1.897 7.016L2 30l7.198-1.878A13.946 13.946 0 0016.003 30C23.726 30 30 23.726 30 16.003 30 8.276 23.726 2 16.003 2zm0 25.472a11.62 11.62 0 01-5.905-1.605l-.422-.252-4.277 1.116 1.14-4.155-.277-.44a11.62 11.62 0 01-1.786-6.139c0-6.418 5.227-11.641 11.645-11.641 6.417 0 11.64 5.223 11.64 11.641 0 6.415-5.223 11.475-11.758 11.475zm6.39-8.703c-.35-.175-2.073-1.02-2.394-1.138-.32-.117-.553-.175-.787.176-.232.35-.901 1.138-1.105 1.372-.203.234-.407.263-.756.088-.35-.175-1.476-.544-2.812-1.734-1.04-.927-1.742-2.072-1.946-2.421-.203-.35-.022-.539.153-.712.157-.155.35-.405.524-.608.174-.203.233-.35.35-.584.117-.234.059-.438-.029-.613-.088-.175-.787-1.898-1.079-2.597-.283-.68-.572-.588-.787-.598-.203-.009-.437-.011-.671-.011a1.288 1.288 0 00-.932.438c-.32.35-1.224 1.195-1.224 2.916s1.254 3.383 1.428 3.616c.175.234 2.468 3.77 5.98 5.286.836.361 1.488.577 1.997.739.84.267 1.605.23 2.209.14.673-.1 2.073-.848 2.366-1.665.291-.818.291-1.52.203-1.665-.087-.145-.32-.232-.67-.407z" />
                </svg>
            </motion.a>
        </div>
    );
};

export default WhatsAppWidget;
