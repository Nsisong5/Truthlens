import React from 'react';
import { User, Mail, FileText } from 'lucide-react';
import styles from './ProfileView.module.css';

/**
 * Profile view mode - displays user information
 * @param {Object} props
 * @param {Object} props.profile - User profile data
 */
function ProfileView({ profile }) {
  return (
    <div className={styles.view}>
      <div className={styles.section}>
        <div className={styles.field}>
          <div className={styles.label}>
            <User size={18} />
            <span>Username</span>
          </div>
          <div className={styles.value}>{profile.username}</div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>
            <Mail size={18} />
            <span>Email</span>
          </div>
          <div className={styles.value}>{profile.email}</div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>
            <FileText size={18} />
            <span>Bio</span>
          </div>
          <div className={styles.value}>
            {profile.bio || <span className={styles.emptyBio}>No bio added yet</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;