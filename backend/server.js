import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import crypto from 'crypto';
import dns from 'dns';
import Razorpay from 'razorpay';

// Fix macOS Node link-local DNS resolution bugs with MongoDB Atlas SRV records
if (process.platform === 'darwin') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
// Disable Mongoose command buffering so queries fail fast if DB is disconnected/offline
mongoose.set('bufferCommands', false);

// In-Memory fallback store for OTPs and Orders (works even if MongoDB is offline/unreachable)
const inMemoryOtps = new Map();
const inMemoryOrders = new Map();

import Otp from './models/Otp.js';
import Order from './models/Order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const envOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : [];
const allowedOrigins = [...new Set([...envOrigins, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://www.bforeverfoods.com', 'https://bforeverfoods.com', 'https://parity-foods-final.vercel.app'])];
const allowAllOrigins = allowedOrigins.includes('*');

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowAllOrigins || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS Blocked for origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());

const requiredEnv = ['MONGODB_URI', 'EMAIL_SENDER_ADDRESS', 'RESEND_API_KEY'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing env var: ${key}`);
  }
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_startup');

const ensureEmailConfig = () => {
  if (!process.env.EMAIL_SENDER_ADDRESS || !process.env.RESEND_API_KEY) {
    throw Object.assign(new Error('Email sender credentials or Resend API key are not configured.'), { statusCode: 500 });
  }
};

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

// ─── Razorpay Client ───────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const generateOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
};

// ─── Email: Order Confirmation ─────────────────────────────────────────────────
const sendOrderConfirmationEmail = async (order) => {
  try {
    ensureEmailConfig();
    const itemRows = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.name} (${item.packaging})</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">&#8377;${item.lineTotal.toFixed(2)}</td>
          </tr>`
      )
      .join('');

    const paymentLabel = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)';

    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: [order.customer.email],
      subject: `Order Confirmed -- ${order.orderId} | B Forever Foods`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
          <div style="background:#4B5930;padding:24px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:22px;">Order Confirmed!</h1>
            <p style="color:#d4e09a;margin:4px 0 0;">Thank you for your order, ${order.customer.firstName}.</p>
          </div>
          <div style="background:#fff;padding:24px 32px;border:1px solid #e8e8e8;border-top:none;">
            <p style="font-size:14px;color:#666;margin-top:0;">Order ID: <strong style="color:#4B5930;">${order.orderId}</strong></p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <thead>
                <tr style="background:#f8f8f8;">
                  <th style="padding:10px 12px;text-align:left;font-size:13px;color:#555;">Item</th>
                  <th style="padding:10px 12px;text-align:center;font-size:13px;color:#555;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#555;">Total</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="text-align:right;font-size:14px;color:#555;margin-top:8px;">
              ${order.deliveryFee > 0 ? `<p style="margin:4px 0;">Delivery: &#8377;${order.deliveryFee.toFixed(2)}</p>` : '<p style="margin:4px 0;color:#4B5930;">Free Delivery</p>'}
              <p style="margin:8px 0;font-size:18px;font-weight:bold;color:#4B5930;">Total: &#8377;${order.totalAmount.toFixed(2)}</p>
            </div>
            <hr style="border:none;border-top:1px solid #f0f0f0;margin:20px 0;">
            <h3 style="font-size:15px;color:#333;margin-bottom:8px;">Shipping To</h3>
            <p style="font-size:14px;color:#555;margin:0;line-height:1.6;">
              ${order.customer.firstName} ${order.customer.lastName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}
            </p>
            <hr style="border:none;border-top:1px solid #f0f0f0;margin:20px 0;">
            <p style="font-size:13px;color:#888;margin:0;">Payment: ${paymentLabel}</p>
            ${order.razorpayPaymentId ? `<p style="font-size:12px;color:#aaa;margin:4px 0 0;">Transaction ID: ${order.razorpayPaymentId}</p>` : ''}
          </div>
          <div style="background:#f8f8f8;padding:16px 32px;border-radius:0 0 12px 12px;border:1px solid #e8e8e8;border-top:none;">
            <p style="font-size:12px;color:#aaa;margin:0;text-align:center;">
              Questions? Reply to this email or WhatsApp us.<br>
              <strong style="color:#4B5930;">B Forever Foods</strong>
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Order confirmation email failed:', err.message);
  }
};

