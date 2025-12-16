from pydantic import BaseModel


class AnalysisScore(BaseModel):
    value: float
    level: str  # "Low", "Moderate", "High"


class AnalysisResult(BaseModel):
    condition: str
    score: AnalysisScore
    mask_base64: str | None = None
    overlay_color: str | None = None


class SkinReport(BaseModel):
    overall_score: int
    results: list[AnalysisResult]
    is_mock: bool = False  # Indicates if data is from mock/dummy generator
