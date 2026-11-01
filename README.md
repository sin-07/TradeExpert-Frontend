# TradeXpert - Full-Stack Real-Time Trading Platform (Next.js)

A unified full-stack trading application built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **MongoDB**. Frontend and backend are completely integrated inside this single Next.js project.

---

## 🚀 Architecture (Typical Full-Stack Next.js)

- **Unified Codebase**: Frontend pages and backend API routes live together inside [`src/app/`](./src/app/).
- **Frontend**:
  - Landing page with live market ticker: [`src/app/page.jsx`](./src/app/page.jsx)
  - Trading terminal: [`src/app/dashboard/page.jsx`](./src/app/dashboard/page.jsx)
  - Auth flows: [`login`](./src/app/login), [`signup`](./src/app/signup), [`verify-otp`](./src/app/verify-otp), [`forgot-password`](./src/app/forgot-password)
- **Backend API Routes** (Native Next.js Route Handlers):
  - Auth: [`src/app/api/auth/`](./src/app/api/auth/)
  - Live Stock Feeds: [`src/app/api/stocks/`](./src/app/api/stocks/)
  - Market Search: [`src/app/api/search/`](./src/app/api/search/)
  - Trading & Portfolio: [`src/app/api/trading/`](./src/app/api/trading/)
  - E-Commerce / Products: [`src/app/api/products/`](./src/app/api/products/), [`src/app/api/orders/`](./src/app/api/orders/)
  - Health Diagnostics: [`src/app/api/health/`](./src/app/api/health/)
- **Backend Core**:
  - MongoDB Mongoose connection: [`src/lib/db.js`](./src/lib/db.js)
  - Database Models: [`src/lib/models/`](./src/lib/models/)
  - JWT Authentication: [`src/lib/auth.js`](./src/lib/auth.js)
  - Email Services: [`src/lib/email/`](./src/lib/email/)

---

## 📁 Directory Structure

```
tradexpert/
├── public/                        # Static assets
├── src/
│   ├── app/                       # Next.js App Router (Frontend Pages & Backend APIs)
│   │   ├── api/                   # All Backend API Route Handlers
│   │   │   ├── auth/              # Signup, login, OTP, password reset
│   │   │   ├── health/            # Health check endpoint
│   │   │   ├── orders/            # Orders API
│   │   │   ├── products/          # Products API
│   │   │   ├── search/            # Market ticker search API
│   │   │   ├── stocks/            # Live stock data proxies
│   │   │   └── trading/           # Portfolio, positions & order execution
│   │   ├── dashboard/             # Trading terminal page
│   │   ├── env-test/              # Diagnostics page
│   │   ├── forgot-password/       # Password reset page
│   │   ├── login/                 # Login page
│   │   ├── signup/                # Signup page
│   │   ├── verify-otp/            # OTP verification page
│   │   ├── globals.css            # Tailwind & global styling
│   │   ├── layout.jsx             # Root layout with AuthProvider & Toaster
│   │   └── page.jsx               # Home landing page
│   ├── components/                # Reusable UI components
│   │   ├── Trading/               # ChartView, OrderPanel, Watchlist, etc.
│   │   ├── Footer.jsx
│   │   ├── ForgotPasswordModal.jsx
│   │   ├── LogoutModal.jsx
│   │   ├── Navbar.jsx
│   │   └── ResetPasswordModal.jsx
│   ├── context/                   # AuthContext
│   ├── data/                      # Mock data
│   ├── hooks/                     # Custom pricing and WebSocket hooks
│   └── lib/                       # Backend database, models, email, and auth
├── .env                           # Environment configuration
├── .env.example
├── .gitignore
├── jsconfig.json                  # Path aliases (@/* -> ./src/*)
├── next.config.mjs
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

---

## 🛠️ How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
```env
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.y0kcidn.mongodb.net/tradexpert?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

NEXT_PUBLIC_API_URL=/api
FRONTEND_URL=http://localhost:3000

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Both frontend and backend will be live!

### 4. Build for Production
```bash
npm run build
npm start
```
