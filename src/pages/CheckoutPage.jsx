import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, MapPin, CheckCircle, Truck, Smartphone, ShieldCheck, Loader2, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { State, City } from 'country-state-city';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const OTP_LENGTH = 4;

const CheckoutPage = () => {
    const { cart, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Login, 2: Address, 3: Payment, 4: Success

    // Auth State - Email & Google
    const [otpEmail, setOtpEmail] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpInfo, setOtpInfo] = useState('');
    const [error, setError] = useState('');

    // Handle Google Login (Production Ready & Free)
    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Auto-fill form
            const nameParts = user.displayName ? user.displayName.split(' ') : ['Guest', ''];

            setFormData(prev => ({
                ...prev,
                email: user.email,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || ''
            }));

            setStep(2);
        } catch (err) {
            console.error(err);
            setError("Google Sign-In Failed: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Email OTP (Simulated + EmailJS attempt)
    const handleSendEmailOtp = async (e) => {
        e.preventDefault();
        setError('');
        setOtpInfo('');

        if (!otpEmail || !otpEmail.includes('@')) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSendingOtp(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: otpEmail })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to send verification code.');
            }

            setIsEmailOtpSent(true);
            setOtpInfo(data?.message || 'Verification code sent to your email.');
        } catch (err) {
            console.error('OTP request failed:', err);
            setError(err?.message || 'Failed to send verification code. Please try again.');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyEmailOtp = async (e) => {
        e.preventDefault();
        setError('');
        setOtpInfo('');

        if (emailOtp.length !== OTP_LENGTH) {
            setError(`Please enter the ${OTP_LENGTH}-digit code.`);
            return;
        }

        setIsVerifyingOtp(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: otpEmail, code: emailOtp })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Verification failed');
            }

            setFormData(prev => ({ ...prev, email: otpEmail }));
            setStep(2);
            setOtpInfo(data?.message || 'Email verified successfully.');
        } catch (err) {
            console.error('OTP verification failed:', err);
            setError(err?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === 'expiryDate') {
            // Remove any non-digit characters
            const cleanValue = value.replace(/\D/g, '');

            // Format as MM/YY
            if (cleanValue.length >= 2) {
                newValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
            } else {
                newValue = cleanValue;
            }
        }

        setFormData(prev => {
            const updates = { [name]: newValue };
            if (name === 'state') {
                updates.city = ''; // Reset city when state changes
            }
            return { ...prev, ...updates };
        });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(3);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // Simulate processing
        setTimeout(() => {
            setStep(4);
            window.scrollTo(0, 0);
        }, 1500);
    };

    if (cart.length === 0 && step !== 4) {
        return (
            <div className="pt-36 pb-20 min-h-screen bg-brand-light flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">Your cart is empty</h2>
                    <Link to="/shop" className="text-brand-gold font-bold hover:underline">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-36 pb-20 min-h-screen bg-brand-light">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content - Forms */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-serif font-bold text-brand-dark mb-8">Checkout</h1>

                        {/* Progress Steps */}
                        <div className="flex items-center mb-10 text-sm font-bold overflow-x-auto">
                            <div className={`flex items-center ${step >= 1 ? 'text-brand-gold' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 flex-shrink-0 ${step >= 1 ? 'border-brand-gold bg-brand-gold text-white' : 'border-gray-300'}`}>
                                    {step > 1 ? <CheckCircle size={16} /> : '1'}
                                </div>
                                Login
                            </div>
                            <div className={`flex-grow h-0.5 mx-4 min-w-[20px] ${step >= 2 ? 'bg-brand-gold' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center ${step >= 2 ? 'text-brand-gold' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 flex-shrink-0 ${step >= 2 ? 'border-brand-gold bg-brand-gold text-white' : 'border-gray-300'}`}>
                                    {step > 2 ? <CheckCircle size={16} /> : '2'}
                                </div>
                                Shipping
                            </div>
                            <div className={`flex-grow h-0.5 mx-4 min-w-[20px] ${step >= 3 ? 'bg-brand-gold' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center ${step >= 3 ? 'text-brand-gold' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 flex-shrink-0 ${step >= 3 ? 'border-brand-gold bg-brand-gold text-white' : 'border-gray-300'}`}>
                                    {step > 3 ? <CheckCircle size={16} /> : '3'}
                                </div>
                                Payment
                            </div>
                            <div className={`flex-grow h-0.5 mx-4 min-w-[20px] ${step >= 4 ? 'bg-brand-gold' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center ${step >= 4 ? 'text-brand-gold' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 flex-shrink-0 ${step >= 4 ? 'border-brand-gold bg-brand-gold text-white' : 'border-gray-300'}`}>
                                    4
                                </div>
                                Done
                            </div>
                        </div>

                        {/* Step 1: Login Form */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-2">
                                    <ShieldCheck className="text-brand-gold" /> Login / Verify
                                </h2>

                                {error && (
                                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {error}
                                    </div>
                                )}

                                {otpInfo && (
                                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        {otpInfo}
                                    </div>
                                )}

                                {!isEmailOtpSent ? (
                                    <div className="space-y-6">
                                        <form onSubmit={handleSendEmailOtp}>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={otpEmail}
                                                    onChange={(e) => {
                                                        setOtpEmail(e.target.value);
                                                        setError('');
                                                        setOtpInfo('');
                                                    }}
                                                    placeholder="Enter your email"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                                                />
                                                <p className="text-xs text-gray-400 mt-2">
                                                    We will send a verification code to this email.
                                                </p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSendingOtp}
                                                className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-brand-gold transition-colors shadow-lg flex justify-center items-center"
                                            >
                                                {isSendingOtp ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    "Send OTP via Email"
                                                )}
                                            </button>
                                        </form>

                                        <div className="relative flex py-2 items-center">
                                            <div className="flex-grow border-t border-gray-200"></div>
                                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                                            <div className="flex-grow border-t border-gray-200"></div>
                                        </div>

                                        <button
                                            onClick={handleGoogleLogin}
                                            type="button"
                                            disabled={isLoading}
                                            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                            )}
                                            Sign in with Google
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleVerifyEmailOtp}>
                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Enter Email OTP</label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                                                <input
                                                    type="text"
                                                    value={emailOtp}
                                                    onChange={(e) => {
                                                        setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH));
                                                        setError('');
                                                    }}
                                                    placeholder={`Enter ${OTP_LENGTH}-digit Code`}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none tracking-widest text-lg"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <p className="text-xs text-gray-500">
                                                    Sent to <span className="font-bold text-gray-700">{otpEmail}</span>
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEmailOtpSent(false);
                                                        setEmailOtp('');
                                                        setError('');
                                                        setOtpInfo('');
                                                    }}
                                                    className="text-xs text-brand-gold hover:underline font-bold"
                                                >
                                                    Change Email
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isVerifyingOtp || emailOtp.length !== OTP_LENGTH}
                                            className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                        >
                                            {isVerifyingOtp ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                "Verify & Continue"
                                            )}
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        )}

                        {/* Step 2: Address Form */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-2">
                                    <MapPin className="text-brand-gold" /> Shipping Address
                                </h2>
                                <form onSubmit={handleAddressSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
                                            <div className="relative">
                                                <select
                                                    name="state"
                                                    required
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none appearance-none bg-white text-gray-700"
                                                >
                                                    <option value="">Select State</option>
                                                    {State.getStatesOfCountry('IN').map(state => (
                                                        <option key={state.isoCode} value={state.name}>{state.name}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                                            <div className="relative">
                                                <select
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    disabled={!formData.state}
                                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none appearance-none bg-white text-gray-700 ${!formData.state ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`}
                                                >
                                                    <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                                                    {(() => {
                                                        const selectedState = State.getStatesOfCountry('IN').find(s => s.name === formData.state);
                                                        const cities = selectedState ? City.getCitiesOfState('IN', selectedState.isoCode) : [];
                                                        return cities.map(city => (
                                                            <option key={city.name} value={city.name}>{city.name}</option>
                                                        ));
                                                    })()}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
                                            <input
                                                type="text"
                                                name="zip"
                                                required
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button type="submit" className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-gold transition-colors text-lg shadow-lg">
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 3: Payment Form */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <div className="mb-6">
                                    <div className="mb-6">
                                        <button onClick={() => setStep(2)} className="flex items-center text-gray-500 hover:text-brand-gold font-medium">
                                            <ArrowLeft size={16} className="mr-1" /> Back to Shipping
                                        </button>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-2">
                                    <CreditCard className="text-brand-gold" /> Payment Details
                                </h2>
                                <form onSubmit={handlePaymentSubmit}>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            required
                                            value={formData.cardName}
                                            onChange={handleInputChange}
                                            placeholder="Name on card"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            required
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                required
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                required
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                placeholder="123"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button type="submit" className="bg-brand-green text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors text-lg shadow-lg flex items-center gap-2">
                                            Pay ₹{getCartTotal().toLocaleString()}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 4: Success Message */}
                        {step === 4 && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 text-center"
                            >
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-green">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Order Placed Successfully!</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Thank you for your purchase, {formData.firstName}. We have sent a confirmation email to {formData.email}.
                                </p>
                                <Link to="/" className="inline-block bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-gold transition-colors">
                                    Back to Home
                                </Link>
                            </motion.div>
                        )}

                    </div>

                    {/* Sidebar - Order Summary */}
                    {step !== 4 && (
                        <div className="lg:col-span-1">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2rem] shadow-xl shadow-brand-dark/5 border border-gray-100 overflow-hidden sticky top-32"
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-serif font-bold text-brand-dark">Order Summary</h3>
                                        <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-xs font-bold">
                                            {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                                        </span>
                                    </div>

                                    {/* Scrollable Item List */}
                                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        <AnimatePresence mode="popLayout">
                                            {cart.map((item) => (
                                                <motion.div 
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-brand-gold/20 transition-all group"
                                                >
                                                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 shadow-sm relative">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                        <button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all border border-gray-100"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex-grow flex flex-col justify-between py-1">
                                                        <div>
                                                            <h4 className="font-bold text-brand-dark text-sm leading-tight line-clamp-1">{item.name}</h4>
                                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Premium Mustard Oil</p>
                                                        </div>
                                                        
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                                                                <button 
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-brand-gold transition-colors"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                                <span className="text-xs font-black w-4 text-center text-brand-dark">{item.quantity}</span>
                                                                <button 
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-brand-gold transition-colors"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>
                                                            <span className="text-sm font-bold text-brand-dark">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Promo Code */}
                                    <div className="mb-8">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Promo Code" 
                                                className="w-full pl-4 pr-20 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm"
                                            />
                                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-gold hover:text-brand-dark transition-colors px-3 py-1">
                                                APPLY
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pricing Totals */}
                                    <div className="space-y-4 border-t border-gray-100 pt-6">
                                        <div className="flex justify-between text-gray-500 text-sm font-medium">
                                            <span>Subtotal</span>
                                            <span className="text-brand-dark">₹{getCartTotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500 text-sm font-medium">
                                            <span>Shipping</span>
                                            <span className="text-brand-green font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-1 rounded">Free</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                                            <span className="text-lg font-serif font-bold text-brand-dark">Grand Total</span>
                                            <div className="text-right">
                                                <span className="block text-2xl font-bold text-brand-gold leading-none">₹{getCartTotal().toLocaleString()}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">All taxes included</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Info Area */}
                                <div className="bg-brand-dark p-6 text-white">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                            <Truck className="text-brand-gold" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Delivery Promise</p>
                                            <p className="text-xs text-white/70">Arriving in 3-5 Business Days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4 border-t border-white/10 opacity-50 justify-center">
                                        <ShieldCheck size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">100% Secure Transaction</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
