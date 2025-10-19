/**
 * Mock Authentication API
 * Simulates backend login and signup with realistic latency and validation
 */

/**
 * Simulates network delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const simulateDelay = (min = 800, max = 1500) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Mock login function
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Login response
 * @throws {Error} On validation or authentication failure
 */
export async function mockLogin({ username, password }) {
  // Validate input
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  if (username.trim().length === 0 || password.trim().length === 0) {
    throw new Error('Username and password cannot be empty');
  }

  // Simulate network delay
  await simulateDelay();

  // Simulate occasional server errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Server error: Unable to process login. Please try again.');
  }

  // Mock authentication logic
  // In production, these would be validated against real database
  const validCredentials = [
    { username: 'testuser', email: 'test@truthlens.com', password: '1234' },
    { username: 'demo', email: 'demo@truthlens.com', password: 'demo123' },
    { username: 'admin', email: 'admin@truthlens.com', password: 'admin123' }
  ];

  const user = validCredentials.find(
    cred => 
      (cred.username === username || cred.email === username) && 
      cred.password === password
  );

  if (user) {
    // Generate a fake JWT token
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ 
        username: user.username, 
        email: user.email,
        exp: Date.now() + 86400000 // 24 hours
      })
    )}.fake_signature`;

    return {
      status: 200,
      message: 'Login successful',
      token: fakeToken,
      user: {
        username: user.username,
        email: user.email
      }
    };
  } else {
    // Invalid credentials
    throw new Error('Invalid username or password');
  }
}

/**
 * Mock signup function
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} Signup response
 * @throws {Error} On validation failure
 */
export async function mockSignup({ username, email, password }) {
  // Validate input
  if (!username || !email || !password) {
    throw new Error('All fields are required');
  }

  // Trim whitespace
  username = username.trim();
  email = email.trim();
  password = password.trim();

  if (username.length === 0 || email.length === 0 || password.length === 0) {
    throw new Error('Fields cannot be empty');
  }

  // Validate username
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }

  if (username.length > 20) {
    throw new Error('Username must be less than 20 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }

  // Validate email
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address');
  }

  // Validate password
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Simulate network delay
  await simulateDelay(1000, 1800);

  // Simulate occasional server errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Server error: Unable to process signup. Please try again.');
  }

  // Check for existing users (mock database check)
  const existingUsers = ['testuser', 'admin', 'demo'];
  const existingEmails = ['test@truthlens.com', 'admin@truthlens.com', 'demo@truthlens.com'];

  if (existingUsers.includes(username.toLowerCase())) {
    throw new Error('Username already exists. Please choose another.');
  }

  if (existingEmails.includes(email.toLowerCase())) {
    throw new Error('Email already registered. Please login instead.');
  }

  // Successful signup
  const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ 
      username, 
      email,
      exp: Date.now() + 86400000 // 24 hours
    })
  )}.fake_signature`;

  return {
    status: 201,
    message: 'Account created successfully',
    token: fakeToken,
    user: {
      username,
      email
    }
  };
}

/**
 * Mock social login (Google/Facebook)
 * @param {string} provider - 'google' or 'facebook'
 * @returns {Promise<Object>} Social login response
 */
export async function mockSocialLogin(provider) {
  await simulateDelay(1500, 2000);

  // In production, this would redirect to OAuth flow
  // For now, simulate successful login
  const mockUser = {
    google: {
      username: 'googleuser',
      email: 'user@gmail.com'
    },
    facebook: {
      username: 'fbuser',
      email: 'user@facebook.com'
    }
  };

  const user = mockUser[provider] || mockUser.google;

  const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ 
      username: user.username, 
      email: user.email,
      provider,
      exp: Date.now() + 86400000
    })
  )}.fake_signature`;

  return {
    status: 200,
    message: `${provider} login successful`,
    token: fakeToken,
    user
  };
}

/**
 * Helper to check if error is recoverable
 * @param {Error} error - The error object
 * @returns {boolean} Whether retry might succeed
 */
export function isRecoverableError(error) {
  return error.message.includes('Server error') || 
         error.message.includes('network') ||
         error.message.includes('timeout');
}