import React, { useEffect, useState, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Type,
  HelpCircle,
  Globe,
  ChevronLeft,
  Check,
  Sparkles,
  ShieldAlert,
  PhoneCall,
  RotateCcw,
} from "lucide-react";

import Card from "../../components/common/Card";
import PrimaryButton from "../../components/common/PrimaryButton";
import StatusBadge from "../../components/common/StatusBadge";
import SectionLabel from "../../components/common/SectionLabel";

import MicButton from "../../components/voice/MicButton";
import VoiceWave from "../../components/voice/VoiceWave";
import { getComplaintLabel } from "../../data/symptomFollowUps";
import { getRegistrationScript } from "../../data/registrationScript_temp";

import {
  startSpeechRecognition,
  stopSpeechRecognition,
  isSpeechRecognitionSupported,
} from "../../service/voice/speechToText";
import { speak, stopSpeaking, unlockAudio } from "../../service/voice/textToSpeech";
import api from "../../service/api";

const COLORS = {
  ink: "#0F3B3A",
  inkSoft: "#1C5250",
  mint: "#3FBFA0",
  mintSoft: "#E4F5F0",
  red: "#D14343",
  redSoft: "#FBE8E8",
  bg: "#F7F7F4",
  card: "#FFFFFF",
  line: "#E6E3DC",
  text: "#1A2321",
  sub: "#5C6864",
};

const LANGUAGES = [
  { code: "hi", label: "हिन्दी", tts: "hi-IN" },
  { code: "en", label: "English", tts: "en-IN" },
  { code: "gu", label: "ગુજરાતી", tts: "gu-IN" },
];

