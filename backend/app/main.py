import threading
import contextlib
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import containers, metrics, events, analytics, governance, simulate, report, health, settings, prometheus, agent_ingest
from app.services.monitoring import start_monitoring_loop

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Configure lifespan to run the monitoring background loop in a daemon thread
@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # In the Enterprise Agent pattern, remote agents run the monitor loops on individual machines.
    # Start local monitoring loop only if explicitly requested via environment variable.
    if os.getenv("RUN_LOCAL_MONITOR") == "true":
        monitor_thread = threading.Thread(target=start_monitoring_loop, daemon=True)
        monitor_thread.start()
    yield
    # Cleanup happens here on shutdown (nothing specific to do for daemon thread)

app = FastAPI(
    title="VerdeKube AI API",
    description="Intelligent Carbon-Aware Container Governance Platform Backend",
    version="1.0.0",
    lifespan=lifespan
)


# Enable CORS for frontend interface
# Restrict to known frontend origins instead of a wildcard, since allow_credentials=True
# combined with allow_origins=["*"] is invalid per the CORS spec and rejected by browsers
# for credentialed requests. Add any additional preview/staging domains as needed.
ALLOWED_ORIGINS = [
    "https://verde-kub.vercel.app",
    "http://localhost:5173",  # local Vite dev server
    "http://localhost:3000",  # docker-compose frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routers
app.include_router(containers.router)
app.include_router(metrics.router)
app.include_router(events.router)
app.include_router(analytics.router)
app.include_router(governance.router)
app.include_router(simulate.router)
app.include_router(report.router)
app.include_router(health.router)
app.include_router(settings.router)
app.include_router(prometheus.router)
app.include_router(agent_ingest.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to VerdeKube AI Platform",
        "documentation": "/docs"
    }
