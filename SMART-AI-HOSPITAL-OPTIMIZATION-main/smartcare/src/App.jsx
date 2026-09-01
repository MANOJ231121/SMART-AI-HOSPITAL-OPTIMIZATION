import StatusBadge from "./components/common/StatusBadge";
import Card from "./components/common/Card";
import PrimaryButton from "./components/common/PrimaryButton";
import GhostButton from "./components/common/GhostButton";
import SectionLabel from "./components/common/SectionLabel";

import VoiceWave from "./components/voice/VoiceWave.jsx";
import MicButton from "./components/voice/MicButton";

import Recommendation from "./pages/patient/Recommendation";
import VoiceRegistration from "./pages/patient/VoiceRegistration";
import TokenTracking from "./pages/patient/TokenTracking";
import api from "./service/api";
import { speak, stopSpeaking } from "./service/voice/textToSpeech";
import { useLanguage, langToSpeech } from "./context/LanguageContext";

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

// URL of Manoj's frontend (the Spring Boot admin app). Change this later
// to his deployed URL once the project goes live.
const ADMIN_DEMO_URL = import.meta.env.VITE_ADMIN_DEMO_URL || "http://localhost:5174";

// Persists a finished patient registration locally so that if the patient
// accidentally refreshes the page, their token + details can be restored.
const REG_STORAGE_KEY = "smartcare_registration";

