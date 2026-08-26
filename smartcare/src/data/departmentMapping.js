import { Bone, Heart, Sparkles, Stethoscope, Eye, Brain, Activity, ShieldAlert } from "lucide-react";

export const ALL_DEPARTMENTS = {
  gen: { id: "gen", name: "General Medicine", icon: Stethoscope, code: "GEN" },
  ortho: { id: "ortho", name: "Orthopedics", icon: Bone, code: "ORTHO" },
  cardio: { id: "cardio", name: "Cardiology", icon: Heart, code: "CARD" },
  derma: { id: "derma", name: "Dermatology", icon: Sparkles, code: "DERMA" },
  neuro: { id: "neuro", name: "Neurology", icon: Brain, code: "NEURO" },
  eye: { id: "eye", name: "Ophthalmology", icon: Eye, code: "EYE" },
  ped: { id: "ped", name: "Pediatrics", icon: Activity, code: "PED" },
  emerg: { id: "emerg", name: "Emergency", icon: ShieldAlert, code: "EMERG" },
};

// Maps a "Main Symptom" keyword or department name to department metadata
const SYMPTOM_TO_DEPARTMENT = {
  "Fever": ALL_DEPARTMENTS.gen,
  "Cough/Cold": ALL_DEPARTMENTS.gen,
  "General / Viral Symptoms": ALL_DEPARTMENTS.gen,
  "General Complaint": ALL_DEPARTMENTS.gen,
  "Joint/Knee Pain": ALL_DEPARTMENTS.ortho,
  "Joint / Knee / Musculoskeletal Pain": ALL_DEPARTMENTS.ortho,
  "Skin Issue": ALL_DEPARTMENTS.derma,
  "Dermatological / Skin Issue": ALL_DEPARTMENTS.derma,
  "Chest Pain": ALL_DEPARTMENTS.cardio,
  "Cardiovascular / Heart Concern": ALL_DEPARTMENTS.cardio,
  "Headache": ALL_DEPARTMENTS.neuro,
  "Headache / Neurological Complaint": ALL_DEPARTMENTS.neuro,
  "Eye / Vision Problem": ALL_DEPARTMENTS.eye,
  "Pediatric Condition": ALL_DEPARTMENTS.ped,
  "Critical / Urgent Symptoms": ALL_DEPARTMENTS.emerg,
};

export function getDepartmentMetadataByName(name) {
  if (!name) return ALL_DEPARTMENTS.gen;
  const lower = name.toLowerCase();
  if (lower.includes("ortho") || lower.includes("bone") || lower.includes("joint") || lower.includes("knee")) return ALL_DEPARTMENTS.ortho;
  if (lower.includes("cardio") || lower.includes("heart") || lower.includes("chest")) return ALL_DEPARTMENTS.cardio;
  if (lower.includes("derma") || lower.includes("skin") || lower.includes("rash")) return ALL_DEPARTMENTS.derma;
  if (lower.includes("neuro") || lower.includes("brain") || lower.includes("headache")) return ALL_DEPARTMENTS.neuro;
  if (lower.includes("eye") || lower.includes("ophthal") || lower.includes("vision")) return ALL_DEPARTMENTS.eye;
  if (lower.includes("pediatric") || lower.includes("child") || lower.includes("baby")) return ALL_DEPARTMENTS.ped;
  if (lower.includes("emerg") || lower.includes("trauma") || lower.includes("urgent")) return ALL_DEPARTMENTS.emerg;
  return ALL_DEPARTMENTS.gen;
}

// Decides department + confidence based on extracted symptom data
export function getRecommendation(extracted) {
  const symptom = extracted?.["Main Symptom"];

  if (!symptom) {
    return {
      dept: ALL_DEPARTMENTS.gen,
      confidence: "Low",
      reason: "No specific symptoms were captured, so we're routing you to General Medicine for an initial clinical evaluation.",
    };
  }

  // Handle direct lookup
  let matched = SYMPTOM_TO_DEPARTMENT[symptom];

  // Handle compound symptoms e.g. "Joint/Knee Pain + Headache"
  if (!matched) {
    matched = getDepartmentMetadataByName(symptom);
  }

  if (matched) {
    const isCompound = symptom.includes("+");
    return {
      dept: matched,
      confidence: "High",
      reason: isCompound
        ? `Based on your primary complaint (${symptom.split("+")[0].trim()}), ${matched.name} is recommended for specialist evaluation, with cross-consultation notes for associated symptoms.`
        : `Based on your reported symptoms (${symptom}), ${matched.name} appears to be the most appropriate department for clinical care.`,
    };
  }

  return {
    dept: ALL_DEPARTMENTS.gen,
    confidence: "Medium",
    reason: "Based on the information you provided, General Medicine is recommended for an initial evaluation.",
  };
}