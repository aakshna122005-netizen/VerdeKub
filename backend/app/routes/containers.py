from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from datetime import datetime

router = APIRouter(prefix="/containers", tags=["Containers"])

@router.get("/", response_model=List[schemas.ContainerResponse])
def read_containers(db: Session = Depends(get_db)):
    containers = db.query(models.Container).all()
    return containers

@router.post("/", response_model=schemas.ContainerResponse)
def create_container(container: schemas.ContainerCreate, db: Session = Depends(get_db)):
    db_container = db.query(models.Container).filter(models.Container.name == container.name).first()
    if db_container:
        raise HTTPException(status_code=400, detail="Container name already exists")
    
    new_container = models.Container(
        name=container.name,
        status="ACTIVE",
        cpu_usage=0.0,
        memory_usage=0.0,
        carbon_output=0.0,
        created_at=datetime.utcnow()
    )
    db.add(new_container)
    db.commit()
    db.refresh(new_container)
    
    # Log event
    event = models.Event(
        container_id=new_container.id,
        event_type="SIMULATION",
        action="CREATED",
        timestamp=datetime.utcnow(),
        details=f"New simulated container created: {container.name}"
    )
    db.add(event)
    db.commit()
    
    return new_container
