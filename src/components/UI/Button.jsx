import React from 'react';
import styles from './Button.module.css';

/**
 * Reusable Button component
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type (button|submit|reset)
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.variant - Style variant (primary|ghost|danger)
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */

function Button({ 
  onClick, 
  type = 'button', 
  disabled = false, 
  variant = 'primary', 
  children,
  className = '',
  ...rest 
}) {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;