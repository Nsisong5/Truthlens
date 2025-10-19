import React from 'react';
import styles from './SocialLoginButtons.module.css';

/**
 * Social login buttons (Google & Facebook)
 * @param {Object} props
 * @param {Function} props.onGoogleLogin - Google login handler
 * @param {Function} props.onFacebookLogin - Facebook login handler
 * @param {boolean} props.isLoading - Loading state
 */
function SocialLoginButtons({ onGoogleLogin, onFacebookLogin, isLoading }) {
  return (
    <div className={styles.container}>
      <div className={styles.divider}>
        <span className={styles.dividerText}>or continue with</span>
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={isLoading}
          className={styles.socialButton}
          aria-label="Continue with Google"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={onFacebookLogin}
          disabled={isLoading}
          className={styles.socialButton}
          aria-label="Continue with Facebook"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#1877F2"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>
    </div>
  );
}

export default SocialLoginButtons;