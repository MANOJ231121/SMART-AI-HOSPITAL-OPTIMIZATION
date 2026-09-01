import React, { useState, useEffect, useRef } from "react";
import {
  Mic, Volume2, VolumeX, Type, HelpCircle, Globe, ChevronRight, ChevronLeft,
  Check, AlertTriangle, Activity, Users, Clock, Stethoscope, Building2,
  DoorOpen, Ticket, LayoutDashboard, Search, Filter, Settings, LogOut,
  Heart, Eye, Bone, Brain, Sparkles, ShieldAlert, CheckCircle2, XCircle,
  ArrowRight, RotateCcw, Contrast, TextCursorInput, PhoneCall, BadgeCheck,
  TrendingUp, PieChart as PieChartIcon, UserCheck, CalendarClock, MapPin
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";

/* ===================== DESIGN TOKENS =====================
   Palette: "Clinical Ink" — deep ink-teal (#0F3B3A) as the trust anchor,
   a living mint (#3FBFA0) for AI/active states, warm amber (#E8A33D) for
   priority, and clear red (#D14343) reserved ONLY for emergency states —
   so red carries real weight instead of being decorative.
   Type: 'Fraunces' (display, used sparingly for the token + hero) paired
   with 'Inter' (body/UI) and 'IBM Plex Mono' for tokens/ids/data.
============================================================= */

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap";

const COLORS = {
  ink: "#0F3B3A",
  inkSoft: "#1C5250",
  mint: "#3FBFA0",
  mintSoft: "#E4F5F0",
  amber: "#E8A33D",
  amberSoft: "#FCF0DD",
  red: "#D14343",
  redSoft: "#FBE8E8",
  bg: "#F7F7F4",
  card: "#FFFFFF",
  line: "#E6E3DC",
  text: "#1A2321",
  sub: "#5C6864",
};

/* ===================== MOCK DATA LAYER =====================
   Kept separate from UI, mirrors the future MongoDB entities.
============================================================= */

const LANGUAGES = [
  { code: "hi", label: "हिन्दी" },
  { code: "en", label: "English" },
  { code: "gu", label: "ગુજરાતી" },
];

const DEPARTMENTS = [
  { id: "derma", name: "Dermatology", icon: Sparkles, doctors: 3, patients: 18, queue: 6, status: "Active" },
  { id: "ortho", name: "Orthopedics", icon: Bone, doctors: 4, patients: 22, queue: 9, status: "Active" },
  { id: "cardio", name: "Cardiology", icon: Heart, doctors: 2, patients: 14, queue: 4, status: "Active" },
  { id: "gen", name: "General Medicine", icon: Stethoscope, doctors: 5, patients: 30, queue: 11, status: "Active" },
  { id: "neuro", name: "Neurology", icon: Brain, doctors: 2, patients: 8, queue: 2, status: "Active" },
  { id: "eye", name: "Ophthalmology", icon: Eye, doctors: 2, patients: 10, queue: 3, status: "Active" },
];

const DOCTORS = [
  { id: "d1", name: "Dr. Priya Sharma", dept: "Dermatology", cabin: "A-101", available: true, queue: 10 },
  { id: "d2", name: "Dr. Rahul Mehta", dept: "Dermatology", cabin: "A-105", available: true, queue: 3 },
  { id: "d3", name: "Dr. Ankit Shah", dept: "Dermatology", cabin: "B-201", available: false, queue: null },
  { id: "d4", name: "Dr. Meera Nair", dept: "Orthopedics", cabin: "C-201", available: true, queue: 12 },
  { id: "d5", name: "Dr. Karan Bhatt", dept: "Orthopedics", cabin: "C-204", available: true, queue: 4 },
  { id: "d6", name: "Dr. Sunita Rao", dept: "Orthopedics", cabin: "C-206", available: false, queue: null },
];

const QUEUE_TABLE = [
  { token: "D-019", patient: "Kiran Vora", age: 41, status: "Serving" },
  { token: "D-020", patient: "Neha Joshi", age: 29, status: "Completed" },
  { token: "D-021", patient: "Rahul Desai", age: 25, status: "Waiting" },
  { token: "D-022", patient: "Amit Trivedi", age: 34, status: "Waiting" },
  { token: "D-023", patient: "Amit Patel", age: 25, status: "Your Token" },
  { token: "D-024", patient: "Priyanka Iyer", age: 38, status: "Waiting" },
];

const DOCTOR_QUEUE = [
  { token: "D-021", patient: "Rahul Desai", age: 25, complaint: "Skin rash, 3 days", priority: "Normal", status: "Waiting" },
  { token: "D-022", patient: "Amit Trivedi", age: 34, complaint: "Knee pain, 1 week", priority: "Priority", status: "Waiting" },
  { token: "D-023", patient: "Amit Patel", age: 25, complaint: "Right knee pain after fall, swelling", priority: "Priority", status: "Waiting" },
  { token: "D-024", patient: "Priyanka Iyer", age: 38, complaint: "Persistent cough, 5 days", priority: "Normal", status: "Waiting" },
  { token: "D-018", patient: "Sanjay Kumar", age: 52, complaint: "Chest tightness on exertion", priority: "Emergency", status: "Waiting" },
];

const REG_TREND = [
  { day: "Mon", patients: 62 }, { day: "Tue", patients: 74 }, { day: "Wed", patients: 68 },
  { day: "Thu", patients: 81 }, { day: "Fri", patients: 90 }, { day: "Sat", patients: 55 }, { day: "Sun", patients: 40 },
];
const DEPT_WORKLOAD = DEPARTMENTS.map(d => ({ name: d.name, patients: d.patients }));
const AI_CONFIDENCE = [
  { name: "High confidence", value: 68 },
  { name: "Medium confidence", value: 22 },
  { name: "Human review", value: 10 },
];
const AI_PIE_COLORS = [COLORS.mint, COLORS.amber, COLORS.red];

/* ===================== API SERVICE LAYER (mock) =====================
   Placeholder functions structured to later call
   Next.js -> Express -> MongoDB -> AI Service.
======================================================================= */
const api = {
  registerPatient: async (payload) => ({ ok: true, id: "REG-" + Math.floor(Math.random() * 9000 + 1000), ...payload }),
  sendVoiceInput: async (audioBlob) => ({ ok: true }),
  convertSpeechToText: async (audioBlob) => ({ text: "" }),
  sendMessageToAI: async (message, context) => ({ reply: "", extracted: {} }),
  getDepartmentRecommendation: async (symptoms) => ({ department: "Orthopedics", confidence: "high" }),
  getDoctorMatches: async (deptId) => DOCTORS.filter(d => d.dept === deptId),
  getAvailableDoctors: async () => DOCTORS.filter(d => d.available),
  generateToken: async (doctorId) => ({ token: "O-005" }),
  getPatientQueue: async (token) => QUEUE_TABLE,
  getDoctorQueue: async (doctorId) => DOCTOR_QUEUE,
  getDashboardStats: async () => ({}),
  getDoctors: async () => DOCTORS,
  getDepartments: async () => DEPARTMENTS,
  getRegistrations: async () => [],
};

/* ===================== SHARED UI PRIMITIVES ===================== */

function StatusBadge({ tone = "neutral", children, icon: Icon }) {
  const map = {
    neutral: { bg: "#EEEFEC", fg: COLORS.sub },
    mint: { bg: COLORS.mintSoft, fg: COLORS.inkSoft },
    amber: { bg: COLORS.amberSoft, fg: "#8A5A0E" },
    red: { bg: COLORS.redSoft, fg: COLORS.red },
    ink: { bg: "#E6EFEE", fg: COLORS.ink },
  };
  const s = map[tone];
  return (
    <span style={{ background: s.bg, color: s.fg }} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold tracking-wide">
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{ background: COLORS.card, borderColor: COLORS.line, ...style }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, full, disabled, tone = "mint" }) {
  const bg = tone === "mint" ? COLORS.ink : tone === "red" ? COLORS.red : COLORS.ink;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: disabled ? "#B9C4C1" : bg }}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 text-white font-semibold px-5 py-3 rounded-xl transition-transform active:scale-[0.98] hover:opacity-90 disabled:cursor-not-allowed`}
    >
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon, full }) {
  return (
    <button
      onClick={onClick}
      style={{ borderColor: COLORS.line, color: COLORS.text }}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-xl border bg-white hover:bg-[#F3F2EE] transition-colors`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return <div style={{ color: COLORS.sub }} className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1">{children}</div>;
}

