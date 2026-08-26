import React from "react";

const COLORS = {
  sub: "#5C6864",
};

export default function SectionLabel({ children }) {
  return (
    <div
      style={{ color: COLORS.sub }}
      className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1"
    >
      {children}
    </div>
  );
}