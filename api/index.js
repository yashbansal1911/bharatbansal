import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import crypto from 'crypto';
import Razorpay from 'razorpay';

dotenv.config();

// ─── In-Memory Fallback Stores ────────────────────────────────────────────────
const inMemoryOtps = new Map();
const inMemoryOrders = new Map();

// ─── Mongoose Models ──────────────────────────────────────────────────────────
mongoose.set('bufferCommands', false);

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });
const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  packaging: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  lineTotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'pending' },
}, { timestamps: true });
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// ─── DB Connection (cached for serverless warm reuse) ─────────────────────────
let dbConnected = false;
async function connectDB() {
  if (dbConnected || mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.warn('MONGODB_URI not set — running without DB'); return; }
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'parity-foods' });
    dbConnected = true;
    console.log('MongoDB connected');
  } catch (e) {
    console.warn('MongoDB connection failed (continuing):', e.message);
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();
const generateOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
};
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const getResend = () => new Resend(process.env.RESEND_API_KEY || '');
const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// ─── DB connect middleware ────────────────────────────────────────────────────
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ─── OTP: Request ────────────────────────────────────────────────────────────
app.post('/api/auth/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalizedEmail = email.trim().toLowerCase();
    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store in memory instantly
    inMemoryOtps.set(normalizedEmail, { codeHash: hashCode(code), rawCode: code, expiresAt });
    console.log(`[OTP] Generated for ${normalizedEmail}: ${code}`);

    // Async DB write (non-blocking)
    if (mongoose.connection.readyState === 1) {
      Otp.findOneAndUpdate(
        { email: normalizedEmail },
        { codeHash: hashCode(code), expiresAt, verified: false },
        { upsert: true, new: true }
      ).catch((e) => console.warn('[OTP] DB save warning:', e.message));
    }

    // Send email
    let emailSent = false;
    if (process.env.RESEND_API_KEY && process.env.EMAIL_SENDER_ADDRESS) {
      try {
        const { error } = await getResend().emails.send({
          from: `${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: [normalizedEmail],
          subject: `Your verification code — ${process.env.EMAIL_FROM_NAME || 'B Forever Foods'}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#333;">
              <div style="background:#4B5930;padding:20px 32px;border-radius:12px 12px 0 0;">
                <h2 style="color:#fff;margin:0;font-size:18px;">Email Verification</h2>
              </div>
              <div style="background:#fff;padding:24px 32px;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;">
                <p style="margin:0 0 16px;">Hello,</p>
                <p style="margin:0 0 16px;">Your verification code is:</p>
                <div style="text-align:center;padding:20px;background:#f9f9f9;border-radius:8px;border:1px solid #ddd;margin:0 0 16px;">
                  <strong style="font-size:36px;letter-spacing:12px;color:#4B5930;">${code}</strong>
                </div>
                <p style="margin:0 0 8px;color:#666;font-size:14px;">This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
                <p style="margin:0;color:#666;font-size:14px;">If you didn't request this, you can safely ignore this email.</p>
              </div>
            </div>
          `,
        });
        if (!error) emailSent = true;
        else console.warn('[OTP] Resend warning:', error.message);
      } catch (e) {
        console.warn('[OTP] Resend exception:', e.message);
      }
    }

    res.json({
      success: true,
      message: 'Verification code sent to your email.',
      code,
      emailSent,
    });
  } catch (err) {
    console.error('[OTP] request-otp error:', err);
    res.status(500).json({ message: err.message || 'Failed to send OTP' });
  }
});

// ─── OTP: Verify ─────────────────────────────────────────────────────────────
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

    const normalizedEmail = email.trim().toLowerCase();

    // Dev bypass
    if (code === '1234') return res.json({ message: 'Email verified successfully.' });

    // Check memory first, then DB
    let record = inMemoryOtps.get(normalizedEmail);
    if (!record && mongoose.connection.readyState === 1) {
      try { record = await Otp.findOne({ email: normalizedEmail }); } catch (e) {}
    }

    if (!record) return res.status(400).json({ message: 'No verification code found. Please request a new code.' });
    if (new Date(record.expiresAt) < new Date()) {
      inMemoryOtps.delete(normalizedEmail);
      return res.status(400).json({ message: 'Code has expired. Please request a new one.' });
    }

    const isValid = record.rawCode === code || hashCode(code) === record.codeHash;
    if (!isValid) return res.status(400).json({ message: 'Invalid code. Please try again.' });

    inMemoryOtps.delete(normalizedEmail);
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('[OTP] verify-otp error:', err);
    res.status(500).json({ message: err.message || 'Verification failed' });
  }
});

// ─── Orders: Create Razorpay Order ───────────────────────────────────────────
app.post('/api/orders/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) return res.status(400).json({ message: 'Invalid amount.' });
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'ADD_RAZORPAY_KEY_ID') {
      return res.status(503).json({ message: 'Payment gateway not configured.' });
    }
    const order = await getRazorpay().orders.create({ amount: Math.round(amount * 100), currency, receipt: receipt || generateOrderId() });
    res.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('[Orders] Razorpay create failed:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Orders: Verify Payment & Save ───────────────────────────────────────────
app.post('/api/orders/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Incomplete payment verification data.' });
    }
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ message: 'Payment verification failed.' });

    const orderId = generateOrderId();
    const items = (orderData.items || []).map((i) => ({ id: i.id, name: i.name, packaging: i.packaging || i.size || '', quantity: i.quantity, price: i.price, lineTotal: i.price * i.quantity }));
    let order = { orderId, razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, customer: orderData.customer, shippingAddress: orderData.shippingAddress, items, subtotal: orderData.subtotal, deliveryFee: orderData.deliveryFee || 0, discount: orderData.discount || 0, totalAmount: orderData.totalAmount, paymentMethod: 'razorpay', status: 'paid' };

    if (mongoose.connection.readyState === 1) {
      try { order = await Order.create({ ...order, razorpaySignature: razorpay_signature }); } catch (e) { console.warn('[Orders] DB save warning:', e.message); inMemoryOrders.set(orderId, order); }
    } else { inMemoryOrders.set(orderId, order); }

    sendOrderEmail(order).catch(() => {});
    res.json({ success: true, orderId: order.orderId, message: 'Payment verified and order saved.' });
  } catch (err) {
    console.error('[Orders] verify-payment error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Orders: COD ─────────────────────────────────────────────────────────────
app.post('/api/orders/cod', async (req, res) => {
  try {
    const { orderData } = req.body;
    if (!orderData?.customer || !orderData.items?.length) return res.status(400).json({ message: 'Incomplete order data.' });

    const orderId = generateOrderId();
    const items = orderData.items.map((i) => ({ id: i.id, name: i.name, packaging: i.packaging || i.size || '', quantity: i.quantity, price: i.price, lineTotal: i.price * i.quantity }));
    let order = { orderId, customer: orderData.customer, shippingAddress: orderData.shippingAddress, items, subtotal: orderData.subtotal, deliveryFee: orderData.deliveryFee || 0, discount: orderData.discount || 0, totalAmount: orderData.totalAmount, paymentMethod: 'cod', status: 'pending' };

    if (mongoose.connection.readyState === 1) {
      try { order = await Order.create(order); } catch (e) { console.warn('[Orders] DB save warning:', e.message); inMemoryOrders.set(orderId, order); }
    } else { inMemoryOrders.set(orderId, order); }

    sendOrderEmail(order).catch(() => {});
    res.json({ success: true, orderId: order.orderId, message: 'Order placed successfully. Pay on delivery.' });
  } catch (err) {
    console.error('[Orders] COD error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Order Confirmation Email ─────────────────────────────────────────────────
async function sendOrderEmail(order) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_SENDER_ADDRESS) return;
  try {
    const rows = (order.items || []).map((i) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${i.name} (${i.packaging})</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${Number(i.lineTotal).toFixed(2)}</td></tr>`).join('');
    await getResend().emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: [order.customer.email],
      subject: `Order Confirmed – ${order.orderId} | B Forever Foods`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><div style="background:#4B5930;padding:24px 32px;border-radius:12px 12px 0 0;"><h1 style="color:#fff;margin:0;font-size:22px;">Order Confirmed!</h1><p style="color:#d4e09a;margin:4px 0 0;">Thank you, ${order.customer.firstName}.</p></div><div style="padding:24px 32px;border:1px solid #e8e8e8;border-top:none;"><p>Order ID: <strong style="color:#4B5930;">${order.orderId}</strong></p><table style="width:100%;border-collapse:collapse;">${rows}</table><p style="text-align:right;font-size:18px;font-weight:bold;color:#4B5930;">Total: ₹${Number(order.totalAmount).toFixed(2)}</p></div></div>`,
    });
  } catch (e) { console.warn('[Email] Order confirmation failed:', e.message); }
}

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
});

export default app;
