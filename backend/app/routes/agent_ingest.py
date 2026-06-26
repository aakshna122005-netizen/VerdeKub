from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
import os
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/agents", tags=["Agent Ingestion"])

@router.get("/download")
def download_agent(format: str = "exe"):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    if format == "exe":
        exe_path = os.path.abspath(os.path.join(current_dir, "../../../agent/dist/EckoKubeAgent.exe"))
        if os.path.exists(exe_path):
            return FileResponse(
                path=exe_path,
                filename="EckoKubeAgent.exe",
                media_type="application/octet-stream"
            )
            
    # Fallback to python script
    agent_path = os.path.abspath(os.path.join(current_dir, "../../../agent/agent.py"))
    if not os.path.exists(agent_path):
        raise HTTPException(status_code=404, detail="Agent file not found on server")
        
    return FileResponse(
        path=agent_path, 
        filename="agent.py", 
        media_type="application/x-python-code"
    )

@router.post("/register")
def register_agent(req: schemas.AgentRegister, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == req.id).first()
    if not agent:
        agent = models.Agent(id=req.id, name=req.name, os=req.os, last_seen=datetime.utcnow())
        db.add(agent)
    else:
        agent.name = req.name
        agent.os = req.os
        agent.last_seen = datetime.utcnow()
    db.commit()
    return {"status": "success", "agent_id": agent.id}

@router.post("/report")
def report_telemetry(req: schemas.TelemetryReport, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == req.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not registered")
    
    agent.last_seen = datetime.utcnow()
    
    for c_rep in req.containers:
        container = db.query(models.Container).filter(
            models.Container.name == c_rep.name,
            models.Container.agent_id == agent.id
        ).first()
        
        if not container:
            container = models.Container(name=c_rep.name, agent_id=agent.id)
            db.add(container)
            db.commit()
            db.refresh(container)
            
        container.status = c_rep.status
        container.cpu_usage = c_rep.cpu_usage
        container.memory_usage = c_rep.memory_usage
        container.carbon_output = c_rep.carbon_output
        db.commit()
        
        metric = models.Metric(
            container_id=container.id,
            cpu_usage=c_rep.cpu_usage,
            memory_usage=c_rep.memory_usage,
            carbon_output=c_rep.carbon_output,
            timestamp=datetime.utcnow()
        )
        db.add(metric)
        
    db.commit()
    return {"status": "success"}

@router.post("/event")
def report_event(req: schemas.EventReport, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == req.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not registered")
        
    container = db.query(models.Container).filter(
        models.Container.name == req.container_name,
        models.Container.agent_id == agent.id
    ).first()
    
    if not container:
        container = models.Container(name=req.container_name, agent_id=agent.id)
        db.add(container)
        db.commit()
        db.refresh(container)
        
    event = models.Event(
        container_id=container.id,
        event_type=req.event_type,
        action=req.action,
        timestamp=datetime.utcnow(),
        details=req.details
    )
    db.add(event)
    db.commit()
    return {"status": "success"}
