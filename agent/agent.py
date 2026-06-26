import os
import sys
import time
import socket
import logging
import platform
import requests
import psutil
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("EcoKubeAgent")

# Configuration (read from environment or fallbacks)
SERVER_URL = os.getenv("ECOKUBE_SERVER_URL", "http://localhost:8000")
AGENT_ID = os.getenv("ECOKUBE_AGENT_ID", f"agent-{socket.gethostname().lower()}")
AGENT_NAME = os.getenv("ECOKUBE_AGENT_NAME", f"Machine {socket.gethostname()}")
CHECK_INTERVAL = int(os.getenv("ECOKUBE_CHECK_INTERVAL", "5"))

# Isolation Forest ML Anomaly Detector
class LocalMLDetector:
    def __init__(self):
        self.contamination = 0.15
        self.leakage_cpu_threshold = 15.0
        self.model = IsolationForest(contamination=self.contamination, random_state=42)
        self._is_trained = False
        self._initialize_deterministic_training()

    def _initialize_deterministic_training(self):
        static_data = []
        for cpu in [25.0, 30.0, 35.0, 40.0, 45.0, 50.0, 55.0, 60.0, 65.0, 70.0, 75.0, 80.0]:
            for mem in [40.0, 50.0, 60.0, 70.0, 80.0]:
                carbon = cpu * 0.42
                static_data.append([cpu, mem, carbon])
        X_train = np.array(static_data)
        self.model.fit(X_train)
        self._is_trained = True

    def detect(self, cpu: float, memory: float, carbon: float) -> str:
        if cpu < self.leakage_cpu_threshold:
            return "Leakage"
        if not self._is_trained:
            return "Normal"
        try:
            X = np.array([[cpu, memory, carbon]])
            prediction = self.model.predict(X)
            if prediction[0] == -1:
                return "Leakage"
            return "Normal"
        except Exception:
            return "Normal"

# Initialize detector
detector = LocalMLDetector()

# Try to import docker SDK
try:
    import docker
except ImportError:
    docker = None

def get_docker_client():
    if not docker:
        return None
    try:
        return docker.from_env()
    except Exception as e:
        logger.warning(f"Local Docker Desktop/daemon not accessible: {e}")
        return None

def calculate_carbon(cpu_usage: float) -> float:
    return cpu_usage * 0.42

def register_agent():
    """Register agent with the central cloud dashboard backend."""
    url = f"{SERVER_URL}/agents/register"
    payload = {
        "id": AGENT_ID,
        "name": AGENT_NAME,
        "os": f"{platform.system()} {platform.release()}"
    }
    try:
        res = requests.post(url, json=payload, timeout=5)
        if res.status_code == 200:
            logger.info(f"Agent successfully registered to central server. ID: {AGENT_ID}")
            return True
        else:
            logger.error(f"Registration rejected by server: {res.text}")
    except Exception as e:
        logger.error(f"Failed to connect to central server at {SERVER_URL} for registration: {e}")
    return False

def report_event(container_name: str, event_type: str, action: str, details: str):
    """Pushes a governance or anomaly event log to the central server."""
    url = f"{SERVER_URL}/agents/event"
    payload = {
        "agent_id": AGENT_ID,
        "container_name": container_name,
        "event_type": event_type,
        "action": action,
        "details": details
    }
    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        logger.warning(f"Could not submit event to central dashboard: {e}")

