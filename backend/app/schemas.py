from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- Container Schemas ---
class ContainerBase(BaseModel):
    name: str
    status: str
    cpu_usage: float
    memory_usage: float
    carbon_output: float

class ContainerCreate(BaseModel):
    name: str

class ContainerResponse(ContainerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Metric Schemas ---
class MetricBase(BaseModel):
    container_id: int
    cpu_usage: float
    memory_usage: float
    carbon_output: float

class MetricResponse(MetricBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Event Schemas ---
class EventBase(BaseModel):
    container_id: int
    event_type: str
    action: str
    details: Optional[str] = None

class EventResponse(EventBase):
    id: int
    timestamp: datetime
    container_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- Simulation Schemas ---
class SimulationRequest(BaseModel):
    container_name: str
    cpu_usage: float
    memory_usage: float

class GovernanceRequest(BaseModel):
    container_id: int
    action: str # STANDBY, THROTTLED, ACTIVE

# --- Analytics & Dashboard Schemas ---
class KPIOverview(BaseModel):
    total_containers: int
    active_containers: int
    idle_containers: int
    carbon_saved: float # Cumulative carbon saved (estimate)
    current_emissions: float # Current sum of carbon output (g CO2 / hr)

class TimeSeriesPoint(BaseModel):
    timestamp: str
    cpu_avg: float
    memory_avg: float
    carbon_total: float
    carbon_saved_total: float

class AnalyticsResponse(BaseModel):
    kpis: KPIOverview
    carbon_trend: List[TimeSeriesPoint]
    utilization_trend: List[TimeSeriesPoint]
    daily_emissions: List[TimeSeriesPoint]

# --- Settings Schemas ---
class SettingsBase(BaseModel):
    contamination_rate: float
    leakage_cpu_threshold: float

# --- Agent Ingest Schemas ---
class AgentRegister(BaseModel):
    id: str
    name: str
    os: Optional[str] = None

class ContainerReport(BaseModel):
    name: str
    status: str
    cpu_usage: float
    memory_usage: float
    carbon_output: float

class TelemetryReport(BaseModel):
    agent_id: str
    containers: List[ContainerReport]

class EventReport(BaseModel):
    agent_id: str
    container_name: str
    event_type: str
    action: str
    details: str


