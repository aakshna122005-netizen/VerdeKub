from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.pdf_generator import generate_pdf_report

router = APIRouter(prefix="/report", tags=["Report"])

@router.get("/")
def download_report(db: Session = Depends(get_db)):
    pdf_buffer = generate_pdf_report(db)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=verdekube_sustainability_report.pdf"}
    )
