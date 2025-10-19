/**
 * Mock Profile API
 * Simulates backend profile operations with localStorage persistence
 */

const STORAGE_KEY = 'truthlens_profile';
const VERIFICATION_KEY = 'truthlens_email_verification';

/**
 * Simulates network delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const simulateDelay = (min = 800, max = 1400) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Gets default sample profile
 * @returns {Object} Default profile data
 */
const getDefaultProfile = () => {
  const user = JSON.parse(localStorage.getItem('truthlens_user') || '{}');
  return {
    username: user.username || 'testuser',
    email: user.email || 'test@truthlens.com',
    bio: 'Truth seeker and fact checker',
    joinedDate: new Date('2024-01-15').toISOString()
  };
};

/**
 * Fetches user profile from localStorage or returns default
 * @returns {Promise<Object>} User profile
 */
export async function fetchProfile() {
  await simulateDelay();

  // Check if user is logged in
  const token = localStorage.getItem('truthlens_token');
  if (!token) {
    throw new Error('Not authenticated. Please login.');
  }

  // Try to get profile from localStorage
  let profile = localStorage.getItem(STORAGE_KEY);
  
  if (profile) {
    return JSON.parse(profile);
  }

  // Return default profile and persist it
  const defaultProfile = getDefaultProfile();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
}

/**
 * Updates user profile
 * @param {Object} updates - Profile updates
 * @param {string} updates.username - New username
 * @param {string} updates.email - New email
 * @param {string|null} updates.password - New password (optional)
 * @param {string} updates.bio - User bio
 * @returns {Promise<Object>} Updated profile
 * @throws {Error} On validation failure
 */
export async function updateProfile({ username, email, password = null, bio = '' }) {
  // Validate input
  if (!username || username.trim().length === 0) {
    throw new Error('Username is required');
  }

  if (username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters');
  }

  if (username.trim().length > 30) {
    throw new Error('Username must be less than 30 characters');
  }

  if (username.toLowerCase() === 'error') {
    throw new Error('Invalid username');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('Please enter a valid email address');
  }

  if (password && password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Simulate network delay
  await simulateDelay();

  // Simulate occasional server errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Server error: Unable to update profile. Please try again.');
  }

  // Get current profile
  const currentProfile = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  // Update profile
  const updatedProfile = {
    ...currentProfile,
    username: username.trim(),
    email: email.trim(),
    bio: bio.trim()
  };

  // Persist to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

  // Also update user object
  const user = JSON.parse(localStorage.getItem('truthlens_user') || '{}');
  user.username = updatedProfile.username;
  user.email = updatedProfile.email;
  localStorage.setItem('truthlens_user', JSON.stringify(user));

  return updatedProfile;
}

/**
 * Sends email verification code
 * @param {string} newEmail - New email to verify
 * @returns {Promise<Object>} Verification ID
 */
export async function sendEmailVerification(newEmail) {
  if (!isValidEmail(newEmail)) {
    throw new Error('Invalid email address');
  }

  await simulateDelay(500, 1000);

  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationId = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Store verification data
  const verificationData = {
    verificationId,
    code,
    email: newEmail,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0
  };

  localStorage.setItem(VERIFICATION_KEY, JSON.stringify(verificationData));

  // In a real app, this would send an email
  console.log(`[MOCK] Verification code sent to ${newEmail}: ${code}`);

  return {
    success: true,
    verificationId,
    // In development, return code for testing
    _devCode: code
  };
}

/**
 * Verifies email with code
 * @param {string} verificationId - Verification ID
 * @param {string} code - 6-digit verification code
 * @returns {Promise<Object>} Verification result
 */
export async function verifyEmail(verificationId, code) {
  await simulateDelay(400, 800);

  const verificationData = localStorage.getItem(VERIFICATION_KEY);
  
  if (!verificationData) {
    throw new Error('Verification session not found. Please request a new code.');
  }

  const data = JSON.parse(verificationData);

  // Check if expired
  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(VERIFICATION_KEY);
    throw new Error('Verification code expired. Please request a new code.');
  }

  // Check attempts
  if (data.attempts >= 3) {
    localStorage.removeItem(VERIFICATION_KEY);
    throw new Error('Too many failed attempts. Please request a new code.');
  }

  // Check verification ID
  if (data.verificationId !== verificationId) {
    throw new Error('Invalid verification session.');
  }

  // Check code
  if (data.code !== code.trim()) {
    // Increment attempts
    data.attempts += 1;
    localStorage.setItem(VERIFICATION_KEY, JSON.stringify(data));
    throw new Error(`Invalid verification code. ${3 - data.attempts} attempts remaining.`);
  }

  // Success - clean up
  localStorage.removeItem(VERIFICATION_KEY);

  return {
    success: true,
    email: data.email
  };
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gets stored verification code (for testing/development)
 * @returns {string|null} Current verification code
 */
export function getStoredVerificationCode() {
  const data = localStorage.getItem(VERIFICATION_KEY);
  if (!data) return null;
  const parsed = JSON.parse(data);
  return parsed.code;
}