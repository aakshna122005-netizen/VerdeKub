from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    os = Column(String, nullable=True)
    last_seen = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    containers = relationship("Container", back_populates="agent", cascade="all, delete-orphan")

class Container(Base):
    __tablename__ = "containers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="ACTIVE", nullable=False) # ACTIVE, STANDBY, THROTTLED
    cpu_usage = Column(Float, default=0.0)
    memory_usage = Column(Float, default=0.0)
    carbon_output = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    agent_id = Column(String, ForeignKey("agents.id"), nullable=True)
    agent = relationship("Agent", back_populates="containers")

    metrics = relationship("Metric", back_populates="container", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="container", cascade="all, delete-orphan")

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), nullable=False)
    cpu_usage = Column(Float, nullable=False)
    memory_usage = Column(Float, nullable=False)
    carbon_output = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    container = relationship("Container", back_populates="metrics")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), nullable=False)
    event_type = Column(String, nullable=False) # ANOMALY, GOVERNANCE, SIMULATION
    action = Column(String, nullable=False) # STANDBY, THROTTLED, RECOVERED, CREATED
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)

    container = relationship("Container", back_populates="events")