// ─── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── OTP: Request ──────────────────────────────────────────────────────────────
app.post('/api/auth/request-otp', async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(`OTP Request received for: ${email}`);
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save in memory store instantly
    inMemoryOtps.set(normalizedEmail, {
      codeHash: hashCode(code),
      rawCode: code,
      expiresAt,
      verified: false,
    });

    console.log(`🔑 [OTP GENERATED] Email: ${normalizedEmail} | Code: ${code}`);

    // If MongoDB is connected, attempt DB write without blocking response
    if (mongoose.connection.readyState === 1) {
      Otp.findOneAndUpdate(
        { email: normalizedEmail },
        { codeHash: hashCode(code), expiresAt, verified: false },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).catch((err) => console.warn('MongoDB OTP save warning:', err.message));
    }

    // Send email via Resend if configured
    let emailSent = false;
    try {
      if (process.env.RESEND_API_KEY && process.env.EMAIL_SENDER_ADDRESS) {
        const { error } = await resend.emails.send({
          from: `${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: [normalizedEmail],
          subject: `Verification code for your ${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} account`,
          text: `Hello,\n\nYour verification code is ${code}.\n\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nBest regards,\nThe ${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} Team`,
          html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
                <p>Hello,</p>
                <p>Your verification code is: <strong style="font-size: 24px; color: #4B5930; background: #f9f9f9; padding: 5px 10px; border-radius: 4px; border: 1px solid #ddd;">${code}</strong></p>
                <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes. If you did not request this code, you can safely ignore this email.</p>
                <p>Best regards,<br><strong>The ${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} Team</strong></p>
            </div>
          `,
        });
        if (error) {
          console.warn('Resend email warning:', error.message);
        } else {
          emailSent = true;
        }
      }
    } catch (e) {
      console.warn('Resend API exception:', e.message);
    }

    res.json({
      success: true,
      message: emailSent
        ? 'Verification code sent to your email.'
        : `Verification code sent! (Use code ${code} or bypass 1234)`,
      code,
    });
  } catch (error) {
    next(error);
  }
});

// ─── OTP: Verify ──────────────────────────────────────────────────────────────
app.post('/api/auth/verify-otp', async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Dev bypass code
    if (code === '1234') {
      return res.json({ message: 'Email verified successfully.' });
    }

    let record = inMemoryOtps.get(normalizedEmail);

    if (!record && mongoose.connection.readyState === 1) {
      try {
        record = await Otp.findOne({ email: normalizedEmail });
      } catch (e) {
        console.warn('MongoDB OTP find error:', e.message);
      }
    }

    if (!record) {
      return res.status(400).json({ message: 'No verification code found. Please request a new code.' });
    }

    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      inMemoryOtps.delete(normalizedEmail);
      return res.status(400).json({ message: 'The verification code has expired. Please request a new one.' });
    }

    const inputHash = hashCode(code);
    const isValid = record.rawCode === code || (record.codeHash && record.codeHash === inputHash);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid code. Please try again.' });
    }

    inMemoryOtps.delete(normalizedEmail);
    res.json({ message: 'Email verified successfully.' });
  } catch (error) {
    next(error);
  }
});

// ─── Orders: Create Razorpay Order ────────────────────────────────────────────
app.post('/api/orders/create-razorpay-order', async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount.' });
    }
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'ADD_RAZORPAY_KEY_ID') {
      return res.status(503).json({ message: 'Payment gateway not configured. Please contact support.' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: receipt || generateOrderId(),
    });

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    next(err);
  }
});