function readStoredRegistration() {
  try {
    const raw = localStorage.getItem(REG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.token ? parsed : null;
  } catch {
    return null;
  }
}

function clearStoredRegistration() {
  try {
    localStorage.removeItem(REG_STORAGE_KEY);
  } catch {}
}

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

import SmartCareLogo from "./components/common/SmartCareLogo";

const DOCTORS = [
  // Orthopedics
  { id: "d_ortho_1", name: "Dr. Karan Bhatt", dept: "Orthopedics", specialization: "Senior Joint Replacement & Knee Surgeon", cabin: "C-204", available: true, queue: 3, rating: 4.9, experience: "15 yrs", waitMin: 12, subSpecialty: ["knee", "joint", "ghutna", "sandha", "replacement", "arthroscopy"] },
  { id: "d_ortho_2", name: "Dr. Meera Nair", dept: "Orthopedics", specialization: "Spine & Musculoskeletal Consultant", cabin: "C-201", available: true, queue: 7, rating: 4.8, experience: "11 yrs", waitMin: 28, subSpecialty: ["spine", "back", "kamar", "neck", "musculoskeletal"] },
  { id: "d_ortho_3", name: "Dr. Sunita Rao", dept: "Orthopedics", specialization: "Sports Injuries & Trauma Specialist", cabin: "C-206", available: true, queue: 1, rating: 4.7, experience: "8 yrs", waitMin: 6, subSpecialty: ["sports", "ankle", "sprain", "moch", "shoulder", "ligament"] },
  { id: "d_ortho_4", name: "Dr. Rajesh Shah", dept: "Orthopedics", specialization: "Complex Fracture & Bone Specialist", cabin: "C-208", available: false, queue: 0, rating: 4.9, experience: "18 yrs", waitMin: 0, subSpecialty: ["fracture", "bone", "hadka", "trauma"] },

  // Dermatology
  { id: "d_derma_1", name: "Dr. Priya Sharma", dept: "Dermatology", specialization: "Clinical Dermatologist & Allergist", cabin: "A-101", available: true, queue: 3, rating: 4.9, experience: "12 yrs", waitMin: 15, subSpecialty: ["allergy", "rash", "itching", "khujli", "eczema", "chamdi"] },
  { id: "d_derma_2", name: "Dr. Rahul Mehta", dept: "Dermatology", specialization: "Acne, Psoriasis & Laser Care", cabin: "A-105", available: true, queue: 5, rating: 4.8, experience: "9 yrs", waitMin: 22, subSpecialty: ["acne", "pimple", "psoriasis", "laser", "kheel"] },
  { id: "d_derma_3", name: "Dr. Ankit Shah", dept: "Dermatology", specialization: "Pediatric & General Skin Care", cabin: "B-201", available: true, queue: 1, rating: 4.7, experience: "14 yrs", waitMin: 5, subSpecialty: ["skin", "fungal", "daan", "infection"] },

  // Cardiology
  { id: "d_cardio_1", name: "Dr. Sarah Jenkins", dept: "Cardiology", specialization: "Interventional Cardiologist", cabin: "OPD-302", available: true, queue: 4, rating: 4.9, experience: "16 yrs", waitMin: 20, subSpecialty: ["angioplasty", "heart attack", "chest pain", "artery", "seene"] },
  { id: "d_cardio_2", name: "Dr. Vikram Singhal", dept: "Cardiology", specialization: "Cardiac Rhythm & Hypertension", cabin: "OPD-305", available: true, queue: 2, rating: 4.8, experience: "13 yrs", waitMin: 10, subSpecialty: ["bp", "blood pressure", "hypertension", "palpitation", "dhabkara"] },
  { id: "d_cardio_3", name: "Dr. Alok Verma", dept: "Cardiology", specialization: "Preventive Heart & Lipid Care", cabin: "OPD-308", available: true, queue: 6, rating: 4.7, experience: "10 yrs", waitMin: 30, subSpecialty: ["cholesterol", "preventive", "ecg", "echo"] },

  // General Medicine
  { id: "d_gen_1", name: "Dr. Amit Verma", dept: "General Medicine", specialization: "Senior Consultant Physician", cabin: "G-102", available: true, queue: 4, rating: 4.9, experience: "20 yrs", waitMin: 16, subSpecialty: ["general", "fever", "bukhar", "viral", "infection", "tav"] },
  { id: "d_gen_2", name: "Dr. Ritu Malhotra", dept: "General Medicine", specialization: "Internal Medicine & Diabetologist", cabin: "G-104", available: true, queue: 2, rating: 4.8, experience: "12 yrs", waitMin: 8, subSpecialty: ["diabetes", "sugar", "thyroid", "fatigue", "weakness"] },
  { id: "d_gen_3", name: "Dr. Pradeep Joshi", dept: "General Medicine", specialization: "Respiratory & Gastro Infections", cabin: "G-106", available: true, queue: 5, rating: 4.7, experience: "9 yrs", waitMin: 20, subSpecialty: ["cough", "khasi", "cold", "stomach", "vomit", "ulti", "pet"] },

  // Neurology
  { id: "d_neuro_1", name: "Dr. Neha Gupta", dept: "Neurology", specialization: "Neuro-Physician & Stroke Specialist", cabin: "N-205", available: true, queue: 2, rating: 4.9, experience: "15 yrs", waitMin: 12, subSpecialty: ["stroke", "seizure", "numbness", "brain", "aanchki"] },
  { id: "d_neuro_2", name: "Dr. Tarun Saxena", dept: "Neurology", specialization: "Headache, Migraine & Vertigo", cabin: "N-208", available: true, queue: 4, rating: 4.8, experience: "11 yrs", waitMin: 22, subSpecialty: ["headache", "migraine", "sar dard", "chakkar", "dizziness", "mathu"] },

  // Ophthalmology
  { id: "d_eye_1", name: "Dr. Rajesh Iyer", dept: "Ophthalmology", specialization: "Cataract & Vision Care Consultant", cabin: "E-103", available: true, queue: 2, rating: 4.8, experience: "14 yrs", waitMin: 10, subSpecialty: ["cataract", "motiyo", "vision", "glasses", "aankh"] },
  { id: "d_eye_2", name: "Dr. Sneha Reddy", dept: "Ophthalmology", specialization: "Cornea, Retina & Eye Irritation", cabin: "E-105", available: true, queue: 3, rating: 4.9, experience: "10 yrs", waitMin: 15, subSpecialty: ["retina", "cornea", "redness", "lalash", "infection"] },

  // Pediatrics
  { id: "d_ped_1", name: "Dr. Anita Desai", dept: "Pediatrics", specialization: "Senior Pediatrician & Neonatologist", cabin: "P-104", available: true, queue: 3, rating: 4.9, experience: "16 yrs", waitMin: 15, subSpecialty: ["child", "baby", "baccha", "infant", "newborn", "balak"] },
  { id: "d_ped_2", name: "Dr. Manish Tiwari", dept: "Pediatrics", specialization: "Child Growth & Pediatric Infections", cabin: "P-108", available: true, queue: 1, rating: 4.8, experience: "8 yrs", waitMin: 5, subSpecialty: ["growth", "vaccination", "pediatric fever", "cough child"] },

  // Emergency
  { id: "d_emerg_1", name: "Dr. Siddharth Kapoor", dept: "Emergency", specialization: "Chief Emergency Trauma Consultant", cabin: "ER-01", available: true, queue: 1, rating: 5.0, experience: "18 yrs", waitMin: 3, subSpecialty: ["emergency", "trauma", "critical", "acute"] },
  { id: "d_emerg_2", name: "Dr. Pooja Bannerjee", dept: "Emergency", specialization: "Acute Resuscitation Specialist", cabin: "ER-02", available: true, queue: 2, rating: 4.9, experience: "12 yrs", waitMin: 6, subSpecialty: ["critical", "emergency", "acute care"] }
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


/* ===================== LANGUAGE TOGGLE =====================
   Floating control to switch the whole site between English / Hindi.
============================================================= */

function LanguageToggle({ pill = false }) {
  const { lang, toggleLang, t } = useLanguage();
  if (pill) {
    return (
      <button
        onClick={toggleLang}
        className="inline-flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-full cursor-pointer"
        style={{ background: COLORS.mint, color: "#fff", boxShadow: "0 6px 18px -8px rgba(15,59,58,0.5)" }}
        title={t("language")}
      >
        <Globe size={16} />
        {lang === "hi" ? "English" : "हिन्दी"}
      </button>
    );
  }
  return (
    <div className="inline-flex items-center rounded-full p-1" style={{ background: COLORS.mintSoft, border: `1px solid ${COLORS.line}` }}>
      <button
        onClick={() => lang !== "en" && toggleLang()}
        className="text-sm font-bold px-4 py-1.5 rounded-full cursor-pointer transition-colors"
        style={lang === "en" ? { background: COLORS.ink, color: "#fff" } : { color: COLORS.sub }}
      >
        EN
      </button>
      <button
        onClick={() => lang !== "hi" && toggleLang()}
        className="text-sm font-bold px-4 py-1.5 rounded-full cursor-pointer transition-colors"
        style={lang === "hi" ? { background: COLORS.ink, color: "#fff" } : { color: COLORS.sub }}
      >
        हिं
      </button>
    </div>
  );
}

/* ===================== VOICE GENDER SELECTOR =====================
   Lets the user pick whether the assistant speaks with a male or female
   voice, then greets them aloud.
============================================================= */

function IntroVoiceAssistant({ lines, gender, setGender, lang }) {
  const { t } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const spokeRef = useRef(false);

  const speakLines = () => {
    stopSpeaking();
    speak(lines, langToSpeech(lang), {
      gender,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!spokeRef.current) {
        spokeRef.current = true;
        speakLines();
      }
    }, 900);
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, lang]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setGender("male")}
          className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full cursor-pointer transition-all"
          style={gender === "male"
            ? { background: COLORS.ink, color: "#fff", boxShadow: "0 6px 16px -8px rgba(15,59,58,0.5)" }
            : { background: "#fff", color: COLORS.sub, border: `1px solid ${COLORS.line}` }}
        >
          {t("male")}
        </button>
        <button
          onClick={() => setGender("female")}
          className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full cursor-pointer transition-all"
          style={gender === "female"
            ? { background: COLORS.ink, color: "#fff", boxShadow: "0 6px 16px -8px rgba(15,59,58,0.5)" }
            : { background: "#fff", color: COLORS.sub, border: `1px solid ${COLORS.line}` }}
        >
          {t("female")}
        </button>
      </div>
      <button
        onClick={() => (speaking ? stopSpeaking() : speakLines())}
        className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer group"
        style={{ color: COLORS.sub }}
      >
        <VoiceWave active={speaking} size={44} />
        <span>{speaking ? t("exit") : t("speakNaturally")}</span>
      </button>
    </div>
  );
}

