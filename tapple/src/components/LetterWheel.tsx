import React from "react";

type Props = {
  letters: string[];
  tapped: Set<string>;
  disabled: boolean;
  onLetterClick: (letter: string) => void;
  radius?: number;
  size?: number;
};

export default function LetterWheel({
  letters,
  tapped,
  disabled,
  onLetterClick,
  radius = 210,
  size = 500,
}: Props) {
  const center = size / 2;

  return (
    <svg width={size} height={size} className="drop-shadow-2xl">
      {letters.map((letter, i) => {
        const angle = (i * 360 / letters.length - 90) * Math.PI / 180;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const isTapped = tapped.has(letter);

        return (
          <g key={letter}>
            <circle
              cx={x}
              cy={y}
              r="25"
              fill={isTapped ? "#94a3b8" : "#ffffff"}
              stroke="#1e293b"
              strokeWidth="2"
              className={[
                "transition-all",
                !disabled && !isTapped ? "cursor-pointer hover:fill-yellow-300" : "",
              ].join(" ")}
              onClick={() => {
                if (disabled || isTapped) return;
                onLetterClick(letter);
              }}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={[
                "text-2xl font-bold pointer-events-none select-none",
                isTapped ? "fill-gray-500" : "fill-gray-800",
              ].join(" ")}
            >
              {letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
