/**
 * ReadingLevelToggle.jsx - 3-Level Content Mode Selector
 * 
 * Features:
 * - Beginner / Intermediate / Advanced toggle
 * - Accessible fieldset with legend (visually hidden)
 * - Radio inputs with keyboard navigation (Tab + Arrow keys)
 * - Focus-visible rings
 * - Screen reader announcements
 * - Respects reduced-motion
 * - Helper text: "Choose how much detail you want."
 */

import { useId } from 'react';
import { READING_LEVELS, READING_LEVEL_META } from '../content/readingLevels.js';
import styles from './ReadingLevelToggle.module.css';

export default function ReadingLevelToggle({ value, onChange, className = '' }) {
  const groupId = useId();

  return (
    <fieldset 
      className={`${styles.fieldset} ${className}`}
      aria-label="Content level"
    >
      <legend className={styles.legend}>
        Level
      </legend>
      <span className={styles.helperText}>
        Choose how much detail you want.
      </span>
      
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
              data-testid={`radio-level-${level}`}
            >
              <input
                type="radio"
                id={inputId}
                name={`level-${groupId}`}
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
                className={styles.srOnly}
              >
                {meta.description}
              </span>
            </label>
          );
        })}
      </div>
      <span className={styles.microcopy}>
        You can change this any time.
      </span>
    </fieldset>
  );
}
