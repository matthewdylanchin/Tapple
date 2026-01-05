export type Phase = "playing" | "exploding" | "gameover";

export interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}
