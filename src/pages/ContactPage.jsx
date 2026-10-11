import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
    Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle, 
    ChevronDown, Leaf, Shield, Award, Users, Building, 
    ArrowRight, Check, Handshake 
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import SEOHead from '../components/SEOHead';

const ContactPage = () => {
    const generalFormRef = useRef();
    const distributorFormRef = useRef();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialTab = searchParams.get('tab') === 'partner' ? 'partner' : 'general';
    const [selectedInquiry, setSelectedInquiry] = useState(initialTab); // 'general' or 'partner'
    const [declarationError, setDeclarationError] = useState(false);

    // Sync state if URL search params change externally
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'partner') {
            setSelectedInquiry('partner');
        } else if (tabParam === 'general' || tabParam === 'contact') {
            setSelectedInquiry('general');
        }
    }, [searchParams]);

    const handleTabSwitch = (tab) => {
        setSelectedInquiry(tab);
        setSearchParams(tab === 'partner' ? { tab: 'partner' } : {}, { replace: true });
    };

    // General Form State
    const [generalStatus, setGeneralStatus] = useState('idle'); // idle, sending, success, error
    const [generalData, setGeneralData] = useState({
        name: '',
        phone: '',
        email: '',
        comment: ''
    });

    // Distributor Form State
    const [distributorStatus, setDistributorStatus] = useState('idle'); // idle, sending, success, error
    const [distributorData, setDistributorData] = useState({
        fullName: '',
        mobile: '',
        whatsApp: '',
        email: '',
        firmName: '',
        businessType: 'Distributor',
        gstNumber: '',
        experience: 'Less than 1 year',
        state: '',
        district: '',
        city: '',
        pinCode: '',
        warehouseAvailable: 'Yes',
        warehouseSize: 'Below 500',
        salespersons: 'None',
        declared: false
    });

    // FAQ Accordion State
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // General Form Handlers
    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setGeneralData(prev => ({ ...prev, [name]: value }));
    };

    const handleGeneralSubmit = async (e) => {
        e.preventDefault();
        setGeneralStatus('sending');

        const templateParams = {
            name: generalData.name,
            phone: generalData.phone,
            email: generalData.email,
            message: generalData.comment,
            from_name: generalData.name,
            reply_to: generalData.email,
            to_name: 'Parity Foods Team'
        };

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_CONTACT_SERVICE_ID || 'service_196fkgq',
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_93bek1s',
                templateParams,
                {
                    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '_Uos1mzZcJ6lnkUdy',
                }
            );
            setGeneralStatus('success');
            setGeneralData({ name: '', phone: '', email: '', comment: '' });
        } catch (error) {
            console.error('Failed to send email:', error);
            setGeneralStatus('error');
        }
    };

    // Distributor Form Handlers
    const handleDistributorChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'declared' && checked) {
            setDeclarationError(false);
        }
        setDistributorData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDistributorSubmit = async (e) => {
        e.preventDefault();
        if (!distributorData.declared) {
            setDeclarationError(true);
            const declarationEl = document.getElementById('declaration-checkbox');
            if (declarationEl) {
                declarationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setDeclarationError(false);
        setDistributorStatus('sending');

        try {
            const payload = {
                fullName: distributorData.fullName,
                mobile: distributorData.mobile,
                whatsApp: distributorData.whatsApp || distributorData.mobile,
                email: distributorData.email,
                firmName: distributorData.firmName,
                businessType: distributorData.businessType,
                gstNumber: distributorData.gstNumber,
                experience: distributorData.experience,
                state: distributorData.state,
                district: distributorData.district,
                city: distributorData.city,
                pinCode: distributorData.pinCode,
                warehouseAvailable: distributorData.warehouseAvailable,
                warehouseSize: distributorData.warehouseSize,
                salespersons: distributorData.salespersons,
            };

            // ── Send via Backend API (triggers Resend email to info@bforeverfoods.com) ──
            const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
            const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            const targetUrl = isLocalhost && rawApiUrl ? `${rawApiUrl}/api/partner-inquiry` : '/api/partner-inquiry';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                const res = await fetch(targetUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!res.ok && targetUrl !== '/api/partner-inquiry') {
                    // Fallback to relative URL if localhost direct call failed
                    await fetch('/api/partner-inquiry', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    }).catch(() => {});
                }
            } catch (apiErr) {
                clearTimeout(timeoutId);
                console.warn('Backend partner API fetch error, checking relative endpoint:', apiErr);
                if (targetUrl !== '/api/partner-inquiry') {
                    await fetch('/api/partner-inquiry', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    }).catch(() => {});
                }
            }

            // Optional non-blocking EmailJS notification in background
            try {
                const templateParams = {
                    from_name: distributorData.fullName,
                    reply_to: distributorData.email,
                    to_name: 'Parity Distributor Team',
                    message: `
NEW DISTRIBUTOR INQUIRY:
Full Name: ${distributorData.fullName}
Mobile: ${distributorData.mobile}
WhatsApp: ${distributorData.whatsApp || distributorData.mobile}
Email: ${distributorData.email}
Company: ${distributorData.firmName} (${distributorData.businessType})
GST: ${distributorData.gstNumber || 'N/A'}
Experience: ${distributorData.experience}
Location: ${distributorData.city}, ${distributorData.district}, ${distributorData.state} - ${distributorData.pinCode}
Warehouse: ${distributorData.warehouseAvailable} (${distributorData.warehouseSize} sq ft)
Salespersons: ${distributorData.salespersons}
                    `.trim(),
                };

                emailjs
                    .send(
                        import.meta.env.VITE_EMAILJS_CONTACT_SERVICE_ID || 'service_196fkgq',
                        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_93bek1s',
                        templateParams,
                        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '_Uos1mzZcJ6lnkUdy' }
                    )
                    .catch(() => {});
            } catch (ejsErr) {
                // Ignore error
            }

            // ── Show success immediately & reset form ──
            setDistributorStatus('success');
            setDistributorData({
                fullName: '',
                mobile: '',
                whatsApp: '',
                email: '',
                firmName: '',
                businessType: 'Distributor',
                gstNumber: '',
                experience: 'Less than 1 year',
                state: '',
                district: '',
                city: '',
                pinCode: '',
                warehouseAvailable: 'Yes',
                warehouseSize: 'Below 500',
                salespersons: 'None',
                declared: false,
            });

            scrollToForm();

        } catch (error) {
            console.error('Failed to submit distributor lead:', error);
            setDistributorStatus('error');
        }
    };

    const scrollToForm = () => {
        const formElement = document.getElementById('distributor-application-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const inputClasses = "w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all bg-white text-brand-dark text-[15px]";
    const labelClasses = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2";





    // FAQ list
    const faqs = [
        { q: 'What investment is required?', a: 'Our minimum proposed investment capacity starts from ₹1–5 Lakhs for smaller sub-districts and up to ₹25–50 Lakhs+ for super stockists and regional depots.' },
        { q: 'What margins can distributors expect?', a: 'We offer highly attractive commercial margins ranging from 8% to 15% depending on territory scaling, distribution channels, and volume commitments.' },
        { q: 'Which territories are available?', a: 'We are expanding across North, East, and Central India. Exclusive district-level or city-level distribution rights are awarded based on market network evaluation.' },
        { q: 'How long is the approval process?', a: 'Once you submit a complete verified application along with your GST certificate, our sales management team reviews and contacts you within 2–3 business days.' },
        { q: 'Is marketing support provided?', a: 'Yes! Parity provides comprehensive retail support including standees, banners, visual danglers, sample sachets, local advertisement support, and sales executive assistance.' },
        { q: 'How are products supplied?', a: 'Products are dispatched directly from our processing facilities under double-filtered purity seals using dedicated regional transport hubs.' }
    ];

    return (
        <div className="bg-[#FDFBF7] min-h-screen pt-32 pb-2">
            <SEOHead
                title="Contact & Partner With Parity Mustard Oil | B Forever Foods"
                description="Get in touch with B Forever Foods Pvt Ltd for customer inquiries, bulk orders, wholesale distributorship, and dealership opportunities for Parity Mustard Oil."
                keywords="Contact B Forever Foods, Parity Mustard Oil Distributorship, Wholesale Mustard Oil Dealer, B Forever Foods Phone Number, Kachi Ghani Dealership"
                path="/contact"
                faqs={faqs.map(f => ({ question: f.q, answer: f.a }))}
            />
            <div className="container mx-auto px-6 lg:px-12">
                
                {/* Header Switcher */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200/60 pb-8 mb-16 gap-6">
                    <div>
                        <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase block mb-2">Connect With Us</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">
                            {selectedInquiry === 'general' ? 'Contact Us' : 'Become a Partner'}
                        </h1>
                    </div>

                    {/* Inquiry Type Buttons (Side-by-Side Pill Switcher) */}
                    <div 
                        role="tablist" 
                        aria-label="Inquiry Type" 
                        className="inline-flex items-center p-1.5 bg-white border border-[#D19E31]/70 rounded-full shadow-sm w-full md:w-auto relative"
                    >
                        {/* Contact Us Button */}
                        <button 
                            type="button"
                            role="tab"
                            id="tab-general"
                            aria-controls="panel-general"
                            aria-selected={selectedInquiry === 'general'}
                            onClick={() => handleTabSwitch('general')}
                            className={`relative flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors duration-200 z-10 select-none cursor-pointer ${
                                selectedInquiry === 'general' 
                                    ? 'text-white' 
                                    : 'text-brand-dark/70 hover:text-brand-dark'
                            }`}
                        >
                            {selectedInquiry === 'general' && (
                                <motion.div
                                    layoutId="activeInquiryTab"
                                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                    className="absolute inset-0 bg-brand-dark rounded-full shadow-md -z-10"
                                />
                            )}
                            <Mail size={16} className={`transition-colors ${selectedInquiry === 'general' ? 'text-brand-gold' : 'text-gray-400'}`} />
                            <span>Contact Us</span>
                        </button>

                        {/* Partner With Us Button */}
                        <button 
                            type="button"
                            role="tab"
                            id="tab-partner"
                            aria-controls="panel-partner"
                            aria-selected={selectedInquiry === 'partner'}
                            onClick={() => handleTabSwitch('partner')}
                            className={`relative flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors duration-200 z-10 select-none cursor-pointer ${
                                selectedInquiry === 'partner' 
                                    ? 'text-white' 
                                    : 'text-brand-dark/70 hover:text-brand-dark'
                            }`}
                        >
                            {selectedInquiry === 'partner' && (
                                <motion.div
                                    layoutId="activeInquiryTab"
                                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                    className="absolute inset-0 bg-brand-dark rounded-full shadow-md -z-10"
                                />
                            )}
                            <Handshake size={17} className={`transition-colors ${selectedInquiry === 'partner' ? 'text-brand-gold' : 'text-gray-400'}`} />
                            <span>Partner With Us</span>
                        </button>
                    </div>
                </div>

                {/* ────────────────────────────────────────────────────────
                    TAB A: GENERAL CONTACT
                ──────────────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {selectedInquiry === 'general' && (
                        <motion.div
                            key="general"
                            id="panel-general"
                            role="tabpanel"
                            aria-labelledby="tab-general"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start"
                        >
                            {/* Form Column */}
                            <div className="w-full lg:w-1/2">
                                <div className="mb-10">
                                    <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">Have a question or comment?</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        Use the form below to send us a message and our customer service team will get back to you shortly.
                                    </p>
                                </div>

                                {generalStatus === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-50/50 border border-green-100 rounded-3xl p-8 text-center shadow-sm"
                                    >
                                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                        <h3 className="text-2xl font-serif font-bold text-green-800 mb-2">Message Sent!</h3>
                                        <p className="text-green-700 text-sm leading-relaxed max-w-sm mx-auto">
                                            Thank you for reaching out. We have successfully received your inquiry and will respond within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => setGeneralStatus('idle')}
                                            className="mt-6 bg-brand-dark hover:bg-brand-gold text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form ref={generalFormRef} onSubmit={handleGeneralSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={labelClasses}>Name <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={generalData.name}
                                                    onChange={handleGeneralChange}
                                                    required
                                                    className={inputClasses}
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={generalData.phone}
                                                    onChange={handleGeneralChange}
                                                    className={inputClasses}
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={generalData.email}
                                                onChange={handleGeneralChange}
                                                required
                                                className={inputClasses}
                                                placeholder="Enter email address"
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>Message / Comment <span className="text-red-500">*</span></label>
                                            <textarea
                                                name="comment"
                                                value={generalData.comment}
                                                onChange={handleGeneralChange}
                                                required
                                                rows="5"
                                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all bg-white resize-none text-[15px] text-brand-dark"
                                                placeholder="Write your query details here..."
                                            ></textarea>
                                        </div>

                                        {generalStatus === 'error' && (
                                            <div className="flex items-center gap-3 text-red-700 bg-red-50/50 border border-red-100 p-4 rounded-xl text-sm">
                                                <AlertCircle className="flex-shrink-0 text-red-500" size={18} />
                                                <p>Failed to send message. Please check connection and try again.</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={generalStatus === 'sending'}
                                            className="bg-brand-gold hover:bg-brand-dark text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                        >
                                            {generalStatus === 'sending' ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} />
                                                    Sending Query
                                                </>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Contact Info Column */}
                            <div className="w-full lg:w-1/2 lg:pl-12">
                                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-sm space-y-10">
                                    <div>
                                        <span className="text-brand-gold text-[10px] font-bold tracking-[0.25em] uppercase block mb-3">Headquarters</span>
                                        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">B Forever Foods Pvt Ltd</h2>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Providing premium double-filtered, cold-pressed edible oil seeds since 1998. Committed to maintaining peak purity.
                                        </p>
                                    </div>

                                    <div className="space-y-6 border-t border-gray-100 pt-8">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-gold flex-shrink-0">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Call Us</span>
                                                <p className="text-brand-dark font-bold text-base">+91-9111512398</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-gold flex-shrink-0">
                                                <Mail size={18} />
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Email Address</span>
                                                <p className="text-brand-dark font-bold text-base">info@bforeverfoods.com</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-gold flex-shrink-0">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Office Location</span>
                                                <p className="text-brand-dark font-bold text-base max-w-sm">
                                                    Industrial Area Morena, Madhya Pradesh, India
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ────────────────────────────────────────────────────────
                        TAB B: PARTNER WITH US (DISTRIBUTOR LANDING PAGE)
                    ──────────────────────────────────────────────────────── */}
                    {selectedInquiry === 'partner' && (
                        <motion.div
                            key="partner"
                            id="panel-partner"
                            role="tabpanel"
                            aria-labelledby="tab-partner"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-24"
                        >
                            {/* 1. Hero Section */}
                            <section 
                                className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-16 flex items-center min-h-[500px]"
                                style={{ background: 'linear-gradient(135deg, #102410 0%, #1c361c 60%, #294c29 100%)' }}
                            >
                                <div className="absolute inset-0 opacity-[0.03]"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(45deg, #D19E31 0, #D19E31 1px, transparent 0, transparent 28px)',
                                        backgroundSize: '28px 28px'
                                    }}
                                />
                                <div className="relative z-10 max-w-3xl text-white">
                                    <span className="bg-brand-gold text-brand-dark text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase inline-block mb-6 shadow-sm">
                                        Exclusive Channel Opportunities
                                    </span>
                                    <h2 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-6">
                                        Grow Your Business with Parity Mustard Oil
                                    </h2>
                                    <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-8 max-w-2xl">
                                        Join our expanding distributor network and partner with a trusted edible oil brand delivering quality, purity, and strong market demand.
                                    </p>
                                    <button 
                                        onClick={scrollToForm}
                                        className="bg-brand-gold hover:bg-white text-brand-dark font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
                                    >
                                        Apply for Distributorship
                                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                
                                {/* Absolute floating bottle illustration */}
                                <div className="absolute right-6 lg:right-12 bottom-0 top-12 w-1/3 hidden md:flex items-center justify-center select-none pointer-events-none">
                                    <img src="/images/parity-mustard-oil-bottle.png" alt="Parity Jar" className="h-full max-h-[420px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]" />
                                </div>
                            </section>





                            {/* 4. Business Potential Section */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase block">Market Potential</span>
                                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark leading-tight">
                                        Secure a Profitable Share in an Essential Market
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        The Indian edible oil sector is one of the fastest growing FMCG categories. Consumers are moving rapidly towards traditional cold-pressed, kachi ghani options that retain health properties. Parity Mustard Oil serves this high-volume segment with double-filtered absolute purity.
                                    </p>
                                </div>
                                
                                {/* Infographic Style Box */}
                                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm grid grid-cols-2 gap-6 divide-x-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                    <div className="space-y-2 p-2">
                                        <div className="text-4xl font-bold text-brand-dark">₹1.5L+ Cr</div>
                                        <div className="text-xs uppercase font-bold tracking-wider text-brand-gold">Edible Oil Market</div>
                                        <p className="text-gray-400 text-[11px]">Huge consumer addressable market size across India.</p>
                                    </div>
                                    <div className="space-y-2 p-2 md:pl-8">
                                        <div className="text-4xl font-bold text-brand-dark">85%+</div>
                                        <div className="text-xs uppercase font-bold tracking-wider text-brand-gold">Repeat Purchase</div>
                                        <p className="text-gray-400 text-[11px]">Regular kitchen usage guarantees high monthly volume turnover.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 5. Distributor Application Form */}
                            <section id="distributor-application-form" className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-12 shadow-sm space-y-10">
                                <div className="border-b border-gray-100 pb-6">
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">Distributor Application Form</h3>
                                    <p className="text-gray-400 text-xs mt-1">Please provide accurate verification details. All fields marked with * are mandatory.</p>
                                </div>

                                {distributorStatus === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-50/50 border border-green-100 rounded-3xl p-12 text-center shadow-sm max-w-xl mx-auto"
                                    >
                                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                        <h3 className="text-2xl font-serif font-bold text-green-800 mb-2">Application Submitted!</h3>
                                        <p className="text-green-700 text-sm leading-relaxed">
                                            Your distributor profile has been registered successfully. Our channel partner development team will review your credentials and contact you within 2–3 business days.
                                        </p>
                                        <button
                                            onClick={() => setDistributorStatus('idle')}
                                            className="mt-6 bg-brand-dark hover:bg-brand-gold text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all"
                                        >
                                            Submit another application
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form ref={distributorFormRef} onSubmit={handleDistributorSubmit} className="space-y-12">
                                        
                                        {/* SECTION 1: Personal Details */}
                                        <div className="space-y-6">
                                            <h4 className="text-base font-bold text-brand-dark border-l-4 border-brand-gold pl-3">1. Personal Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={labelClasses}>Full Name *</label>
                                                    <input type="text" name="fullName" value={distributorData.fullName} onChange={handleDistributorChange} required className={inputClasses} placeholder="Enter your full name" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Email Address *</label>
                                                    <input type="email" name="email" value={distributorData.email} onChange={handleDistributorChange} required className={inputClasses} placeholder="Enter email address" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Mobile Number *</label>
                                                    <input type="tel" name="mobile" value={distributorData.mobile} onChange={handleDistributorChange} required className={inputClasses} placeholder="Enter active mobile number" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>WhatsApp Number</label>
                                                    <input type="tel" name="whatsApp" value={distributorData.whatsApp} onChange={handleDistributorChange} className={inputClasses} placeholder="Enter WhatsApp number (optional)" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 2: Business Details */}
                                        <div className="space-y-6">
                                            <h4 className="text-base font-bold text-brand-dark border-l-4 border-brand-gold pl-3">2. Business Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={labelClasses}>Firm/Company Name *</label>
                                                    <input type="text" name="firmName" value={distributorData.firmName} onChange={handleDistributorChange} required className={inputClasses} placeholder="Enter business name" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Business Type *</label>
                                                    <select name="businessType" value={distributorData.businessType} onChange={handleDistributorChange} required className={inputClasses}>
                                                        <option value="Distributor">Distributor</option>
                                                        <option value="Super Stockist">Super Stockist</option>
                                                        <option value="Wholesaler">Wholesaler</option>
                                                        <option value="Retail Chain">Retail Chain</option>
                                                        <option value="C&F Agent">C&F Agent</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>GST Number (Optional)</label>
                                                    <input type="text" name="gstNumber" value={distributorData.gstNumber} onChange={handleDistributorChange} className={inputClasses} placeholder="Enter 15-digit GSTIN (if available)" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Years of Business Experience *</label>
                                                    <select name="experience" value={distributorData.experience} onChange={handleDistributorChange} required className={inputClasses}>
                                                        <option value="Less than 1 year">Less than 1 year</option>
                                                        <option value="1–3 years">1–3 years</option>
                                                        <option value="3–5 years">3–5 years</option>
                                                        <option value="5–10 years">5–10 years</option>
                                                        <option value="10+ years">10+ years</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 3: Location Details */}
                                        <div className="space-y-6">
                                            <h4 className="text-base font-bold text-brand-dark border-l-4 border-brand-gold pl-3">3. Location Details</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClasses}>State *</label>
                                                    <input type="text" name="state" value={distributorData.state} onChange={handleDistributorChange} required className={inputClasses} placeholder="e.g. Madhya Pradesh" />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClasses}>District *</label>
                                                    <input type="text" name="district" value={distributorData.district} onChange={handleDistributorChange} required className={inputClasses} placeholder="e.g. Morena" />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClasses}>City *</label>
                                                    <input type="text" name="city" value={distributorData.city} onChange={handleDistributorChange} required className={inputClasses} placeholder="e.g. Gwalior" />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className={labelClasses}>Pin Code *</label>
                                                    <input type="text" name="pinCode" value={distributorData.pinCode} onChange={handleDistributorChange} required className={inputClasses} placeholder="e.g. 476001" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 4: Infrastructure Details */}
                                        <div className="space-y-6">
                                            <h4 className="text-base font-bold text-brand-dark border-l-4 border-brand-gold pl-3">4. Infrastructure Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className={labelClasses}>Warehouse Available? *</label>
                                                    <div className="flex gap-6 mt-3">
                                                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-brand-dark">
                                                            <input type="radio" name="warehouseAvailable" value="Yes" checked={distributorData.warehouseAvailable === 'Yes'} onChange={handleDistributorChange} className="accent-brand-gold" /> Yes
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-brand-dark">
                                                            <input type="radio" name="warehouseAvailable" value="No" checked={distributorData.warehouseAvailable === 'No'} onChange={handleDistributorChange} className="accent-brand-gold" /> No
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Warehouse Size (sq ft)</label>
                                                    <select name="warehouseSize" value={distributorData.warehouseSize} onChange={handleDistributorChange} className={inputClasses}>
                                                        <option value="Below 500">Below 500</option>
                                                        <option value="500–1000">500–1000</option>
                                                        <option value="1000–3000">1000–3000</option>
                                                        <option value="3000–5000">3000–5000</option>
                                                        <option value="5000+">5000+</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Number of Salespersons</label>
                                                    <select name="salespersons" value={distributorData.salespersons} onChange={handleDistributorChange} className={inputClasses}>
                                                        <option value="None">None</option>
                                                        <option value="1–3">1–3</option>
                                                        <option value="4–10">4–10</option>
                                                        <option value="10+">10+</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Declaration Checkbox */}
                                        <div id="declaration-checkbox" className={`border-t border-gray-100 pt-8 transition-all ${declarationError ? 'p-4 bg-red-50/60 rounded-2xl border border-red-200' : ''}`}>
                                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                                <input type="checkbox" name="declared" checked={distributorData.declared} onChange={handleDistributorChange} className="w-5 h-5 rounded border-gray-200 accent-brand-gold text-white mt-0.5 flex-shrink-0" />
                                                <span className={`text-xs leading-relaxed font-semibold ${declarationError ? 'text-red-700 font-bold' : 'text-gray-500'}`}>
                                                    I confirm that the information provided is accurate and I am genuinely interested in becoming an authorized Parity Mustard Oil distributor.
                                                </span>
                                            </label>
                                            {declarationError && (
                                                <p className="text-red-600 text-xs font-semibold mt-2 pl-8">
                                                    Please check the confirmation box above to submit your inquiry.
                                                </p>
                                            )}
                                        </div>

                                        {distributorStatus === 'error' && (
                                            <div className="flex items-center gap-3 text-red-700 bg-red-50 border border-red-100 p-4 rounded-xl text-sm">
                                                <AlertCircle className="flex-shrink-0 text-red-500" size={18} />
                                                <p>Failed to send distributor lead. Please fill all required fields and check your connection.</p>
                                            </div>
                                        )}

                                        {/* Button */}
                                        <button 
                                            type="submit"
                                            disabled={distributorStatus === 'sending'}
                                            className="w-full bg-brand-gold hover:bg-brand-dark text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {distributorStatus === 'sending' ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} />
                                                    Submitting Application...
                                                </>
                                            ) : (
                                                'Submit Distributor Application'
                                            )}
                                        </button>
                                    </form>
                                )}
                            </section>

                            {/* 6. Trust Building Section */}
                            <section className="bg-brand-dark text-white rounded-[2.5rem] p-8 md:p-16 text-center space-y-12">
                                <div className="max-w-xl mx-auto space-y-3">
                                    <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase block">Assurance</span>
                                    <h3 className="text-3xl md:text-4xl font-serif font-bold">Standard of Excellence</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                                    <div className="space-y-2">
                                        <Award className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                                        <h4 className="font-bold text-sm">ISO Quality Standards</h4>
                                        <p className="text-gray-400 text-xs">Standardized manufacturing processes for consistent safety.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Shield className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                                        <h4 className="font-bold text-sm">FSSAI Certified Products</h4>
                                        <p className="text-gray-400 text-xs">100% compliant with standard edible oil regulations.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Leaf className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                                        <h4 className="font-bold text-sm">Trusted Manufacturing Process</h4>
                                        <p className="text-gray-400 text-xs">Traditional kachi ghani process to retain vital nutrients.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Users className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                                        <h4 className="font-bold text-sm">Wide Distribution Vision</h4>
                                        <p className="text-gray-400 text-xs">Building lasting connections throughout rural & urban centers.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Building className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                                        <h4 className="font-bold text-sm">Dedicated Partner Support</h4>
                                        <p className="text-gray-400 text-xs">Constant interaction with our regional channel executives.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 7. FAQ Section */}
                            <section className="space-y-12">
                                <div className="text-center max-w-xl mx-auto">
                                    <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase block mb-3">Support</span>
                                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Frequently Asked Questions</h3>
                                </div>
                                <div className="max-w-3xl mx-auto space-y-4">
                                    {faqs.map(({ q, a }, index) => {
                                        const isOpen = openFaqIndex === index;
                                        return (
                                            <div key={q} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all shadow-sm">
                                                <button
                                                    onClick={() => toggleFaq(index)}
                                                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-brand-dark hover:text-brand-gold transition-colors text-[15px]"
                                                >
                                                    <span>{q}</span>
                                                    <ChevronDown size={16} className={`text-brand-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                
                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-50/50 pt-4">
                                                                {a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* 8. Final CTA Section */}
                            <section className="bg-brand-light rounded-[2.5rem] p-8 md:p-16 text-center space-y-8 border border-gray-100">
                                <div className="max-w-2xl mx-auto space-y-4">
                                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark">
                                        Ready to Build a Profitable Partnership?
                                    </h3>
                                    <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
                                        Join Parity Mustard Oil's growing distribution network and bring premium quality products to customers across India.
                                    </p>
                                </div>
                                <button 
                                    onClick={scrollToForm}
                                    className="bg-brand-gold hover:bg-brand-dark text-white font-bold px-10 py-4 rounded-full text-sm uppercase tracking-widest transition-all shadow-md"
                                >
                                    Submit Distributor Application
                                </button>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ContactPage;
