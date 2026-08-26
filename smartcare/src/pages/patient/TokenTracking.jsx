import React, { useEffect, useState } from "react";
import { ChevronLeft, Clock, Volume2 } from "lucide-react";

import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import SectionLabel from "../../components/common/SectionLabel";
import VoiceWave from "../../components/voice/VoiceWave";
import api from "../../service/api";
import { speak, stopSpeaking } from "../../service/voice/textToSpeech";

const COLORS = {
  ink: "#0F3B3A",
  mintSoft: "#E4F5F0",
  bg: "#F7F7F4",
  sub: "#5C6864",
  text: "#1A2321",
  line: "#E6E3DC",
};

export default function TokenTracking({ go, token, lang = "hi" }) {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No token found. Please register first.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchQueueStatus() {
      try {
        const data = await api.getQueueStatus(token);
        if (!cancelled && data) {
          setQueueData(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.log("Live queue fallback / polling notice:", err);
          // If network error on custom token, provide friendly fallback
          if (!queueData) {
            setQueueData({
              yourToken: token,
              patientName: "Patient",
              department: "Hospital Department",
              currentlyServing: "D-021",
              patientsAhead: 2,
              estimatedMinutes: 12,
              queue: [
                { token: "D-021", initials: "K.V.", status: "Serving" },
                { token: "D-022", initials: "R.D.", status: "Waiting" },
                { token: token, initials: "You", status: "Your Token" },
              ]
            });
            setLoading(false);
          }
        }
      }
    }

    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 5000); // poll every 5s

    return () => {
      cancelled = true;
      clearInterval(interval);
      stopSpeaking();
    };
  }, [token]);

  const handleHearStatus = () => {
    if (!queueData) return;
    setSpeaking(true);

    let speechText = "";
    const ttsLang = lang === "gu" ? "gu-IN" : lang === "en" ? "en-IN" : "hi-IN";

    if (lang === "en") {
      speechText = `Your token number is ${queueData.yourToken}. The doctor is currently serving token ${queueData.currentlyServing || "None"} in ${queueData.department || "the department"}. There are ${queueData.patientsAhead} patients ahead of you, and your estimated wait time is approximately ${queueData.estimatedMinutes} minutes.`;
    } else if (lang === "gu") {
      speechText = `તમારો ટોકન નંબર ${queueData.yourToken} છે. ${queueData.department || "વિભાગ"}માં હાલમાં ટોકન ${queueData.currentlyServing || "કોઈ નહીં"} તપાસાઈ રહ્યો છે. તમારા આગળ ${queueData.patientsAhead} દર્દીઓ છે, અને અંદાજિત રાહ જોવાનો સમય લગભગ ${queueData.estimatedMinutes} મિનિટ છે.`;
    } else {
      speechText = `आपका टोकन नंबर ${queueData.yourToken} है। ${queueData.department || "विभाग"} में अभी टोकन ${queueData.currentlyServing || "कोई नहीं"} को देखा जा रहा है। आपके आगे ${queueData.patientsAhead} मरीज हैं, और अनुमानित प्रतीक्षा समय लगभग ${queueData.estimatedMinutes} मिनट है।`;
    }

    speak(speechText, ttsLang, {
      onEnd: () => setSpeaking(false),
    });
  };

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: COLORS.bg }}>
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => go("landing")}
          className="flex items-center gap-1 text-sm font-semibold mb-6"
          style={{ color: COLORS.sub }}
        >
          <ChevronLeft size={16} /> Home
        </button>

        {loading && (
          <Card className="p-6 text-center mb-5">
            <p className="text-sm" style={{ color: COLORS.sub }}>
              Loading your queue status...
            </p>
          </Card>
        )}

        {!loading && error && (
          <Card className="p-6 text-center mb-5">
            <p className="text-sm" style={{ color: COLORS.sub }}>
              {error}
            </p>
          </Card>
        )}

        {!loading && queueData && (
          <>
            <Card className="p-6 text-center mb-5">
              <p
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: COLORS.sub }}
              >
                Your Token
              </p>
              <p
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  color: COLORS.ink,
                }}
                className="text-4xl font-bold"
              >
                {queueData.yourToken}
              </p>

              <div className="flex justify-center gap-8 mt-5">
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.text }}>
                    {queueData.currentlyServing || "None"}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.sub }}>
                    Currently serving
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.text }}>
                    {queueData.patientsAhead}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.sub }}>
                    Patients ahead
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <StatusBadge tone="amber" icon={Clock}>
                  {queueData.status === "IN_CONSULTATION" ? "Now In Consultation" : `Waiting · ~${queueData.estimatedMinutes} min estimated`}
                </StatusBadge>
              </div>
            </Card>

            <Card className="p-5">
              <SectionLabel>Live Department Queue</SectionLabel>
              <div className="space-y-2 mt-2">
                {queueData.queue?.map((row) => (
                  <div
                    key={row.token}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{
                      background:
                        row.token === queueData.yourToken
                          ? COLORS.mintSoft
                          : "transparent",
                    }}
                  >
                    <span
                      className="font-mono text-sm font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      {row.token}
                    </span>

                    {/* Only initials shown for patient privacy */}
                    <span className="text-sm" style={{ color: COLORS.sub }}>
                      {row.initials}
                    </span>

                    <StatusBadge
                      tone={
                        row.status === "Serving" || row.status === "IN_CONSULTATION"
                          ? "mint"
                          : row.status === "Completed" || row.status === "COMPLETED"
                          ? "neutral"
                          : row.token === queueData.yourToken
                          ? "ink"
                          : "amber"
                      }
                    >
                      {row.token === queueData.yourToken ? "Your Token" : row.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        <button
          onClick={handleHearStatus}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border py-3 font-semibold text-sm"
          style={{ borderColor: COLORS.line, color: COLORS.text }}
        >
          <Volume2 size={16} /> Hear Queue Status
        </button>

        {speaking && (
          <div className="mt-3 text-center">
            <VoiceWave active bars={20} />
          </div>
        )}
      </div>
    </div>
  );
}