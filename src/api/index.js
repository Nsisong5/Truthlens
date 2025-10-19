
import { USE_MOCK, API_BASE_URL } from './apiConfig';
import * as mockAPI from './mockVerify';

/**
 * Real API implementation - calls actual FastAPI backend
 * TODO: Replace with actual FastAPI endpoint integration
 */
const realAPI = {
  /**
   * Verify article using real backend
   * @param {string|null} token - JWT auth token
   * @param {string} text - Article text
   * @returns {Promise<Object>} Verification result
   */
  async verifyArticle(token, text) {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/verify_article`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }
};

/**
 * Export the appropriate API based on configuration
 * When USE_MOCK is true, uses mock API
 * When USE_MOCK is false, uses real FastAPI endpoints
 */
export const verifyArticle = USE_MOCK 
  ? mockAPI.verifyArticle 
  : realAPI.verifyArticle;

// Export helper functions if using mock
export const isRecoverableError = USE_MOCK 
  ? mockAPI.isRecoverableError 
  : (error) => {
      // For real API, consider network errors and 5xx as recoverable
      return error.message.includes('Failed to fetch') ||
             error.message.includes('NetworkError') ||
             error.message.includes('HTTP 5');
    };