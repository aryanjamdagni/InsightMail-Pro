from fastapi import APIRouter, UploadFile, File, Body, HTTPException, Depends
from services.gemini_service import GeminiService
from models.analysis import AnalysisResponse
import sys


router = APIRouter()

def get_service():
    return GeminiService()

@router.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(
    email_text: str = Body(..., embed=True),
    service: GeminiService = Depends(get_service)
):
    result = service.analyze_email(text_content=email_text)
    return {"data": result["analysis"], "time_taken": result["time_taken"],"llm_cost_analysis": result["llm_cost_analysis"]}

@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    service: GeminiService = Depends(get_service)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image (JPEG/PNG).")
    
    file_bytes = await file.read()
    result = service.analyze_email(file_bytes=file_bytes, mime_type=file.content_type)
    return {"data": result["analysis"], "time_taken": result["time_taken"],"llm_cost_analysis": result["llm_cost_analysis"]}

@router.post("/analyze/pdf", response_model=AnalysisResponse)
async def analyze_pdf(
    file: UploadFile = File(...),
    service: GeminiService = Depends(get_service)
):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "File must be a PDF.")
    
    file_bytes = await file.read()
    result = service.analyze_email(file_bytes=file_bytes, mime_type="application/pdf")
    return {"data": result["analysis"], "time_taken": result["time_taken"],"llm_cost_analysis": result["llm_cost_analysis"]}