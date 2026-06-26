from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.services.governance import apply_manual_governance

router = APIRouter(prefix="/governance", tags=["Governance"])

@router.post("/", response_model=schemas.EventResponse)
def trigger_governance(req: schemas.GovernanceRequest, db: Session = Depends(get_db)):
    container = db.query(models.Container).filter(models.Container.id == req.container_id).first()
    if not container:
        raise HTTPException(status_code=404, detail="Container not found")
        
    if req.action not in ["STANDBY", "THROTTLED", "ACTIVE"]:
        raise HTTPException(status_code=400, detail="Invalid governance action. Must be: STANDBY, THROTTLED, or ACTIVE")
        
    event = apply_manual_governance(db, container, req.action)
    
    return schemas.EventResponse(
        id=event.id,
        container_id=event.container_id,
        event_type=event.event_type,
        action=event.action,
        timestamp=event.timestamp,
        details=event.details,
        container_name=container.name
    )
