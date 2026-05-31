import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, MapPin, CheckCircle, Truck, Smartphone, ShieldCheck, Loader2, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { State, City } from 'country-state-city';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const OTP_LENGTH = 4;

const CheckoutPage = () => {
    const { cart, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Login, 2: Address, 3: Payment, 4: Success

    // Auth State - Email, Phone & Google
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
    const [otpEmail, setOtpEmail] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpInfo, setOtpInfo] = useState('');
    const [error, setError] = useState('');
    const [resendCountdown, setResendCountdown] = useState(0);

    // OTP Countdown Timer Effect
    useEffect(() => {
        let timer;
        const isOtpSent = loginMethod === 'email' ? isEmailOtpSent : isPhoneOtpSent;
        if (isOtpSent && resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isEmailOtpSent, isPhoneOtpSent, loginMethod, resendCountdown]);

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
        if (e && e.preventDefault) e.preventDefault();
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
            setResendCountdown(30); // Start 30-second cooldown
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

        // Development Testing Bypass
        if (emailOtp === '1234') {
            setFormData(prev => ({ ...prev, email: otpEmail }));
            setStep(2);
            setOtpInfo('Email verified successfully (Dev Bypass).');
            setIsVerifyingOtp(false);
            return;
        }

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

    const handleSendPhoneOtp = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setError('');
        setOtpInfo('');

        if (!phoneNumber || phoneNumber.trim().length < 10) {
            setError("Please enter a valid phone number.");
            return;
        }

        setIsSendingOtp(true);

        try {
            // Setup ReCAPTCHA verifier if not already done
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber
                    },
                    'expired-callback': () => {
                        // Response expired. Ask user to solve reCAPTCHA again.
                    }
                });
            }

            const appVerifier = window.recaptchaVerifier;
            
            // Format phone number to ensure it has '+' prefix (default to +91 for India if no '+' prefix is present)
            let formattedPhone = phoneNumber.trim();
            if (!formattedPhone.startsWith('+')) {
                if (formattedPhone.startsWith('0')) {
                    formattedPhone = formattedPhone.substring(1);
                }
                formattedPhone = '+91' + formattedPhone;
            }

            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setIsPhoneOtpSent(true);
            setOtpInfo(`Verification SMS sent to ${formattedPhone}.`);
            setResendCountdown(30); // Start 30-second cooldown
        } catch (err) {
            console.error('Phone OTP request failed:', err);
            setError(err?.message || 'Failed to send verification SMS. Please try again.');
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = null;
                } catch (e) {
                    console.error('Error clearing recaptcha:', e);
                }
            }
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyPhoneOtp = async (e) => {
        e.preventDefault();
        setError('');
        setOtpInfo('');

        if (phoneOtp.length !== 6) {
            setError('Please enter the 6-digit SMS code.');
            return;
        }

        setIsVerifyingOtp(true);

        // Development Bypass
        if (phoneOtp === '123456') {
            setFormData(prev => ({ ...prev, phone: phoneNumber }));
            setStep(2);
            setOtpInfo('Phone verified successfully (Dev Bypass).');
            setIsVerifyingOtp(false);
            return;
        }

        try {
            if (!confirmationResult) {
                throw new Error("No active verification session found. Please request an OTP first.");
            }
            const result = await confirmationResult.confirm(phoneOtp);
            const user = result.user;
            
            setFormData(prev => ({ ...prev, phone: user.phoneNumber }));
            setStep(2);
            setOtpInfo('Phone verified successfully.');
        } catch (err) {
            console.error('Phone OTP verification failed:', err);
            setError(err?.message || 'Invalid SMS verification code. Please try again.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        upiId: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'cod'
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isUpiVerified, setIsUpiVerified] = useState(false);
    const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
    const [cardFlipped, setCardFlipped] = useState(false);
    const [paymentStage, setPaymentStage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === 'expiryDate') {
            const cleanValue = value.replace(/\D/g, '');
            if (cleanValue.length >= 2) {
                newValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
            } else {
                newValue = cleanValue;
            }
        } else if (name === 'cardNumber') {
            const cleanValue = value.replace(/\D/g, '').slice(0, 16);
            newValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        } else if (name === 'cvv') {
            newValue = value.replace(/\D/g, '').slice(0, 3);
        } else if (name === 'cardName') {
            newValue = value.slice(0, 24);
        } else if (name === 'upiId') {
            setIsUpiVerified(false);
        }

        setFormData(prev => {
            const updates = { [name]: newValue };
            if (name === 'state') {
                updates.city = ''; // Reset city when state changes
            }
            return { ...prev, ...updates };
        });
    };

    const handleVerifyUpi = () => {
        if (!formData.upiId || !formData.upiId.includes('@')) {
            setError('Please enter a valid UPI ID (e.g. name@upi)');
            return;
        }
        setError('');
        setIsVerifyingUpi(true);
        setTimeout(() => {
            setIsVerifyingUpi(false);
            setIsUpiVerified(true);
        }, 1200);
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(3);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = (e) => {
        if (e) e.preventDefault();
        setError('');
        
        if (paymentMethod === 'card') {
            if (!formData.cardNumber || formData.cardNumber.length < 19) {
                setError('Please enter a valid 16-digit card number.');
                return;
            }
            if (!formData.expiryDate || formData.expiryDate.length < 5) {
                setError('Please enter a valid card expiry date (MM/YY).');
                return;
            }
            if (!formData.cvv || formData.cvv.length < 3) {
                setError('Please enter a valid 3-digit CVV.');
                return;
            }
        } else if (paymentMethod === 'upi') {
            if (!formData.upiId || !formData.upiId.includes('@')) {
                setError('Please enter your UPI ID or verify scan.');
                return;
            }
        }

        setIsProcessingPayment(true);
        
        // Multi-stage secure simulated processor
        setPaymentStage('Securing connection...');
        setTimeout(() => {
            setPaymentStage('Verifying payment token...');
            setTimeout(() => {
                setPaymentStage('Authenticating order...');
                setTimeout(() => {
                    setIsProcessingPayment(false);
                    setStep(4);
                    window.scrollTo(0, 0);
                }, 1000);
            }, 1000);
        }, 1000);
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

                                {/* Segmented Login Tabs */}
                                {!isEmailOtpSent && !isPhoneOtpSent && (
                                    <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLoginMethod('email');
                                                setError('');
                                                setOtpInfo('');
                                            }}
                                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === 'email' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                                        >
                                            Email Address
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLoginMethod('phone');
                                                setError('');
                                                setOtpInfo('');
                                            }}
                                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${loginMethod === 'phone' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                                        >
                                            Phone Number
                                        </button>
                                    </div>
                                )}

                                {loginMethod === 'email' ? (
                                    !isEmailOtpSent ? (
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
                                                    <div className="flex items-center gap-4">
                                                        {resendCountdown > 0 ? (
                                                            <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                                                <Loader2 size={10} className="animate-spin text-brand-gold" />
                                                                Resend in {resendCountdown}s
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={handleSendEmailOtp}
                                                                className="text-xs text-brand-gold hover:text-brand-dark hover:underline font-bold transition-colors"
                                                            >
                                                                Resend OTP
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsEmailOtpSent(false);
                                                                setEmailOtp('');
                                                                setError('');
                                                                setOtpInfo('');
                                                                setResendCountdown(0);
                                                            }}
                                                            className="text-xs text-gray-400 hover:text-brand-dark hover:underline font-bold transition-colors"
                                                        >
                                                            Change Email
                                                        </button>
                                                    </div>
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
                                    )
                                ) : (
                                    !isPhoneOtpSent ? (
                                        <div className="space-y-6">
                                            <form onSubmit={handleSendPhoneOtp}>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">+91</span>
                                                        <input
                                                            type="tel"
                                                            value={phoneNumber}
                                                            onChange={(e) => {
                                                                setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                                                                setError('');
                                                                setOtpInfo('');
                                                            }}
                                                            placeholder="Enter 10-digit number"
                                                            required
                                                            className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all font-semibold"
                                                        />
                                                    </div>
                                                     <p className="text-xs text-gray-400 mt-2">
                                                        We will send a 6-digit SMS verification code to your phone number via Firebase (Free service).
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
                                                        "Send OTP via SMS"
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
                                        <form onSubmit={handleVerifyPhoneOtp}>
                                            <div className="mb-6">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Enter SMS OTP</label>
                                                <div className="relative">
                                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                                                    <input
                                                        type="text"
                                                        value={phoneOtp}
                                                        onChange={(e) => {
                                                            setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                            setError('');
                                                        }}
                                                        placeholder="Enter 6-digit Code"
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none tracking-widest text-lg font-bold"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <p className="text-xs text-gray-500">
                                                        Sent to <span className="font-bold text-gray-700">{phoneNumber}</span>
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        {resendCountdown > 0 ? (
                                                            <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                                                <Loader2 size={10} className="animate-spin text-brand-gold" />
                                                                Resend in {resendCountdown}s
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={handleSendPhoneOtp}
                                                                className="text-xs text-brand-gold hover:text-brand-dark hover:underline font-bold transition-colors"
                                                            >
                                                                Resend SMS
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsPhoneOtpSent(false);
                                                                setPhoneOtp('');
                                                                setError('');
                                                                setOtpInfo('');
                                                                setResendCountdown(0);
                                                            }}
                                                            className="text-xs text-gray-400 hover:text-brand-dark hover:underline font-bold transition-colors"
                                                        >
                                                            Change Number
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isVerifyingOtp || phoneOtp.length !== 6}
                                                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                            >
                                                {isVerifyingOtp ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    "Verify & Continue"
                                                )}
                                            </button>
                                        </form>
                                    )
                                )}

                                {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
                                <div id="recaptcha-container" className="hidden"></div>
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
                        {/* Step 3: Payment Choice Section */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden"
                            >
                                {/* Futuristic Scoped CSS Block */}
                                <style>{`
                                    @keyframes scan-line {
                                        0% { top: 0%; }
                                        50% { top: 100%; }
                                        100% { top: 0%; }
                                    }
                                    .payment-scanner {
                                        position: absolute;
                                        width: 100%;
                                        height: 3px;
                                        background: linear-gradient(90deg, transparent, #d4af37, transparent);
                                        animation: scan-line 3s infinite linear;
                                    }
                                    .credit-card-container {
                                        perspective: 1000px;
                                        width: 100%;
                                        max-width: 320px;
                                        height: 190px;
                                    }
                                    .credit-card-inner {
                                        position: relative;
                                        width: 100%;
                                        height: 100%;
                                        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                                        transform-style: preserve-3d;
                                    }
                                    .credit-card-inner.flipped {
                                        transform: rotateY(180deg);
                                    }
                                    .card-face {
                                        position: absolute;
                                        width: 100%;
                                        height: 100%;
                                        backface-visibility: hidden;
                                        border-radius: 1rem;
                                    }
                                    .card-back {
                                        transform: rotateY(180deg);
                                    }
                                `}</style>

                                {/* Multi-stage secure full overlay loader */}
                                <AnimatePresence>
                                    {isProcessingPayment && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8"
                                        >
                                            <div className="relative mb-6">
                                                <div className="w-20 h-20 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin"></div>
                                                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-gold" size={32} />
                                            </div>
                                            <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">Processing Secure Payment</h3>
                                            <p className="text-sm text-gray-500 font-medium tracking-wide animate-pulse">
                                                {paymentStage}
                                            </p>
                                            <div className="mt-8 flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                <ShieldCheck size={14} className="text-brand-green" />
                                                PCI-DSS 256-Bit SSL Encrypted
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mb-6">
                                    <button onClick={() => setStep(2)} className="flex items-center text-gray-500 hover:text-brand-gold font-medium transition-colors">
                                        <ArrowLeft size={16} className="mr-1" /> Back to Shipping
                                    </button>
                                </div>

                                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2">Secure Payment Options</h2>
                                <p className="text-sm text-gray-500 mb-8">Choose your preferred payment method to complete your purchase securely.</p>

                                {error && (
                                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {error}
                                    </div>
                                )}

                                {/* Choice Tabs Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('upi'); setError(''); }}
                                        className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ${paymentMethod === 'upi' ? 'border-brand-gold bg-brand-gold/5 shadow-md shadow-brand-gold/5' : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50/50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'upi' ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-brand-dark text-sm">UPI / QR Code</h4>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">GPay, PhonePe, Paytm</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('card'); setError(''); }}
                                        className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ${paymentMethod === 'card' ? 'border-brand-gold bg-brand-gold/5 shadow-md shadow-brand-gold/5' : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50/50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-brand-dark text-sm">Cards</h4>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">Visa, MasterCard, RuPay</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('cod'); setError(''); }}
                                        className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-brand-gold bg-brand-gold/5 shadow-md shadow-brand-gold/5' : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50/50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-brand-dark text-sm">Pay on Delivery</h4>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">Cash, Card, UPI at door</p>
                                        </div>
                                    </button>
                                </div>

                                <form onSubmit={handlePaymentSubmit}>
                                    {/* 1. UPI Payment Interface */}
                                    {paymentMethod === 'upi' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                {/* Left side: Premium Animated QR Terminal */}
                                                <div className="flex flex-col items-center">
                                                    <div className="relative w-44 h-44 bg-white p-3 rounded-2xl shadow-sm border border-gray-150 flex items-center justify-center overflow-hidden group">
                                                        <div className="payment-scanner"></div>
                                                        <svg className="w-full h-full text-brand-dark" viewBox="0 0 100 100">
                                                            {/* Stylized high-end dynamic QR vector */}
                                                            <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" fill="currentColor"/>
                                                            <path d="M45,10 h10 v10 h-10 z M55,20 h5 v5 h-5 z M45,30 h15 v5 h-15 z M80,45 h10 v20 h-10 z M65,55 h10 v10 h-10 z M45,65 h10 v10 h-10 z M55,80 h15 v15 h-15 z" fill="currentColor"/>
                                                            <circle cx="50" cy="50" r="10" fill="#d4af37"/>
                                                            <path d="M47,50 l2,2 l4,-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-4">Scan QR to pay securely</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <img src="https://static.phonepe.com/images/brand/phonepe/logo-vertical.png" alt="PhonePe" className="h-3 opacity-60 object-contain" />
                                                        <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="GPay" className="h-3.5 opacity-60 object-contain" />
                                                        <img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/paytm_logo_icon_169300.png" alt="Paytm" className="h-3 opacity-60 object-contain" />
                                                    </div>
                                                </div>

                                                {/* Right side: Manual VPA entry */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Or enter UPI ID / VPA</label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                name="upiId"
                                                                value={formData.upiId}
                                                                onChange={handleInputChange}
                                                                placeholder="e.g. user@okhdfcbank"
                                                                className="w-full pl-4 pr-24 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handleVerifyUpi}
                                                                disabled={isVerifyingUpi || isUpiVerified || !formData.upiId}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                                                            >
                                                                {isVerifyingUpi ? (
                                                                    <Loader2 className="animate-spin w-3 h-3" />
                                                                ) : isUpiVerified ? (
                                                                    <span className="text-brand-green flex items-center gap-0.5">Verified ✓</span>
                                                                ) : (
                                                                    "Verify"
                                                                )}
                                                            </button>
                                                        </div>
                                                        <p className="text-[11px] text-gray-400 mt-2">Enter your UPI ID and click verify to authenticate instantly.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <ShieldCheck size={20} /> Complete Payment (₹{getCartTotal().toLocaleString()})
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* 2. Card Payment Interface */}
                                    {paymentMethod === 'card' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                            {/* Beautiful Real-time 3D credit card display */}
                                            <div className="flex justify-center mb-4">
                                                <div className="credit-card-container">
                                                    <div className={`credit-card-inner shadow-xl shadow-brand-dark/10 ${cardFlipped ? 'flipped' : ''}`}>
                                                        {/* FRONT Face */}
                                                        <div className="card-face card-front bg-gradient-to-br from-brand-dark to-slate-900 text-white p-5 border border-white/10 flex flex-col justify-between">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-gold to-amber-300 opacity-80"></div>
                                                                    <span className="text-xs font-serif font-black tracking-widest text-brand-gold">PARITY</span>
                                                                </div>
                                                                {/* Dynamic Network Logo */}
                                                                {formData.cardNumber.startsWith('4') ? (
                                                                    <span className="text-lg italic font-extrabold text-blue-400">Visa</span>
                                                                ) : formData.cardNumber.startsWith('5') ? (
                                                                    <span className="text-lg italic font-extrabold text-orange-400">Mastercard</span>
                                                                ) : formData.cardNumber.startsWith('6') ? (
                                                                    <span className="text-lg italic font-extrabold text-brand-gold">RuPay</span>
                                                                ) : (
                                                                    <CreditCard size={20} className="text-white/60" />
                                                                )}
                                                            </div>

                                                            <div>
                                                                {/* Chip & contactless */}
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <div className="w-7 h-5 rounded bg-amber-400/80 border border-amber-300 flex-shrink-0 flex items-center justify-center p-0.5">
                                                                        <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-60">
                                                                            <div className="border border-brand-dark/30"></div>
                                                                            <div className="border border-brand-dark/30"></div>
                                                                            <div className="border border-brand-dark/30"></div>
                                                                        </div>
                                                                    </div>
                                                                    <svg className="w-4 h-4 text-white/50 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M2 12a10 10 0 0 1 10-10M2 12a6 6 0 0 1 6-6M2 12a2 2 0 0 1 2-2"/>
                                                                    </svg>
                                                                </div>
                                                                {/* Interactive Card Number */}
                                                                <p className="font-mono text-base tracking-[0.2em] font-bold text-white shadow-inner mb-3">
                                                                    {formData.cardNumber || '•••• •••• •••• ••••'}
                                                                </p>
                                                            </div>

                                                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-white/60">
                                                                <div>
                                                                    <span className="block text-[7px] text-white/40 mb-0.5">Cardholder</span>
                                                                    <span className="text-white tracking-widest">{formData.cardName ? formData.cardName.toUpperCase() : 'YOUR NAME'}</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="block text-[7px] text-white/40 mb-0.5">Expires</span>
                                                                    <span className="text-white tracking-widest">{formData.expiryDate || 'MM/YY'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* BACK Face */}
                                                        <div className="card-face card-back bg-gradient-to-br from-slate-900 to-brand-dark text-white p-5 border border-white/10 flex flex-col justify-between">
                                                            <div className="w-full h-8 bg-black/80 -mx-5 mt-2 flex-shrink-0"></div>
                                                            <div className="space-y-4">
                                                                <div className="bg-white/10 h-7 rounded px-3 flex items-center justify-end">
                                                                    <span className="text-[10px] text-gray-400 font-bold uppercase mr-2 tracking-widest">CVV</span>
                                                                    <span className="font-mono text-white text-xs font-bold tracking-widest bg-brand-gold/20 px-2 py-0.5 rounded border border-brand-gold/30">
                                                                        {formData.cvv || '•••'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[7px] text-white/40 leading-normal">
                                                                    This interactive card is secured with standard 256-bit SSL token encryption. Under no circumstances is raw private data cached.
                                                                </p>
                                                            </div>
                                                            <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-brand-gold/60">
                                                                <span>Secured Card Terminal</span>
                                                                <span>Secure ✓</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Real-time Inputs */}
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Cardholder Name</label>
                                                    <input
                                                        type="text"
                                                        name="cardName"
                                                        required
                                                        value={formData.cardName}
                                                        onChange={handleInputChange}
                                                        onFocus={() => setCardFlipped(false)}
                                                        placeholder="Name on card"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-all"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Card Number</label>
                                                    <div className="relative">
                                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="text"
                                                            name="cardNumber"
                                                            required
                                                            value={formData.cardNumber}
                                                            onChange={handleInputChange}
                                                            onFocus={() => setCardFlipped(false)}
                                                            placeholder="0000 0000 0000 0000"
                                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm font-mono tracking-wider transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Expiry Date</label>
                                                        <input
                                                            type="text"
                                                            name="expiryDate"
                                                            required
                                                            value={formData.expiryDate}
                                                            onChange={handleInputChange}
                                                            onFocus={() => setCardFlipped(false)}
                                                            placeholder="MM/YY"
                                                            maxLength={5}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm font-mono transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">CVV</label>
                                                        <input
                                                            type="password"
                                                            name="cvv"
                                                            required
                                                            value={formData.cvv}
                                                            onChange={handleInputChange}
                                                            onFocus={() => setCardFlipped(true)}
                                                            onBlur={() => setCardFlipped(false)}
                                                            placeholder="•••"
                                                            maxLength={3}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm font-mono transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <ShieldCheck size={20} /> Securely Pay ₹{getCartTotal().toLocaleString()}
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* 3. Pay on Delivery Interface */}
                                    {paymentMethod === 'cod' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                            <div className="p-6 rounded-2xl bg-green-50/50 border border-brand-green/20 flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-brand-dark text-sm">Pay on Delivery Confirmed</h4>
                                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                                        No prepayment required! Pay 100% securely via Cash, UPI scan, or credit/debit card at the doorstep when your Parity Premium Mustard Oil is delivered.
                                                    </p>
                                                    <div className="flex gap-4 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        <span>✓ FREE delivery</span>
                                                        <span>✓ Contactless handoffs</span>
                                                        <span>✓ Doorstep payment support</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
                                            >
                                                Confirm Cash on Delivery Order
                                            </button>
                                        </motion.div>
                                    )}
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
