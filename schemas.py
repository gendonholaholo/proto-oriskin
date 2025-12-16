from pydantic import BaseModel
from typing import List, Optional

class AnalysisScore(BaseModel):
    value: int  # 0-100
    level: str  # "Low", "Moderate", "High"

class AnalysisResult(BaseModel):
    condition: str
    score: AnalysisScore
    mask_base64: Optional[str] = None
    overlay_color: Optional[str] = None

class SkinReport(BaseModel):
    overall_score: int
    results: List[AnalysisResult]
