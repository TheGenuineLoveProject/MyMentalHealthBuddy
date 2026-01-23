/**
 * ReadingLevelToggle.jsx - 3-Level Reading Mode Selector
 * 
 * Features:
 * - Kids / Standard / Deep toggle
 * - Accessible fieldset with legend
 * - Radio inputs with keyboard navigation
 * - Focus-visible rings
 * - Screen reader announcements
 * - Respects reduced-motion
 */

import { useId } from 'react';
import { READING_LEVELS, READING_LEVEL_META } from '../content/readingLevels.js';
import styles from './ReadingLevelToggle.module.css';

export default function ReadingLevelToggle({ value, onChange, className = '' }) {
  const groupId = useId();

  return (
    <fieldset 
      className={`${styles.fieldset} ${className}`}
      aria-label="Reading level"
    >
      <legend className={styles.legend}>
        Reading level
      </legend>
      
      <div className={styles.radioGroup} role="radiogroup">
        {READING_LEVELS.map((level) => {
          const meta = READING_LEVEL_META[level];
          const inputId = `${groupId}-${level}`;
          const isSelected = value === level;

          return (
            <label
              key={level}
              htmlFor={inputId}
              className={`${styles.radioLabel} ${isSelected ? styles.selected : ''}`}
              data-testid={`radio-reading-level-${level}`}
            >
              <input
                type="radio"
                id={inputId}
                name={`reading-level-${groupId}`}
                value={level}
                checked={isSelected}
                onChange={() => onChange(level)}
                className={styles.radioInput}
                aria-describedby={`${inputId}-desc`}
              />
              <span className={styles.radioText}>
                {meta.label}
              </span>
              <span 
                id={`${inputId}-desc`}
                className={styles.radioDescription}
              >
                {meta.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
