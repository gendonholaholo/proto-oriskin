import base64
import random

import cv2
import numpy as np

from app.core.config import settings
from app.schemas.analysis import AnalysisResult, AnalysisScore, SkinReport


class SkinAnalyzerService:
    """
    Skin Analysis Service
    
    When MOCK_MODE=True (default for development):
        - Uses random score generation
        - Generates dummy mask overlays
        - No ML model required
    
    When MOCK_MODE=False (production):
        - Will use actual ML model inference
        - Requires model to be loaded
    """

    def __init__(self):
        self.mock_mode = settings.MOCK_MODE
        if not self.mock_mode:
            # Initialize real model here in Production
            # self.model = load_model("...")
            pass

    def decode_image(self, file_bytes: bytes) -> np.ndarray:
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img

    def encode_image_to_base64(self, img: np.ndarray) -> str:
        _, buffer = cv2.imencode(".png", img)
        return base64.b64encode(buffer).decode("utf-8")

    def generate_mock_mask(self, image: np.ndarray, color: tuple) -> str:
        """
        Generate random blobs as a mock mask for development/testing.
        """
        mask = np.zeros_like(image)
        h, w = image.shape[:2]

        for _ in range(5):
            center_x = random.randint(0, w)
            center_y = random.randint(0, h)
            radius = random.randint(10, 50)
            cv2.circle(mask, (center_x, center_y), radius, color, -1)

        return self.encode_image_to_base64(mask)

    def _analyze_mock(self, original_img: np.ndarray) -> SkinReport:
        """Mock analysis with random data for development."""
        conditions = [
            {"name": "Sebum", "color": (255, 0, 0)},  # Blue
            {"name": "Pore", "color": (0, 255, 0)},  # Green
            {"name": "Wrinkle", "color": (0, 0, 255)},  # Red
            {"name": "Acne", "color": (0, 255, 255)},  # Yellow
            {"name": "Blackhead", "color": (255, 0, 255)},  # Magenta
            {"name": "Flek", "color": (128, 0, 128)},  # Purple
        ]

        results = []
        total_score = 0

        for cond in conditions:
            score_val = random.randint(30, 95)
            level = (
                "Low" if score_val < 50 else "Moderate" if score_val < 80 else "High"
            )

            mask_b64 = self.generate_mock_mask(original_img, cond["color"])

            # Map BGR to hex string for frontend
            b, g, r = cond["color"]
            hex_color = f"#{r:02x}{g:02x}{b:02x}"

            result = AnalysisResult(
                condition=cond["name"],
                score=AnalysisScore(value=score_val, level=level),
                mask_base64=mask_b64,
                overlay_color=hex_color,
            )
            results.append(result)
            total_score += score_val

        overall = int(total_score / len(conditions))

        return SkinReport(overall_score=overall, results=results, is_mock=True)

    def _analyze_real(self, original_img: np.ndarray) -> SkinReport:
        """
        Real ML model inference for production.
        TODO: Implement when ML model is ready.
        """
        raise NotImplementedError(
            "Real ML analysis not yet implemented. Set MOCK_MODE=true in .env"
        )

    async def analyze(self, file_bytes: bytes) -> SkinReport:
        """
        Main analysis entry point.
        Switches between mock and real analysis based on MOCK_MODE setting.
        """
        original_img = self.decode_image(file_bytes)

        if self.mock_mode:
            return self._analyze_mock(original_img)
        else:
            return self._analyze_real(original_img)
