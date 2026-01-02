🚀 Koset Console — High-Performance GPU Cloud

Koset Console is a production-grade MERN stack application built for managing GPU workloads, serverless deployments, and instant GPU clusters.
The platform enforces a security-first authentication system where OTP verification is mandatory, even for users authenticated via Google OAuth.

✨ Key Features

🔐 Secure Authentication

Manual Email + OTP

Google OAuth + OTP (2FA enforced)

📧 Email Whitelist Enforcement

Access restricted via ALLOWED_EMAILS

🧠 GPU Management

Filter GPUs by VRAM, RAM, architecture, and availability

☁️ Cloud Infrastructure Modules

Serverless Repositories

Pod Templates

Storage Management

Fine-Tuning Pipelines

💳 Billing & Usage

Real-time spend tracking

Usage-based billing insights

🏗 System Architecture & Authentication Flow

The application follows a strict verification pipeline ensuring no user gains access without OTP validation.

Authentication Pipeline

OAuth / Email Entry
User initiates Login or Signup.

User Identification
Email validated against the ALLOWED_EMAILS list.

Partial Session Creation
A JWT is issued with otpVerifiedAt: null.

OTP Challenge
A 6-digit OTP is sent to the user’s Gmail.

OTP Verification
JWT is upgraded with full access permissions.

Dashboard Access Granted

⚠️ Google-authenticated users must complete OTP verification before accessing the dashboard.

🚀 Getting Started
Prerequisites

Node.js v18.x or higher

MongoDB v6.x or higher

Google Cloud Console Account

SMTP Provider (Gmail recommended for OTP delivery)

📦 Installation
1️⃣ Clone the Repository
git clone https://github.com/yourusername/koset-console.git
cd koset-console

2️⃣ Backend Setup

Navigate to the backend directory:

cd server
npm install


Create a .env file inside the server directory:

# Server Configuration
NODE_ENV=development
PORT=8000
API_BASE_URL=http://localhost:8000

# MongoDB
MONGO_URI=mongodb://localhost:27017/koset

# Security
JWT_SECRET=your_jwt_secret_here
COOKIE_NAME=app_session
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false

# CORS
FRONTEND_ORIGIN=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
OAUTH_CALLBACK_URL=http://localhost:8000/auth/google/callback

# Email (OTP Delivery)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Access Control
ALLOWED_EMAILS=user1@gmail.com,user2@gmail.com


Start the backend server:

npm run dev

3️⃣ Frontend Setup

Navigate to the frontend directory:

cd client
npm install


Create a .env file inside the client directory:

VITE_API_URL=http://localhost:8000


Start the frontend:

npm run dev

🌐 Application Access

Frontend: http://localhost:5173

Backend: http://localhost:8000

📂 Project Structure
├── client/
│   ├── src/
│   │   ├── context/        # AuthContext (session persistence)
│   │   ├── pages/          # Login, Signup, OTP, Dashboard
│   │   ├── layouts/        # Navbar, Sidebar, Dashboard wrappers
│   │   └── api.js          # Centralized API handler
│
└── server/
    ├── src/
    │   ├── auth/           # Google OAuth, JWT, Passport strategies
    │   ├── otp/            # OTP generation & Nodemailer logic
    │   ├── routes/         # Auth, User, GPU APIs
    │   └── models/         # MongoDB schemas (User, OTP, GPU)

🔒 Security Notes

Gmail App Passwords are required for OTP delivery

Standard Gmail passwords will NOT work

Enable 2-Step Verification on the sender Gmail account

OTP verification is enforced for all authentication flows

Cookies are HTTP-only and JWT-based

🤝 Contributing

Fork the repository

Create your feature branch

git checkout -b feature/YourFeature


Commit your changes

git commit -m "Add YourFeature"


Push to the branch

git push origin feature/YourFeature
