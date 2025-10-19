import React from 'react';
import styles from './FormToggleLink.module.css';

/**
 * Toggle link between login and signup forms
 * @param {Object} props
 * @param {string} props.mode - Current mode ('login' or 'signup')
 * @param {Function} props.onToggle - Toggle handler
 */
function FormToggleLink({ mode, onToggle }) {
  const isLogin = mode === 'login';

  return (
    <div className={styles.container}>
      <p className={styles.text}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button
          type="button"
          onClick={onToggle}
          className={styles.link}
        >
          {isLogin ? 'Sign up here' : 'Log in here'}
        </button>
      </p>
    </div>
  );
}

export default FormToggleLink;