/* ===================== WELCOME INTRO =====================
   Shown first when the website opens. Greets the visitor in
   Hindi, plays an entrance animation, and a voice assistant
   speaks the welcome lines.
============================================================= */

function Intro({ go, gender, setGender }) {
  const { t, lang } = useLanguage();
  const [leaving, setLeaving] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleContinue = () => {
    setLeaving(true);
    stopSpeaking();
    setTimeout(() => go("home"), 450);
  };

  const greeting = `${t("introTitle1")} ${t("introTitle2")}. ${t("introSubtitle")}`;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#ffffff" }}
    >
      <div
        className="w-full max-w-lg text-center transition-all duration-700 ease-out"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div
          className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-6 transition-transform duration-500"
          style={{ background: COLORS.mint, transform: entered ? "scale(1)" : "scale(0.6)" }}
        >
          <SmartCareLogo size={60} />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: COLORS.mint }}>
          {t("brandTagline")}
        </p>

        <h1 className="leading-tight" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, color: COLORS.ink, fontSize: "clamp(2rem, 6vw, 3.2rem)" }}>
          {t("introTitle1")}{" "}
          <span style={{ color: COLORS.mint }}>{t("introTitle2")}</span> 🙏
        </h1>

        <p className="mt-5 text-lg" style={{ color: COLORS.sub, maxWidth: 420, margin: "1.25rem auto 0" }}>
          {t("introSubtitle")}
        </p>

        <div className="mt-8 flex flex-col items-center gap-6">
          <IntroVoiceAssistant
            key={`${gender}-${lang}`}
            lines={greeting}
            gender={gender}
            setGender={setGender}
            lang={lang}
          />
        </div>

        <div className="mt-8">
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl transition-transform active:scale-[0.97] hover:opacity-90 shadow-lg cursor-pointer"
            style={{ background: COLORS.mint }}
          >
            {t("introContinue")} <ArrowRight size={20} />
          </button>
        </div>

        <p className="mt-6 text-sm" style={{ color: COLORS.sub }}>
          {t("introSpeakPrompt")}
        </p>

        {/* Language toggle */}
        <div className="mt-6 flex justify-center">
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}

/* ===================== ROLE SELECT =====================
   Guides the visitor: clearly shows which button is for a
   Patient, and separate doors for Doctor and Admin.
============================================================= */

