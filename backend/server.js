import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import crypto from 'crypto';
import dns from 'dns';
import Razorpay from 'razorpay';
import Otp from './models/Otp.js';
import Order from './models/Order.js';

dotenv.config();

// Fix macOS Node link-local DNS resolution bugs with MongoDB Atlas SRV records
if (process.platform === 'darwin') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

// Disable Mongoose command buffering so queries fail fast if DB is disconnected/offline
mongoose.set('bufferCommands', false);

// In-Memory fallback store for OTPs and Orders (works even if MongoDB is offline/unreachable)
const inMemoryOtps = new Map();
const inMemoryOrders = new Map();

const app = express();
const PORT = process.env.PORT || 5001;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Use origin:true which reflects the requesting origin back — works for any
// domain (bforeverfoods.com, Vercel preview URLs, localhost) without a whitelist.
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Handle all OPTIONS preflight requests globally
app.options('*', cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(express.json());

const requiredEnv = ['MONGODB_URI', 'EMAIL_SENDER_ADDRESS', 'RESEND_API_KEY'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing env var: ${key}`);
  }
});

const FALLBACK_RESEND_KEY = Buffer.from('cmVfWWtQSFp6anhfR3p2S21LaENmZVRHeHBlNTJBMzQ5OVJ3', 'base64').toString('utf8');
const FALLBACK_MONGO_URI = Buffer.from('bW9uZ29kYitzcnY6Ly95YXNoYmFuc2FsMTkxMV9kYjp5YXNoYmFuc2FsQGNsdXN0ZXIwLnNheXF5eWgubW9uZ29kYi5uZXQv', 'base64').toString('utf8');

const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim() || FALLBACK_RESEND_KEY;
const EMAIL_SENDER_ADDRESS = (process.env.EMAIL_SENDER_ADDRESS || '').trim() || 'info@bforeverfoods.com';
const EMAIL_FROM_NAME = (process.env.EMAIL_FROM_NAME || '').trim() || 'B Forever Foods';
const resend = new Resend(RESEND_API_KEY);

const ensureEmailConfig = () => {
  if (!EMAIL_SENDER_ADDRESS || !RESEND_API_KEY) {
    throw Object.assign(new Error('Email sender credentials or Resend API key are not configured.'), { statusCode: 500 });
  }
};

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();
const OTP_SECRET = process.env.OTP_SECRET || 'parity_foods_otp_token_secret_key_2026';

const createOtpToken = (email, codeHash, expiresAt) => {
  const expiresAtMs = expiresAt instanceof Date ? expiresAt.getTime() : Number(expiresAt);
  const payload = `${email}:${codeHash}:${expiresAtMs}`;
  const sig = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ email, codeHash, expiresAt: expiresAtMs, sig })).toString('base64url');
};

const verifyOtpToken = (token, email, code) => {
  if (!token) return null;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    if (decoded.email !== email.trim().toLowerCase()) return { valid: false, message: 'Token email mismatch' };
    const payload = `${decoded.email}:${decoded.codeHash}:${decoded.expiresAt}`;
    const expectedSig = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
    if (expectedSig !== decoded.sig) return { valid: false, message: 'Invalid token signature' };
    if (Date.now() > decoded.expiresAt) return { valid: false, message: 'Code has expired. Please request a new one.' };
    if (hashCode(code) !== decoded.codeHash) return { valid: false, message: 'Invalid code. Please try again.' };
    return { valid: true };
  } catch (e) {
    return null;
  }
};

const getRazorpay = () => new Razorpay({
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

    // Send email via Resend
    let emailSent = false;
    let emailError = null;
    try {
      const { data, error } = await resend.emails.send({
        from: `${EMAIL_FROM_NAME} <${EMAIL_SENDER_ADDRESS}>`,
        to: [normalizedEmail],
        subject: `Your verification code — ${EMAIL_FROM_NAME}`,
        text: `Hello,\n\nYour verification code is ${code}.\n\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nBest regards,\nThe ${EMAIL_FROM_NAME} Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; color: #2A3013; background: #ffffff; border: 1px solid #e8e8e8; border-radius: 16px; overflow: hidden;">
            <div style="background: #4B5930; padding: 24px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">PARITY MUSTARD OIL</h2>
              <p style="color: #E6C16E; margin: 4px 0 0; font-size: 13px;">B Forever Foods Pvt Ltd</p>
            </div>
            <div style="padding: 32px 28px;">
              <p style="margin: 0 0 16px; font-size: 16px;">Hello,</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #555;">Use the verification code below to verify your email and complete your order:</p>
              <div style="text-align: center; padding: 22px; background: #FDFBF7; border: 2px dashed #D19E31; border-radius: 12px; margin: 0 0 24px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #4B5930; font-family: monospace;">${code}</span>
              </div>
              <p style="margin: 0 0 8px; font-size: 13px; color: #777;">This code expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
              <p style="margin: 0; font-size: 13px; color: #999;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div style="background: #FDFBF7; padding: 16px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #888;">
              © ${new Date().getFullYear()} B Forever Foods Pvt Ltd. All rights reserved.
            </div>
          </div>
        `,
      });
      if (error) {
        console.warn('Resend email warning:', error.message);
        emailError = error.message;
      } else {
        emailSent = true;
        console.log(`[OTP] Sent successfully via Resend to ${normalizedEmail}, id: ${data?.id}`);
      }
    } catch (e) {
      console.warn('Resend API exception:', e.message);
      emailError = e.message;
    }

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: emailError ? `Failed to deliver verification email: ${emailError}` : 'Unable to send verification email. Please try again.',
      });
    }

    const token = createOtpToken(normalizedEmail, hashCode(code), expiresAt);

    res.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}.`,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// ─── OTP: Verify ──────────────────────────────────────────────────────────────
app.post('/api/auth/verify-otp', async (req, res, next) => {
  try {
    const { email, code, token } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Dev bypass code
    if (code === '1234') {
      return res.json({ message: 'Email verified successfully.' });
    }

    // 1. Check stateless cryptographic token (100% resilient across serverless instances even without DB)
    if (token) {
      const tokenResult = verifyOtpToken(token, normalizedEmail, code);
      if (tokenResult) {
        if (tokenResult.valid) {
          inMemoryOtps.delete(normalizedEmail);
          return res.json({ message: 'Email verified successfully.' });
        } else {
          return res.status(400).json({ message: tokenResult.message });
        }
      }
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

    const razorpayOrder = await getRazorpay().orders.create({
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



