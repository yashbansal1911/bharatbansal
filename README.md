# Parity Foods Web App

A React + Vite storefront for Parity Foods with a secure email-OTP based checkout verification flow backed by an Express/MongoDB service.

## Requirements

- Node.js 18+
- npm 10+
- MongoDB Atlas (or any MongoDB-compatible connection string)
- Gmail account with an App Password for `saurav4ryou707997@gmail.com` (used for sending OTPs)

## Frontend Setup

```bash
npm install
cp .env.example .env # optional, adjust VITE_API_BASE_URL as needed
npm run dev
```

### Frontend Scripts

- `npm run dev` – Start Vite dev server (defaults to http://localhost:5173)
- `npm run build` – Production build
- `npm run preview` – Preview the production build locally
- `npm run lint` – Run ESLint

## Backend Setup

```bash
cd backend
cp .env.example .env
# fill in MongoDB URI and Gmail app password in backend/.env
npm install
npm run dev   # or npm start for production
```

Environment variables (see `backend/.env.example`):

| Key | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name (default `parity-foods`) |
| `PORT` | API port (default `5000`) |
| `CLIENT_ORIGIN` | Allowed frontend origins (comma separated) |
| `OTP_EXPIRY_MINUTES` | Minutes before an OTP expires |
| `EMAIL_SENDER_ADDRESS` | Gmail address (``) |
| `EMAIL_SENDER_PASS` | Gmail App Password used by Nodemailer |
| `EMAIL_FROM_NAME` | Sender name shown in the email |

### Gmail setup

1. Enable 2-Step Verification on `saurav4ryou707997@gmail.com` (or whichever account you use).
2. Generate an App Password from Google Account → Security → App passwords.
3. Copy the 16-character key (without spaces) into `EMAIL_SENDER_PASS` inside `backend/.env`.
4. Restart the backend server so Nodemailer can authenticate successfully.

### API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/auth/request-otp` | Generates a 4-digit OTP, stores it in MongoDB, and emails it to the user |
| `POST` | `/api/auth/verify-otp` | Verifies the submitted OTP before allowing checkout |

## Checkout Flow

1. Customer enters their email on `/checkout`.
2. Frontend calls `POST /api/auth/request-otp` to trigger OTP creation & email delivery.
3. Customer enters the received 4-digit code.
4. Frontend calls `POST /api/auth/verify-otp`. On success, the checkout continues to shipping/payment steps.

Ensure both the frontend (Vite dev server) and backend (Express server) are running locally for the flow to work during development.
