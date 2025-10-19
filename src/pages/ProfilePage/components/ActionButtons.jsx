import React from 'react';
import { Save, X } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './ActionButtons.module.css';

/**
 * Action buttons for edit mode
 * @param {Object} props
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isLoading - Loading state
 */
function ActionButtons({ onSave, onCancel, isLoading }) {
  return (
    <div className={styles.actions}>
      <Button
        type="submit"
        variant="primary"
        onClick={onSave}
        disabled={isLoading}
        className={styles.saveButton}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner}></span>
            Saving...
          </>
        ) : (
          <>
            <Save size={16} />
            Save Changes
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={isLoading}
      >
        <X size={16} />
        Cancel
      </Button>
    </div>
  );
}

export default ActionButtons;