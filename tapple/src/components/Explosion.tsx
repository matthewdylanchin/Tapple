import React from "react";
import type { Particle } from "../types/game";

type Props = {
  active: boolean;
  particles: Particle[];
};

export default function Explosion({ active, particles }: Props) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animation: "particleBlast 900ms ease-out forwards",
            transform: "translate(0px, 0px)",
            ["--dx" as any]: `${p.dx}px`,
            ["--dy" as any]: `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
}