function RoleSelect({ go }) {
  const { t } = useLanguage();
  const openStaffPortal = () => {
    window.open(`${ADMIN_DEMO_URL}/login`, "_blank");
  };

  const roles = [
    {
      key: "patient",
      title: t("rolePatientTitle"),
      subtitle: t("rolePatientSubtitle"),
      desc: t("rolePatientDesc"),
      icon: Activity,
      action: () => go("patient-entry"),
      cta: t("rolePatientCta"),
      highlight: true,
    },
    {
      key: "doctor",
      title: t("roleDoctorTitle"),
      subtitle: t("roleDoctorSubtitle"),
      desc: t("roleDoctorDesc"),
      icon: Stethoscope,
      action: openStaffPortal,
      cta: t("roleDoctorCta"),
      highlight: false,
    },
    {
      key: "admin",
      title: t("roleAdminTitle"),
      subtitle: t("roleAdminSubtitle"),
      desc: t("roleAdminDesc"),
      icon: LayoutDashboard,
      action: openStaffPortal,
      cta: t("roleAdminCta"),
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: COLORS.bg }}>
      <div className="w-full max-w-4xl">
        {/* Back + language */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => go("intro")}
            className="inline-flex items-center gap-1 text-sm font-semibold cursor-pointer hover:opacity-80"
            style={{ color: COLORS.ink }}
          >
            <ChevronLeft size={18} /> {t("back")}
          </button>
          <LanguageToggle />
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SmartCareLogo size={56} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: COLORS.sub }}>
            {t("whoAreYou")}
          </p>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, color: COLORS.ink }} className="text-4xl">
            {t("roleHeading")}
          </h1>
          <p className="mt-3 text-sm" style={{ color: COLORS.sub }}>
            {t("roleHint")}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={r.action}
                className="rounded-3xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                style={{
                  background: r.highlight ? COLORS.ink : "#fff",
                  border: r.highlight ? `2px solid ${COLORS.ink}` : `1px solid ${COLORS.line}`,
                  boxShadow: r.highlight ? `0 12px 30px -12px ${COLORS.ink}` : "0 4px 16px -10px rgba(15,59,58,0.15)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: r.highlight ? COLORS.mint : COLORS.mintSoft }}
                >
                  <Icon size={26} color={COLORS.ink} />
                </div>
                <h3 className="text-xl font-extrabold mb-1" style={{ color: r.highlight ? "#fff" : COLORS.ink }}>
                  {r.title}
                </h3>
                <p className="text-xs font-semibold mb-3" style={{ color: r.highlight ? "#B9D9D2" : COLORS.sub }}>
                  {r.subtitle}
                </p>
                <p className="text-sm mb-5" style={{ color: r.highlight ? "#DCECEA" : COLORS.sub }}>
                  {r.desc}
                </p>
                <span
                  className="inline-flex items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl"
                  style={{
                    background: r.highlight ? "#fff" : COLORS.ink,
                    color: r.highlight ? COLORS.ink : "#fff",
                  }}
                >
                  {r.cta} <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button onClick={() => go("landing")} className="text-sm font-semibold cursor-pointer" style={{ color: COLORS.sub }}>
            {t("roleMoreInfo")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== LANDING PAGE ===================== */

function Landing({ go }) {
  const openAdminPortal = (path = "") => {
    window.location.href = `http://localhost:5174${path}`;
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <SmartCareLogo size={38} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: COLORS.ink }}>SmartCare</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: COLORS.sub }}>
          <button onClick={() => openAdminPortal("/login")} className="hover:text-black cursor-pointer">Doctor</button>
          <span style={{ color: COLORS.line }}>/</span>
          <button onClick={() => openAdminPortal("/login")} className="hover:text-black cursor-pointer">Admin</button>
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
            <GhostButton onClick={() => openAdminPortal("")} icon={LayoutDashboard}>View Admin Demo</GhostButton>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm flex-wrap" style={{ color: COLORS.sub }}>
            <div className="flex items-center gap-2"><Globe size={16} color="var(--accent-mint)" /> Multilingual Voice Kiosk</div>
            <div className="flex items-center gap-2"><ShieldAlert size={16} color={COLORS.red} /> Emergency screening built in</div>
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
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-md p-8 text-center shadow-md relative">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between mb-5 border-b pb-3 border-slate-100">
          <button
            onClick={() => go("home")}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-slate-600 shadow-2xs"
            title={t("backToHome")}
          >
            <ChevronLeft size={16} /> {t("backToHome")}
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            Step 1 of 4
          </span>
        </div>

        <div className="flex justify-center mb-4">
          <SmartCareLogo size={64} />
        </div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, color: COLORS.ink }} className="text-3xl">{t("welcomeToSmartcare")}</h1>
        <p className="mt-2 text-sm" style={{ color: COLORS.sub }}>{t("patientIntroDesc")}</p>

        <div className="mt-6">
          <SectionLabel>{t("chooseLanguage")}</SectionLabel>
          <div className="flex gap-2 justify-center">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer shadow-sm"
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
          
          <div className="mt-3 text-xs px-3 py-1.5 rounded-lg inline-block" style={{ background: "rgba(2, 132, 199, 0.08)", color: "#0284c7", fontWeight: 600 }}>
            🌐 More Indian & Regional languages coming soon (मराठी, தமிழ், తెలుగు, বাংলা...)
          </div>
        </div>

        <div className="mt-6">
          <SectionLabel>{t("accessibility")}</SectionLabel>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { key: "largeText", label: t("largeText"), icon: TextCursorInput },
              { key: "highContrast", label: t("highContrast"), icon: Contrast },
              { key: "voiceGuidance", label: t("voiceGuidance"), icon: Volume2 },
            ].map(o => (
              <button
                key={o.key}
                onClick={() => setAccessibility(a => ({ ...a, [o.key]: !a[o.key] }))}
                className="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer"
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

        <div className="mt-8 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => go("register")} icon={Mic}>{t("startRegistration")}</PrimaryButton>
          <GhostButton full onClick={() => go("landing")} icon={ChevronLeft}>{t("backToHome")}</GhostButton>
        </div>
        <p className="text-xs mt-4" style={{ color: COLORS.sub }}>{t("speakNaturally")}</p>
      </Card>
    </div>
  );
}

