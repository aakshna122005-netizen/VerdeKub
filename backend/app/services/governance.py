from datetime import datetime
import logging
from sqlalchemy.orm import Session
from app.models import Container, Event, Metric
from app.services.ml_detector import detector

logger = logging.getLogger("EcoKubeGovernance")

def get_local_docker_client():
    try:
        import docker
        return docker.from_env()
    except Exception:
        return None

def calculate_carbon(cpu_usage: float) -> float:
    # C = U * 0.42 (grams CO2 / hour)
    return cpu_usage * 0.42

def evaluate_and_govern(db: Session, container: Container) -> bool:
    """Evaluates container metrics using ML and rule-based thresholds.
    Triggers automated governance actions if leakage is detected.
    Returns:
        bool: True if governance override was triggered, False otherwise.
    """
    # 1. Detect state using detector
    state = detector.detect(container.cpu_usage, container.memory_usage, container.carbon_output)
    
    if state == "Leakage" and container.status == "ACTIVE":
        # Capture pre-governance stats
        old_cpu = container.cpu_usage
        old_carbon = container.carbon_output
        
        # 2. Trigger Governance Override: Transition to STANDBY
        container.status = "STANDBY"
        # Simulate container downscaling / throttling
        container.cpu_usage = 1.0  # Throttled/standby CPU usage
        container.memory_usage = 5.0  # Throttled/standby Memory usage
        container.carbon_output = calculate_carbon(container.cpu_usage)
        
        # Apply real Docker CPU limits if container is real and active
        client = get_local_docker_client()
        if client:
            try:
                docker_container = client.containers.get(container.name)
                # Limit CPU resource allocation to 5% of a core
                docker_container.update(nano_cpus=50000000)
                logger.info(f"Successfully throttled real Docker container: {container.name}")
            except Exception as e:
                logger.debug(f"Could not throttle real Docker container {container.name}: {e}")
        
        # 3. Calculate saved carbon rate (grams CO2/hour)
        saved_rate = old_carbon - container.carbon_output
        
        # 4. Generate governance event log
        event = Event(
            container_id=container.id,
            event_type="GOVERNANCE",
            action="STANDBY",
            timestamp=datetime.utcnow(),
            details=f"Automated idle container standby policy. Throttled CPU from {old_cpu}% to {container.cpu_usage}%. Saved {saved_rate:.2f} g CO2/hr."
        )
        db.add(event)
        
        # 5. Create an anomaly event log as well
        anomaly_event = Event(
            container_id=container.id,
            event_type="ANOMALY",
            action="LEAKAGE_DETECTED",
            timestamp=datetime.utcnow(),
            details=f"Carbon leakage anomaly detected. CPU utilization dropped below 15% ({old_cpu}%)."
        )
        db.add(anomaly_event)
        
        db.commit()
        return True
        
    return False

def apply_manual_governance(db: Session, container: Container, action: str) -> Event:
    """Manually overrides a container state."""
    old_status = container.status
    container.status = action
    
    if action == "STANDBY":
        container.cpu_usage = 1.0
        container.memory_usage = 5.0
    elif action == "THROTTLED":
        container.cpu_usage = max(1.0, container.cpu_usage * 0.5)
        container.memory_usage = max(5.0, container.memory_usage * 0.7)
    elif action == "ACTIVE":
        # Recover container
        container.cpu_usage = 45.0
        container.memory_usage = 60.0
        
    container.carbon_output = calculate_carbon(container.cpu_usage)
    
    # Apply real Docker updates
    client = get_local_docker_client()
    if client:
        try:
            docker_container = client.containers.get(container.name)
            if action == "STANDBY":
                docker_container.update(nano_cpus=50000000) # 5% limit
            elif action == "THROTTLED":
                docker_container.update(nano_cpus=500000000) # 50% limit
            elif action == "ACTIVE":
                docker_container.update(nano_cpus=0) # Reset limit
            logger.info(f"Successfully applied manual governance {action} to real Docker container {container.name}")
        except Exception as e:
            logger.debug(f"Could not apply manual governance to real container {container.name}: {e}")
            
    event = Event(
        container_id=container.id,
        event_type="MANUAL_OVERRIDE",
        action=action,
        timestamp=datetime.utcnow(),
        details=f"Manual governance override: changed status from {old_status} to {action}."
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

