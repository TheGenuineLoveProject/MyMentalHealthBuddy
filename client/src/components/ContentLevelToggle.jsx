/**
 * ContentLevelToggle.jsx - 3-Level Content Selector
 * 
 * Features:
 * - Beginner / Intermediate / Advanced toggle
 * - localStorage persistence
 * - Accessible: keyboard reachable, aria-pressed, focus-visible
 * - Respects reduced-motion
 */

import { useState, useEffect } from 'react';
import styles from './ContentLevelToggle.module.css';

const STORAGE_KEY = 'glp-content-level';
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};
const LEVEL_DESCRIPTIONS = {
  beginner: 'Simple, step-by-step guidance',
  intermediate: 'Practical how-to details',
  advanced: 'In-depth exploration'
};

export function useContentLevel() {
  const [level, setLevel] = useState('beginner');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && LEVELS.includes(stored)) {
        setLevel(stored);
      }
    } catch (e) {}
  }, []);

  const updateLevel = (newLevel) => {
    if (LEVELS.includes(newLevel)) {
      setLevel(newLevel);
      try {
        localStorage.setItem(STORAGE_KEY, newLevel);
      } catch (e) {}
    }
  };

  return [level, updateLevel];
}

export default function ContentLevelToggle({ level, onChange }) {
  return (
    <div 
      className={styles.toggleContainer}
      role="group"
      aria-label="Content complexity level"
    >
      <span className={styles.toggleLabel}>
        Reading level:
      </span>
      <div className={styles.toggleGroup}>
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            className={`${styles.toggleButton} ${level === lvl ? styles.active : ''}`}
            onClick={() => onChange(lvl)}
            aria-pressed={level === lvl}
            aria-label={`${LEVEL_LABELS[lvl]}: ${LEVEL_DESCRIPTIONS[lvl]}`}
            data-testid={`toggle-level-${lvl}`}
          >
            {LEVEL_LABELS[lvl]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ContentLevelContent({ level, contentLevels, children }) {
  if (!contentLevels) {
    return children || null;
  }

  const content = contentLevels[level];
  if (!content) {
    return children || null;
  }

  return (
    <div className={styles.levelContent} data-level={level}>
      {content.summary && (
        <p className={styles.summary}>{content.summary}</p>
      )}

      {content.reassurance && (
        <p className={styles.reassurance}>{content.reassurance}</p>
      )}

      {content.steps && content.steps.length > 0 && (
        <ol className={styles.stepsList} role="list">
          {content.steps.map((step, i) => (
            <li key={i} className={styles.stepItem}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepText}>{step}</span>
            </li>
          ))}
        </ol>
      )}

      {content.guidance && content.guidance.length > 0 && (
        <ul className={styles.guidanceList} role="list">
          {content.guidance.map((item, i) => (
            <li key={i} className={styles.guidanceItem}>{item}</li>
          ))}
        </ul>
      )}

      {content.examples && content.examples.length > 0 && (
        <div className={styles.examplesSection}>
          <h4 className={styles.examplesTitle}>Examples</h4>
          <ul className={styles.examplesList} role="list">
            {content.examples.map((ex, i) => (
              <li key={i} className={styles.exampleItem}>{ex}</li>
            ))}
          </ul>
        </div>
      )}

      {content.deeperDive && content.deeperDive.length > 0 && (
        <div className={styles.deeperSection}>
          <h4 className={styles.deeperTitle}>Going Deeper</h4>
          <ul className={styles.deeperList} role="list">
            {content.deeperDive.map((item, i) => (
              <li key={i} className={styles.deeperItem}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {content.references && content.references.length > 0 && (
        <div className={styles.referencesSection}>
          <h4 className={styles.referencesTitle}>References</h4>
          <ul className={styles.referencesList} role="list">
            {content.references.map((ref, i) => (
              <li key={i} className={styles.referenceItem}>{ref}</li>
            ))}
          </ul>
        </div>
      )}

      {children}
    </div>
  );
}

export { LEVELS, LEVEL_LABELS, LEVEL_DESCRIPTIONS };
