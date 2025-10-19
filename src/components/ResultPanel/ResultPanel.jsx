import React, { useEffect, useRef, useState } from 'react';
import Button from '../UI/Button';
import styles from './ResultPanel.module.css';

/**
 * Result panel - displays verification results
 * @param {Object} props
 * @param {Object} props.result - Verification result object
 * @param {Function} props.onCheckAgain - Callback to start new check
 * @param {Function} props.onViewFullReport - Callback when user wants full report
 * @param {boolean} props.isLoggedIn - Whether user is authenticated
 */
function ResultPanel({ result, onCheckAgain, onViewFullReport, isLoggedIn }) {
  const [shareMessage, setShareMessage] = useState('');
  const summaryRef = useRef(null);

  useEffect(() => {
    // Focus on summary when results appear
    if (result && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [result]);

  if (!result) return null;

  const { score, verdict, confidence, rationale, sources = [] } = result;

  // Determine score color
  const getScoreColor = () => {
    if (score >= 70) return styles.scoreHigh;
    if (score >= 40) return styles.scoreMedium;
    return styles.scoreLow;
  };

  // Get stance badge style
  const getStanceBadge = (stance) => {
    switch (stance?.toLowerCase()) {
      case 'supports':
        return styles.stanceSupports;
      case 'contradicts':
        return styles.stanceContradicts;
      case 'neutral':
        return styles.stanceNeutral;
      default:
        return styles.stanceNeutral;
    }
  };

  // Handle share
  const handleShare = async () => {
    const shareText = `TruthLens Verification Result:\nScore: ${score}/100\nVerdict: ${verdict}\n\n${rationale}\n\nCheck your facts at TruthLens`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (err) {
      setShareMessage('Failed to copy');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  // Truncate excerpt
  const truncateExcerpt = (text, maxLength = 140) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className={styles.panel}>
      <div 
        className={styles.summary}
        ref={summaryRef}
        tabIndex={-1}
        aria-label="Verification results summary"
      >
        <div className={styles.scoreRow}>
          <div className={`${styles.scorePill} ${getScoreColor()}`}>
            <span className={styles.scoreLabel}>Truth Score</span>
            <span className={styles.scoreValue}>{score}/100</span>
          </div>

          <div className={styles.verdictBadge}>
            <span className={styles.verdictLabel}>Verdict:</span>
            <span className={styles.verdictValue}>{verdict}</span>
          </div>

          <div className={styles.confidenceBadge}>
            <span className={styles.confidenceLabel}>Confidence:</span>
            <span className={styles.confidenceValue}>
              {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
            </span>
          </div>
        </div>

        <p className={styles.rationale}>{rationale}</p>
      </div>

      {sources.length > 0 ? (
        <div className={styles.evidenceSection}>
          <h3 className={styles.evidenceTitle}>Evidence Sources</h3>
          <ul className={styles.sourcesList}>
            {sources.map((source, index) => (
              <li key={index} className={styles.sourceItem}>
                <div className={styles.sourceHeader}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceTitle}
                  >
                    {source.title}
                  </a>
                  <span className={`${styles.stanceBadge} ${getStanceBadge(source.stance)}`}>
                    {source.stance?.toUpperCase() || 'NEUTRAL'}
                  </span>
                </div>
                <div className={styles.sourceMeta}>
                  <span className={styles.publisher}>{source.publisher}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.date}>{source.date}</span>
                </div>
                {source.excerpt && (
                  <p className={styles.excerpt}>{truncateExcerpt(source.excerpt)}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.noSources}>
          <p>No supporting sources found. We couldn't find authoritative sources for this claim.</p>
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="primary" onClick={onViewFullReport}>
          View Full Report
        </Button>

        <Button variant="ghost" onClick={handleShare}>
          {shareMessage || 'Share Summary'}
        </Button>

        <Button variant="ghost" onClick={onCheckAgain}>
          Check Again
        </Button>
      </div>
    </div>
  );
}

export default ResultPanel; 