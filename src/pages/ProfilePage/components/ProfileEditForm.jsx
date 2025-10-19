import React, { useState } from 'react';
import { User, Mail, Lock, FileText, Eye, EyeOff } from 'lucide-react';
import styles from './ProfileEditForm.module.css';

/**
 * Profile edit form component
 * @param {Object} props
 * @param {Object} props.profile - Current profile data
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 */
function ProfileEditForm({ profile, onSave, onCancel, isLoading, error }) {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
    bio: profile.bio || '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.trim().length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only if provided)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Confirm password (only if password is provided)
    if (formData.password && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Only include password if it was changed
      const updates = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        password: formData.password || null
      };
      
      onSave(updates);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {error && (
        <div className={styles.errorBanner} role="alert">
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Username */}
      <div className={styles.field}>
        <label htmlFor="username" className={styles.label}>
          <User size={18} />
          <span>Username</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
          disabled={isLoading}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
        />
        {errors.username && (
          <span id="username-error" className={styles.fieldError}>
            {errors.username}
          </span>
        )}
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          <Mail size={18} />
          <span>Email</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          disabled={isLoading}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className={styles.fieldError}>
            {errors.email}
          </span>
        )}
        {formData.email !== profile.email && (
          <p className={styles.hint}>
            Changing your email will require verification
          </p>
        )}
      </div>

      {/* Bio */}
      <div className={styles.field}>
        <label htmlFor="bio" className={styles.label}>
          <FileText size={18} />
          <span>Bio</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className={styles.textarea}
          rows={3}
          placeholder="Tell us about yourself..."
          disabled={isLoading}
          maxLength={200}
        />
        <span className={styles.charCount}>
          {formData.bio.length} / 200
        </span>
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          <Lock size={18} />
          <span>New Password (optional)</span>
        </label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="Leave blank to keep current password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span id="password-error" className={styles.fieldError}>
            {errors.password}
          </span>
        )}
      </div>

      {/* Confirm Password */}
      {formData.password && (
        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            <Lock size={18} />
            <span>Confirm New Password</span>
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Confirm your new password"
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.passwordToggle}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span id="confirmPassword-error" className={styles.fieldError}>
              {errors.confirmPassword}
            </span>
          )}
        </div>
      )}
    </form>
  );
}

export default ProfileEditForm;