def run_agent_monitoring_tick():
    """Gathers local telemetry, executes ML policies, and reports stats to the cloud."""
    client = get_docker_client()
    container_reports = []
    
    if client:
        try:
            logger.info("Polling local Docker daemon for container metrics...")
            containers = client.containers.list(all=True)
            for c in containers:
                name = c.name
                status_str = "ACTIVE" if c.status == "running" else "STANDBY"
                cpu_pct = 0.0
                mem_pct = 0.0

                if c.status == "running":
                    try:
                        stats = c.stats(stream=False)
                        
                        # CPU percentage calculation
                        cpu_stats = stats.get('cpu_stats', {})
                        precpu_stats = stats.get('precpu_stats', {})
                        cpu_usage = cpu_stats.get('cpu_usage', {}).get('total_usage', 0)
                        precpu_usage = precpu_stats.get('cpu_usage', {}).get('total_usage', 0)
                        system_cpu = cpu_stats.get('system_cpu_usage', 0)
                        presystem_cpu = precpu_stats.get('system_cpu_usage', 0)
                        
                        cpu_delta = cpu_usage - precpu_usage
                        system_delta = system_cpu - presystem_cpu
                        online_cpus = cpu_stats.get('online_cpus', 1)
                        
                        if system_delta > 0 and cpu_delta > 0:
                            cpu_pct = (cpu_delta / system_delta) * online_cpus * 100.0
                        
                        # Memory percentage calculation
                        mem_stats = stats.get('memory_stats', {})
                        mem_usage = mem_stats.get('usage', 0)
                        mem_limit = mem_stats.get('limit', 1)
                        mem_pct = (mem_usage / mem_limit) * 100.0
                    except Exception as e:
                        logger.debug(f"Failed to fetch stats for {name}: {e}")

                carbon = calculate_carbon(cpu_pct)
                
                # Check ML leakage policy
                state = detector.detect(cpu_pct, mem_pct, carbon)
                if state == "Leakage" and status_str == "ACTIVE":
                    # Automated governance: Throttle the real running container!
                    try:
                        c.update(nano_cpus=50000000) # Limits container CPU to 5% capacity
                        status_str = "STANDBY"
                        cpu_pct = 1.0
                        mem_pct = 5.0
                        carbon = calculate_carbon(cpu_pct)
                        logger.info(f"[ML GOVERNANCE] Throttled local idle container: {name}")
                        report_event(
                            container_name=name,
                            event_type="GOVERNANCE",
                            action="STANDBY",
                            details=f"Agent automated scale-down. Throttled container CPU to 5% limit."
                        )
                        report_event(
                            container_name=name,
                            event_type="ANOMALY",
                            action="LEAKAGE_DETECTED",
                            details=f"Carbon leakage detected: CPU dropped below 15%."
                        )
                    except Exception as e:
                        logger.error(f"Failed to apply resource throttle: {e}")

                container_reports.append({
                    "name": name,
                    "status": status_str,
                    "cpu_usage": round(cpu_pct, 2),
                    "memory_usage": round(mem_pct, 2),
                    "carbon_output": round(carbon, 2)
                })
        except Exception as e:
            logger.error(f"Docker API collection failure: {e}")
            client = None # Force fallback on next step

    # Fallback to local system process monitoring if Docker is unavailable
    if not client:
        logger.info("Docker daemon not reachable. Collecting host process statistics...")
        host_cpu = psutil.cpu_percent(interval=None)
        host_mem = psutil.virtual_memory().percent
        container_reports.append({
            "name": "Host System (Total)",
            "status": "ACTIVE",
            "cpu_usage": round(host_cpu, 2),
            "memory_usage": round(host_mem, 2),
            "carbon_output": round(calculate_carbon(host_cpu), 2)
        })

        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                cpu = proc.info['cpu_percent'] or 0.0
                mem = proc.info['memory_percent'] or 0.0
                pid_name = f"pid_{proc.info['pid']}_{proc.info['name']}"
                if proc.info['pid'] == 0:
                    continue
                processes.append((pid_name, cpu, mem))
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        processes.sort(key=lambda x: x[1], reverse=True)
        for name, cpu, mem in processes[:5]:
            cpu_norm = min(100.0, cpu / psutil.cpu_count())
            container_reports.append({
                "name": name,
                "status": "ACTIVE",
                "cpu_usage": round(cpu_norm, 2),
                "memory_usage": round(mem, 2),
                "carbon_output": round(calculate_carbon(cpu_norm), 2)
            })

    # Submit report payload to central server
    url = f"{SERVER_URL}/agents/report"
    payload = {
        "agent_id": AGENT_ID,
        "containers": container_reports
    }
    try:
        res = requests.post(url, json=payload, timeout=5)
        if res.status_code == 200:
            logger.info(f"Report submitted successfully ({len(container_reports)} targets reported).")
        else:
            logger.warning(f"Server rejected report: {res.text}")
    except Exception as e:
        logger.error(f"Failed to submit telemetry report to central server: {e}")

def main():
    logger.info(f"Starting EcoKube local agent daemon...")
    logger.info(f"Connecting to Central Server: {SERVER_URL}")
    
    # Attempt initial registration, loop until successful
    registered = False
    while not registered:
        registered = register_agent()
        if not registered:
            logger.warning("Retrying registration in 10 seconds...")
            time.sleep(10)
            
    # Warm up psutil CPU calculations
    psutil.cpu_percent(interval=None)
    
    # Loop and report telemetry
    while True:
        try:
            run_agent_monitoring_tick()
        except Exception as e:
            logger.error(f"Error in agent execution tick: {e}")
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
