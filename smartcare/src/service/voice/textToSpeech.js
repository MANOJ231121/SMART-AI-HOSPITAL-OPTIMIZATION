let voicesReady = false;
let pendingVoiceCallbacks = [];

function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    voicesReady = true;
    pendingVoiceCallbacks.forEach((cb) => cb());
    pendingVoiceCallbacks = [];
  }
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function whenVoicesReady(callback) {
  if (voicesReady) {
    callback();
  } else {
    pendingVoiceCallbacks.push(callback);
    setTimeout(() => {
      if (!voicesReady) {
        voicesReady = true;
        callback();
      }
    }, 800);
  }
}

/**
 * Finds the most suitable voice for speech synthesis.
 * Handles fallback for Gujarati (gu-IN) when the OS/Browser has no native gu voice
 * by selecting an Indian phonetic voice (hi-IN / en-IN) so audio never goes silent.
 */
function findBestVoice(language) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const langCode = (language || "hi-IN").toLowerCase();
  const prefix = langCode.split("-")[0];

  // 1. Direct match
  let matched = voices.find(v => v.lang.toLowerCase() === langCode);
  if (matched) return { voice: matched, lang: matched.lang };

  // 2. Language prefix match (e.g., 'gu', 'hi', 'en')
  matched = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  if (matched) return { voice: matched, lang: matched.lang };

  // 3. If Gujarati ('gu') is requested but not installed in the browser/OS,
  // fallback to Hindi ('hi-IN') or Indian English ('en-IN') which uses Indian phonetic pronunciation
  if (prefix === "gu") {
    matched = voices.find(v => v.lang.toLowerCase() === "hi-in" || v.lang.toLowerCase().startsWith("hi"));
    if (matched) return { voice: matched, lang: "hi-IN" };

    matched = voices.find(v => v.lang.toLowerCase() === "en-in");
    if (matched) return { voice: matched, lang: "en-IN" };
  }

  // 4. Default / system voice
  matched = voices.find(v => v.default) || voices[0];
  return { voice: matched, lang: matched ? matched.lang : "en-US" };
}

export function speak(text, language = "hi-IN", { onStart, onEnd } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("SpeechSynthesis not supported in this browser environment");
    onEnd?.();
    return;
  }

  if (!text || !text.trim()) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  whenVoicesReady(() => {
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const resolved = findBestVoice(language);

        if (resolved?.voice) {
          utterance.voice = resolved.voice;
          utterance.lang = resolved.lang || language;
        } else {
          utterance.lang = language;
        }

        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => onStart?.();
        utterance.onend = () => onEnd?.();
        utterance.onerror = (e) => {
          console.warn("TTS Notice/Error:", e.error);
          onEnd?.();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Speech synthesis invocation error:", err);
        onEnd?.();
      }
    }, 80);
  });
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function unlockAudio() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const unlock = new SpeechSynthesisUtterance(" ");
    unlock.volume = 0;
    window.speechSynthesis.speak(unlock);
  }
}