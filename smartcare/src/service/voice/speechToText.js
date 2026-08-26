const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function isSpeechRecognitionSupported() {
  return !!SpeechRecognition;
}

let activeRecognition = null;

export function startSpeechRecognition({
  language = "hi-IN",
  onResult,
  onError,
  onEnd,
}) {
  if (!SpeechRecognition) {
    console.error("❌ Speech Recognition NOT supported in this browser");
    onError?.("not-supported");
    return null;
  }

  // Prevent "InvalidStateError: recognition already started"
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {
      /* ignore */
    }
    activeRecognition = null;
  }

  const recognition = new SpeechRecognition();
  let resultReceived = false;

  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎤 MICROPHONE STARTED");
  };

  recognition.onresult = (event) => {
    resultReceived = true;
    const text = event.results[0][0].transcript;
    console.log("🗣️ PATIENT SAID:", text);
    onResult?.(text);
  };

  recognition.onerror = (event) => {
    console.error("❌ SPEECH ERROR:", event.error);
    // 'no-speech' and 'aborted' aren't fatal — let onEnd handle the reset,
    // but still surface it so the UI can show a hint.
    onError?.(event.error);
  };

  recognition.onend = () => {
    console.log("🎤 MICROPHONE ENDED, resultReceived:", resultReceived);
    activeRecognition = null;
    // If recognition ended silently with no result and no error already
    // reported, make sure the caller still gets a signal to reset UI.
    onEnd?.(resultReceived);
  };

  try {
    recognition.start();
    activeRecognition = recognition;
  } catch (e) {
    console.error("❌ Failed to start recognition:", e);
    onError?.("start-failed");
  }

  return recognition;
}

export function stopSpeechRecognition() {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {
      /* ignore */
    }
    activeRecognition = null;
  }
}