import { Polygon, type PolygonDirection } from "@/components/Polygon";

type PolygonSpec = {
  size: number;
  color: string;
  rotate: number;
  direction: PolygonDirection;
  spin: number;
  duration: number;
  delay: number;
  top?: string;
  left?: string;
};

const polygonFields = {
  hero: [
    { size: 92, rotate: -12, color: "rgba(255,255,255,0.10)", direction: "right", spin: 1, duration: 30, delay: -3, top: "3%" },
    { size: 64, rotate: -28, color: "rgba(233,75,138,0.40)", direction: "right", spin: -1, duration: 34, delay: -27, top: "6%" },
    { size: 48, rotate: -10, color: "rgba(233,75,138,0.45)", direction: "right", spin: 1.5, duration: 28, delay: -9, top: "11%" },
    { size: 44, rotate: 38, color: "rgba(244,162,97,0.45)", direction: "left", spin: -1, duration: 24, delay: -13, top: "14%" },
    { size: 82, rotate: -48, color: "rgba(244,162,97,0.35)", direction: "left", spin: 1, duration: 32, delay: -8, top: "17%" },
    { size: 72, rotate: 55, color: "rgba(255,255,255,0.12)", direction: "right", spin: -1, duration: 32, delay: -14, top: "30%" },
    { size: 58, rotate: 14, color: "rgba(255,255,255,0.14)", direction: "left", spin: 1, duration: 26, delay: -18, top: "44%" },
    { size: 42, rotate: -60, color: "rgba(255,255,255,0.15)", direction: "right", spin: -1.5, duration: 22, delay: -4, top: "58%" },
    { size: 60, rotate: 66, color: "rgba(255,255,255,0.11)", direction: "left", spin: 1, duration: 30, delay: -25, top: "68%" },
    { size: 56, rotate: 20, color: "rgba(255,255,255,0.11)", direction: "up", spin: 1, duration: 28, delay: -6, left: "6%" },
    { size: 50, rotate: -30, color: "rgba(255,255,255,0.13)", direction: "down", spin: -1, duration: 26, delay: -12, left: "18%" },
    { size: 44, rotate: 52, color: "rgba(255,255,255,0.12)", direction: "up", spin: 1.5, duration: 30, delay: -20, left: "46%" },
    { size: 66, rotate: -8, color: "rgba(255,255,255,0.10)", direction: "down", spin: -1, duration: 34, delay: -9, left: "74%" },
    { size: 38, rotate: 72, color: "rgba(255,255,255,0.15)", direction: "up", spin: 1, duration: 22, delay: -16, left: "88%" },
    { size: 50, rotate: -18, color: "rgba(233,75,138,0.40)", direction: "right", spin: -1, duration: 24, delay: -8, top: "81%" },
    { size: 58, rotate: 24, color: "rgba(233,75,138,0.50)", direction: "left", spin: 1, duration: 26, delay: -4, top: "85%" },
    { size: 68, rotate: 42, color: "rgba(244,162,97,0.40)", direction: "right", spin: 1.5, duration: 30, delay: -18, top: "89%" },
    { size: 40, rotate: -44, color: "rgba(244,162,97,0.50)", direction: "left", spin: -1, duration: 20, delay: -15, top: "93%" },
  ],
  banner: [
    { size: 46, rotate: -22, color: "rgba(244,162,97,0.65)", direction: "right", spin: 1, duration: 24, delay: -8, top: "12%" },
    { size: 35, rotate: -18, color: "rgba(233,75,138,0.55)", direction: "left", spin: -1, duration: 28, delay: -14, top: "28%" },
    { size: 23, rotate: 10, color: "rgba(255,255,255,0.50)", direction: "up", spin: 1, duration: 22, delay: -6, left: "72%" },
    { size: 77, rotate: -22, color: "rgba(244,162,97,0.45)", direction: "right", spin: -1, duration: 32, delay: -20, top: "48%" },
    { size: 57, rotate: 10, color: "rgba(233,75,138,0.45)", direction: "down", spin: 1, duration: 26, delay: -12, left: "68%" },
    { size: 44, rotate: 12, color: "rgba(255,255,255,0.40)", direction: "left", spin: -1, duration: 30, delay: -4, top: "64%" },
    { size: 29, rotate: 14, color: "rgba(33,156,158,0.60)", direction: "up", spin: 1.5, duration: 24, delay: -16, left: "88%" },
    { size: 54, rotate: -8, color: "rgba(255,255,255,0.35)", direction: "down", spin: -1, duration: 28, delay: -9, left: "82%" },
    { size: 137, rotate: 28, color: "rgba(244,162,97,0.35)", direction: "left", spin: 1, duration: 34, delay: -24, top: "82%" },
  ],
  compact: [
    { size: 77, rotate: -22, color: "rgba(244,162,97,0.50)", direction: "right", spin: 1, duration: 28, delay: -16, top: "8%" },
    { size: 46, rotate: -22, color: "rgba(244,162,97,0.65)", direction: "left", spin: -1, duration: 24, delay: -8, top: "38%" },
    { size: 35, rotate: -18, color: "rgba(233,75,138,0.55)", direction: "right", spin: 1.5, duration: 26, delay: -12, top: "24%" },
    { size: 54, rotate: -8, color: "rgba(255,255,255,0.35)", direction: "down", spin: -1, duration: 22, delay: -6, left: "47%" },
    { size: 23, rotate: 10, color: "rgba(255,255,255,0.55)", direction: "up", spin: 1, duration: 20, delay: -14, left: "66%" },
    { size: 28, rotate: 12, color: "rgba(33,156,158,0.55)", direction: "left", spin: -1, duration: 30, delay: -20, top: "68%" },
  ],
  cta: [
    { size: 146, rotate: -18, color: "rgba(255,255,255,0.14)", direction: "right", spin: 1, duration: 32, delay: -12, top: "4%" },
    { size: 92, rotate: 53, color: "rgba(244,162,97,0.35)", direction: "left", spin: -1, duration: 28, delay: -20, top: "24%" },
    { size: 132, rotate: -40, color: "rgba(255,255,255,0.10)", direction: "up", spin: 1, duration: 34, delay: -8, left: "20%" },
    { size: 101, rotate: 58, color: "rgba(80,33,129,0.28)", direction: "down", spin: -1, duration: 30, delay: -16, left: "78%" },
    { size: 95, rotate: 22, color: "rgba(255,255,255,0.14)", direction: "left", spin: 1, duration: 32, delay: -4, top: "66%" },
    { size: 47, rotate: -10, color: "rgba(244,162,97,0.50)", direction: "right", spin: -1.5, duration: 24, delay: -14, top: "82%" },
    { size: 62, rotate: -30, color: "rgba(255,255,255,0.15)", direction: "up", spin: 1, duration: 26, delay: -10, left: "34%" },
  ],
  panel: [
    { size: 120, rotate: -18, color: "rgba(255,255,255,0.08)", direction: "right", spin: 1, duration: 30, delay: -12, top: "3%" },
    { size: 70, rotate: 35, color: "rgba(244,162,97,0.55)", direction: "left", spin: -1, duration: 26, delay: -18, top: "12%" },
    { size: 40, rotate: -40, color: "rgba(33,156,158,0.65)", direction: "up", spin: 1.5, duration: 24, delay: -6, left: "62%" },
    { size: 90, rotate: 210, color: "rgba(233,75,138,0.35)", direction: "right", spin: -1, duration: 32, delay: -22, top: "38%" },
    { size: 54, rotate: 15, color: "rgba(255,255,255,0.18)", direction: "down", spin: 1, duration: 28, delay: -10, left: "18%" },
    { size: 64, rotate: 165, color: "rgba(244,162,97,0.35)", direction: "left", spin: -1, duration: 30, delay: -4, top: "58%" },
    { size: 32, rotate: -25, color: "rgba(255,255,255,0.28)", direction: "up", spin: 1, duration: 22, delay: -16, left: "76%" },
    { size: 140, rotate: 200, color: "rgba(0,0,0,0.18)", direction: "right", spin: 1, duration: 34, delay: -26, top: "82%" },
    { size: 48, rotate: -10, color: "rgba(33,156,158,0.5)", direction: "down", spin: -1.5, duration: 26, delay: -8, left: "45%" },
  ],
} satisfies Record<string, PolygonSpec[]>;

// Every shape in this file is defined in seconds per crossing. This multiplier
// stretches those cycles: 1 = as specified, 1.7 = noticeably calmer drift.
const SPEED = 1.7;

export function FlowingPolygons({ variant }: { variant: keyof typeof polygonFields }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [container-type:inline-size]"
    >
      {polygonFields[variant].map((polygon, index) => (
        <Polygon
          key={`${variant}-${index}`}
          className={variant === "hero" ? "hidden lg:block" : undefined}
          size={polygon.size}
          rotate={polygon.rotate}
          color={polygon.color}
          direction={polygon.direction}
          spin={polygon.spin}
          floatDuration={polygon.duration * SPEED}
          floatDelay={polygon.delay * SPEED}
          style={{ top: polygon.top, left: polygon.left }}
        />
      ))}
    </div>
  );
}
