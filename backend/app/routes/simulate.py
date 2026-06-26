from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models, schemas
from app.services.governance import calculate_carbon, evaluate_and_govern

router = APIRouter(prefix="/simulate", tags=["Simulation"])

@router.post("/", response_model=schemas.ContainerResponse)
def simulate_load(req: schemas.SimulationRequest, db: Session = Depends(get_db)):
    container = db.query(models.Container).filter(models.Container.name == req.container_name).first()
    if not container:
        raise HTTPException(status_code=404, detail="Container not found")
        
    # Inject simulation values
    container.cpu_usage = req.cpu_usage
    container.memory_usage = req.memory_usage
    container.carbon_output = calculate_carbon(req.cpu_usage)
    
    # Save simulated values
    db.commit()
    
    # Log event
    event = models.Event(
        container_id=container.id,
        event_type="SIMULATION",
        action="INJECTED_LOAD",
        timestamp=datetime.utcnow(),
        details=f"Injected custom load: CPU {req.cpu_usage}%, Memory {req.memory_usage}%"
    )
    db.add(event)
    
    # Save metric point
    metric = models.Metric(
        container_id=container.id,
        cpu_usage=container.cpu_usage,
        memory_usage=container.memory_usage,
        carbon_output=container.carbon_output,
        timestamp=datetime.utcnow()
    )
    db.add(metric)
    db.commit()
    
    # Trigger active governance evaluations
    evaluate_and_govern(db, container)
    db.refresh(container)
    
    return container