const UI_STRINGS = {
  en: {
    understanding: "Understanding your symptoms...",
    steps: [
      "Understanding your voice response",
      "Extracting symptoms & medical entities",
      "Analyzing duration and severity",
      "Assessing clinical priority",
      "Matching appropriate hospital department",
    ],
    infoCollected: "Information collected",
    nothingYet: "Nothing yet — answer the first question to begin.",
    aiSpeaking: "AI Speaking",
    youSaid: "You said",
    tapToStart: "Tap to Start Registration",
    tapToStartSub: "This unlocks voice and audio for your browser",
    exit: "Exit",
    help: "Help",
    voiceMode: "Voice Mode",
    typePlaceholder: "Type your answer here...",
    sendAnswer: "Send answer",
    mute: "Mute",
    unmute: "Unmute",
    replay: "Replay question",
    switchType: "Type instead",
    switchVoice: "Switch to voice",
    naturalNote: "You can speak naturally. You don't need to use medical terms.",
    urgentTitle: "Urgent Human Attention Required",
    urgentDesc: "Your responses may require urgent medical attention. Please follow hospital emergency procedures or contact hospital triage staff immediately.",
    urgentDisclaimer: "AI screening is not a medical diagnosis. This flag exists only to route you to emergency staff faster.",
    alertStaff: "Alert Emergency Staff",
  },
  gu: {
    understanding: "તમારા લક્ષણોનું વિશ્લેષણ કરી રહ્યા છીએ...",
    steps: [
      "તમારા અવાજ પ્રતિસાદને સમજી રહ્યા છીએ",
      "મુખ્ય લક્ષણો અને તકલીફ શોધી રહ્યા છીએ",
      "સમયગાળો અને તીવ્રતા તપાસી રહ્યા છીએ",
      "ક્લિનિકલ પ્રાથમિકતા નક્કી કરી રહ્યા છીએ",
      "યોગ્ય હોસ્પિટલ વિભાગ પસંદ કરી રહ્યા છીએ",
    ],
    infoCollected: "એકત્રિત કરેલી માહિતી",
    nothingYet: "હજુ કોઈ માહિતી નથી — શરૂ કરવા માટે પ્રથમ પ્રશ્નનો જવાબ આપો.",
    aiSpeaking: "AI બોલી રહ્યું છે",
    youSaid: "તમે કહ્યું",
    tapToStart: "રજીસ્ટ્રેશન શરૂ કરવા સ્પર્શ કરો",
    tapToStartSub: "આ તમારા બ્રાઉઝરમાં અવાજ સક્રિય કરશે",
    exit: "બહાર નીકળો",
    help: "મદદ",
    voiceMode: "વોઈસ મોડ",
    typePlaceholder: "તમારો જવાબ અહીં લખો...",
    sendAnswer: "જવાબ મોકલો",
    mute: "અવાજ બંધ",
    unmute: "અવાજ ચાલુ",
    replay: "પ્રશ્ન ફરી સાંભળો",
    switchType: "લખીને જવાબ આપો",
    switchVoice: "વોઈસ પર સ્વિચ કરો",
    naturalNote: "તમે સહજતાથી બોલી શકો છો. તબીબી શબ્દો વાપરવાની જરૂર નથી.",
    urgentTitle: "તાત્કાલિક મેડિકલ સહાયની જરૂર છે",
    urgentDesc: "તમારી તકલીફ તાત્કાલિક સારવાર માંગી શકે છે. કૃપા કરીને તરત જ ઈમરજન્સી સ્ટાફનો સંપર્ક કરો.",
    urgentDisclaimer: "AI સ્ક્રીનીંગ એ ડૉક્ટરનું નિદાન નથી. આ તમને ઝડપથી ઈમરજન્સી ડૉક્ટર પાસે પહોંચાડવા માટે છે.",
    alertStaff: "ઈમરજન્સી સ્ટાફને સૂચિત કરો",
  },
  hi: {
    understanding: "आपके लक्षणों को समझा जा रहा है...",
    steps: [
      "आपकी आवाज़ और उत्तर को समझा जा रहा है",
      "मुख्य लक्षणों की पहचान की जा रही है",
      "समस्या की अवधि और गंभीरता जांची जा रही है",
      "प्राथमिकता का आकलन किया जा रहा है",
      "उचित हॉस्पिटल विभाग तय किया जा रहा है",
    ],
    infoCollected: "प्राप्त जानकारी",
    nothingYet: "अभी कोई जानकारी नहीं — शुरू करने के लिए पहले प्रश्न का उत्तर दें।",
    aiSpeaking: "AI बोल रहा है",
    youSaid: "आपने कहा",
    tapToStart: "रजिस्ट्रेशन शुरू करने के लिए टैप करें",
    tapToStartSub: "यह आपके ब्राउज़र में ऑडियो अनलॉक करता है",
    exit: "बाहर निकलें",
    help: "सहायता",
    voiceMode: "वॉयस मोड",
    typePlaceholder: "अपना उत्तर यहाँ लिखें...",
    sendAnswer: "उत्तर भेजें",
    mute: "म्यूट करें",
    unmute: "अनम्यूट करें",
    replay: "प्रश्न दोबारा सुनें",
    switchType: "टाइप करके बताएं",
    switchVoice: "वॉयस पर जाएं",
    naturalNote: "आप स्वाभाविक रूप से बोल सकते हैं। डॉक्टरी भाषा का उपयोग करने की आवश्यकता नहीं है।",
    urgentTitle: "तत्काल आपातकालीन सहायता आवश्यक",
    urgentDesc: "आपकी स्थिति में तुरंत मेडिकल जांच की आवश्यकता हो सकती है। कृपया सीधे इमरजेंसी काउंटर या अस्पताल स्टाफ से संपर्क करें।",
    urgentDisclaimer: "AI स्क्रीनिंग कोई अंतिम डॉक्टरी निदान नहीं है। यह आपको तुरंत डॉक्टर से मिलाने के लिए है।",
    alertStaff: "इमरजेंसी स्टाफ को सूचित करें",
  },
};

