import React from "react";

const COLORS = {
  line: "#E6E3DC",
  text: "#1A2321",
};

export default function GhostButton({
  children,
  onClick,
  icon: Icon,
  full,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderColor: COLORS.line,
        color: COLORS.text,
      }}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-xl border bg-white hover:bg-[#F3F2EE] transition-colors`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}