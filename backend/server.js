import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Otp from './models/Otp.js';

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
    // Remove trailing slash if present
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    if (allowAllOrigins || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS Blocked for origin: ${origin}`);
      callback(null, false); // Pass false instead of throwing an error to handle preflights gracefully
    }
  },
  credentials: true,
}));
app.use(express.json());

const requiredEnv = ['MONGODB_URI', 'EMAIL_SENDER_ADDRESS', 'EMAIL_SENDER_PASS'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing env var: ${key}`);
  }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER_ADDRESS,
    pass: process.env.EMAIL_SENDER_PASS,
  },
});

const ensureEmailConfig = () => {
  if (!process.env.EMAIL_SENDER_ADDRESS || !process.env.EMAIL_SENDER_PASS) {
    throw Object.assign(new Error('Email sender credentials are not configured.'), { statusCode: 500 });
  }
};

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

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

    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { codeHash: hashCode(code), expiresAt, verified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    ensureEmailConfig();
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'B Forever Foods'}" <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: normalizedEmail,
      subject: `Verification code for your ${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} account`,
      text: `Hello,\n\nYour verification code is ${code}.\n\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes. If you did not request this, please ignore this email.\n\nBest regards,\nThe ${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} Team`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
            <p>Hello,</p>
            <p>Your verification code is: <strong style="font-size: 24px; color: #4B5930; background: #f9f9f9; padding: 5px 10px; border-radius: 4px; border: 1px solid #ddd;">${code}</strong></p>
            <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes. If you did not request this code, you can safely ignore this email.</p>
            <p>Best regards,<br>
            <strong>The ${process.env.EMAIL_FROM_NAME || 'B Forever Foods'} Team</strong></p>
        </div>
      `,
    });

    res.json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/verify-otp', async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const record = await Otp.findOne({ email: normalizedEmail });

    if (!record) {
      return res.status(400).json({ message: 'No verification code found. Please request a new code.' });
    }

    if (record.expiresAt < new Date()) {
      await record.deleteOne();
      return res.status(400).json({ message: 'The verification code has expired. Please request a new one.' });
    }

    if (record.codeHash !== hashCode(code)) {
      return res.status(400).json({ message: 'Invalid code. Please try again.' });
    }

    await record.deleteOne();
    res.json({ message: 'Email verified successfully.' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/test-email', async (req, res) => {
  const { to } = req.query;
  if (!to) {
    return res.status(400).json({ success: false, message: 'Provide ?to=your@email.com in the query string.' });
  }
  try {
    ensureEmailConfig();
    await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'Parity Foods'} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to,
      subject: 'Parity Foods — SMTP Test',
      text: 'This is a test email from your Parity Foods backend. SMTP is working correctly!',
      html: '<p>This is a <strong>test email</strong> from your Parity Foods backend. SMTP is working correctly! ✅</p>',
    });
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ success: false, message: err.message, code: err.code || null });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong. Please try again later.',
  });
});

mongoose
  .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'parity-foods' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
