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
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];
const allowAllOrigins = allowedOrigins.includes('*');

app.use(cors({
  origin(origin, callback) {
    if (allowAllOrigins || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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
      from: `${process.env.EMAIL_FROM_NAME || 'Parity Foods'} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: normalizedEmail,
      subject: 'Parity Foods Verification Code',
      text: `Your verification code is ${code}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      html: `<p>Your verification code is <strong>${code}</strong>.</p><p>The code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
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
