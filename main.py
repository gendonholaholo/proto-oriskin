from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import schemas
import analysis

app = FastAPI(
    title="Skin Analysis Microservice",
    description="API for processing skin analysis (Sebum, Pore, Acne, etc.)",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "service": "skin-analysis-microservice"}

@app.post("/analyze", response_model=List[schemas.AnalysisResult])
async def analyze_skin(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    results = await analysis.analyze_skin_image(contents)
    return results

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
