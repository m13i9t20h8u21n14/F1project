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

## 🛠️ Local Development & Quick Start

### 1. Start the Python FastF1 Microservice
1. Navigate to the microservice directory:
   ```bash
   cd fastf1-service
   ```
2. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the service:
   ```bash
   python app.py
   ```
   *(Server starts on `http://localhost:5001`)*

### 2. Start the Express Backend
1. In a new terminal, navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and configure:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *(Server starts on `http://localhost:5000`)*

### 3. Start the Frontend React Web App
1. In a third terminal, navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install modules:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🧬 Deployment Configuration (Vercel)

The React web application is configured for deployment to **Vercel** with local asset caching.

- **Vercel Project**: `f1project-be2v`
- **Production URL**: [https://f1project-be2v.vercel.app](https://f1project-be2v.vercel.app)

Deployment is managed via the Vercel CLI. Large Python environments (`venv`), local telemetry caches (`.fastf1-cache`), and backend folders are automatically ignored during upload using [.vercelignore](.vercelignore) to optimize build speeds.
