import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        country: 'India',
        relatedTo: '',
        message: ''
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
        console.log('Form submitted:', formData);
        // Handle form submission logic here
    };

    const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all bg-white/50 backdrop-blur-sm";
    const labelClasses = "block text-sm font-bold text-gray-700 mb-2";

    return (
        <section className="py-24 bg-brand-light relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Get in Touch</h2>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            We are always happy to hear from you. To send us your queries, feedback or suggestions,
                            please fill in the form below and someone from the team will get in touch with you shortly.
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name */}
                            <div>
                                <label className={labelClasses}>Your Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={labelClasses}>Email ID <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className={labelClasses}>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className={labelClasses}>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="Enter your state"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className={labelClasses}>Country</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={inputClasses}
                                >
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Related To */}
                            <div>
                                <label className={labelClasses}>Related To <span className="text-red-500">*</span></label>
                                <select
                                    name="relatedTo"
                                    value={formData.relatedTo}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                >
                                    <option value="">Select a value</option>
                                    <option value="Sales">Sales Inquiry</option>
                                    <option value="Support">Customer Support</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className={labelClasses}>Message <span className="text-red-500">*</span></label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className={inputClasses}
                                placeholder="Message/Query"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center md:text-left">
                            <button
                                type="submit"
                                className="bg-brand-green text-white px-10 py-4 rounded-full font-bold tracking-wide hover:bg-brand-gold transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                SUBMIT
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
