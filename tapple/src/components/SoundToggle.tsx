import React from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  soundOn: boolean;
  onToggle: () => void;
};

export default function SoundToggle({ soundOn, onToggle }: Props) {
  return (
    <div className="mt-2 flex justify-center">
      <button
        type="button"
        aria-label={soundOn ? "Sound on" : "Sound off"}
        onClick={onToggle}
        className="bg-white/80 hover:bg-white text-black px-4 py-2 rounded-full font-semibold transition shadow"
      >
        {soundOn ? (
          <Volume2 className="inline-block w-5 h-5" />
        ) : (
          <VolumeX className="inline-block w-5 h-5" />
        )}
      </button>
    </div>
  );
}
