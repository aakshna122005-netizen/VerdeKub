from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/metrics", tags=["Metrics"])

@router.get("/", response_model=List[schemas.MetricResponse])
def read_metrics(
    container_id: Optional[int] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.Metric)
    if container_id is not None:
        query = query.filter(models.Metric.container_id == container_id)
    
    metrics = query.order_by(models.Metric.timestamp.desc()).limit(limit).all()
    # Reverse so they are returned in ascending chronological order for chart compatibility
    return list(reversed(metrics))
