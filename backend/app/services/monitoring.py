import time
import logging
import psutil
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Container, Metric, Event
from app.services.governance import evaluate_and_govern, calculate_carbon

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("EcoKubeLiveMonitoring")

# Try to import docker, handle fallback silently if not installed
try:
    import docker
except ImportError:
    docker = None

def get_docker_client():
    if not docker:
        return None
    try:
        # Connects to local Docker daemon (e.g. Unix socket or Windows pipe)
        return docker.from_env()
    except Exception as e:
        logger.warning(f"Docker daemon not accessible: {e}")
        return None

def collect_docker_metrics(client, db: Session):
    """Collects real-time metrics from running Docker containers using the Docker SDK."""
    try:
        active_containers = client.containers.list(all=True)
        active_container_names = [c.name for c in active_containers]
        
        # Mark containers that are no longer present as STANDBY or clean them up
        db_containers = db.query(Container).all()
        for db_c in db_containers:
            # Skip host fallback records
            if db_c.name.startswith("Host System") or "pid_" in db_c.name:
                continue
            if db_c.name not in active_container_names:
                db_c.status = "STANDBY"
                db_c.cpu_usage = 0.0
                db_c.memory_usage = 0.0
                db_c.carbon_output = 0.0
        db.commit()

        for container in active_containers:
            name = container.name
            status_str = "ACTIVE" if container.status == "running" else "STANDBY"
            
            # Fetch stats
            cpu_pct = 0.0
            mem_pct = 0.0
            
            if container.status == "running":
                try:
                    stats = container.stats(stream=False)
                    
                    # Calculate CPU percent
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
                    
                    # Calculate Memory percent
                    mem_stats = stats.get('memory_stats', {})
                    mem_usage = mem_stats.get('usage', 0)
                    mem_limit = mem_stats.get('limit', 1)
                    mem_pct = (mem_usage / mem_limit) * 100.0
                except Exception as e:
                    logger.debug(f"Could not read stats for container {name}: {e}")
                    # If stats fails, fallback to 0 or baseline
            
            # Upsert container record
            db_c = db.query(Container).filter(Container.name == name).first()
            if not db_c:
                db_c = Container(name=name, status=status_str)
                db.add(db_c)
                db.commit()
                db.refresh(db_c)
                
            db_c.status = status_str
            db_c.cpu_usage = round(cpu_pct, 2)
            db_c.memory_usage = round(mem_pct, 2)
            db_c.carbon_output = round(calculate_carbon(cpu_pct), 2)
            
            # Write metrics log point
            metric = Metric(
                container_id=db_c.id,
                cpu_usage=db_c.cpu_usage,
                memory_usage=db_c.memory_usage,
                carbon_output=db_c.carbon_output,
                timestamp=datetime.utcnow()
            )
            db.add(metric)
            db.commit()
            
            # Run governance engine check
            evaluate_and_govern(db, db_c)
            
    except Exception as e:
        logger.error(f"Error gathering Docker container stats: {e}")
        raise e

def collect_host_fallback_metrics(db: Session):
    """Fallback: collects real host statistics and tracks top 5 processes via psutil."""
    try:
        # 1. Capture Total Host Metrics
        host_cpu = psutil.cpu_percent(interval=None)
        host_mem = psutil.virtual_memory().percent
        
        host_container_name = "Host System (Total)"
        db_host = db.query(Container).filter(Container.name == host_container_name).first()
        if not db_host:
            db_host = Container(name=host_container_name, status="ACTIVE")
            db.add(db_host)
            db.commit()
            db.refresh(db_host)
            
        db_host.status = "ACTIVE"
        db_host.cpu_usage = round(host_cpu, 2)
        db_host.memory_usage = round(host_mem, 2)
        db_host.carbon_output = round(calculate_carbon(host_cpu), 2)

        
        db.add(Metric(
            container_id=db_host.id,
            cpu_usage=db_host.cpu_usage,
            memory_usage=db_host.memory_usage,
            carbon_output=db_host.carbon_output,
            timestamp=datetime.utcnow()
        ))
        db.commit()
        evaluate_and_govern(db, db_host)

        # 2. Capture Top 5 Resource-consuming Processes
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                # Get stats
                cpu = proc.info['cpu_percent'] or 0.0
                mem = proc.info['memory_percent'] or 0.0
                name = f"pid_{proc.info['pid']}_{proc.info['name']}"
                if proc.info['pid'] == 0:  # Skip system idle process
                    continue
                processes.append((name, cpu, mem))
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        # Sort processes by CPU usage descending and take top 5
        processes.sort(key=lambda x: x[1], reverse=True)
        top_processes = processes[:5]
        top_names = [p[0] for p in top_processes]

        # Cleanup process records in DB that are no longer in the top 5
        db_processes = db.query(Container).filter(Container.name.like("pid_%")).all()
        for db_p in db_processes:
            if db_p.name not in top_names:
                db.delete(db_p)
        db.commit()

        for name, cpu, mem in top_processes:
            # We divide by online cpu cores count since psutil process cpu_percent can be > 100% on multi-core systems
            cpu_normalized = min(100.0, cpu / psutil.cpu_count())
            
            db_p = db.query(Container).filter(Container.name == name).first()
            if not db_p:
                db_p = Container(name=name, status="ACTIVE")
                db.add(db_p)
                db.commit()
                db.refresh(db_p)
            
            db_p.status = "ACTIVE"
            db_p.cpu_usage = round(cpu_normalized, 2)
            db_p.memory_usage = round(mem, 2)
            db_p.carbon_output = round(calculate_carbon(cpu_normalized), 2)
            
            db.add(Metric(
                container_id=db_p.id,
                cpu_usage=db_p.cpu_usage,
                memory_usage=db_p.memory_usage,
                carbon_output=db_p.carbon_output,
                timestamp=datetime.utcnow()
            ))
            db.commit()
            evaluate_and_govern(db, db_p)

    except Exception as e:
        logger.error(f"Error gathering host process stats: {e}")

def run_metrics_collection_tick():
    """Runs a single metrics collection cycle from real sources."""
    db = SessionLocal()
    try:
        client = get_docker_client()
        if client:
            try:
                collect_docker_metrics(client, db)
            except Exception:
                # Docker daemon connection failed or stats unavailable, fallback
                collect_host_fallback_metrics(db)
        else:
            collect_host_fallback_metrics(db)
    finally:
        db.close()

def start_monitoring_loop():
    """Continuous loop collecting real infrastructure metrics every 5 seconds."""
    # Warm up CPU percent counter (first call is usually 0.0)
    psutil.cpu_percent(interval=None)
    for proc in psutil.process_iter(['cpu_percent']):
        try:
            proc.info['cpu_percent']
        except Exception:
            pass
            
    while True:
        try:
            run_metrics_collection_tick()
        except Exception as e:
            logger.error(f"Error in live metrics background loop: {e}")
        time.sleep(5)
