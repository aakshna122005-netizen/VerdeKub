from fastapi import APIRouter
from app import schemas
from app.services.ml_detector import detector

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/", response_model=schemas.SettingsBase)
def get_settings():
    return schemas.SettingsBase(
        contamination_rate=detector.contamination,
        leakage_cpu_threshold=detector.leakage_cpu_threshold
    )

@router.post("/", response_model=schemas.SettingsBase)
def update_settings(req: schemas.SettingsBase):
    detector.update_settings(
        contamination=req.contamination_rate,
        leakage_cpu_threshold=req.leakage_cpu_threshold
    )
    return schemas.SettingsBase(
        contamination_rate=detector.contamination,
        leakage_cpu_threshold=detector.leakage_cpu_threshold
    )
