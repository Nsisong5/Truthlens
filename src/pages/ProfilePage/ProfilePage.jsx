import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import ProfileHeader from './components/ProfileHeader';
import ProfileView from './components/ProfileView';
import ProfileEditForm from './components/ProfileEditForm';
import ActionButtons from './components/ActionButtons';
import EmailVerificationModal from './components/EmailVerificationModal';
import Button from '../../components/UI/Button';
import { 
  fetchProfile, 
  updateProfile, 
  sendEmailVerification, 
  verifyEmail 
} from '../../api/mockProfile';

import { 
 getCurrentUser
 
} from '../../api/realApi';

import styles from './ProfilePage.module.css';

function ProfilePage() {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Email verification state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(null);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Auto-clear success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getCurrentUser();
      setProfile(data);
    } catch (err) {
      setError(err.message);
      
      // If not authenticated, redirect to login
      if (err.message.includes('Not authenticated')) {
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setError('');
  };

  const handleSave = async (updates) => {
    setIsSaving(true);
    setError('');

    try {
      // Check if email changed
      if (updates.email !== profile.email) {
        // Store updates and trigger email verification
        setPendingUpdates(updates);
        setNewEmail(updates.email);
        
        const verificationResponse = await sendEmailVerification(updates.email);
        setVerificationId(verificationResponse.verificationId);
        setShowVerificationModal(true);
        setIsSaving(false);
        
        // Show dev code in console for testing
        if (verificationResponse._devCode) {
          console.log(`[DEV] Verification code: ${verificationResponse._devCode}`);
        }
        return;
      }

      // If email didn't change, update directly
      const updatedProfile = await updateProfile(updates);
      setProfile(updatedProfile);
      setIsEditMode(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyEmail = async (code) => {
    setIsVerifying(true);
    setVerificationError('');

    try {
      await verifyEmail(verificationId, code);
      
      // Email verified, now update profile
      if (pendingUpdates) {
        const updatedProfile = await updateProfile(pendingUpdates);
        setProfile(updatedProfile);
        setPendingUpdates(null);
      }

      setShowVerificationModal(false);
      setIsEditMode(false);
      setSuccessMessage('Email verified and profile updated successfully!');
    } catch (err) {
      setVerificationError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const verificationResponse = await sendEmailVerification(newEmail);
      setVerificationId(verificationResponse.verificationId);
      setVerificationError('');
      
      // Show dev code in console for testing
      if (verificationResponse._devCode) {
        console.log(`[DEV] Verification code: ${verificationResponse._devCode}`);
      }
    } catch (err) {
      setVerificationError(err.message);
    }
  };

  const handleCloseVerification = () => {
    setShowVerificationModal(false);
    setVerificationError('');
    setPendingUpdates(null);
    setNewEmail('');
    setIsSaving(false);
  };

  const handleLogout = () => {
    // Confirm before logout
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear all authentication data
      localStorage.removeItem('truthlens_token');
      localStorage.removeItem('truthlens_user');
      localStorage.removeItem('truthlens_profile');
      
      // Redirect to login page
      navigate('/auth');
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (not authenticated)
  if (error && error.includes('Not authenticated')) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h2>Authentication Required</h2>
            <p>{error}</p>
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Back Button */}
      <Link to="/" className={styles.backButton}>
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <div className={styles.container}>
        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>
            ✓ {successMessage}
          </div>
        )}

        {/* Card */}
        <div className={styles.card}>
          {/* Profile Header */}
          <ProfileHeader
            username={profile.username}
            email={profile.email}
            joinedDate={profile.joinedDate}
            isEditMode={isEditMode}
            onEditClick={handleEditClick}
          />

          {/* Content */}
          <div className={styles.content}>
            {isEditMode ? (
              <>
                <ProfileEditForm
                  profile={profile}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isLoading={isSaving}
                  error={error}
                />
                <ActionButtons
                  onSave={(e) => {
                    e.preventDefault();
                    const form = e.target.closest('form') || document.querySelector('form');
                    if (form) {
                      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                  }}
                  onCancel={handleCancel}
                  isLoading={isSaving}
                />
              </>
            ) : (
              <>
                <ProfileView profile={profile} />
                
                {/* Logout Button - Only shown in view mode */}
                <div className={styles.logoutSection}>
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                  <p className={styles.logoutHint}>
                    This will end your session and clear all stored data
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        email={newEmail}
        onVerify={handleVerifyEmail}
        onResend={handleResendCode}
        onClose={handleCloseVerification}
        isLoading={isVerifying}
        error={verificationError}
      />
    </div>
  );
}

export default ProfilePage;