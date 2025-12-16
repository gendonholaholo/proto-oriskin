import numpy as np
import cv2
import base64
import random
from typing import List
from schemas import AnalysisResult, AnalysisScore

def decode_image(file_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def encode_image_to_base64(img: np.ndarray) -> str:
    _, buffer = cv2.imencode('.png', img)
    return base64.b64encode(buffer).decode('utf-8')

def generate_dummy_mask(image: np.ndarray, color: tuple) -> str:
    # Create a blank mask
    mask = np.zeros_like(image)
    h, w = image.shape[:2]
    
    # Draw random blobs to simulate detection
    for _ in range(5):
        center_x = random.randint(0, w)
        center_y = random.randint(0, h)
        radius = random.randint(10, 50)
        cv2.circle(mask, (center_x, center_y), radius, color, -1)
    
    # Blend with original (optional, but returning pure mask is better for frontend overlay)
    # Here we return just the mask as PNG base64
    return encode_image_to_base64(mask)

async def analyze_skin_image(file_bytes: bytes) -> List[AnalysisResult]:
    # In a real M4 implementation:
    # 1. Load PyTorch model with .to('mps')
    # 2. Run inference
    original_img = decode_image(file_bytes)
    
    conditions = [
        {"name": "Sebum", "color": (0, 255, 255)}, # Yellow
        {"name": "Pore", "color": (255, 0, 0)},    # Blue
        {"name": "Flek", "color": (0, 0, 0)},      # Black/Dark
        {"name": "Wrinkle", "color": (0, 255, 0)}, # Green
        {"name": "Acne", "color": (0, 0, 255)},    # Red
        {"name": "Comedo", "color": (255, 255, 255)} # White
    ]
    
    results = []
    
    for cond in conditions:
        score_val = random.randint(20, 95)
        level = "High" if score_val > 80 else ("Moderate" if score_val > 50 else "Low")
        
        # Simulate processing time or MPS usage
        mask_b64 = generate_dummy_mask(original_img, cond["color"])
        
        results.append(
            AnalysisResult(
                condition=cond["name"],
                score=AnalysisScore(value=score_val, level=level),
                mask_base64=mask_b64,
                overlay_color=str(cond["color"])
            )
        )
        
    return results
