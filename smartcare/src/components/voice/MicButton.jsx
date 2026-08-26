import React from "react";
import { Mic } from "lucide-react";

const COLORS = {
  mint: "#55C9B1",
  red: "#D14343",
  ink: "#0F3B3A",
  text: "#1A2321",
};

export default function MicButton({
  state,
  onTap,
  largeText,
}) {
  // states:
  // idle | listening | processing | speaking

  const ring =
    state === "listening"
      ? COLORS.red
      : COLORS.mint;

  const pulsing = state === "listening";

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onTap}
        disabled={
          state === "processing" ||
          state === "speaking"
        }
        className="relative flex items-center justify-center rounded-full transition-transform active:scale-95"
        style={{
          width: 128,
          height: 128,
        }}
      >
        {pulsing && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: ring,
              opacity: 0.25,
            }}
          />
        )}

        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              state === "processing"
                ? "#E9E7DF"
                : ring,
            opacity:
              state === "processing"
                ? 1
                : 0.12,
          }}
        />

        <span
          className="relative flex items-center justify-center rounded-full shadow-lg"
          style={{
            width: 96,
            height: 96,
            background:
              state === "processing"
                ? "#D9D6CB"
                : `linear-gradient(155deg, ${ring}, ${COLORS.ink})`,
          }}
        >
          <Mic
            size={38}
            color="#fff"
            strokeWidth={2}
          />
        </span>
      </button>

      <div className="text-center">
        <p
          className={`${
            largeText
              ? "text-lg"
              : "text-base"
          } font-semibold`}
          style={{
            color: COLORS.text,
          }}
        >
          {state === "idle" &&
            "Tap to speak"}

          {state === "listening" &&
            "Listening..."}

          {state === "processing" &&
            "Understanding your response..."}

          {state === "speaking" &&
            "AI is speaking..."}
        </p>
      </div>
    </div>
  );
}