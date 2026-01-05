import React from "react";

type Props = {
  category: string;
  timeLeft: number;
};

export default function Header({ category, timeLeft }: Props) {
  return (
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
  );
}
