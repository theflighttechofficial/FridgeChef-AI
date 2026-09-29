// Utility for Web Speech API text-to-speech with server TTS fallback

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private currentVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer warm natural English voices (Google US English, Samantha, Alex, Karen, Natural)
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Karen') ||
          v.name.includes('Daniel'))
    );
    this.currentVoice = preferred || voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  }

  public speak(
    text: string,
    onEnd?: () => void,
    onStart?: () => void,
    onError?: (err: any) => void
  ) {
    this.stop();

    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.currentVoice) {
      utterance.voice = this.currentVoice;
    }
    utterance.rate = 0.95; // Slightly slower, clear culinary pace
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeakingState = true;
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        try {
          navigator.vibrate([10, 20, 10]);
        } catch (e) {
          // Safe fallback
        }
      }
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech synthesis error:', event);
      }
      if (onError) onError(event);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.isSpeakingState = false;
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isSpeakingState = true;
    }
  }

  public stop() {
    if (this.synth) {
      // Detach callbacks first: cancel() fires onend/onerror on the old utterance,
      // which would otherwise trigger stale handlers (e.g. auto-advance).
      if (this.currentUtterance) {
        this.currentUtterance.onend = null;
        this.currentUtterance.onerror = null;
        this.currentUtterance.onstart = null;
      }
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }

  public isPaused(): boolean {
    return this.synth ? this.synth.paused : false;
  }
}

export const speechEngine = new SpeechEngine();
