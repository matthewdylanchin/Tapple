import React, { useEffect, useState } from "react";
import "./index.css";

const CATEGORIES = [
  "Animals", "Foods", "Countries", "Cities", "Movies", "Colors",
  "Sports", "Fruits", "Vegetables", "Occupations", "Clothing",
  "Furniture", "Vehicles", "Instruments", "Brands", "Drinks",
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Particle {
  id: number;
  x: number;   // percent
  y: number;   // percent
  dx: number;  // px
  dy: number;  // px
  color: string;
}

type Phase = "playing" | "exploding" | "gameover";

export default function TappleGame() {
  const [category, setCategory] = useState<string>("");
  const [tappedLetters, setTappedLetters] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [phase, setPhase] = useState<Phase>("playing");
  const [particles, setParticles] = useState<Particle[]>([]);

  // Start a round on mount
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown (only while playing)
  useEffect(() => {
    if (phase !== "playing") return;
    if (!category) return;

    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }

    // timeLeft === 0
    triggerExplosion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, category, phase]);

  const startNewRound = () => {
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomTime = Math.floor(Math.random() * 31) + 30; // 30–60 seconds

    setCategory(randomCategory);
    setTimeLeft(randomTime);
    setTappedLetters(new Set());
    setParticles([]);
    setPhase("playing");
  };

  const triggerExplosion = () => {
    // prevent double-trigger
    setPhase((p) => (p === "playing" ? "exploding" : p));

    // Make particles
    const newParticles: Particle[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * 900,
      dy: (Math.random() - 0.5) * 900,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    }));
    setParticles(newParticles);

    // After the explosion animation, cut to black GAME OVER
    window.setTimeout(() => {
      setPhase("gameover");
    }, 900);
  };

  const handleLetterClick = (letter: string) => {
    if (phase !== "playing") return;
    if (tappedLetters.has(letter)) return;

    setTappedLetters((prev) => new Set([...prev, letter]));
  };

  const radius = 210;
  const centerX = 250;
  const centerY = 250;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-600 overflow-hidden relative">
      {/* Particle layer during explosion */}
      {phase === "exploding" && (
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
                // start centered at its own position, then fling out
                transform: `translate(0px, 0px)`,
                // pass target movement via CSS variables
                ["--dx" as any]: `${p.dx}px`,
                ["--dy" as any]: `${p.dy}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main UI (fade/scale out when exploding) */}
      <div
        className={[
          "relative z-10",
          "transition-all duration-500 ease-out",
          phase === "exploding" ? "opacity-0 scale-125 blur-sm" : "",
          phase === "gameover" ? "opacity-0" : "",
        ].join(" ")}
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            TAPPLE
          </h1>

          <div className="bg-white rounded-lg px-6 py-3 shadow-2xl inline-block">
            <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
          </div>

          <div
            className={[
              "mt-4 text-4xl font-bold",
              timeLeft <= 10 ? "text-red-300 animate-pulse" : "text-white",
            ].join(" ")}
          >
            {timeLeft}s
          </div>
        </div>

        <svg width="500" height="500" className="drop-shadow-2xl">
          {LETTERS.map((letter, i) => {
            const angle = (i * 360 / LETTERS.length - 90) * Math.PI / 180;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const isTapped = tappedLetters.has(letter);

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
                    phase === "playing" && !isTapped ? "cursor-pointer hover:fill-yellow-300" : "",
                  ].join(" ")}
                  onClick={() => handleLetterClick(letter)}
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

        <div className="text-center mt-8">
          <button
            onClick={startNewRound}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-300 hover:text-blue-700 transition-all transform hover:scale-105"
          >
            New Round
          </button>
        </div>
      </div>

      {/* GAME OVER screen */}
      
      {phase === "gameover" && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="text-white text-6xl font-extrabold tracking-widest animate-fadeIn">
            GAME OVER
          </div>
          <button
            onClick={startNewRound}
            className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes particleBlast {
          0% { opacity: 1; transform: translate(0px, 0px) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.2); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        .animate-fadeIn {
          animation: fadeIn 650ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}