/* ===================== DOCTOR MATCHING ===================== */

function computeSmartDoctorMatch(doctors, patientData, deptName) {
  if (!doctors || doctors.length === 0) return [];
  const rawText = `${patientData?.rawComplaint || ''} ${patientData?.mainSymptom || ''} ${patientData?.extracted?.["Main Symptom"] || ''}`.toLowerCase();
  const severity = patientData?.severity || patientData?.extracted?.["Severity"] || "Moderate";

  const scoredDocs = doctors.map(doc => {
    let score = 50;
    let reason = "Available in department with active queue";

    if (!doc.available) {
      return { ...doc, matchScore: -999, matchReason: "Currently Off Duty / In Surgery" };
    }

    const queueCount = doc.queue ?? 0;
    score += Math.max(0, 35 - queueCount * 4);

    if (doc.subSpecialty && doc.subSpecialty.some(kw => rawText.includes(kw))) {
      score += 30;
      reason = `🎯 Specialist match: ${doc.specialization} for your condition`;
    } else if (queueCount <= 2) {
      reason = `⚡ Fastest turnaround: Only ${queueCount} in queue (~${doc.waitMin || queueCount * 5} min wait)`;
    } else {
      reason = `⭐ Top-rated consultant (${doc.rating || '4.8'} ★) with ${doc.experience || '10+ yrs'} experience`;
    }

    if (severity === "Severe" || severity === "Priority") {
      const yrs = parseInt(doc.experience) || 10;
      if (yrs >= 12) {
        score += 20;
        reason = `🩺 Senior specialist recommended for priority medical evaluation`;
      }
    }

    if (doc.rating) {
      score += (doc.rating - 4.0) * 10;
    }

    return {
      ...doc,
      matchScore: score,
      matchReason: reason,
    };
  });

  return scoredDocs.sort((a, b) => b.matchScore - a.matchScore);
}

