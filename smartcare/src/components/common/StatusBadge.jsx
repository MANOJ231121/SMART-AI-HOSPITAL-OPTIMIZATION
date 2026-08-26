import React from "react";

const COLORS = {
  sub: "#5C6864",
  mintSoft: "#E4F5F0",
  inkSoft: "#1C5250",
  amberSoft: "#FCF0DD",
  redSoft: "#FBE8E8",
  red: "#D14343",
};

export default function StatusBadge({ tone = "neutral", children, icon: Icon }) {
  const map = {
    neutral: { bg: "#EEEFEC", fg: COLORS.sub },
    mint: { bg: COLORS.mintSoft, fg: COLORS.inkSoft },
    amber: { bg: COLORS.amberSoft, fg: "#8A5A0E" },
    red: { bg: COLORS.redSoft, fg: COLORS.red },
    ink: { bg: "#E6EFEE", fg: "#0F3B3A" },
  };

  const s = map[tone];

  return (
    <span
      style={{ background: s.bg, color: s.fg }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold tracking-wide"
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}