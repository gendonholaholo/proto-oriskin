from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.schemas.analysis import SkinReport
from app.services.skin_analyzer import SkinAnalyzerService

router = APIRouter()


def get_analyzer_service():
    return SkinAnalyzerService()


@router.post("/analyze", response_model=SkinReport)
async def analyze_skin(
    file: Annotated[UploadFile, File(...)],
    service: Annotated[SkinAnalyzerService, Depends(get_analyzer_service)],
):
    """
    Analyze skin image for conditions (Sebum, Pore, Wrinkle, etc.)
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image"
        )

    try:
        content = await file.read()
        report = await service.analyze(content)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}",
        )
