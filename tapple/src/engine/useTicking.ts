import { useEffect } from "react";
import { playTick } from "./sound";
import type { Phase } from "../types/game";

export function useTicking(
  enabled: boolean,
  phase: Phase,
  timeLeft: number,
  category: string
) {
  useEffect(() => {
    if (!enabled || phase !== "playing" || !category) return;

    let cancelled = false;
    let timeoutId: number | null = null;

    const schedule = () => {
      if (cancelled) return;

      const t = timeLeft;

      const interval =
        t > 20 ? 1000 :
        t > 10 ? 700 :
        t > 5  ? 450 :
        t > 2  ? 250 : 140;

      const pitch =
        t > 10 ? 900 :
        t > 5  ? 1100 : 1400;

      playTick(0.12, pitch);
      timeoutId = window.setTimeout(schedule, interval);
    };

    schedule();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, phase, timeLeft, category]);
}
