/**
 * Sensory Controller - Multi-Sensory Engagement Framework
 * Implements haptic, audio, and motion feedback for therapeutic UX
 * Respects user preferences (reduced-motion, hearing accessibility)
 */

import { sensory } from '../../../shared/design-system/tokens';

export type SensoryMode = 'serenity' | 'empowerment' | 'focus' | 'recovery';
export type HapticPattern = keyof typeof sensory.haptics;
export type AudioCue = keyof typeof sensory.audio;

interface SensoryPreferences {
  hapticsEnabled: boolean;
  audioEnabled: boolean;
  reducedMotion: boolean;
  volume: number; // 0-1
}

class SensoryController {
  private audioContext: AudioContext | null = null;
  private preferences: SensoryPreferences;

  constructor() {
    // Initialize with user preferences and system settings
    this.preferences = this.loadPreferences();
    this.initializeAudioContext();
  }

  /**
   * Load user preferences from localStorage and system settings
   * Guards against non-browser environments (tests, SSR)
   */
  private loadPreferences(): SensoryPreferences {
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    const savedPrefs = isBrowser ? localStorage.getItem('sensoryPreferences') : null;
    const reducedMotion = isBrowser ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    const defaults: SensoryPreferences = {
      hapticsEnabled: true,
      audioEnabled: false, // Off by default for non-intrusive UX
      reducedMotion,
      volume: 0.5,
    };

    if (savedPrefs) {
      try {
        return { ...defaults, ...JSON.parse(savedPrefs), reducedMotion };
      } catch {
        return defaults;
      }
    }

    return defaults;
  }

