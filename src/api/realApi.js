/**
 * Real API Client for TruthLens
 * Connects React frontend to FastAPI backend
 * 
 * IMPORTANT: This uses the real backend endpoints
 * Make sure your FastAPI server is running!
 */

import { API_BASE_URL } from './apiConfig';

/**
 * Helper to handle API responses
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: response.statusText || 'Request failed'
    }));
    
    // Handle specific error cases
    if (response.status === 401) {
      // Unauthorized - clear token
      console.error('[TruthLens API] 401 Unauthorized - clearing tokens');
      localStorage.removeItem('truthlens_token');
      localStorage.removeItem('truthlens_user');
      throw new Error('Session expired. Please login again.');
    }
    
    if (response.status === 422) {
      // Validation error
      const message = error.detail?.[0]?.msg || 'Invalid request data';
      throw new Error(message);
    }
    
    throw new Error(error.detail || error.message || 'Request failed');
  }
  
  return await response.json();
}

/**
 * Get authorization headers with JWT token
 */
function getAuthHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Get token from localStorage if not provided
  if (!token) {
    token = localStorage.getItem('truthlens_token');
    console.log('[TruthLens API] Token from localStorage:', token);
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[TruthLens API] Authorization header set');
  } else {
    console.warn('[TruthLens API] No token available for authorization');
  }
  
  return headers;
}

/**
 * Register new user
 * POST /register
 * 
 * @param {Object} userData
 * @param {string} userData.email - User email
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} { access_token, token_type }
 */
export async function register({ email, username, password }) {
  console.log('[TruthLens API] Registering user:', username);
  
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      username,
      password
    })
  });
  
  const data = await handleResponse(response);
  
  // Store token immediately after registration
  if (data.access_token) {
    console.log('[TruthLens API] Registration successful - storing token');
    localStorage.setItem('truthlens_token', data.access_token);
    
    // Also store user data
    const userData = { username, email };
    localStorage.setItem('truthlens_user', JSON.stringify(userData));
    console.log('[TruthLens API] User data stored');
  }
  
  return data;
}

/**
 * Login user
 * POST /login
 * 
 * FastAPI expects OAuth2 form data (application/x-www-form-urlencoded)
 * with fields: username, password
 * 
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Promise<Object>} { access_token, token_type }
 */
export async function login({username, password}) {
  console.log('[TruthLens API] Logging in user:', username);
  
  
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password})
  });
  
  const data = await handleResponse(response);
  
  // CRITICAL: Store token immediately after successful login
  if (data.access_token) {
    console.log('[TruthLens API] Login successful - storing token');
    localStorage.setItem('truthlens_token', data.access_token);
    console.log('[TruthLens API] Token stored. Verifying...');
    
    // Verify token was stored
    const storedToken = localStorage.getItem('truthlens_token');
    console.log('[TruthLens API] Token verification:', storedToken ? 'SUCCESS' : 'FAILED');
    
    // Fetch and store user data immediately
    try {
      const user = await getCurrentUser();
      console.log('[TruthLens API] User profile fetched and stored');
    } catch (error) {
      console.error('[TruthLens API] Failed to fetch user profile:', error);
      // Don't throw - token is still valid even if profile fetch fails
    }
  }
  
  return data;
}

/**
 * Get current user profile
 * GET /me
 * 
 * Requires authentication
 * 
 * @returns {Promise<Object>} User profile data
 */
export async function getCurrentUser() {
  console.log('[TruthLens API] Fetching current user profile');
  
  // Check if token exists before making request
  const token = localStorage.getItem('truthlens_token');
  if (!token) {
    console.error('[TruthLens API] No token found in localStorage');
    throw new Error('Not authenticated. Please login first.');
  }
  
  console.log('[TruthLens API] Token found, making request to /me');
  
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  const user = await handleResponse(response);
  
  // Store user data
  console.log('[TruthLens API] User profile received:', user.username);
  localStorage.setItem('truthlens_user', JSON.stringify(user));
  
  return user;
}

/**
 * Verify article/claim
 * POST /api/verify
 * 
 * @param {Object} data
 * @param {string} data.text - Text content to verify
 * @param {string} [data.url] - Optional source URL
 * @param {string} [data.title] - Optional article title
 * @returns {Promise<Object>} Verification result
 */
export async function verifyArticle({ text, url = null, title = null }) {
  console.log('[TruthLens API] Verifying article');
  
  const response = await fetch(`${API_BASE_URL}/api/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      text,
      ...(url && { url }),
      ...(title && { title })
    })
  });
  
  return await handleResponse(response);
}

/**
 * Logout user (client-side only)
 * Clears local storage
 */
export function logout() {
  console.log('[TruthLens API] Logging out - clearing all data');
  localStorage.removeItem('truthlens_token');
  localStorage.removeItem('truthlens_user');
  localStorage.removeItem('truthlens_profile'); // Also clear profile data if exists
  console.log('[TruthLens API] Logout complete');
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = localStorage.getItem('truthlens_token');
  const hasToken = !!token;
  console.log('[TruthLens API] Authentication check:', hasToken ? 'Authenticated' : 'Not authenticated');
  return hasToken;
}

/**
 * Get stored user data
 * @returns {Object|null}
 */
export function getStoredUser() {
  const userData = localStorage.getItem('truthlens_user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('[TruthLens API] Failed to parse user data:', e);
      return null;
    }
  }
  return null;
}

// Debug helper - log localStorage state
export function debugLocalStorage() {
  console.log('=== TruthLens localStorage Debug ===');
  console.log('Token:', localStorage.getItem('truthlens_token') ? 'EXISTS' : 'MISSING');
  console.log('User:', localStorage.getItem('truthlens_user') ? 'EXISTS' : 'MISSING');
  console.log('Profile:', localStorage.getItem('truthlens_profile') ? 'EXISTS' : 'MISSING');
  