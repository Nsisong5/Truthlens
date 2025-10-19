import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CheckerCard from '../../components/CheckerCard/CheckerCard';
import { Moon, Sun } from 'lucide-react';
import ResultPanel from '../../components/ResultPanel/ResultPanel';
import AuthPromptModal from '../../components/Modal/AuthPromptModal';
import { verifyArticle } from '../../api';
import styles from './CheckerPage.module.css';

function CheckerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingText, setPendingText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('truthlens_token');
    setIsLoggedIn(!!token);

    // Check for dark mode
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkMode);
  }, []);

  // Toggle theme
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

  // Handle check submission
  const handleCheckDocument = async (text) => {
    if (!isLoggedIn) {
      // Show auth modal if not logged in
      setPendingText(text);
      setShowAuthModal(true);
      return;
    }

    await performCheck(text);
  };

  // Perform the actual verification
  const performCheck = async (text, asGuest = false) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const token = asGuest ? null : localStorage.getItem('truthlens_token');
      const verificationResult = await verifyArticle(token, text);
      setResult(verificationResult);
    } catch (err) {
      setError(err.message || 'Failed to verify document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guest continuation
  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
    if (pendingText) {
      performCheck(pendingText, true);
      setPendingText('');
    }
  };

  // Handle check again
  const handleCheckAgain = () => {
    setResult(null);
    setError('');
  };

  // Handle view full report
  const handleViewFullReport = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      // TODO: Navigate to full report page or expand section
      alert('Full report feature coming soon!');
    }
  };

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link to="/" className={styles.logo}>
            TruthLens
          </Link>

          <div className={styles.navActions}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isLoggedIn ? (
              <Link to="/profile" className={styles.loginButton}>
                Profile
              </Link>
            ) : (
              <Link to="/auth" className={styles.loginButton}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <h1 className={styles.title}>Check facts with TruthLens</h1>
        <p className={styles.subtitle}>
          Upload, paste, or drag your document — we'll find the truth behind every word.
        </p>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <CheckerCard onSubmit={handleCheckDocument} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className={styles.errorClose}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Result Panel */}
        <ResultPanel
          result={result}
          onCheckAgain={handleCheckAgain}
          onViewFullReport={handleViewFullReport}
          isLoggedIn={isLoggedIn}
        />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <Link to="/about">About</Link>
            <span className={styles.footerSeparator}>•</span>
            <Link to="/privacy">Privacy</Link>
            <span className={styles.footerSeparator}>•</span>
            <Link to="/terms">Terms</Link>
          </div>
          <p className={styles.copyright}>© 2025 TruthLens</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </div>
  );
}

export default CheckerPage;