function ProcessingScreen({ lang, onDone }) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.hi;
  const steps = ui.steps;
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= steps.length) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setDone((d) => d + 1);
    }, 550);

    return () => clearTimeout(t);
  }, [done]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: COLORS.bg }}
    >
      <Card className="w-full max-w-md p-8">
        <h2
          className="text-xl font-bold text-center mb-6"
          style={{ color: COLORS.ink }}
        >
          {ui.understanding}
        </h2>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    index < done ? COLORS.mint : "#EEEDE7",
                }}
              >
                {index < done ? (
                  <Check size={14} color="#fff" />
                ) : (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: COLORS.sub }}
                  />
                )}
              </div>

              <span
                className="text-sm font-medium"
                style={{
                  color:
                    index < done ? COLORS.text : COLORS.sub,
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RegistrationProgress({ step, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className="h-1.5 rounded-full"
          style={{
            width: 22,
            background:
              index <= step ? COLORS.mint : COLORS.line,
          }}
        />
      ))}
    </div>
  );
}

function PatientSummary({ extracted, lang }) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.hi;
  const entries = Object.entries(extracted);

  return (
    <Card className="p-5 h-fit sticky top-6">
      <SectionLabel>{ui.infoCollected}</SectionLabel>

      {entries.length === 0 && (
        <p
          className="text-sm mt-2"
          style={{ color: COLORS.sub }}
        >
          {ui.nothingYet}
        </p>
      )}

      <div className="space-y-3 mt-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between border-b pb-2"
            style={{ borderColor: COLORS.line }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: COLORS.sub }}
            >
              {key}
            </span>

            <span
              className="text-sm font-bold"
              style={{ color: COLORS.text }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function VoiceRegistration({
  go,
  lang = "hi",
  setPatientData,
  gender,
}) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.hi;
  const [stepIdx, setStepIdx] = useState(0);
  const [micState, setMicState] = useState("speaking");
  const [transcript, setTranscript] = useState([]);
  const [extracted, setExtracted] = useState({});
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showProcessing, setShowProcessing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [emergencyText, setEmergencyText] = useState("");
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const [busy, setBusy] = useState(false);

  // Tracks whether speech recognition is currently active, independent of
  // the async `micState`, so automatic re-listening never double-fires.
  const recogActiveRef = useRef(false);
  const startedRef = useRef(false);

  // The local script is used only for the opening line and as a no-backend
  // fallback. The real conversation is driven by the LLM.
  const scriptSteps = getRegistrationScript(lang);
  const latestStep = scriptSteps[stepIdx] || scriptSteps[0];

  const REQUIRED_KEYS = ["Name", "Age", "Contact", "Main Symptom", "Duration"];
  const collectedCount = REQUIRED_KEYS.filter((k) => extracted[k]).length;

  // Speak the first question once audio is unlocked (or after a language change).
  useEffect(() => {
    if (!audioUnlocked) return;
    if (muted) {
      setMicState("idle");
      return;
    }
    if (!startedRef.current) {
      startedRef.current = true;
      const t = setTimeout(
        () => ask(getRegistrationScript(lang)[0].q),
        400
      );
      return () => clearTimeout(t);
    }
  }, [audioUnlocked, lang, muted]);

  // Fresh start when the language changes.
  useEffect(() => {
    if (lang) {
      startedRef.current = false;
      setExtracted({});
      setTranscript([]);
      setStepIdx(0);
    }
  }, [lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopSpeechRecognition();
    };
  }, []);

  // Speech helper that speaks arbitrary text (used for LLM replies / re-asks).
  function speakLine(text, onEnd) {
    if (!text) {
      onEnd && onEnd();
      return;
    }
    const ttsLang = lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-IN";
    setMicState("speaking");
    stopSpeaking();
    speak(text, ttsLang, {
      onEnd: () => {
        setMicState("idle");
        onEnd && onEnd();
      },
      gender,
    });
  }

  // Asks a question out loud, then automatically listens for the answer.
  function ask(text) {
    if (!text) {
      setMicState("idle");
      return;
    }
    setLastQuestion(text);
    if (muted) {
      setMicState("idle");
      return;
    }
    const ttsLang = lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-IN";
    setMicState("speaking");
    stopSpeaking();
    speak(text, ttsLang, {
      onEnd: () => {
        setMicState("idle");
        setTimeout(() => startListening({ auto: true }), 500);
      },
      gender,
    });
  }

  // Small spoken acknowledgement used only when the LLM is unavailable.
  function ackText() {
    if (lang === "gu") return "સારું";
    if (lang === "en") return "Okay.";
    return "ज़रूर।";
  }

  function submitAnswer(answer) {
    const cleanAnswer = answer.trim();

    if (!cleanAnswer || busy) {
      setMicState("idle");
      return;
    }

    setTranscript((current) => [
      ...current,
      { who: "ai", text: lastQuestion || latestStep?.q || "" },
      { who: "patient", text: cleanAnswer },
    ]);

    // Local emergency screening (multilingual) kept as a safety net.
    const emergencyHit = /chest pain|breathless|saans|faint|seene me dard|chhati|hriday|dhabkara|shwas|છાતી|શ્વાસ|હૃદય|ચક્કર|બેભાન|લોહી/i.test(
      cleanAnswer
    );

    // Next fallback question from the local script (first missing field).
    function fallbackNextQuestion() {
      for (const s of scriptSteps) {
        if (s.extractLabel && !extracted[s.extractLabel]) return s.q;
      }
      return "";
    }

    // No LLM / backend unavailable -> drive with the local script.
    function handleFallback() {
      const s = latestStep || scriptSteps[0];
      let local = {};
      if (s?.extractLabel && typeof s?.extract === "function") {
        let v = s.extract(cleanAnswer);
        if (s.key === "complaint") v = getComplaintLabel(cleanAnswer);
        local[s.extractLabel] = v;
      }
      setExtracted((current) => ({ ...current, ...local }));

      const nextIdx = stepIdx + 1;
      if (nextIdx < scriptSteps.length) {
        setStepIdx(nextIdx);
        speakLine(ackText(), () => ask(scriptSteps[nextIdx].q));
      } else {
        speakLine(ackText(), () => setShowProcessing(true));
      }
    }

    setBusy(true);
    setMicState("processing");
    api
      .chatWithGroq({
        text: cleanAnswer,
        language: lang,
        mode: "chat",
        question: lastQuestion || latestStep?.q || "",
        context: extracted,
      })
      .then((res) => {
        setBusy(false);
        if (!res) {
          handleFallback();
          return;
        }

        if (res.emergency || emergencyHit) {
          setEmergencyText(cleanAnswer);
          setEmergency(true);
          setMicState("idle");
          return;
        }

        if (res.extracted && Object.keys(res.extracted).length) {
          setExtracted((current) => ({ ...current, ...res.extracted }));
        }

        const reply = res.reply || "";

        if (res.done) {
          speakLine(reply, () => {
            setMicState("idle");
            setShowProcessing(true);
          });
          return;
        }

        const nextText = res.nextQuestion || fallbackNextQuestion() || "";
        speakLine(reply, () => ask(nextText));
      })
      .catch(() => {
        setBusy(false);
        handleFallback();
      });
  }

  // Starts speech recognition so the patient can answer. Used by both the
  // manual mic button and the automatic "assistant finished speaking" trigger.
  function startListening({ auto = false } = {}) {
    if (recogActiveRef.current || window.speechSynthesis.speaking) {
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      if (!auto) {
        alert(
          "Voice input isn't supported in this browser. Please use Chrome, or switch to 'Type instead'."
        );
      }
      return;
    }

    stopSpeaking();
    setMicState("listening");
    recogActiveRef.current = true;

    const sttLang =
      lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-IN";

    startSpeechRecognition({
      language: sttLang,
      auto,

      onResult: (text) => {
        if (!text || !text.trim()) {
          setMicState("idle");
          return;
        }

        setMicState("processing");

        setTimeout(() => {
          submitAnswer(text.trim());
        }, 300);
      },

      onError: (error) => {
        console.error("❌ SPEECH RECOGNITION ERROR:", error);
        recogActiveRef.current = false;

        if (error === "not-allowed" || error === "service-not-allowed") {
          if (!auto) {
            alert(
              "Microphone access was blocked. Please allow microphone permission for this site and try again."
            );
          }
        }
      },

      onEnd: (resultReceived) => {
        console.log("🛑 SPEECH RECOGNITION ENDED");
        recogActiveRef.current = false;
        if (!resultReceived) {
          setMicState((current) =>
            current === "listening" ? "idle" : current
          );
        }
      },
    });
  }

  async function handleTap() {
    console.log("🎤 MIC BUTTON CLICKED for lang:", lang);
    startListening({ auto: false });
  }

  function handleTextSubmit() {
    if (!textInput.trim()) return;

    submitAnswer(textInput.trim());
    setTextInput("");
  }

  if (emergency) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: COLORS.bg }}
      >
        <Card
          className="w-full max-w-lg p-8"
          style={{
            borderColor: COLORS.red,
            borderWidth: 2,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: COLORS.redSoft }}
            >
              <ShieldAlert size={22} color={COLORS.red} />
            </div>

            <h2
              className="text-xl font-extrabold"
              style={{ color: COLORS.red }}
            >
              {ui.urgentTitle}
            </h2>
          </div>

          <p
            className="text-sm mb-4"
            style={{ color: COLORS.text }}
          >
            {lang === "gu" ? "દર્દીએ જણાવ્યું:" : lang === "hi" ? "मरीज ने बताया:" : "Patient reported:"}{" "}
            <span className="italic">
              "{emergencyText}"
            </span>
          </p>

          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: COLORS.redSoft }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: COLORS.red }}
            >
              {ui.urgentDesc}
            </p>
          </div>

          <p
            className="text-xs mb-6"
            style={{ color: COLORS.sub }}
          >
            {ui.urgentDisclaimer}
          </p>

          <div className="flex gap-3">
            <PrimaryButton
              tone="red"
              icon={PhoneCall}
              full
              onClick={() => go("patient-entry")}
            >
              {ui.alertStaff}
            </PrimaryButton>
          </div>
        </Card>
      </div>
    );
  }

  if (showProcessing) {
    return (
      <ProcessingScreen
        lang={lang}
        onDone={() => {
          setPatientData({
            transcript,
            extracted,
            name: extracted["Name"] || "Patient",
            rawComplaint: transcript.filter(t => t.who === "patient").map(t => t.text).join(" · "),
            mainSymptom: extracted["Main Symptom"] || "General Checkup",
            duration: extracted["Duration"] || "1 week",
            severity: extracted["Severity"] || "Moderate",
            lang: lang,
          });

          go("recommendation");
        }}
      />
    );
  }

  if (!audioUnlocked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: COLORS.bg }}
      >
        <div className="text-center max-w-sm">
          <button
            onClick={() => {
              unlockAudio();
              setAudioUnlocked(true);
            }}
            className="w-full px-8 py-4 rounded-xl text-white font-bold text-lg cursor-pointer shadow-lg hover:opacity-95 transition-opacity"
            style={{ background: COLORS.ink }}
          >
            {ui.tapToStart}
          </button>
          <p className="text-sm mt-3 mb-6" style={{ color: COLORS.sub }}>
            {ui.tapToStartSub}
          </p>

          <button
            onClick={() => go("patient-entry")}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-slate-600"
          >
            <ChevronLeft size={16} /> {lang === "gu" ? "પાછા જાઓ" : lang === "hi" ? "पीछे जाएं" : "Back to Language Selection"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: COLORS.bg }}
    >
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => go("patient-entry")}
          className="flex items-center gap-1 text-sm font-semibold cursor-pointer"
          style={{ color: COLORS.sub }}
        >
          <ChevronLeft size={16} />
          {ui.exit}
        </button>

        <RegistrationProgress
          step={collectedCount}
          total={REQUIRED_KEYS.length}
        />

        <button
          className="text-sm font-semibold flex items-center gap-1"
          style={{ color: COLORS.sub }}
        >
          <HelpCircle size={16} />
          {ui.help}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-[1fr_320px] gap-6 pb-16">
        <Card className="p-6 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <StatusBadge tone="mint" icon={Globe}>
              {LANGUAGES.find((l) => l.code === lang)?.label || "English"}
            </StatusBadge>

            <StatusBadge tone="neutral">
              {ui.voiceMode}
            </StatusBadge>
          </div>

          <div className="flex items-start gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: COLORS.ink }}
            >
              <Sparkles
                size={18}
                color={COLORS.mint}
              />
            </div>

            <p
              className="text-2xl sm:text-3xl font-semibold leading-snug"
              style={{
                color: COLORS.ink,
                fontFamily: "Fraunces, serif",
              }}
            >
              {lastQuestion}
            </p>
          </div>

          <div
            className="flex items-center gap-2 mt-3 mb-8"
            style={{ paddingLeft: 52 }}
          >
            <Volume2 size={15} color={COLORS.sub} />

            <span
              className="text-xs font-semibold"
              style={{ color: COLORS.sub }}
            >
              {ui.aiSpeaking}
            </span>

            <VoiceWave
              active={
                micState === "speaking" && !muted
              }
            />
          </div>

          {transcript.length > 0 && (
            <div
              className="mb-8 rounded-xl p-4 max-h-40 overflow-y-auto"
              style={{ background: COLORS.bg }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-wide mb-2"
                style={{ color: COLORS.sub }}
              >
                {ui.youSaid}
              </p>

              <p
                className="text-sm"
                style={{ color: COLORS.text }}
              >
                "{transcript[transcript.length - 1].text}"
              </p>
            </div>
          )}

          {!textMode ? (
            <div className="flex flex-col items-center py-6">
              <MicButton
                state={micState}
                onTap={handleTap}
                largeText
              />

              {micState === "listening" && (
                <VoiceWave
                  active
                  color={COLORS.red}
                />
              )}
            </div>
          ) : (
            <div className="py-6">
              <textarea
                value={textInput}
                onChange={(event) =>
                  setTextInput(event.target.value)
                }
                placeholder={ui.typePlaceholder}
                className="w-full rounded-xl border p-4 text-base outline-none focus:ring-2"
                style={{
                  borderColor: COLORS.line,
                }}
                rows={3}
              />

              <div className="mt-3">
                <PrimaryButton
                  onClick={handleTextSubmit}
                >
                  {ui.sendAnswer}
                </PrimaryButton>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <button
              onClick={() =>
                setMuted((current) => !current)
              }
              className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              style={{ color: COLORS.sub }}
            >
              {muted ? (
                <VolumeX size={16} />
              ) : (
                <Volume2 size={16} />
              )}

              {muted ? ui.unmute : ui.mute}
            </button>

            <button
              className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              style={{ color: COLORS.sub }}
              onClick={() => {
                if (micState !== "idle") return;
                stopSpeaking();
                const ttsLang =
                  lang === "hi"
                    ? "hi-IN"
                    : lang === "gu"
                    ? "gu-IN"
                    : "en-IN";
                setMicState("speaking");
                speak(lastQuestion, ttsLang, {
                  onEnd: () => setMicState("idle"),
                  gender,
                });
              }}
            >
              <RotateCcw size={16} />
              {ui.replay}
            </button>

            <button
              onClick={() =>
                setTextMode((current) => !current)
              }
              className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              style={{ color: COLORS.sub }}
            >
              <Type size={16} />

              {textMode
                ? ui.switchVoice
                : ui.switchType}
            </button>
          </div>

          <p
            className="text-center text-xs mt-6"
            style={{ color: COLORS.sub }}
          >
            {ui.naturalNote}
          </p>
        </Card>

        <PatientSummary extracted={extracted} lang={lang} />
      </div>
    </div>
  );
}