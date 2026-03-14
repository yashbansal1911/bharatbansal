import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
    const formRef = useRef();
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');

        // REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
        // Sign up at https://www.emailjs.com/
        const SERVICE_ID = 'service_67rwggu';
        const TEMPLATE_ID = 'template_93bek1s';
        const PUBLIC_KEY = 'eZOlF2MCM7qqSGGS1';

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then((result) => {
                console.log('Email sent successfully:', result.text);
                setStatus('success');
                setFormData({ name: '', phone: '', email: '', comment: '' });
            }, (error) => {
                console.error('Failed to send email:', error.text);
                setStatus('error');
            });
    };

    const inputClasses = "w-full px-4 py-3 rounded-full border border-gray-300 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all bg-white";
    const labelClasses = "block text-sm font-bold text-gray-700 mb-2";

    return (
        <div className="bg-brand-light min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-serif font-bold text-brand-dark mb-16"
                >
                    Contact
                </motion.h1>

                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Left Side - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Have a question or comment?</h3>
                            <p className="text-gray-600">Use the form below to send us a message or contact us by mail at:</p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                            >
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                                <p className="text-green-700">Your message has been sent successfully. We will get back to you shortly.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-green-600 font-bold hover:text-green-800 underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className={labelClasses}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Comment <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all bg-white resize-none"
                                    ></textarea>
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                                        <AlertCircle size={20} />
                                        <p>Something went wrong. Please try again later or email us directly.</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="bg-red-600 text-white px-8 py-3 font-bold hover:bg-red-700 transition-colors duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Sending...
                                        </>
                                    ) : (
                                        'Submit Contact'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Right Side - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-4xl font-serif font-bold text-brand-dark mb-8">Get In Touch!</h2>

                        <div className="space-y-8">
                            <h3 className="text-3xl font-medium text-gray-800 uppercase tracking-wide">
                                B Forever Foods Pvt Ltd
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-brand-dark mt-1" />
                                    <div>
                                        <p className="text-gray-700 font-medium">Phone: +91-9111512398</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-brand-dark mt-1" />
                                    <div>
                                        <p className="text-gray-700 font-medium">info@bforeverfoods.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-brand-dark mt-1" />
                                    <div>
                                        <p className="text-gray-700 font-medium max-w-sm">
                                            Industrial Area Morena
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
