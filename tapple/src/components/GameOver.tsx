import React from "react";

type Props = {
  onRestart: () => void;
};

export default function GameOver({ onRestart }: Props) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="text-white text-6xl font-extrabold tracking-widest animate-fadeIn">
        GAME OVER
      </div>
      <button
        onClick={onRestart}
        className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition"
      >
        Play Again
      </button>
    </div>
  );
}
