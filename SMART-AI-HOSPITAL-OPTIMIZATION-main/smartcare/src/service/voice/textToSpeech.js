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

function hasNaturalMarker(name) {
  return /(neural|online|natural|worden|google us english|google uk english|premium|enhanced)/i.test(
    name
  );
}

/**
 * Tries to find a voice matching a preferred gender.
 * Voices often include "Male"/"Female" (or "Google US English"/"Microsoft Zira" etc.)
 * in their name. We match case-insensitively, preferring modern neural/online
 * voices that sound noticeably more natural (less robotic).
 */
function findVoiceByGender(voices, gender) {
  if (!gender || !voices || voices.length === 0) return null;
  const g = gender.toLowerCase();
  const keywords = g === "male"
    ? ["male", " men", "david", "daniel", "alex", " rishi", " christopher", " eric", " guy", " google uk english male"]
    : ["female", "zira", "susan", "samantha", "victoria", "karen", "moira", "tessa", " jenny", " aria", " libby", " sonia", " natasha", " google uk english female"];

  // Prefer a natural-sounding (neural/online) voice in the desired gender.
  const natural = voices.find(
    (v) => hasNaturalMarker(v.name) && keywords.some((kw) => v.name.toLowerCase().includes(kw))
  );
  if (natural) return natural;

  return voices.find((v) => keywords.some((kw) => v.name.toLowerCase().includes(kw))) || null;
}

/**
 * Finds the most suitable voice for speech synthesis.
 * Handles fallback for Gujarati (gu-IN) when the OS/Browser has no native gu voice
 * by selecting an Indian phonetic voice (hi-IN / en-IN) so audio never goes silent.
 */
function findBestVoice(language, gender) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const langCode = (language || "hi-IN").toLowerCase();
  const prefix = langCode.split("-")[0];

  // 0. Preferred gender in the exact language
  if (gender) {
    const inLang = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
    const byGender = findVoiceByGender(inLang, gender);
    if (byGender) return { voice: byGender, lang: byGender.lang };
  }

  // 1. Direct match (prefer a natural neural/online voice)
  let matched =
    voices.find(v => v.lang.toLowerCase() === langCode && hasNaturalMarker(v.name)) ||
    voices.find(v => v.lang.toLowerCase() === langCode);
  if (matched) return { voice: matched, lang: matched.lang };

  // 2. Language prefix match (e.g., 'gu', 'hi', 'en')
  matched =
    voices.find(v => v.lang.toLowerCase().startsWith(prefix) && hasNaturalMarker(v.name)) ||
    voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  if (matched) return { voice: matched, lang: matched.lang };

  // 3. If Gujarati ('gu') is requested but not installed in the browser/OS,
  // fallback to Hindi ('hi-IN') or Indian English ('en-IN') which uses Indian phonetic pronunciation
  if (prefix === "gu") {
    matched = voices.find(v => v.lang.toLowerCase() === "hi-in" && hasNaturalMarker(v.name)) ||
      voices.find(v => v.lang.toLowerCase() === "hi-in" || v.lang.toLowerCase().startsWith("hi"));
    if (matched) return { voice: matched, lang: "hi-IN" };

    matched = voices.find(v => v.lang.toLowerCase() === "en-in");
    if (matched) return { voice: matched, lang: "en-IN" };
  }

  // 4. Default / system voice
  matched = voices.find(v => v.default) || voices[0];
  return { voice: matched, lang: matched ? matched.lang : "en-US" };
}

export function unlockSpeech(gender) {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const unlock = new SpeechSynthesisUtterance(" ");
    unlock.volume = 0;
    window.speechSynthesis.speak(unlock);
  }
}

export function speak(text, language = "hi-IN", { onStart, onEnd, gender } = {}) {
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
        const resolved = findBestVoice(language, gender);

        if (resolved?.voice) {
          utterance.voice = resolved.voice;
          utterance.lang = resolved.lang || language;
        } else {
          utterance.lang = language;
        }

        utterance.rate = 0.93;
        utterance.pitch = gender === "male" ? 0.9 : 1.02;
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