import React from "react";

const COLORS = {
  card: "#FFFFFF",
  line: "#E6E3DC",
};

export default function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: COLORS.card,
        borderColor: COLORS.line,
        ...style,
      }}
    >
      {children}
    </div>
  );
}