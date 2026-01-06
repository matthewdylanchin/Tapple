import { useState, useEffect } from "react";
import Header from "./components/Header";
import SoundToggle from "./components/SoundToggle"; 
import LetterWheel from "./components/LetterWheel";
import Explosion from "./components/Explosion";
import GameOver from "./components/GameOver";
import { useTicking }from "./engine/useTicking";
import { playExplosion } from "./engine/sound";
import type { Phase, Particle } from "./types/game";
import { LETTERS } from "./data/letters";
import { randomCategory } from "./data/categories";
import { ensureAudio } from "./engine/sound";

export default function TappleGame() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [timeLeft, setTimeLeft] = useState(0);
  const [category, setCategory] = useState("");
  const [tappedLetters, setTappedLetters] = useState<Set<string>>(new Set());
  const [particles, setParticles] = useState<Particle[]>([]);


  const [soundOn, setSoundOn] = useState(true);

  useTicking(soundOn, phase, timeLeft, category);


  useEffect(() => {
  if (phase !== "playing") return;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return; // prevents holding key spamming
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key.toUpperCase();

    // Only A-Z
    if (key.length === 1 && key >= "A" && key <= "Z") {
      e.preventDefault();
      useLetter(key);
    }
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [phase, tappedLetters]); 


useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    if (!category) return;

    if (timeLeft > 0) {
      const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
      return () => window.clearTimeout(t);
    }

    triggerExplosion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, category, phase]);

  function startNewRound() {
    if (soundOn) ensureAudio();

    setPhase("playing");
    setTappedLetters(new Set());
    setParticles([]);

    setCategory(randomCategory());
    setTimeLeft(Math.floor(Math.random() * 31) + 30);
  }

  function triggerExplosion() {
    setPhase((p) => (p === "playing" ? "exploding" : p));
    if (soundOn) playExplosion();

    const newParticles: Particle[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * 900,
      dy: (Math.random() - 0.5) * 900,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    }));
    setParticles(newParticles);

    window.setTimeout(() => setPhase("gameover"), 900);
  }

  function useLetter(letter: string) {
  if (phase !== "playing") return;

  const L = letter.toUpperCase();
  if (L.length !== 1) return;
  if (L < "A" || L > "Z") return;

  if (tappedLetters.has(L)) return;

  setTappedLetters(prev => new Set([...prev, L]));
}




  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-600 overflow-hidden relative">
      <Explosion active={phase === "exploding"} particles={particles} />

      <div
        className={[
          "relative z-10",
          "transition-all duration-500 ease-out",
          phase === "exploding" ? "opacity-0 scale-125 blur-sm" : "",
          phase === "gameover" ? "opacity-0" : "",
        ].join(" ")}
      >
        <Header category={category} timeLeft={timeLeft} />

        <SoundToggle
          soundOn={soundOn}
          onToggle={() => {
            ensureAudio();
            setSoundOn((s) => !s);
          }}
        />

        <LetterWheel
          letters={LETTERS}
          tapped={tappedLetters}
          disabled={phase !== "playing"}
          onLetterClick= {useLetter}
        />

        <div className="text-center mt-8">
          <button
            onClick={startNewRound}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-300 hover:text-blue-700 transition-all transform hover:scale-105"
          >
            New Round
          </button>
        </div>
      </div>

      {phase === "gameover" && <GameOver onRestart={startNewRound} />}
    </div>
  );
}