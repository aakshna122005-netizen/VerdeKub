from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/prometheus", tags=["Prometheus"])

@router.get("/")
def get_prometheus_metrics(db: Session = Depends(get_db)):
    containers = db.query(models.Container).all()
    lines = []
    
    lines.append("# HELP verdekube_cpu_usage_ratio Simulated CPU utilization ratio (0.0 to 100.0)")
    lines.append("# TYPE verdekube_cpu_usage_ratio gauge")
    for c in containers:
        lines.append(f'verdekube_cpu_usage_ratio{{container="{c.name}"}} {c.cpu_usage}')

    lines.append("# HELP verdekube_memory_usage_ratio Simulated Memory utilization ratio (0.0 to 100.0)")
    lines.append("# TYPE verdekube_memory_usage_ratio gauge")
    for c in containers:
        lines.append(f'verdekube_memory_usage_ratio{{container="{c.name}"}} {c.memory_usage}')

    lines.append("# HELP verdekube_carbon_emissions_g_hr Estimated carbon output in grams CO2 per hour")
    lines.append("# TYPE verdekube_carbon_emissions_g_hr gauge")
    for c in containers:
        lines.append(f'verdekube_carbon_emissions_g_hr{{container="{c.name}"}} {c.carbon_output}')

    lines.append("# HELP verdekube_container_status Active status of container (1 for ACTIVE, 0 for STANDBY/THROTTLED)")
    lines.append("# TYPE verdekube_container_status gauge")
    for c in containers:
        val = 1 if c.status == "ACTIVE" else 0
        lines.append(f'verdekube_container_status{{container="{c.name}",status="{c.status}"}} {val}')

    content = "\n".join(lines) + "\n"
    return Response(content=content, media_type="text/plain")