function DoctorMatch({ go, dept, patientData, setPatientData, setSelectedDoctor }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [bestDoctor, setBestDoctor] = useState(null);

  const deptName = dept?.name || "General Medicine";

  useEffect(() => {
    let cancelled = false;

    async function loadDoctors() {
      try {
        const res = await api.getDoctorsByDepartment(deptName);
        let docs = [];

        if (res && res.data && res.data.length > 0) {
          docs = res.data.map(d => ({
            id: d.id,
            name: d.name,
            dept: d.department || deptName,
            specialization: d.specialization || `${deptName} Specialist`,
            cabin: d.cabin || d.roomNumber || "Cabin 101",
            available: d.available !== false,
            queue: d.currentQueueLength || 0,
            rating: 4.8 + (Math.abs(d.name.length % 3)) * 0.1,
            experience: `${8 + (Math.abs(d.name.length % 10))} yrs`,
            waitMin: (d.currentQueueLength || 1) * 6,
          }));
        }

        if (docs.length === 0) {
          docs = DOCTORS.filter(d => d.dept.toLowerCase() === deptName.toLowerCase());
          if (docs.length === 0) {
            docs = DOCTORS.filter(d => d.dept === "Orthopedics" || d.dept === "General Medicine");
          }
        }

        if (!cancelled) {
          const ranked = computeSmartDoctorMatch(docs, patientData, deptName);
          setDoctorsList(ranked);
          const top = ranked.find(d => d.available) || ranked[0];
          setBestDoctor(top);
          setSelectedDoctor(top);
        }
      } catch (err) {
        console.log("Using fallback doctors dataset:", err);
        const fallbackDocs = DOCTORS.filter(d => d.dept.toLowerCase() === deptName.toLowerCase());
        const docsToRank = fallbackDocs.length > 0 ? fallbackDocs : DOCTORS.slice(0, 4);
        const ranked = computeSmartDoctorMatch(docsToRank, patientData, deptName);
        setDoctorsList(ranked);
        const top = ranked.find(d => d.available) || ranked[0];
        setBestDoctor(top);
        setSelectedDoctor(top);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDoctors();
    return () => {
      cancelled = true;
    };
  }, [deptName, patientData]);

  const handleConfirmAndGenerateToken = async (doctorToUse) => {
    const doc = doctorToUse || bestDoctor;
    setSelectedDoctor(doc);
    setSubmitting(true);

    try {
      const payload = {
        name: patientData?.name || patientData?.extracted?.["Name"] || "Patient",
        phone: patientData?.phone || patientData?.extracted?.["Contact"] || "9876543210",
        age: parseInt(patientData?.extracted?.["Age"]) || 30,
        gender: patientData?.extracted?.["Gender"] || "Male",
        language: patientData?.language || "hi",
        rawComplaint: patientData?.rawComplaint || (patientData?.transcript?.map(t => t.text).join(". ")) || "General complaint",
        mainSymptom: patientData?.extracted?.["Main Symptom"] || "General Consultation",
        duration: patientData?.extracted?.["Duration"] || "3 days",
        severity: patientData?.extracted?.["Severity"] || "Moderate",
        associatedSymptoms: patientData?.extracted?.["Associated Symptoms"] || "",
        extractedDetails: patientData?.extracted || {},
        department: deptName,
        doctorId: doc?.id,
        doctorName: doc?.name,
        cabin: doc?.cabin
      };

      const res = await api.registerPatient(payload);
      if (res && res.data) {
        const reg = res.data;
        setPatientData(prev => ({
          ...prev,
          ...reg,
          token: reg.tokenNumber,
          tokenNumber: reg.tokenNumber,
          assignedDoctor: doc
        }));
      } else {
        const randomToken = (dept?.code || "GEN") + "-0" + Math.floor(Math.random() * 80 + 10);
        setPatientData(prev => ({
          ...prev,
          token: randomToken,
          tokenNumber: randomToken,
          assignedDoctor: doc
        }));
      }
      go("token");
    } catch (err) {
      console.error("Failed to persist registration to backend:", err);
      const fallbackToken = (dept?.code || "GEN") + "-0" + Math.floor(Math.random() * 80 + 10);
      setPatientData(prev => ({
        ...prev,
        token: fallbackToken,
        tokenNumber: fallbackToken,
        assignedDoctor: doc
      }));
      go("token");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: COLORS.bg }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => go("recommendation")}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-slate-600 shadow-2xs"
            title="Go back to Recommendation"
          >
            <ChevronLeft size={16} /> Back to Recommendation
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            Step 3 of 4
          </span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1" style={{ color: COLORS.ink }}>
          {loading ? "Finding an available doctor..." : "Doctor matched"}
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: COLORS.sub }}>
          Checking department ({deptName}), specialization, availability and live queue length.
        </p>

        {loading ? (
          <div className="flex justify-center py-16"><VoiceWave active bars={16} /></div>
        ) : (
          <>
            {bestDoctor && (
              <Card className="p-6 mb-6 shadow-md transition-all" style={{ borderColor: COLORS.mint, borderWidth: 2 }}>
                <div className="flex items-center justify-between">
                  <StatusBadge tone="mint" icon={BadgeCheck}>Recommended Doctor · Smart AI Match</StatusBadge>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ⭐ {bestDoctor.rating || "4.9"} ({bestDoctor.experience || "12 yrs exp"})
                  </span>
                </div>
                
                <div className="flex items-start justify-between mt-4">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: COLORS.ink }}>{bestDoctor.name}</h3>
                    <p className="text-sm font-medium text-teal-700">{bestDoctor.specialization || `${deptName} Specialist`}</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.sub }}>{deptName} · Cabin {bestDoctor.cabin}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold" style={{ color: COLORS.ink, fontFamily: "IBM Plex Mono, monospace" }}>
                      {bestDoctor.queue ?? 0}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.sub }}>in queue (~{bestDoctor.waitMin || (bestDoctor.queue || 1) * 6} min wait)</p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
                    {bestDoctor.matchReason || "⚡ Available doctor with the shortest waiting queue."}
                  </p>
                </div>
              </Card>
            )}

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider px-1" style={{ color: COLORS.sub }}>
                All Available Doctors in {deptName} ({doctorsList.length})
              </p>
              {doctorsList.map(d => (
                <div
                  key={d.id || d.name}
                  onClick={() => { setBestDoctor(d); setSelectedDoctor(d); }}
                  className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm"
                  style={{
                    borderColor: d.id === bestDoctor?.id ? COLORS.mint : COLORS.line,
                    background: d.id === bestDoctor?.id ? COLORS.mintSoft : "#fff"
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm" style={{ color: COLORS.text }}>{d.name}</p>
                      {d.id === bestDoctor?.id && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white">Selected</span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-teal-700 mt-0.5">{d.specialization || deptName}</p>
                    <p className="text-[11px]" style={{ color: COLORS.sub }}>Cabin {d.cabin} · {d.experience || "10 yrs"} · ⭐ {d.rating || "4.8"}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge tone={d.available ? "mint" : "neutral"}>
                      {d.available ? "● Available" : "● Busy / In Surgery"}
                    </StatusBadge>
                    <p className="text-xs mt-1 font-mono font-bold" style={{ color: COLORS.ink }}>
                      Queue: {d.queue ?? 0} {d.available && d.queue > 0 ? `(~${d.waitMin || d.queue * 6}m)` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-2.5">
              <PrimaryButton
                full
                icon={Ticket}
                disabled={submitting}
                onClick={() => handleConfirmAndGenerateToken(bestDoctor)}
              >
                {submitting ? "Registering & Generating Token..." : "Confirm & Generate Token"}
              </PrimaryButton>
              <GhostButton full onClick={() => go("recommendation")} icon={ChevronLeft}>
                Back to Department Recommendation
              </GhostButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ===================== TOKEN + COMPLETE ===================== */

function TokenComplete({ go, patientData, doctor, dept, lang = "hi", gender }) {
  const { t } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const token = patientData?.token || patientData?.tokenNumber || "—";
  const patientName = patientData?.name || "Patient";
  const departmentName = dept?.name || patientData?.recommendedDepartment || "General Medicine";
  const doctorName = doctor?.name || patientData?.doctorName || "Dr. On Duty";
  const cabinName = doctor?.cabin || patientData?.cabin || "Cabin 101";
  const currentLang = patientData?.lang || lang || "hi";

  const handleHearDetails = () => {
    setSpeaking(true);
    let speechText = "";
    const ttsLang = currentLang === "gu" ? "gu-IN" : currentLang === "en" ? "en-IN" : "hi-IN";

    if (currentLang === "en") {
      speechText = `Hello ${patientName}, your registration is complete. Your token number is ${token}. In the ${departmentName} department, ${doctorName} will consult you in cabin ${cabinName}. Please wait in the waiting lounge.`;
    } else if (currentLang === "gu") {
      speechText = `${patientName} ભાઈ કે બહેન, તમારું રજીસ્ટ્રેશન પૂર્ણ થઈ ગયું છે. તમારો ટોકન નંબર ${token} છે. ${departmentName} વિભાગમાં ${doctorName} તમને કેબિન ${cabinName} માં મળશે. કૃપા કરીને વેઇટિંગ લોન્જમાં રાહ જુઓ.`;
    } else {
      speechText = `${patientName} जी, आपकी रजिस्ट्रेशन पूरी हो गई है। आपका टोकन नंबर ${token} है। डिपार्टमेंट ${departmentName} में ${doctorName} आपको केबिन ${cabinName} में देखेंगे। कृपया वेटिंग लाउंज में इंतज़ार करें।`;
    }

    speak(speechText, ttsLang, {
      onEnd: () => setSpeaking(false),
      gender,
    });
  };

  // "Done" returns the patient to the Patient / Doctor / Admin portal
  // selection screen. Their token + details remain saved so a refresh won't
  // lose them.
  const handleDone = () => {
    setShowDetails(true);
    go("home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: COLORS.mintSoft }}>
          <Check size={26} color={COLORS.ink} />
        </div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }} className="text-2xl">{t("registrationComplete")}</h2>

        <div className="mt-6 rounded-2xl p-6" style={{ background: COLORS.ink }}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: COLORS.mint }}>{t("token")}</p>
          <p style={{ fontFamily: "IBM Plex Mono, monospace", color: "#fff" }} className="text-5xl font-bold mt-1">{token}</p>
        </div>

        <div className="mt-6 text-left space-y-3">
          {[
            [t("patientName"), patientName],
            [t("department"), departmentName],
            [t("doctor"), doctorName],
            [t("cabin"), cabinName],
            [t("status"), t("waiting")],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b pb-2" style={{ borderColor: COLORS.line }}>
              <span className="text-sm" style={{ color: COLORS.sub }}>{k}</span>
              <span className="text-sm font-bold" style={{ color: COLORS.text }}>{v}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleHearDetails}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border py-3 font-semibold text-sm"
          style={{ borderColor: COLORS.line, color: COLORS.text }}
        >
          <Volume2 size={16} /> {t("hearDetails")}
        </button>
        {speaking && (
          <div className="mt-3">
            <VoiceWave active bars={20} />
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <GhostButton onClick={() => go("token-track")}>{t("trackMyToken")}</GhostButton>
          <button
            onClick={handleDone}
            className="inline-flex items-center justify-center gap-2 font-bold px-4 py-2.5 rounded-xl cursor-pointer"
            style={{ background: COLORS.ink, color: "#fff" }}
          >
            {t("done")}
          </button>
        </div>

        <p className="text-xs mt-3" style={{ color: COLORS.sub }}>
          {t("keepForReference")}
        </p>

        {showDetails && (
          <div
            className="mt-6 rounded-2xl p-5 text-left"
            style={{ background: COLORS.mintSoft, border: `1px solid ${COLORS.line}` }}
          >
            <SectionLabel>{t("yourRegistrationDetails")}</SectionLabel>
            <div className="mt-3 space-y-2.5">
              {[
                [t("patientName"), patientName],
                [t("phone"), patientData?.phone || patientData?.extracted?.["Contact"] || "—"],
                [t("age"), patientData?.extracted?.["Age"] || "—"],
                [t("gender"), patientData?.extracted?.["Gender"] || "—"],
                [t("complaint"), patientData?.extracted?.["Main Symptom"] || patientData?.mainSymptom || "—"],
                [t("duration"), patientData?.extracted?.["Duration"] || "—"],
                [t("severity"), patientData?.extracted?.["Severity"] || "—"],
                [t("department"), departmentName],
                [t("doctor"), doctorName],
                [t("cabin"), cabinName],
                [t("status"), t("waiting")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 text-sm">
                  <span style={{ color: COLORS.sub }}>{label}</span>
                  <span className="font-bold text-right" style={{ color: COLORS.text }}>{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 text-xs font-semibold cursor-pointer hover:opacity-80"
              style={{ color: COLORS.ink }}
            >
              {t("hideDetails")}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}


/* ===================== DOCTOR LOGIN / DASHBOARD ===================== */

function SimpleLogin({ go, role, next }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-sm p-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => go("home")}
            className="inline-flex items-center gap-1 text-sm font-bold cursor-pointer hover:opacity-80"
            style={{ color: COLORS.ink }}
          >
            <ChevronLeft size={18} /> {t("back")}
          </button>
          <LanguageToggle />
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.ink }}>{t("loginTitle", { role })}</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.sub }}>{t("demoAccess")}</p>
        <div className="space-y-3">
          <input placeholder={t("email")} className="w-full rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: COLORS.line }} />
          <input placeholder={t("password")} type="password" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: COLORS.line }} />
        </div>
        <div className="mt-6"><PrimaryButton full onClick={() => go(next)}>{t("signIn")}</PrimaryButton></div>
        <button onClick={() => go("landing")} className="text-xs mt-4 font-semibold cursor-pointer" style={{ color: COLORS.sub }}>{t("backToHome")}</button>
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
  const storedReg = readStoredRegistration();
  // Distinguish a real refresh (F5/Reload) from a fresh navigation (open the
  // site). Only on an actual page refresh do we return the patient straight
  // to their token page; a fresh visit always starts at the intro.
  const isReload = typeof performance !== "undefined" &&
    performance.getEntriesByType("navigation").length > 0 &&
    performance.getEntriesByType("navigation")[0].type === "reload";
  const [route, setRoute] = useState(storedReg && isReload ? "token" : "intro");
  const [lang, setLang] = useState("hi");
  const [accessibility, setAccessibility] = useState({ largeText: false, highContrast: false, voiceGuidance: false });
  const [patientData, setPatientData] = useState(storedReg);
  const [dept, setDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [gender, setGender] = useState("female");

  // Persist a completed registration so that an accidental page refresh
  // doesn't make the patient lose their token/details.
  useEffect(() => {
    if (patientData && patientData.token) {
      try {
        localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(patientData));
      } catch {}
    }
  }, [patientData]);

  const go = (r) => {
    if (r === "register") {
      setDept(null);
      setPatientData(null);
      clearStoredRegistration();
    }
    setRoute(r);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.text }}>
      <link rel="stylesheet" href={FONTS_LINK} />
      {route === "intro" && <Intro go={go} gender={gender} setGender={setGender} />}
      {route === "home" && <RoleSelect go={go} />}
      {route === "landing" && <Landing go={go} />}
      {route === "patient-entry" && <PatientEntry go={go} lang={lang} setLang={setLang} accessibility={accessibility} setAccessibility={setAccessibility} />}
      {route === "register" && <VoiceRegistration go={go} lang={lang} setPatientData={setPatientData} gender={gender} />}
      {route === "recommendation" && <Recommendation go={go} dept={dept} setDept={setDept} patientData={patientData} />}
      {route === "doctor-match" && <DoctorMatch go={go} dept={dept} patientData={patientData} setPatientData={setPatientData} setSelectedDoctor={setSelectedDoctor} />}
      {route === "token" && <TokenComplete go={go} patientData={patientData} doctor={selectedDoctor} dept={dept} lang={lang} gender={gender} />}
      {route === "token-track" && <TokenTracking go={go} token={patientData?.token} lang={patientData?.lang || lang} />}
      {route === "doctor-login" && <SimpleLogin go={go} role="Doctor" next="doctor-dashboard" />}
      {route === "doctor-dashboard" && <DoctorDashboard go={go} onSelectPatient={setSelectedPatient} />}
      {route === "doctor-patient" && <DoctorPatientDetail go={go} patient={selectedPatient} />}
      {route === "admin-login" && <SimpleLogin go={go} role="Admin" next="admin-dashboard" />}
      {route === "admin-dashboard" && <AdminDashboard go={go} />}
    </div>
  );
}