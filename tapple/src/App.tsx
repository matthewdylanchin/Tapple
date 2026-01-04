import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  "Animals", "Foods", "Countries", "Cities", "Movies", "Colors",
  "Sports", "Fruits", "Vegetables", "Occupations", "Clothing",
  "Furniture", "Vehicles", "Instruments", "Brands", "Drinks"
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

export default function TappleGame() {
  const [category, setCategory] = useState<string>('');
  const [tappedLetters, setTappedLetters] = useState<Set<string>>(new Set<string>());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && category) {
      triggerExplosion();
    }
  }, [timeLeft, category]);

  const startNewRound = () => {
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomTime = Math.floor(Math.random() * 31) + 30; // 30-60 seconds
    setCategory(randomCategory);
    setTimeLeft(randomTime);
    setTappedLetters(new Set<string>());
    setIsExploding(false);
    setParticles([]);
  };

  const triggerExplosion = () => {
    setIsExploding(true);
    const newParticles = [];
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        dx: (Math.random() - 0.5) * 200,
        dy: (Math.random() - 0.5) * 200,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      });
    }
    setParticles(newParticles);
  };

  const handleLetterClick = (letter: string) => {
    if (!isExploding && !tappedLetters.has(letter)) {
      setTappedLetters(new Set<string>([...tappedLetters, letter]));
    }
  };

  const radius = 180;
  const centerX = 250;
  const centerY = 250;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
      {isExploding && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute w-4 h-4 rounded-full animate-pulse"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                animation: `explode 2s ease-out forwards`,
                transform: `translate(${p.dx}px, ${p.dy}px)`,
                opacity: 0
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className={`relative ${isExploding ? 'animate-bounce' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            TAPPLE
          </h1>
          <div className="bg-white rounded-lg px-6 py-3 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
          </div>
          <div className={`mt-4 text-4xl font-bold ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
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
                  r="22"
                  fill={isTapped ? '#94a3b8' : '#ffffff'}
                  stroke="#1e293b"
                  strokeWidth="2"
                  className={`cursor-pointer transition-all ${!isTapped && !isExploding ? 'hover:fill-yellow-300' : ''}`}
                  onClick={() => handleLetterClick(letter)}
                  style={{
                    filter: isExploding ? 'blur(2px)' : 'none'
                  }}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-2xl font-bold ${isTapped ? 'fill-gray-500' : 'fill-gray-800'} pointer-events-none select-none`}
                  style={{
                    filter: isExploding ? 'blur(2px)' : 'none'
                  }}
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
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-300 hover:text-purple-700 transition-all transform hover:scale-105"
          >
            New Round
          </button>
        </div>
      </div>

      <style>{`
        @keyframes explode {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }
      `}</style>
    </div>
  );
}