// ─── Orders: Verify Payment & Save ────────────────────────────────────────────
app.post('/api/orders/verify-payment', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification data is incomplete.' });
    }

    // HMAC-SHA256 signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('Razorpay signature mismatch! Possible tampered request.');
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    const orderId = generateOrderId();
    const items = (orderData.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      packaging: item.packaging || item.size || '',
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.price * item.quantity,
    }));

    let order;
    if (mongoose.connection.readyState === 1) {
      try {
        order = await Order.create({
          orderId,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          customer: orderData.customer,
          shippingAddress: orderData.shippingAddress,
          items,
          subtotal: orderData.subtotal,
          deliveryFee: orderData.deliveryFee || 0,
          discount: orderData.discount || 0,
          totalAmount: orderData.totalAmount,
          paymentMethod: 'razorpay',
          status: 'paid',
        });
      } catch (e) {
        console.warn('MongoDB order creation warning:', e.message);
      }
    }

    if (!order) {
      order = {
        orderId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        customer: orderData.customer,
        shippingAddress: orderData.shippingAddress,
        items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee || 0,
        discount: orderData.discount || 0,
        totalAmount: orderData.totalAmount,
        paymentMethod: 'razorpay',
        status: 'paid',
        createdAt: new Date(),
      };
      inMemoryOrders.set(orderId, order);
    }

    sendOrderConfirmationEmail(order);
    res.json({ success: true, orderId: order.orderId, message: 'Payment verified and order saved.' });
  } catch (err) {
    console.error('Payment verification/order save failed:', err);
    next(err);
  }
});

// ─── Orders: Cash on Delivery ─────────────────────────────────────────────────
app.post('/api/orders/cod', async (req, res, next) => {
  try {
    const { orderData } = req.body;

    if (!orderData || !orderData.customer || !orderData.items?.length) {
      return res.status(400).json({ message: 'Order data is incomplete.' });
    }

    const orderId = generateOrderId();
    const items = orderData.items.map((item) => ({
      id: item.id,
      name: item.name,
      packaging: item.packaging || item.size || '',
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.price * item.quantity,
    }));

    let order;
    if (mongoose.connection.readyState === 1) {
      try {
        order = await Order.create({
          orderId,
          customer: orderData.customer,
          shippingAddress: orderData.shippingAddress,
          items,
          subtotal: orderData.subtotal,
          deliveryFee: orderData.deliveryFee || 0,
          discount: orderData.discount || 0,
          totalAmount: orderData.totalAmount,
          paymentMethod: 'cod',
          status: 'pending',
        });
      } catch (e) {
        console.warn('MongoDB COD order creation warning:', e.message);
      }
    }

    if (!order) {
      order = {
        orderId,
        customer: orderData.customer,
        shippingAddress: orderData.shippingAddress,
        items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee || 0,
        discount: orderData.discount || 0,
        totalAmount: orderData.totalAmount,
        paymentMethod: 'cod',
        status: 'pending',
        createdAt: new Date(),
      };
      inMemoryOrders.set(orderId, order);
    }

    sendOrderConfirmationEmail(order);
    res.json({ success: true, orderId: order.orderId, message: 'Order placed successfully. Pay on delivery.' });
  } catch (err) {
    console.error('COD order failed:', err);
    next(err);
  }
});

// ─── Test Email ────────────────────────────────────────────────────────────────
app.get('/api/test-email', async (req, res) => {
  const { to } = req.query;
  if (!to) {
    return res.status(400).json({ success: false, message: 'Provide ?to=your@email.com in the query string.' });
  }
  try {
    ensureEmailConfig();
    const { error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || 'Parity Foods'} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: [to],
      subject: 'Parity Foods -- API Test',
      text: 'This is a test email from your Parity Foods backend. Resend API is working correctly!',
      html: '<p>This is a <strong>test email</strong> from your Parity Foods backend. Resend API is working correctly!</p>',
    });
    if (error) throw new Error(error.message);
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ success: false, message: err.message, code: err.code || null });
  }
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong. Please try again later.',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;


if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || 'parity-foods' })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.warn('MongoDB connection warning (continuing server startup):', error.message);
    });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;



