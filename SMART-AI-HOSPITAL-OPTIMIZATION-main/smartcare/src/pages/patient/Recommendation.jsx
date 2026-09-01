import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronLeft, RotateCcw } from "lucide-react";

import Card from "../../components/common/Card";
import PrimaryButton from "../../components/common/PrimaryButton";
import GhostButton from "../../components/common/GhostButton";
import StatusBadge from "../../components/common/StatusBadge";
import { getRecommendation, getDepartmentMetadataByName } from "../../data/departmentMapping";
import api from "../../service/api";
import { useLanguage } from "../../context/LanguageContext";

const COLORS = {
  ink: "#0F3B3A",
  inkSoft: "#1C5250",
  mintSoft: "#E4F5F0",
  bg: "#F7F7F4",
  sub: "#5C6864",
};

export default function Recommendation({
  go,
  dept,
  setDept,
  patientData,
}) {
  const { t } = useLanguage();
  const localRec = getRecommendation(patientData?.extracted);
  const [recommendation, setRecommendation] = useState({
    dept: localRec.dept,
    confidence: localRec.confidence,
    reason: localRec.reason,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchAiRouting() {
      if (!patientData?.rawComplaint && !patientData?.mainSymptom) return;
      try {
        const text = patientData.rawComplaint || patientData.mainSymptom;
        const res = await api.getDepartmentRecommendation(text, patientData.extractedDetails || {});
        if (res && res.success && !cancelled) {
          const deptMeta = getDepartmentMetadataByName(res.recommendedDepartment);
          const updatedRec = {
            dept: deptMeta,
            confidence: res.confidence || "High",
            reason: res.reasoning || localRec.reason,
          };
          setRecommendation(updatedRec);
          setDept(deptMeta);
        }
      } catch (err) {
        console.log("Using local department mapping fallback:", err);
      }
    }

    fetchAiRouting();

    if (!dept) {
      setDept(localRec.dept);
    }

    return () => {
      cancelled = true;
    };
  }, [patientData]);

  const activeDept = dept || recommendation.dept;
  const DepartmentIcon = activeDept?.icon || localRec.dept.icon;

  const confidenceTone =
    recommendation.confidence === "High" ? "mint" : recommendation.confidence === "Medium" ? "amber" : "neutral";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ background: COLORS.bg }}
    >
      <Card className="w-full max-w-lg p-8 text-center shadow-md">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between mb-5 border-b pb-3 border-slate-100">
          <button
            onClick={() => go("register")}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-slate-600 shadow-2xs"
            title="Go back to registration"
          >
            <ChevronLeft size={16} /> Back to Intake
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            Step 2 of 4
          </span>
        </div>

        <StatusBadge tone={confidenceTone} icon={CheckCircle2}>
          Confidence: {recommendation.confidence}
        </StatusBadge>

        <p
          className="text-xs font-bold uppercase tracking-wide mt-6"
          style={{ color: COLORS.sub }}
        >
          {t("recommendedDepartment")}
        </p>

        <div className="flex items-center justify-center gap-3 mt-2">
          {DepartmentIcon && <DepartmentIcon size={30} color={COLORS.ink} />}

          <h2
            className="text-3xl"
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              color: COLORS.ink,
            }}
          >
            {activeDept?.name || "General Medicine"}
          </h2>
        </div>

        <p className="mt-4 text-sm" style={{ color: COLORS.sub }}>
          {recommendation.reason}
        </p>

        {patientData?.extracted?.["Main Symptom"] && (
          <div
            className="mt-4 rounded-xl p-3.5 text-left text-xs space-y-1"
            style={{ background: COLORS.bg, color: COLORS.sub }}
          >
            <div><strong>{t("reportedComplaint")}:</strong> {patientData.extracted["Main Symptom"]}</div>
            {patientData.extracted["Duration"] && <div><strong>{t("duration")}:</strong> {patientData.extracted["Duration"]}</div>}
            {patientData.extracted["Severity"] && <div><strong>{t("severity")}:</strong> {patientData.extracted["Severity"]}</div>}
          </div>
        )}

        <div
          className="mt-6 rounded-xl p-4 text-left"
          style={{ background: COLORS.mintSoft }}
        >
          <p className="text-xs font-semibold" style={{ color: COLORS.inkSoft }}>
            {t("aiRecommendationNote")}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2.5">
          <PrimaryButton full icon={ArrowRight} onClick={() => go("doctor-match")}>
            {t("findDoctor")}
          </PrimaryButton>
          <GhostButton full icon={RotateCcw} onClick={() => go("register")}>
            {t("reRecordSymptoms")}
          </GhostButton>
        </div>
      </Card>
    </div>
  );
}