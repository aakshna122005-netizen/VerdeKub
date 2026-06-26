# EcoKube AI 🌿
### Intelligent Carbon-Aware Container Governance Platform

EcoKube AI is a lightweight cloud-native governance platform that continuously monitors compute resource utilization, calculates carbon emissions, flags idle/leakage container states using machine learning (Isolation Forest), and automatically transitions workloads into a low-power `STANDBY` state to mitigate digital carbon waste.

---

## 🚀 Key Features

1. **Infrastructure Metrics Monitor**: Simulates/monitors CPU and Memory utilization every 5 seconds.
2. **Carbon Estimation Engine**: Uses the compute emission model: $C = U \times 0.42$ (grams CO₂/hour).
3. **Machine Learning Anomaly Classification**: Employs an unsupervised `Isolation Forest` model (Scikit-Learn) to identify carbon leakages.
4. **Automated Governance Engine**: Triggers standby state (throttling CPU to 1% and Memory to 5%) when underutilization drops below 15% CPU.
5. **Real-time SaaS Dashboard**: A responsive dark-themed React + Vite dashboard displaying charts (Recharts) and events.
6. **Sustainability Compliance Reports**: Generates downloadable PDF reports with executive summaries, KPIs, and compliance details.

---

## 🛠 Tech Stack

- **Backend**: FastAPI, SQLAlchemy ORM, Uvicorn, SQLite
- **Machine Learning**: Scikit-Learn, NumPy, Pandas
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Axios, Lucide React
- **Containerization**: Docker, Docker Compose
- **PDF Generation**: ReportLab

---

## 📂 Folder Structure

```
c:\Users\meaak\OneDrive\Desktop\EckoKube-AI\
├── backend/
│   ├── app/
│   │   ├── config.py             # Config & Dotenv loading
│   │   ├── database.py           # SQLAlchemy Connection
│   │   ├── models.py             # SQLite schemas (Containers, Metrics, Events)
│   │   ├── schemas.py            # Pydantic validation schemas
│   │   ├── main.py               # Lifespan background task runner
│   │   ├── routes/               # API Router endpoints
│   │   └── services/             # ML, Governance, and PDF engines
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # Sidebar, KPI Cards, Tables, Recharts
│   │   ├── App.tsx               # Coordinator state & polling
│   │   ├── api.ts                # Axios integrations
│   │   └── index.css             # Tailwind rules
│   ├── Dockerfile
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Running Locally

### 1. Run the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Dashboard will be available at: [http://localhost:5173](http://localhost:5173)

---

## 🐳 Running with Docker Compose

Start the entire stack (backend on `:8000`, frontend dashboard on `:3000`):
```bash
docker-compose up --build
```
Open your browser to: [http://localhost:3000](http://localhost:3000)

---

## 📈 API Routes Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/containers` | Fetches all active & standby container statuses |
| `GET` | `/metrics` | Fetches historical time-series metric plots |
| `GET` | `/events` | Lists automated ML anomalies and governance logs |
| `GET` | `/analytics` | Returns aggregated KPIs and trend metrics |
| `POST` | `/simulate` | Injects custom CPU/Memory load into a container |
| `POST` | `/governance` | Manually wakes or standbys containers |
| `GET` | `/report` | Generates and downloads the PDF Sustainability Report |
| `GET` | `/health` | Server availability check |

---

## 🌲 Governance Logic & Machine Learning

### Carbon Estimation Model
$$C = U \times 0.42 \text{ grams } \text{CO}_2/\text{hour}$$
Where $U$ is the compute utilization percentage.

### Leakage Anomaly Rule
When a container's CPU utilization drops below **15%**, it is classified as in a `LEAKAGE STATE`. The system automatically:
1. Emits a `LEAKAGE_DETECTED` anomaly event.
2. Applies a governance override policy, transitioning status to `STANDBY`.
3. Downscales container resource allocation (simulated CPU usage set to 1.0%).
4. Calculates saved carbon rate compared to the container's previous execution average.
