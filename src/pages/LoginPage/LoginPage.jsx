import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import { Moon, Sun } from 'lucide-react';
import FormToggleLink from './components/FormToggleLink';
import { mockLogin, mockSignup, mockSocialLogin } from './utils/mockAuthApi';
import styles from './LoginPage.module.css';
import { 
 register,
 login
} from '../../api/realApi';



function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial mode from URL hash (#signup) or default to login
  const initialMode = location.hash === '#signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode on mount
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkMode);
  }, []);

  // Update URL hash when mode changes
  useEffect(() => {
    if (mode === 'signup') {
      window.history.replaceState(null, '', '#signup');
    } else {
      window.history.replaceState(null, '', '#login');
    }
  }, [mode]);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('truthlens_token');
    if (token) {
      // User already logged in, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError('');
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const newDarkMode = !isDarkMode;
    
    if (newDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDarkMode(newDarkMode);
  };

  const handleLoginSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      // Store token in localStorage
      localStorage.setItem('truthlens_token', response.token);
      localStorage.setItem('truthlens_user', JSON.stringify(response.user));

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await register(formData);
      
      // Store token in localStorage
      localStorage.setItem('truthlens_token', response.token);
      localStorage.setItem('truthlens_user', JSON.stringify(response.user));

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await mockSocialLogin(provider);
      
      // Store token in localStorage
      localStorage.setItem('truthlens_token', response.token);
      localStorage.setItem('truthlens_user', JSON.stringify(response.user));

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || `${provider} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={styles.themeToggle}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={styles.container}>
        {/* Logo & Tagline */}
        <div className={styles.header}>
          <h1 className={styles.logo}>TruthLens</h1>
          <p className={styles.tagline}>Truth in a world of noise.</p>
        </div>

        {/* Auth Card */}
        <div className={styles.card}>
          {/* Toggle Tabs */}
          <div className={styles.tabs}>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container with animation */}
          <div className={styles.formContainer}>
            {mode === 'login' ? (
              <LoginForm
                onSubmit={handleLoginSubmit}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <SignupForm
                onSubmit={handleSignupSubmit}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>

          {/* Social Login Buttons */}
          <SocialLoginButtons
            onGoogleLogin={() => handleSocialLogin('google')}
            onFacebookLogin={() => handleSocialLogin('facebook')}
            isLoading={isLoading}
          />

          {/* Toggle Link */}
          <FormToggleLink mode={mode} onToggle={toggleMode} />
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.copyright}>© 2025 TruthLens</p>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;