  /**
   * Save preferences to localStorage
   */
  public updatePreferences(prefs: Partial<SensoryPreferences>): void {
    this.preferences = { ...this.preferences, ...prefs };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sensoryPreferences', JSON.stringify(this.preferences));
    }
  }

  /**
   * Get current preferences
   */
  public getPreferences(): SensoryPreferences {
    return { ...this.preferences };
  }

  /**
   * Initialize Web Audio API context
   */
  private initializeAudioContext(): void {
    if (typeof window === 'undefined' || !window.AudioContext) {
      return;
    }

    try {
      this.audioContext = new AudioContext();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Trigger haptic feedback (mobile only)
   * Guards against non-browser environments
   */
  public async haptic(pattern: HapticPattern): Promise<void> {
    const hasVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;
    
    if (!this.preferences.hapticsEnabled || !hasVibrate) {
      return;
    }

    const vibrationPattern = sensory.haptics[pattern];
    
    try {
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Play audio cue using Web Audio API
   */
  public async playAudioCue(cue: AudioCue): Promise<void> {
    if (!this.preferences.audioEnabled || !this.audioContext) {
      return;
    }

    try {
      if (cue === 'chime') {
        const config = sensory.audio.chime;
        await this.playChime(config.frequencies, config.duration, config.volume);
      } else if (cue === 'success') {
        const config = sensory.audio.success;
        await this.playTone(config.frequency, config.duration, config.volume);
      } else if (cue === 'alphaWave') {
        const config = sensory.audio.alphaWave;
        await this.playBinauralBeat(
          config.baseFrequency,
          config.beatFrequency,
          config.duration
        );
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  /**
   * Play a simple tone
   */
  private async playTone(frequency: number, duration: number, volume: number): Promise<void> {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = volume * this.preferences.volume;

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);

    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  /**
   * Play a chime (multiple tones in sequence)
   */
  private async playChime(frequencies: number[], duration: number, volume: number): Promise<void> {
    for (const freq of frequencies) {
      await this.playTone(freq, duration / frequencies.length, volume);
    }
  }

  /**
   * Play binaural beat for alpha wave entrainment
   * Creates calming effect through frequency difference between ears
   */
  private async playBinauralBeat(
    baseFreq: number,
    beatFreq: number,
    duration: number
  ): Promise<void> {
    if (!this.audioContext) return;

    // Left ear - base frequency
    const oscillatorLeft = this.audioContext.createOscillator();
    const gainLeft = this.audioContext.createGain();
    const pannerLeft = this.audioContext.createStereoPanner();

    oscillatorLeft.frequency.value = baseFreq;
    oscillatorLeft.type = 'sine';
    gainLeft.gain.value = 0.3 * this.preferences.volume;
    pannerLeft.pan.value = -1; // Full left

    oscillatorLeft.connect(gainLeft);
    gainLeft.connect(pannerLeft);
    pannerLeft.connect(this.audioContext.destination);

    // Right ear - base + beat frequency
    const oscillatorRight = this.audioContext.createOscillator();
    const gainRight = this.audioContext.createGain();
    const pannerRight = this.audioContext.createStereoPanner();

    oscillatorRight.frequency.value = baseFreq + beatFreq;
    oscillatorRight.type = 'sine';
    gainRight.gain.value = 0.3 * this.preferences.volume;
    pannerRight.pan.value = 1; // Full right

    oscillatorRight.connect(gainRight);
    gainRight.connect(pannerRight);
    pannerRight.connect(this.audioContext.destination);

    // Start and stop both oscillators
    const startTime = this.audioContext.currentTime;
    const stopTime = startTime + duration / 1000;

    oscillatorLeft.start(startTime);
    oscillatorRight.start(startTime);
    oscillatorLeft.stop(stopTime);
    oscillatorRight.stop(stopTime);

    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  /**
   * Start breathing guide with haptic and audio feedback
   * Implements 4-7-8 breathing technique
   */
  public async startBreathingGuide(cycles: number = 3): Promise<void> {
    for (let i = 0; i < cycles; i++) {
      // Inhale (4 seconds)
      await this.haptic('breathingCycle');
      await this.playAudioCue('chime');
      await this.sleep(4000);

      // Hold (7 seconds)
      await this.sleep(7000);

      // Exhale (8 seconds)
      await this.playAudioCue('chime');
      await this.sleep(8000);
    }

    // Completion
    await this.haptic('success');
    await this.playAudioCue('success');
  }

  /**
   * Grounding exercise - rhythmic haptic pattern for anxiety relief
   */
  public async groundingExercise(): Promise<void> {
    const hasVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;
    
    if (!this.preferences.hapticsEnabled || !hasVibrate) return;

    // 5-4-3-2-1 grounding rhythm
    for (let i = 0; i < 5; i++) {
      await this.haptic('grounding');
      await this.sleep(1000);
    }

    await this.haptic('success');
  }

  /**
   * Celebrate achievement with multi-sensory feedback
   */
  public async celebrate(): Promise<void> {
    await Promise.all([
      this.haptic('success'),
      this.playAudioCue('success'),
    ]);
  }

  /**
   * Error notification with gentle feedback
   */
  public async notifyError(): Promise<void> {
    await this.haptic('error');
  }

  /**
   * General notification
   */
  public async notify(): Promise<void> {
    await this.haptic('notification');
  }

  /**
   * Helper: Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Cleanup audio context
   */
  public destroy(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Singleton instance
export const sensoryController = new SensoryController();

// React hooks for sensory feedback
export function useSensoryFeedback() {
  return {
    haptic: (pattern: HapticPattern) => sensoryController.haptic(pattern),
    playAudio: (cue: AudioCue) => sensoryController.playAudioCue(cue),
    breathingGuide: (cycles?: number) => sensoryController.startBreathingGuide(cycles),
    grounding: () => sensoryController.groundingExercise(),
    celebrate: () => sensoryController.celebrate(),
    notifyError: () => sensoryController.notifyError(),
    notify: () => sensoryController.notify(),
    updatePreferences: (prefs: Partial<SensoryPreferences>) => 
      sensoryController.updatePreferences(prefs),
    getPreferences: () => sensoryController.getPreferences(),
  };
}
