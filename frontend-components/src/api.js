/**
 * API client for Skin Analysis Service
 * Handles communication with FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

/**
 * Analyze skin image by sending to backend
 * @param {Blob} imageBlob - Image blob from camera capture
 * @returns {Promise<Object>} - Analysis results with is_mock indicator
 */
export async function analyzeSkin(imageBlob) {
  const formData = new FormData();
  formData.append('file', imageBlob, 'capture.jpg');

  const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Check backend health status
 * @returns {Promise<Object>} - Health status object
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('Backend service unavailable');
  }

  return response.json();
}

/**
 * Get service info including mock mode status
 * @returns {Promise<Object>} - Service info with mock_mode flag
 */
export async function getServiceInfo() {
  const response = await fetch(`${API_BASE_URL}/info`);

  if (!response.ok) {
    throw new Error('Failed to get service info');
  }

  return response.json();
}

export default {
  analyzeSkin,
  checkHealth,
  getServiceInfo,
  API_BASE_URL,
};