/* ===================== VOICE VISUALIZER ===================== */

function VoiceWave({ active, color = COLORS.mint, bars = 24 }) {
  const [heights, setHeights] = useState(Array(bars).fill(6));
  useEffect(() => {
    if (!active) { setHeights(Array(bars).fill(6)); return; }
    const t = setInterval(() => {
      setHeights(Array.from({ length: bars }, () => 6 + Math.random() * 26));
    }, 120);
    return () => clearInterval(t);
  }, [active, bars]);
  return (
    <div className="flex items-center justify-center gap-[3px] h-9">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`,
            width: 3,
            borderRadius: 2,
            background: color,
            opacity: active ? 0.9 : 0.25,
            transition: "height 120ms ease",
          }}
        />
      ))}
    </div>
  );
}

/* ===================== MIC BUTTON ===================== */

function MicButton({ state, onTap, largeText }) {
  // states: idle | listening | processing | speaking
  const ring = state === "listening" ? COLORS.red : COLORS.mint;
  const pulsing = state === "listening";
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onTap}
        disabled={state === "processing" || state === "speaking"}
        className="relative flex items-center justify-center rounded-full transition-transform active:scale-95"
        style={{ width: 128, height: 128 }}
      >
        {pulsing && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: ring, opacity: 0.25 }}
          />
        )}
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: state === "processing" ? "#E9E7DF" : ring, opacity: state === "processing" ? 1 : 0.12 }}
        />
        <span
          className="relative flex items-center justify-center rounded-full shadow-lg"
          style={{
            width: 96, height: 96,
            background: state === "processing" ? "#D9D6CB" : `linear-gradient(155deg, ${ring}, ${COLORS.ink})`,
          }}
        >
          <Mic size={38} color="#fff" strokeWidth={2} />
        </span>
      </button>
      <div className="text-center">
        <p className={`${largeText ? "text-lg" : "text-base"} font-semibold`} style={{ color: COLORS.text }}>
          {state === "idle" && "Tap to speak"}
          {state === "listening" && "Listening..."}
          {state === "processing" && "Understanding your response..."}
          {state === "speaking" && "AI is speaking..."}
        </p>
      </div>
    </div>
  );
}

/* ===================== LANDING PAGE ===================== */

function Landing({ go }) {
  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: COLORS.ink }}>
            <Activity size={18} color={COLORS.mint} />
          </div>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: COLORS.ink }}>SmartCare</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: COLORS.sub }}>
          <button onClick={() => go("doctor-login")} className="hover:text-black">Doctor</button>
          <span style={{ color: COLORS.line }}>/</span>
          <button onClick={() => go("admin-login")} className="hover:text-black">Admin</button>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <StatusBadge tone="mint" icon={Sparkles}>AI-Assisted Routing, Not Diagnosis</StatusBadge>
          <h1 className="mt-5 leading-[1.05]" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: COLORS.ink }}>
            The receptionist that listens in your language.
          </h1>
          <p className="mt-5 text-lg" style={{ color: COLORS.sub, maxWidth: 480 }}>
            SmartCare's voice assistant registers patients, understands symptoms in their own words, and routes them to the right doctor — while every medical decision stays with your clinical staff.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton onClick={() => go("patient-entry")} icon={ArrowRight}>Start Patient Registration</PrimaryButton>
            <GhostButton onClick={() => go("admin-login")} icon={LayoutDashboard}>View Admin Demo</GhostButton>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm" style={{ color: COLORS.sub }}>
            <div className="flex items-center gap-2"><Globe size={16} /> 3 languages, more coming</div>
            <div className="flex items-center gap-2"><ShieldAlert size={16} /> Emergency screening built in</div>
          </div>
        </div>

        <Card className="p-6 shadow-sm">
          <SectionLabel>Live conversation preview</SectionLabel>
          <div className="mt-3 space-y-3">
            <div className="rounded-2xl px-4 py-3 max-w-[85%]" style={{ background: COLORS.mintSoft }}>
              <p className="text-sm" style={{ color: COLORS.ink }}>"Namaste! Aapka naam kya hai?"</p>
            </div>
            <div className="rounded-2xl px-4 py-3 max-w-[85%] ml-auto" style={{ background: COLORS.bg, border: `1px solid ${COLORS.line}` }}>
              <p className="text-sm" style={{ color: COLORS.text }}>"Mera naam Amit Patel hai."</p>
            </div>
            <div className="rounded-2xl px-4 py-3 max-w-[85%]" style={{ background: COLORS.mintSoft }}>
              <p className="text-sm" style={{ color: COLORS.ink }}>"Ab bataiye, aapko kya problem ho rahi hai?"</p>
            </div>
            <div className="rounded-2xl px-4 py-3 max-w-[85%] ml-auto" style={{ background: COLORS.bg, border: `1px solid ${COLORS.line}` }}>
              <p className="text-sm" style={{ color: COLORS.text }}>"Mere ghutne mein ek hafte se bahut dard hai."</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: COLORS.line }}>
            <span className="text-xs font-semibold" style={{ color: COLORS.sub }}>Extracted symptom</span>
            <StatusBadge tone="ink">Knee pain · 1 week</StatusBadge>
          </div>
        </Card>
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-5">
        {[
          { icon: Mic, title: "Voice-first", body: "No forms. Patients speak naturally, in their own words." },
          { icon: Stethoscope, title: "Doctor matching", body: "Routes by department, availability and queue length." },
          { icon: ShieldAlert, title: "Safety-checked", body: "Flags urgent cases for immediate human attention." },
        ].map((f, i) => (
          <Card key={i} className="p-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: COLORS.mintSoft }}>
              <f.icon size={19} color={COLORS.ink} />
            </div>
            <h3 className="font-bold" style={{ color: COLORS.ink }}>{f.title}</h3>
            <p className="text-sm mt-1" style={{ color: COLORS.sub }}>{f.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

/* ===================== PATIENT ENTRY ===================== */

function PatientEntry({ go, lang, setLang, accessibility, setAccessibility }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-md p-8 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5" style={{ background: COLORS.ink }}>
          <Activity size={28} color={COLORS.mint} />
        </div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, color: COLORS.ink }} className="text-3xl">Welcome to SmartCare</h1>
        <p className="mt-2" style={{ color: COLORS.sub }}>We'll ask a few simple questions by voice to register you and find the right doctor.</p>

        <div className="mt-6">
          <SectionLabel>Choose language</SectionLabel>
          <div className="flex gap-2 justify-center">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="px-4 py-2 rounded-xl font-semibold text-sm border transition-colors"
                style={{
                  background: lang === l.code ? COLORS.ink : "#fff",
                  color: lang === l.code ? "#fff" : COLORS.text,
                  borderColor: lang === l.code ? COLORS.ink : COLORS.line,
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <SectionLabel>Accessibility</SectionLabel>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { key: "largeText", label: "Large text", icon: TextCursorInput },
              { key: "highContrast", label: "High contrast", icon: Contrast },
              { key: "voiceGuidance", label: "Voice guidance", icon: Volume2 },
            ].map(o => (
              <button
                key={o.key}
                onClick={() => setAccessibility(a => ({ ...a, [o.key]: !a[o.key] }))}
                className="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5"
                style={{
                  background: accessibility[o.key] ? COLORS.mintSoft : "#fff",
                  borderColor: accessibility[o.key] ? COLORS.mint : COLORS.line,
                  color: COLORS.text,
                }}
              >
                <o.icon size={14} /> {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <PrimaryButton full onClick={() => go("register")} icon={Mic}>Start Registration</PrimaryButton>
        </div>
        <p className="text-xs mt-4" style={{ color: COLORS.sub }}>You can speak naturally. You don't need to use medical terms.</p>
      </Card>
    </div>
  );
}

/* ===================== VOICE REGISTRATION FLOW ===================== */

const SCRIPT = [
  { key: "name", q: "Namaste! SmartCare Hospital mein aapka swagat hai. Registration ke liye sabse pehle apna naam batayein.", sample: "Mera naam Amit Patel hai.", extract: { label: "Name", value: "Amit Patel" } },
  { key: "age", q: "Dhanyavaad Amit ji. Aapki umar kya hai?", sample: "25 saal.", extract: { label: "Age", value: "25" } },
  { key: "gender", q: "Aap apna gender bata sakte hain?", sample: "Male.", extract: { label: "Gender", value: "Male" } },
  { key: "contact", q: "Aapka mobile number kya hai, taaki hum aapko token ki jaankari bhej sakein?", sample: "9876543210.", extract: { label: "Contact", value: "98765 43210" } },
  { key: "complaint", q: "Ab bataiye, aapko kya problem ho rahi hai?", sample: "Mere right knee mein ek hafte se bahut dard hai. Football khelte waqt gir gaya tha.", extract: { label: "Main Symptom", value: "Knee pain" } },
  { key: "followup1", q: "Samajh gaya. Kya aapko swelling (sujan) bhi hai?", sample: "Haan, thodi swelling hai.", extract: { label: "Swelling", value: "Yes" } },
  { key: "followup2", q: "Dard kitna severe hai — mild, moderate, ya severe?", sample: "Moderate hai.", extract: { label: "Severity", value: "Moderate" } },
];

function ProcessingScreen({ onDone }) {
  const steps = ["Understanding your response", "Extracting symptoms", "Checking additional information", "Assessing priority", "Finding appropriate department"];
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= steps.length) { const t = setTimeout(onDone, 500); return () => clearTimeout(t); }
    const t = setTimeout(() => setDone(d => d + 1), 550);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-md p-8">
        <h2 className="text-xl font-bold text-center mb-6" style={{ color: COLORS.ink }}>Understanding your symptoms...</h2>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: i < done ? COLORS.mint : "#EEEDE7" }}>
                {i < done ? <Check size={14} color="#fff" /> : <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.sub }} />}
              </div>
              <span className="text-sm font-medium" style={{ color: i < done ? COLORS.text : COLORS.sub }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function VoiceRegistration({ go, lang, setPatientData }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [micState, setMicState] = useState("speaking"); // speaking -> idle -> listening -> processing -> next
  const [transcript, setTranscript] = useState([]); // {who, text}
  const [extracted, setExtracted] = useState({});
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showProcessing, setShowProcessing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [emergencyText, setEmergencyText] = useState("");

  const step = SCRIPT[stepIdx];

  useEffect(() => {
    setMicState("speaking");
    const t = setTimeout(() => setMicState("idle"), 1200);
    return () => clearTimeout(t);
  }, [stepIdx]);

  function submitAnswer(sampleText) {
    setTranscript(t => [...t, { who: "ai", text: step.q }, { who: "patient", text: sampleText }]);
    setExtracted(e => ({ ...e, [step.extract.label]: step.extract.value }));

    // Emergency keyword check (demo-only heuristic on the main complaint step)
    if (step.key === "complaint" && /chest pain|breathless|saans|faint/i.test(sampleText)) {
      setEmergencyText(sampleText);
      setEmergency(true);
      return;
    }

    if (stepIdx < SCRIPT.length - 1) {
      setStepIdx(i => i + 1);
    } else {
      setShowProcessing(true);
    }
  }

  function handleTap() {
    if (micState !== "idle") return;
    setMicState("listening");
    setTimeout(() => {
      setMicState("processing");
      setTimeout(() => submitAnswer(step.sample), 700);
    }, 1400);
  }

  function handleTextSubmit() {
    if (!textInput.trim()) return;
    submitAnswer(textInput.trim());
    setTextInput("");
  }

  if (emergency) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.bg }}>
        <Card className="w-full max-w-lg p-8" style={{ borderColor: COLORS.red, borderWidth: 2 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: COLORS.redSoft }}>
              <ShieldAlert size={22} color={COLORS.red} />
            </div>
            <h2 className="text-xl font-extrabold" style={{ color: COLORS.red }}>Urgent Human Attention Required</h2>
          </div>
          <p className="text-sm mb-4" style={{ color: COLORS.text }}>
            Patient reported: <span className="italic">"{emergencyText}"</span>
          </p>
          <div className="rounded-xl p-4 mb-5" style={{ background: COLORS.redSoft }}>
            <p className="text-sm font-medium" style={{ color: COLORS.red }}>
              Your responses may require urgent attention. Please follow hospital emergency procedures or contact hospital staff immediately.
            </p>
          </div>
          <p className="text-xs mb-6" style={{ color: COLORS.sub }}>
            AI screening is not a medical diagnosis. This flag exists only to route you to a human faster.
          </p>
          <div className="flex gap-3">
            <PrimaryButton tone="red" icon={PhoneCall} full onClick={() => go("patient-entry")}>Alert Hospital Staff</PrimaryButton>
          </div>
        </Card>
      </div>
    );
  }

  if (showProcessing) {
    return <ProcessingScreen onDone={() => {
      setPatientData({ transcript, extracted, name: extracted["Name"] || "Amit Patel" });
      go("recommendation");
    }} />;
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => go("patient-entry")} className="flex items-center gap-1 text-sm font-semibold" style={{ color: COLORS.sub }}>
          <ChevronLeft size={16} /> Exit
        </button>
        <RegistrationProgress step={stepIdx} total={SCRIPT.length} />
        <button className="text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.sub }}><HelpCircle size={16} /> Help</button>
      </div>

      <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-[1fr_320px] gap-6 pb-16">
        <Card className="p-6 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <StatusBadge tone="mint" icon={Globe}>{LANGUAGES.find(l => l.code === lang)?.label}</StatusBadge>
            <StatusBadge tone="neutral">Voice Mode</StatusBadge>
          </div>

          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: COLORS.ink }}>
              <Sparkles size={18} color={COLORS.mint} />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold leading-snug" style={{ color: COLORS.ink, fontFamily: "Fraunces, serif" }}>
              {step.q}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3 mb-8 pl-13" style={{ paddingLeft: 52 }}>
            <Volume2 size={15} color={COLORS.sub} />
            <span className="text-xs font-semibold" style={{ color: COLORS.sub }}>AI Speaking</span>
            <VoiceWave active={micState === "speaking" && !muted} />
          </div>

          {transcript.length > 0 && (
            <div className="mb-8 rounded-xl p-4 max-h-40 overflow-y-auto" style={{ background: COLORS.bg }}>
              <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.sub }}>You said</p>
              <p className="text-sm" style={{ color: COLORS.text }}>"{transcript[transcript.length - 1].text}"</p>
            </div>
          )}

          {!textMode ? (
            <div className="flex flex-col items-center py-6">
              <MicButton state={micState} onTap={handleTap} largeText />
              {micState === "listening" && <VoiceWave active color={COLORS.red} />}
            </div>
          ) : (
            <div className="py-6">
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full rounded-xl border p-4 text-base outline-none focus:ring-2"
                style={{ borderColor: COLORS.line }}
                rows={3}
              />
              <div className="mt-3"><PrimaryButton onClick={handleTextSubmit}>Send answer</PrimaryButton></div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <button onClick={() => setMuted(m => !m)} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.sub }}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />} {muted ? "Unmute" : "Mute"}
            </button>
            <button className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.sub }} onClick={() => { setMicState("speaking"); setTimeout(() => setMicState("idle"), 1000); }}>
              <RotateCcw size={16} /> Replay question
            </button>
            <button onClick={() => setTextMode(t => !t)} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.sub }}>
              <Type size={16} /> {textMode ? "Switch to voice" : "Type instead"}
            </button>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: COLORS.sub }}>
            You can speak naturally. You don't need to use medical terms.
          </p>
        </Card>

        <PatientSummary extracted={extracted} />
      </div>
    </div>
  );
}

function RegistrationProgress({ step, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1.5 rounded-full" style={{ width: 22, background: i <= step ? COLORS.mint : COLORS.line }} />
      ))}
    </div>
  );
}

function PatientSummary({ extracted }) {
  const entries = Object.entries(extracted);
  return (
    <Card className="p-5 h-fit sticky top-6">
      <SectionLabel>Information collected</SectionLabel>
      {entries.length === 0 && <p className="text-sm mt-2" style={{ color: COLORS.sub }}>Nothing yet — answer the first question to begin.</p>}
      <div className="space-y-3 mt-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b pb-2" style={{ borderColor: COLORS.line }}>
            <span className="text-xs font-semibold" style={{ color: COLORS.sub }}>{k}</span>
            <span className="text-sm font-bold" style={{ color: COLORS.text }}>{v}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ===================== DEPARTMENT RECOMMENDATION ===================== */

function Recommendation({ go, setDept }) {
  const dept = DEPARTMENTS.find(d => d.id === "ortho");
  useEffect(() => { setDept(dept); }, []);
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-lg p-8 text-center">
        <StatusBadge tone="mint" icon={CheckCircle2}>Confidence: High</StatusBadge>
        <p className="text-xs font-bold uppercase tracking-wide mt-6" style={{ color: COLORS.sub }}>Recommended Department</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <dept.icon size={30} color={COLORS.ink} />
          <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }} className="text-3xl" >{dept.name}</h2>
        </div>
        <p className="mt-4 text-sm" style={{ color: COLORS.sub }}>
          Based on the information you provided, Orthopedics may be the appropriate department.
        </p>
        <div className="mt-6 rounded-xl p-4 text-left" style={{ background: COLORS.mintSoft }}>
          <p className="text-xs font-semibold" style={{ color: COLORS.inkSoft }}>
            This is an AI-assisted department recommendation, not a medical diagnosis. Final medical decisions remain with qualified healthcare professionals.
          </p>
        </div>
        <div className="mt-8">
          <PrimaryButton full icon={ArrowRight} onClick={() => go("doctor-match")}>Find a Doctor</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

/* ===================== DOCTOR MATCHING ===================== */

function DoctorMatch({ go, dept, setSelectedDoctor }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);
  const list = DOCTORS.filter(d => d.dept === "Orthopedics");
  const best = list.filter(d => d.available).sort((a, b) => a.queue - b.queue)[0];

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: COLORS.bg }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-1" style={{ color: COLORS.ink }}>
          {loading ? "Finding an available doctor..." : "Doctor matched"}
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: COLORS.sub }}>Checking department, specialization, availability and queue length.</p>

        {loading ? (
          <div className="flex justify-center py-16"><VoiceWave active bars={16} /></div>
        ) : (
          <>
            <Card className="p-6 mb-6" style={{ borderColor: COLORS.mint, borderWidth: 2 }}>
              <StatusBadge tone="mint" icon={BadgeCheck}>Recommended Doctor</StatusBadge>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: COLORS.ink }}>{best.name}</h3>
                  <p className="text-sm" style={{ color: COLORS.sub }}>Orthopedics · Cabin {best.cabin}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold" style={{ color: COLORS.ink, fontFamily: "IBM Plex Mono, monospace" }}>{best.queue}</p>
                  <p className="text-xs" style={{ color: COLORS.sub }}>in queue</p>
                </div>
              </div>
              <p className="text-xs mt-3 italic" style={{ color: COLORS.sub }}>Reason: Available with the shortest current queue.</p>
            </Card>

            <div className="space-y-3">
              {list.map(d => (
                <div key={d.id} className="flex items-center justify-between px-5 py-4 rounded-xl border" style={{ borderColor: d.id === best.id ? COLORS.mint : COLORS.line, background: "#fff" }}>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.text }}>{d.name}</p>
                    <p className="text-xs" style={{ color: COLORS.sub }}>Orthopedics · Cabin {d.cabin}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge tone={d.available ? "mint" : "neutral"}>{d.available ? "● Available" : "● Unavailable"}</StatusBadge>
                    <p className="text-xs mt-1" style={{ color: COLORS.sub }}>Queue: {d.queue ?? "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <PrimaryButton full icon={Ticket} onClick={() => { setSelectedDoctor(best); go("token"); }}>Confirm & Generate Token</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ===================== TOKEN + COMPLETE ===================== */

function TokenComplete({ go, patientData, doctor }) {
  const [speaking, setSpeaking] = useState(false);
  const token = "O-005";
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: COLORS.mintSoft }}>
          <Check size={26} color={COLORS.ink} />
        </div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }} className="text-2xl">Registration Complete</h2>

        <div className="mt-6 rounded-2xl p-6" style={{ background: COLORS.ink }}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: COLORS.mint }}>Token</p>
          <p style={{ fontFamily: "IBM Plex Mono, monospace", color: "#fff" }} className="text-5xl font-bold mt-1">{token}</p>
        </div>

        <div className="mt-6 text-left space-y-3">
          {[
            ["Patient Name", patientData?.name || "Amit Patel"],
            ["Department", "Orthopedics"],
            ["Doctor", doctor?.name || "Dr. Karan Bhatt"],
            ["Cabin", doctor?.cabin || "C-204"],
            ["Status", "Waiting"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b pb-2" style={{ borderColor: COLORS.line }}>
              <span className="text-sm" style={{ color: COLORS.sub }}>{k}</span>
              <span className="text-sm font-bold" style={{ color: COLORS.text }}>{v}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setSpeaking(true); setTimeout(() => setSpeaking(false), 2400); }}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border py-3 font-semibold text-sm"
          style={{ borderColor: COLORS.line, color: COLORS.text }}
        >
          <Volume2 size={16} /> Hear Registration Details
        </button>
        {speaking && (
          <div className="mt-3">
            <VoiceWave active bars={20} />
            <p className="text-xs italic mt-1" style={{ color: COLORS.sub }}>"Amit ji, aapki registration complete ho gayi hai. Aapka department Orthopedics hai..."</p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3">
          <GhostButton onClick={() => go("token-track")}>Track My Token</GhostButton>
          <PrimaryButton onClick={() => go("landing")}>Done</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

/* ===================== TOKEN TRACKING ===================== */

function TokenTracking({ go }) {
  return (
    <div className="min-h-screen px-6 py-10" style={{ background: COLORS.bg }}>
      <div className="max-w-lg mx-auto">
        <button onClick={() => go("landing")} className="flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: COLORS.sub }}><ChevronLeft size={16} /> Home</button>
        <Card className="p-6 text-center mb-5">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.sub }}>Your Token</p>
          <p style={{ fontFamily: "IBM Plex Mono, monospace", color: COLORS.ink }} className="text-4xl font-bold">D-023</p>
          <div className="flex justify-center gap-8 mt-5">
            <div><p className="text-2xl font-bold" style={{ color: COLORS.text }}>D-019</p><p className="text-xs" style={{ color: COLORS.sub }}>Currently serving</p></div>
            <div><p className="text-2xl font-bold" style={{ color: COLORS.text }}>4</p><p className="text-xs" style={{ color: COLORS.sub }}>Patients ahead</p></div>
          </div>
          <StatusBadge tone="amber" icon={Clock}>Waiting · ~28 min estimated</StatusBadge>
        </Card>

        <Card className="p-5">
          <SectionLabel>Queue</SectionLabel>
          <div className="space-y-2 mt-2">
            {QUEUE_TABLE.map(row => (
              <div key={row.token} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: row.status === "Your Token" ? COLORS.mintSoft : "transparent" }}>
                <span className="font-mono text-sm font-semibold" style={{ color: COLORS.text }}>{row.token}</span>
                <span className="text-sm" style={{ color: COLORS.sub }}>{row.patient}</span>
                <StatusBadge tone={row.status === "Serving" ? "mint" : row.status === "Completed" ? "neutral" : row.status === "Your Token" ? "ink" : "amber"}>{row.status}</StatusBadge>
              </div>
            ))}
          </div>
        </Card>
        <button className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border py-3 font-semibold text-sm" style={{ borderColor: COLORS.line, color: COLORS.text }}>
          <Volume2 size={16} /> Hear Queue Status
        </button>
      </div>
    </div>
  );
}

/* ===================== DOCTOR LOGIN / DASHBOARD ===================== */

function SimpleLogin({ go, role, next }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-sm p-8">
        <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.ink }}>{role} Login</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.sub }}>Demo access — no credentials required.</p>
        <div className="space-y-3">
          <input placeholder="Email" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: COLORS.line }} />
          <input placeholder="Password" type="password" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: COLORS.line }} />
        </div>
        <div className="mt-6"><PrimaryButton full onClick={() => go(next)}>Sign in</PrimaryButton></div>
        <button onClick={() => go("landing")} className="text-xs mt-4 font-semibold" style={{ color: COLORS.sub }}>← Back to home</button>
      </Card>
    </div>
  );
}

function Shell({ title, sidebarItems, active, onNav, onLogout, children }) {
  return (
    <div className="min-h-screen flex" style={{ background: COLORS.bg }}>
      <aside className="w-60 flex-shrink-0 border-r hidden md:flex flex-col" style={{ borderColor: COLORS.line, background: COLORS.card }}>
        <div className="px-5 py-5 flex items-center gap-2 border-b" style={{ borderColor: COLORS.line }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: COLORS.ink }}>
            <Activity size={16} color={COLORS.mint} />
          </div>
          <span className="font-extrabold" style={{ color: COLORS.ink }}>SmartCare</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left"
              style={{
                background: active === item.key ? COLORS.mintSoft : "transparent",
                color: active === item.key ? COLORS.ink : COLORS.sub,
              }}
            >
              <item.icon size={17} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-3 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg" style={{ color: COLORS.sub }}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: COLORS.line, background: COLORS.card }}>
          <h1 className="text-xl font-bold" style={{ color: COLORS.ink }}>{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function DoctorDashboard({ go, onSelectPatient }) {
  const [nav, setNav] = useState("dash");
  const items = [
    { key: "dash", label: "Dashboard", icon: LayoutDashboard },
    { key: "queue", label: "Today's Queue", icon: Users },
    { key: "profile", label: "Profile", icon: UserCheck },
  ];
  const stats = [
    { label: "Today's Patients", val: 24, icon: Users },
    { label: "Waiting", val: 9, icon: Clock },
    { label: "In Consultation", val: 1, icon: Stethoscope },
    { label: "Completed", val: 14, icon: CheckCircle2 },
  ];
  return (
    <Shell title="Doctor Dashboard — Dr. Rahul Mehta" sidebarItems={items} active={nav} onNav={setNav} onLogout={() => go("landing")}>
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: COLORS.sub }}>{s.label}</p>
              <s.icon size={16} color={COLORS.mint} />
            </div>
            <p className="text-3xl font-extrabold mt-2" style={{ color: COLORS.ink }}>{s.val}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Patient Queue</SectionLabel>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border" style={{ borderColor: COLORS.line, color: COLORS.sub }}><Search size={13} /> Search</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border" style={{ borderColor: COLORS.line, color: COLORS.sub }}><Filter size={13} /> Filter</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: COLORS.line }}>
              {["Token", "Patient", "Age", "Complaint", "Priority", "Status", ""].map(h => (
                <th key={h} className="pb-2 font-semibold" style={{ color: COLORS.sub }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCTOR_QUEUE.map(row => (
              <tr key={row.token} className="border-b last:border-0" style={{ borderColor: COLORS.line }}>
                <td className="py-3 font-mono font-semibold" style={{ color: COLORS.ink }}>{row.token}</td>
                <td className="py-3" style={{ color: COLORS.text }}>{row.patient}</td>
                <td className="py-3" style={{ color: COLORS.sub }}>{row.age}</td>
                <td className="py-3" style={{ color: COLORS.sub }}>{row.complaint}</td>
                <td className="py-3">
                  <StatusBadge tone={row.priority === "Emergency" ? "red" : row.priority === "Priority" ? "amber" : "neutral"} icon={row.priority === "Emergency" ? AlertTriangle : undefined}>
                    {row.priority}
                  </StatusBadge>
                </td>
                <td className="py-3" style={{ color: COLORS.sub }}>{row.status}</td>
                <td className="py-3 text-right">
                  <button onClick={() => { onSelectPatient(row); go("doctor-patient"); }} className="text-xs font-bold" style={{ color: COLORS.ink }}>View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}

function DoctorPatientDetail({ go, patient }) {
  const p = patient || DOCTOR_QUEUE[2];
  return (
    <div className="min-h-screen px-6 py-8" style={{ background: COLORS.bg }}>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => go("doctor-dashboard")} className="flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: COLORS.sub }}><ChevronLeft size={16} /> Back to queue</button>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold" style={{ color: COLORS.ink }}>{p.patient}</h2>
              <p className="text-sm" style={{ color: COLORS.sub }}>Age {p.age} · Token {p.token}</p>
            </div>
            <StatusBadge tone={p.priority === "Emergency" ? "red" : p.priority === "Priority" ? "amber" : "neutral"}>{p.priority}</StatusBadge>
          </div>

          <div className="rounded-xl p-4 mb-5" style={{ background: COLORS.mintSoft }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: COLORS.inkSoft }}>AI-Assisted Registration Information</p>
            <p className="text-xs" style={{ color: COLORS.inkSoft }}>Not a diagnosis — a summary of what the patient reported during voice registration.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Reported Symptoms", p.complaint],
              ["Duration", "1 week"],
              ["Severity", "Moderate"],
              ["Related Symptoms", "Swelling"],
              ["AI Recommended Department", "Orthopedics"],
              ["AI Routing Confidence", "High"],
              ["Registration Time", "09:42 AM"],
              ["Gender", "Male"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs font-semibold" style={{ color: COLORS.sub }}>{k}</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.text }}>{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <GhostButton>Mark Completed</GhostButton>
            <PrimaryButton>Start Consultation</PrimaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===================== ADMIN DASHBOARD ===================== */

function AdminDashboard({ go }) {
  const [nav, setNav] = useState("dash");
  const items = [
    { key: "dash", label: "Dashboard", icon: LayoutDashboard },
    { key: "doctors", label: "Doctors", icon: Stethoscope },
    { key: "departments", label: "Departments", icon: Building2 },
    { key: "cabins", label: "Cabins", icon: DoorOpen },
    { key: "registrations", label: "Registrations", icon: Ticket },
    { key: "queues", label: "Queues", icon: Users },
    { key: "analytics", label: "Analytics", icon: TrendingUp },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const metrics = [
    { label: "Total Patients Today", val: 152, icon: Users },
    { label: "Active Doctors", val: 18, icon: Stethoscope },
    { label: "Available Doctors", val: 11, icon: UserCheck },
    { label: "Waiting Patients", val: 35, icon: Clock },
    { label: "Priority Cases", val: 12, icon: AlertTriangle },
    { label: "Emergency Flags", val: 2, icon: ShieldAlert },
    { label: "Active Departments", val: 6, icon: Building2 },
    { label: "Active Queues", val: 6, icon: Activity },
  ];

  return (
    <Shell title={
      nav === "dash" ? "Admin Dashboard" : items.find(i => i.key === nav)?.label
    } sidebarItems={items} active={nav} onNav={setNav} onLogout={() => go("landing")}>

      {nav === "dash" && (
        <>
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            {metrics.map(m => (
              <Card key={m.label} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: COLORS.sub }}>{m.label}</p>
                  <m.icon size={15} color={m.label.includes("Emergency") ? COLORS.red : COLORS.mint} />
                </div>
                <p className="text-2xl font-extrabold mt-1.5" style={{ color: m.label.includes("Emergency") ? COLORS.red : COLORS.ink }}>{m.val}</p>
              </Card>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <Card className="p-5">
              <SectionLabel>Registrations this week</SectionLabel>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={REG_TREND}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.mint} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={COLORS.mint} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.line} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="patients" stroke={COLORS.ink} fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <SectionLabel>Department workload</SectionLabel>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DEPT_WORKLOAD} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid stroke={COLORS.line} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: COLORS.sub }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="patients" fill={COLORS.mint} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <SectionLabel>AI routing distribution</SectionLabel>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={AI_CONFIDENCE} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                    {AI_CONFIDENCE.map((e, i) => <Cell key={i} fill={AI_PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <SectionLabel>Average waiting time (min) by department</SectionLabel>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={DEPT_WORKLOAD.map(d => ({ ...d, wait: Math.round(d.patients * 0.9) }))}>
                  <CartesianGrid stroke={COLORS.line} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: COLORS.sub }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="wait" stroke={COLORS.amber} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}

      {nav === "doctors" && (
        <Card className="p-5 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <SectionLabel>Doctor Management</SectionLabel>
            <PrimaryButton>+ Add Doctor</PrimaryButton>
          </div>
          <table className="w-full text-sm min-w-[700px]">
            <thead><tr className="text-left border-b" style={{ borderColor: COLORS.line }}>
              {["Doctor", "Specialization", "Cabin", "Availability", "Queue", "Actions"].map(h => <th key={h} className="pb-2 font-semibold" style={{ color: COLORS.sub }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {DOCTORS.map(d => (
                <tr key={d.id} className="border-b last:border-0" style={{ borderColor: COLORS.line }}>
                  <td className="py-3 font-semibold" style={{ color: COLORS.text }}>{d.name}</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>{d.dept}</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>{d.cabin}</td>
                  <td className="py-3"><StatusBadge tone={d.available ? "mint" : "neutral"}>{d.available ? "Available" : "Unavailable"}</StatusBadge></td>
                  <td className="py-3" style={{ color: COLORS.sub }}>{d.queue ?? "—"}</td>
                  <td className="py-3 flex gap-3 text-xs font-bold" style={{ color: COLORS.ink }}><button>Edit</button><button>Toggle</button><button style={{ color: COLORS.red }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {nav === "departments" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map(d => (
            <Card key={d.id} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <d.icon size={18} color={COLORS.ink} />
                <h3 className="font-bold" style={{ color: COLORS.ink }}>{d.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="font-bold text-lg" style={{ color: COLORS.text }}>{d.doctors}</p><p className="text-[11px]" style={{ color: COLORS.sub }}>Doctors</p></div>
                <div><p className="font-bold text-lg" style={{ color: COLORS.text }}>{d.patients}</p><p className="text-[11px]" style={{ color: COLORS.sub }}>Patients</p></div>
                <div><p className="font-bold text-lg" style={{ color: COLORS.text }}>{d.queue}</p><p className="text-[11px]" style={{ color: COLORS.sub }}>Queue</p></div>
              </div>
              <div className="mt-3"><StatusBadge tone="mint">{d.status}</StatusBadge></div>
            </Card>
          ))}
        </div>
      )}

      {nav === "cabins" && (
        <Card className="p-5 overflow-x-auto">
          <SectionLabel>Cabin Management</SectionLabel>
          <table className="w-full text-sm mt-3 min-w-[600px]">
            <thead><tr className="text-left border-b" style={{ borderColor: COLORS.line }}>{["Cabin", "Doctor", "Department", "Status", "Location"].map(h => <th key={h} className="pb-2 font-semibold" style={{ color: COLORS.sub }}>{h}</th>)}</tr></thead>
            <tbody>
              {DOCTORS.map(d => (
                <tr key={d.id} className="border-b last:border-0" style={{ borderColor: COLORS.line }}>
                  <td className="py-3 font-mono font-semibold" style={{ color: COLORS.ink }}>{d.cabin}</td>
                  <td className="py-3" style={{ color: COLORS.text }}>{d.name}</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>{d.dept}</td>
                  <td className="py-3"><StatusBadge tone={d.available ? "mint" : "neutral"}>{d.available ? "Available" : "Occupied"}</StatusBadge></td>
                  <td className="py-3 flex items-center gap-1 text-xs" style={{ color: COLORS.sub }}><MapPin size={12} /> Block {d.cabin[0]}, Floor {d.cabin[0] === "A" ? 1 : d.cabin[0] === "B" ? 2 : 3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {nav === "registrations" && (
        <Card className="p-5 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <SectionLabel>Registration Management</SectionLabel>
            <div className="flex gap-2 text-xs font-semibold" style={{ color: COLORS.sub }}>
              <span className="px-3 py-1.5 rounded-lg border" style={{ borderColor: COLORS.line }}>Department</span>
              <span className="px-3 py-1.5 rounded-lg border" style={{ borderColor: COLORS.line }}>Status</span>
              <span className="px-3 py-1.5 rounded-lg border" style={{ borderColor: COLORS.line }}>Priority</span>
            </div>
          </div>
          <table className="w-full text-sm min-w-[800px]">
            <thead><tr className="text-left border-b" style={{ borderColor: COLORS.line }}>{["Reg ID", "Patient", "Department", "Doctor", "Token", "Priority", "AI Confidence", "Status"].map(h => <th key={h} className="pb-2 font-semibold" style={{ color: COLORS.sub }}>{h}</th>)}</tr></thead>
            <tbody>
              {DOCTOR_QUEUE.map((r, i) => (
                <tr key={r.token} className="border-b last:border-0" style={{ borderColor: COLORS.line }}>
                  <td className="py-3 font-mono text-xs" style={{ color: COLORS.sub }}>REG-{1000 + i}</td>
                  <td className="py-3 font-semibold" style={{ color: COLORS.text }}>{r.patient}</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>Orthopedics</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>Dr. Karan Bhatt</td>
                  <td className="py-3 font-mono font-semibold" style={{ color: COLORS.ink }}>{r.token}</td>
                  <td className="py-3"><StatusBadge tone={r.priority === "Emergency" ? "red" : r.priority === "Priority" ? "amber" : "neutral"}>{r.priority}</StatusBadge></td>
                  <td className="py-3" style={{ color: COLORS.sub }}>High</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {nav === "queues" && (
        <Card className="p-5 overflow-x-auto">
          <SectionLabel>Live Queue Management</SectionLabel>
          <table className="w-full text-sm mt-3 min-w-[700px]">
            <thead><tr className="text-left border-b" style={{ borderColor: COLORS.line }}>{["Department", "Doctor", "Cabin", "Current Token", "Waiting", "Status"].map(h => <th key={h} className="pb-2 font-semibold" style={{ color: COLORS.sub }}>{h}</th>)}</tr></thead>
            <tbody>
              {DOCTORS.filter(d => d.available).map(d => (
                <tr key={d.id} className="border-b last:border-0" style={{ borderColor: COLORS.line }}>
                  <td className="py-3" style={{ color: COLORS.text }}>{d.dept}</td>
                  <td className="py-3 font-semibold" style={{ color: COLORS.text }}>{d.name}</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>{d.cabin}</td>
                  <td className="py-3 font-mono" style={{ color: COLORS.ink }}>D-0{18 + Math.floor(Math.random() * 3)}</td>
                  <td className="py-3" style={{ color: COLORS.sub }}>{d.queue}</td>
                  <td className="py-3"><StatusBadge tone="mint">Running</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {nav === "analytics" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <SectionLabel>Hospital Performance</SectionLabel>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {[["Avg. registration time", "3m 40s"], ["Avg. waiting time", "24 min"], ["Patients processed", "152"], ["Queue efficiency", "91%"]].map(([k, v]) => (
                <div key={k}><p className="text-xs" style={{ color: COLORS.sub }}>{k}</p><p className="text-xl font-extrabold" style={{ color: COLORS.ink }}>{v}</p></div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <SectionLabel>AI Performance</SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={AI_CONFIDENCE} dataKey="value" nameKey="name" outerRadius={75}>
                  {AI_CONFIDENCE.map((e, i) => <Cell key={i} fill={AI_PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5 lg:col-span-2">
            <SectionLabel>Peak registration times</SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{ h: "8am", v: 12 }, { h: "10am", v: 28 }, { h: "12pm", v: 34 }, { h: "2pm", v: 22 }, { h: "4pm", v: 30 }, { h: "6pm", v: 18 }]}>
                <CartesianGrid stroke={COLORS.line} vertical={false} />
                <XAxis dataKey="h" tick={{ fontSize: 11, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.ink} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {nav === "settings" && (
        <Card className="p-6 max-w-md">
          <SectionLabel>Settings</SectionLabel>
          <p className="text-sm mt-2" style={{ color: COLORS.sub }}>Hospital configuration, language packs, and staff accounts would live here in the full build.</p>
        </Card>
      )}
    </Shell>
  );
}

/* ===================== APP ROOT ===================== */

export default function App() {
  const [route, setRoute] = useState("landing");
  const [lang, setLang] = useState("hi");
  const [accessibility, setAccessibility] = useState({ largeText: false, highContrast: false, voiceGuidance: false });
  const [patientData, setPatientData] = useState(null);
  const [dept, setDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const go = (r) => { setRoute(r); window.scrollTo(0, 0); };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.text }}>
      <link rel="stylesheet" href={FONTS_LINK} />
      {route === "landing" && <Landing go={go} />}
      {route === "patient-entry" && <PatientEntry go={go} lang={lang} setLang={setLang} accessibility={accessibility} setAccessibility={setAccessibility} />}
      {route === "register" && <VoiceRegistration go={go} lang={lang} setPatientData={setPatientData} />}
      {route === "recommendation" && <Recommendation go={go} setDept={setDept} />}
      {route === "doctor-match" && <DoctorMatch go={go} dept={dept} setSelectedDoctor={setSelectedDoctor} />}
      {route === "token" && <TokenComplete go={go} patientData={patientData} doctor={selectedDoctor} />}
      {route === "token-track" && <TokenTracking go={go} />}
      {route === "doctor-login" && <SimpleLogin go={go} role="Doctor" next="doctor-dashboard" />}
      {route === "doctor-dashboard" && <DoctorDashboard go={go} onSelectPatient={setSelectedPatient} />}
      {route === "doctor-patient" && <DoctorPatientDetail go={go} patient={selectedPatient} />}
      {route === "admin-login" && <SimpleLogin go={go} role="Admin" next="admin-dashboard" />}
      {route === "admin-dashboard" && <AdminDashboard go={go} />}
    </div>
  );
}
