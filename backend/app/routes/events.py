from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timezone
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("/", response_model=List[schemas.EventResponse])
def read_events(
    container_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(models.Event)
    if container_id is not None:
        query = query.filter(models.Event.container_id == container_id)
        
    events = query.order_by(models.Event.timestamp.desc()).limit(limit).all()
    
    result = []
    for e in events:
        # Load details
        res = schemas.EventResponse(
            id=e.id,
            container_id=e.container_id,
            event_type=e.event_type,
            action=e.action,
            timestamp=e.timestamp.replace(tzinfo=timezone.utc),
            details=e.details,
            container_name=e.container.name if e.container else "Unknown"
        )
        result.append(res)
        
    return result
