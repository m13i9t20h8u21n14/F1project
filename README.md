# 🛡️ Aegis: Enterprise Desktop Auth Gateway & Session Rotation System

A highly-aesthetic, cryptographically secure desktop web authentication portal featuring short-lived access credentials, cookie-based session tracking, automated silent refreshes (Refresh Token Rotation), suspected access abuse revocation, and an advanced automated staging CI/CD testing pipeline.

---

## 🚀 Key Architectural Details & Secure Strategy

1. **Short-Lived Access Tokens (JWT)**:
   * Access credentials persist strictly in-memory (React context state) and have a short TTL (15 minutes).
   * This mitigates exposure to Cross-Site Scripting (XSS) extraction attacks.

2. **HTTP-Only Session Cookies (Refresh Token)**:
   * Stored in cookies configured with `httpOnly: true`, `secure: true` (in production), and `sameSite: "strict"` attributes.
   * Eliminates access via JavaScript (fully XSS immune) while defending against Cross-Site Request Forgery (CSRF).

3. **Refresh Token Rotation (RTR)**:
   * On every refresh request, the old refresh token is blacklisted, and a brand-new token pair (Access + Refresh) is issued.
   * If a malicious client tries to double-use an expired refresh token, Aegis **instantly revokes all active sessions for that user** (suspected session hijacking mitigation).

4. **Multi-Channel Password Recovery**:
   * Generates a 6-digit numeric OTP code alongside a secure 32-byte hex link token.
   * Transmits emails containing both options using standard SMTP config (gmail / sendgrid) with dynamic ethereal fallback.
   * Revokes all active user sessions instantly upon successful password reset, securing accounts after credentials change.

---

## 📁 Repository Structure

```
F1-project/
├── backend/
│   ├── config/            # Database connectivity and mailer configs
│   ├── controllers/       # Route request controllers (Signup, login, resets)
│   ├── middleware/        # JWT checking and rate limiting
│   ├── models/            # User mongoose Schema (Hashed passwords, active RTR arrays)
│   ├── routes/            # Express Endpoint mapping
│   ├── tests/             # Jest integration test suite (Memory DB)
│   ├── scripts/           # CI/CD staging smoke test script
│   ├── .env.example       # Environmental templates
│   ├── server.js          # Main Express entrance
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable inputs and toasts
│   │   ├── context/       # Auth Context & global axios interceptors
│   │   ├── pages/         # Splitscreen entry, password resetting, and live stats dashboards
│   │   ├── App.jsx        # Pathname routing and splash screens
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── .github/
    └── workflows/
        └── ci-cd.yml      # Multi-stage CI/CD pipeline
```

---

## 🛠️ Local Development & Quick Start

Aegis is configured to run out-of-the-box **without needing SMTP email credentials**. It automatically builds a free Ethereal SMTP test account and prints a preview link directly to the backend terminal!

### 1. Start the Backend Service
1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Set up environment configurations:
   ```bash
   cp .env.example .env
   ```
   *(Defaults are already pre-configured for MongoDB running locally at port `27017`)*
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

### 2. Start the Frontend React Web App
1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install modules and start:
   ```bash
   npm install
   npm run dev
   ```
3. Visit the dashboard at `http://localhost:5173`.

---

## 🧪 Testing Suite (In-Memory Database)

Our integration testing suite utilizes `mongodb-memory-server` to run a fully operational MongoDB server directly in-memory. **No database server installation is required locally to execute tests!**

Navigate to the `backend/` directory and run:
```bash
npm test
```
The Jest testing runner will automatically:
* Initialize the memory server.
* Test signup parameters, password rules, and JWT issuances.
* Test session rotative checks and logout blacklists.
* Test OTP password forgot/reset procedures.

---

## 🧬 Automated CI/CD Pipeline (GitHub Secrets)

The `.github/workflows/ci-cd.yml` workflow executes on pushes and pull requests to `main`. It manages builds, runs tests, deploys to staging, executes a health check smoke test, and deploys to production.

To configure deployment targets, populate the following **GitHub Repository Secrets** in your GitHub repository settings (`Settings -> Secrets and variables -> Actions`):

| Secret Key Name | Purpose | Example Value |
| :--- | :--- | :--- |
| `STAGING_MONGO_URI` | MongoDB connection for Staging database | `mongodb+srv://user:pass@staging.mongodb.net` |
| `STAGING_JWT_ACCESS_SECRET` | 256-bit cryptographically secure key for staging JWT | `d143c7b3997e29cb1fe0f9076e036e5200...` |
| `STAGING_JWT_REFRESH_SECRET`| Session-cookie signature key for staging | `7f5b84c8a81ee0a82755f11181284a7ab5...` |
| `STAGING_EMAIL_SERVICE` | Mail provider service (gmail, sendgrid, or empty for custom SMTP)| `gmail` |
| `STAGING_EMAIL_HOST` | SMTP server endpoint | `smtp.gmail.com` |
| `STAGING_EMAIL_PORT` | SMTP port (SSL/TLS or standard) | `587` |
| `STAGING_EMAIL_USER` | SMTP Username/Email address | `dev-auth@gmail.com` |
| `STAGING_EMAIL_PASS` | SMTP Account Application Password | `abcd efgh ijkl mnop` |
| `STAGING_EMAIL_FROM` | Staging envelope sender identity | `"Aegis Staging" <dev-auth@gmail.com>` |
| `PROD_MONGO_URI` | Connection URI for the production cluster | `mongodb+srv://user:pass@prod.mongodb.net` |
| `PROD_JWT_ACCESS_SECRET` | 256-bit signature key for production JWT | *(Generate a unique 64-character hex key)* |
| `PROD_JWT_REFRESH_SECRET`| Production cookie session signing key | *(Generate a unique 64-character hex key)* |
| `PROD_EMAIL_USER` | Production SMTP Username | `production-auth@company.com` |
| `PROD_EMAIL_PASS` | Production SMTP Application Password | *(Unique app credential)* |

---

## 🧪 Interactive Security Console Testing Guide

Log in to the dashboard at `http://localhost:5173` and use our **Interactive Gateway Controls** panel to visually watch token transactions:

1. **Test protected routing**: Click `Ping GET /me`. It sends the memory-held JWT and yields a `200 OK` return.
2. **Rotate sessions manually**: Click `Rotate Refresh Token`. The terminal logs immediately record the rotated token, refreshing cookies instantly.
3. **Simulate expired token / Silent Refresh Interception**:
   * Click `Force Expire Token`. This clears the Access Token from React state memory (simulating a 15-minute timeout).
   * Click `Ping GET /me`. 
   * Watch the real-time terminal logs! The axios interceptor catches the `401 TOKEN_EXPIRED`, launches a background call to `/refresh-token`, secures a new access token, saves it, and delivers the original GET request seamlessly!
