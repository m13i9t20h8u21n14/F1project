# 🏎️ F1 Telemetry Visualizer & Race Dashboard

A highly aesthetic, real-time Formula 1 session telemetry visualizer and race simulator. The application maps historical Grand Prix telemetry and models starting grids, live racing progress, and driver inputs (speed, gears, RPM, throttle, and brake) directly onto dynamic 2D SVG track layouts.

---

## 🚀 Key Architectural Components

1. **Frontend React Web App (Vite)**:
   - Dynamic SVG-rendered track layouts with real-time scaling and aspect-ratio preservation.
   - Interactive playback console featuring speeds (1x, 2x, 5x, 10x), resets, and safety car triggers.
   - Live telemetry panel showing RPM, speed, current gear, and real-time throttle/brake inputs.
   - Smart starting grid generator utilizing a physics-staggered cumulative distance formula.

2. **Node.js Express Backend**:
   - Manages session metadata, fetches track geography, and coordinates caching layers.
   - Interfaces with the Python microservice to retrieve high-resolution telemetry.
   - Connects to MongoDB to archive and retrieve past sessions.

3. **Python FastF1 Microservice**:
   - Integrates with the `fastf1` library to query official F1 telemetry, session logs, lap times, and driver numbers.
   - Pre-processes geospatial coordinates to map physical latitude/longitude displacements directly into screen-space SVG polylines.

---

## 📁 Repository Structure

```
F1-project/
├── frontend/             # React + Vite UI
│   ├── src/
│   │   ├── components/   # UI elements (leaderboards, telemetry charts)
│   │   ├── pages/        # Dashboard layout & playback logic
│   │   └── services/     # API integration logic
│   └── package.json
├── backend/              # Node.js API Gateway
│   ├── routes/           # Endpoint maps
│   ├── controllers/      # Coordinates track & archive telemetry
│   └── package.json
└── fastf1-service/       # Python FastF1 wrapper microservice
    ├── app.py            # Flask API returning timing & path arrays
    ├── requirements.txt  # FastF1, Flask, pandas dependencies
    └── venv/             # Python environment (ignored in deployment)
```

---


---

## 🛠️ Local Development & Quick Start

### 1. Start the Python FastF1 Microservice
1.Navigate to the microservice directory
   ```bash
   cd fastf1-service
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
### 3. Start the Frontend React Web App
1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd backend
   ```
2. Install modules and start:
   ```bash
   npm install
   npm run dev
   ```
3. Visit the dashboard at `http://localhost:5173`.

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
