import React, { useEffect, useState } from "react";

const COLORS = {
  mint: "#55C9B1",
};

export default function VoiceWave({
  active,
  color = COLORS.mint,
  bars = 24,
}) {
  const [heights, setHeights] = useState(
    Array(bars).fill(6)
  );

  useEffect(() => {
    if (!active) {
      setHeights(Array(bars).fill(6));
      return;
    }

    const t = setInterval(() => {
      setHeights(
        Array.from(
          { length: bars },
          () => 6 + Math.random() * 26
        )
      );
    }, 120);

    return () => clearInterval(t);
  }, [active, bars]);

  return (
    <div className="flex items-center justify-center gap-[3px] h-9">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`,
            width: 3,
            borderRadius: 2,
            background: color,
            opacity: active ? 0.9 : 0.25,
            transition: "height 120ms ease",
          }}
        />
      ))}
    </div>
  );
}