import React from 'react';
import { Edit2 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './ProfileHeader.module.css';

/**
 * Profile header with avatar and edit button
 * @param {Object} props
 * @param {string} props.username - Username
 * @param {string} props.email - Email
 * @param {string} props.joinedDate - ISO date string
 * @param {boolean} props.isEditMode - Whether in edit mode
 * @param {Function} props.onEditClick - Edit button handler
 */
function ProfileHeader({ username, email, joinedDate, isEditMode, onEditClick }) {
  // Get initials from username (first + last letter)
  const getInitials = (name) => {
    if (!name || name.length === 0) return '??';
    if (name.length === 1) return name.toUpperCase();
    return (name[0] + name[name.length - 1]).toUpperCase();
  };

  // Format joined date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className={styles.header}>
      {/* Initials Avatar */}
      <div className={styles.avatar}>
        <span className={styles.initials}>{getInitials(username)}</span>
      </div>

      {/* User Info */}
      <div className={styles.info}>
        <h1 className={styles.username}>{username}</h1>
        <p className={styles.email}>{email}</p>
        <p className={styles.joined}>
          Member since {formatDate(joinedDate)}
        </p>
      </div>

      {/* Edit Button */}
      {!isEditMode && (
        <Button
          variant="ghost"
          onClick={onEditClick}
          className={styles.editButton}
        >
          <Edit2 size={16} />
          Edit Profile
        </Button>
      )}
    </div>
  );
}

export default ProfileHeader;