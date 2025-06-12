// Define types for SpeechRecognition API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isRecording = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'fr-FR';
    }
  }

  async startRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('La reconnaissance vocale n\'est pas supportée par ce navigateur'));
        return;
      }

      if (this.isRecording) {
        reject(new Error('Enregistrement déjà en cours'));
        return;
      }

      this.isRecording = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isRecording = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isRecording = false;
        reject(new Error(`Erreur de reconnaissance vocale: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isRecording = false;
        reject(error);
      }
    });
  }

  stopRecording() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  speakText(text: string, voice?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Set voice if specified
        if (voice) {
          const voices = this.synthesis.getVoices();
          const selectedVoice = voices.find(v => v.name === voice || v.lang.includes('fr'));
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Erreur de synthèse vocale: ${event.error}`));

        this.synthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices().filter(voice => 
      voice.lang.includes('fr') || voice.lang.includes('en')
    );
  }

  isRecordingActive(): boolean {
    return this.isRecording;
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}