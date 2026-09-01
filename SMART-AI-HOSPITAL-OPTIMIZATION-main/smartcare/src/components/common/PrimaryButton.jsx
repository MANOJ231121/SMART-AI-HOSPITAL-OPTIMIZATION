import React from "react";

const COLORS = {
  ink: "#0F3B3A",
  red: "#D14343",
};

export default function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  full,
  disabled,
  tone = "mint",
}) {
  const bg =
    tone === "mint"
      ? COLORS.ink
      : tone === "red"
      ? COLORS.red
      : COLORS.ink;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#B9C4C1" : bg,
      }}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 text-white font-semibold px-5 py-3 rounded-xl transition-transform active:scale-[0.98] hover:opacity-90 disabled:cursor-not-allowed`}
    >
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
}