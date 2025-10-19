import React, { useState, useEffect, useRef } from 'react';
import { Mail, X } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './EmailVerificationModal.module.css';

/**
 * Email verification modal
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {string} props.email - Email being verified
 * @param {Function} props.onVerify - Verify handler (code) => Promise
 * @param {Function} props.onResend - Resend code handler
 * @param {Function} props.onClose - Close handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 */
function EmailVerificationModal({ 
  isOpen, 
  email, 
  onVerify, 
  onResend, 
  onClose, 
  isLoading,
  error 
}) {
  const [code, setCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length === 6) {
      onVerify(code.trim());
    }
  };

  const handleResend = () => {
    setResendTimer(60);
    setCode('');
    onResend();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.backdrop} 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-title"
    >
      <div className={styles.modal} ref={modalRef}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className={styles.icon}>
          <Mail size={32} />
        </div>

        <h2 id="verification-title" className={styles.title}>
          Verify Your Email
        </h2>

        <p className={styles.message}>
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </p>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className={styles.codeInput}
              disabled={isLoading}
              maxLength={6}
              pattern="\d{6}"
              inputMode="numeric"
              aria-label="Verification code"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={code.length !== 6 || isLoading}
            className={styles.verifyButton}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        <div className={styles.resend}>
          {resendTimer > 0 ? (
            <p className={styles.resendTimer}>
              Resend code in {resendTimer}s
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className={styles.resendButton}
              disabled={isLoading}
            >
              Didn't receive code? Resend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationModal;