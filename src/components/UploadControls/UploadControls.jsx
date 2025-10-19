import React, { useRef } from 'react';
import styles from './UploadControls.module.css';

/**
 * Upload controls component - file upload button and file info display
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when file is selected
 * @param {string} props.fileName - Current file name (if any)
 * @param {Function} props.onClear - Callback to clear file
 */
function UploadControls({ onFileSelect, fileName, onClear }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    // Validate file size (200KB = 204800 bytes)
    if (file.size > 204800) {
      alert('File size exceeds 200KB limit');
      return;
    }

    try {
      const text = await readFileAsText(file);
      onFileSelect(text, file.name);
    } catch (error) {
      alert('Error reading file: ' + error.message);
    }

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.controls}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className={styles.fileInput}
        aria-label="Upload text file"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        className={styles.uploadButton}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path 
            d="M8 3V13M8 3L4 7M8 3L12 7" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        Upload File
      </button>

      {fileName && (
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{fileName}</span>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear file"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadControls;