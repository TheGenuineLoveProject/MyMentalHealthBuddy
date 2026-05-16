/**
 * useWellnessContent - Hook for reading-level-aware wellness content
 * 
 * Combines the ReadingLevelContext with wellnessMicrocopy and contentTierCompiler
 * for consistent, trauma-informed content across wellness pages.
 */
import { useMemo } from 'react';
import { useReadingLevel } from '../context/ReadingLevelContext';
import { pickSlot, getWellnessCopy, buildTierCopy, safetyFooter } from '../content/microcopy/wellnessMicrocopy';
import { getSafetyPhrase, getEvidencePhrase, compileForLevel, validateContent } from '../lib/contentTierCompiler';

export function useWellnessContent(routeKey = 'default') {
  const { readingLevel, isReady } = useReadingLevel();

  const content = useMemo(() => {
    const level = readingLevel || 'intermediate';
    
    return {
      consent: getWellnessCopy('consent', level, routeKey),
      pacing: getWellnessCopy('pacing', level, routeKey),
      grounding: getWellnessCopy('grounding', level, routeKey),
      reassurance: getWellnessCopy('reassurance', level, routeKey),
      exits: getWellnessCopy('exits', level, routeKey),
      safety: getWellnessCopy('safety', level, routeKey),
      reflection: getWellnessCopy('reflection', level, routeKey),
      encouragement: getWellnessCopy('encouragement', level, routeKey),
      tryAgain: getWellnessCopy('tryAgain', level, routeKey),
      emotionalValidation: getWellnessCopy('emotionalValidation', level, routeKey),
      supportSafety: getWellnessCopy('supportSafety', level, routeKey),
      journalingPrompts: getWellnessCopy('journalingPrompts', level, routeKey),
      tierSelectors: getWellnessCopy('tierSelectors', level, routeKey),
      
      ctaPrimary: pickSlot('ctaPrimary', level, routeKey),
      ctaSecondary: pickSlot('ctaSecondary', level, routeKey),
      emptyState: pickSlot('emptyStates', level, routeKey),
      successMessage: pickSlot('successStates', level, routeKey),
      errorMessage: pickSlot('errorStates', level, routeKey),
      
      safetyPhrase: getSafetyPhrase(level),
      evidencePhrase: getEvidencePhrase(level),
      
      safetyFooter
    };
  }, [readingLevel, routeKey]);

  const getTieredCopy = useMemo(() => {
    return (tier) => buildTierCopy({ 
      routeKey, 
      tier, 
      level: readingLevel || 'intermediate' 
    });
  }, [readingLevel, routeKey]);

  const compile = useMemo(() => {
    return (baseContent, options = {}) => compileForLevel(
      baseContent, 
      readingLevel || 'intermediate', 
      options
    );
  }, [readingLevel]);

  const validate = useMemo(() => {
    return (contentToCheck) => validateContent(
      contentToCheck, 
      readingLevel || 'intermediate'
    );
  }, [readingLevel]);

  return {
    level: readingLevel,
    isReady,
    content,
    getTieredCopy,
    compile,
    validate
  };
}

export default useWellnessContent;
