import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import styles from './AuthPromptModal.module.css';

/**
 * Modal prompting user to authenticate or continue as guest
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onContinueAsGuest - Guest continuation handler
 */
function AuthPromptModal({ isOpen, onClose, onContinueAsGuest }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement;

    // Focus first focusable element in modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements?.length > 0) {
      focusableElements[0].focus();
    }

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Trap focus
    const handleTab = (e) => {
      if (!modalRef.current) return;
      
      const focusable = Array.from(
        modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.backdrop} 
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal} ref={modalRef}>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 id="modal-title" className={styles.title}>
          Sign in to check documents
        </h2>

        <p className={styles.message}>
          Create a free account to save your checks and access full reports. 
          We respect your privacy.
        </p>

        <p className={styles.privacy}>
          We will never read or sell your content. Only hashed metadata used for 
          improvements (opt-in).
        </p>

        <div className={styles.actions}>
          <Link to="/auth" className={styles.link}>
            <Button variant="primary">
              Login
            </Button>
          </Link>

          <Link to="/auth#signup" className={styles.link}>
            <Button variant="ghost">
              Sign Up
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            onClick={onContinueAsGuest}
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AuthPromptModal;