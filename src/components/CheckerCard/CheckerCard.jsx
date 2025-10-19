import React, { useState, useRef } from 'react';
import Button from '../UI/Button';
import UploadControls from '../UploadControls/UploadControls';
import styles from './CheckerCard.module.css';

/**
 * Main checker card component - handles text input, file upload, and drag & drop
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback when check is submitted
 * @param {boolean} props.isLoading - Loading state
 */
function CheckerCard({ onSubmit, isLoading }) {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);
  const dragCounter = useRef(0);

  const MAX_CHARS = 200000; // 200KB roughly

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const handleFileSelect = (fileText, name) => {
    setText(fileText);
    setFileName(name);
    setCharCount(fileText.length);
  };

  const handleClear = () => {
    setText('');
    setFileName('');
    setCharCount(0);
  };

  const handleSubmit = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onSubmit(trimmedText);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.name.endsWith('.txt')) {
        alert('Please drop a .txt file');
        return;
      }

      // Validate file size
      if (file.size > 204800) {
        alert('File size exceeds 200KB limit');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileText = event.target.result;
          setText(fileText);
          setFileName(file.name);
          setCharCount(fileText.length);
        };
        reader.onerror = () => {
          alert('Error reading file');
        };
        reader.readAsText(file);
      } catch (error) {
        alert('Error processing file: ' + error.message);
      }
    }
  };

  const isOverLimit = charCount > MAX_CHARS;
  const isDisabled = !text.trim() || isOverLimit || isLoading;

  return (
    <div className={styles.card}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="region"
        aria-label="Document upload area"
      >
        <div className={styles.uploadArea}>
          <UploadControls
            onFileSelect={handleFileSelect}
            fileName={fileName}
            onClear={handleClear}
          />
        </div>

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Paste or drop your text here..."
          value={text}
          onChange={handleTextChange}
          disabled={isLoading}
          aria-describedby="input-hints"
          rows={10}
        />

        <div id="input-hints" className={styles.hints}>
          <span className={styles.hint}>
            Max 200KB for MVP • For best results paste main article body
          </span>
          <span className={`${styles.charCount} ${isOverLimit ? styles.overLimit : ''}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
          </span>
        </div>
      </div>

      <div className={styles.ctaWrapper}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={styles.submitButton}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Checking...
            </>
          ) : (
            'Check Document'
          )}
        </Button>
      </div>
    </div>
  );
}

export default CheckerCard;