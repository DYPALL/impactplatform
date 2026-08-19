import batteryNotAtAll from "@/assets/battery-not-at-all.png.asset.json";
import batteryPartially from "@/assets/battery-partially.png.asset.json";
import batteryMostly from "@/assets/battery-mostly.png.asset.json";
import batteryFully from "@/assets/battery-fully.png.asset.json";
import { LEVELS, type LevelKey } from "./results-data";

/**
 * Visual variants for indicator scores.
 * Swap the default here (or pass `variant` per instance) to change the look
 * everywhere the results page shows an indicator level.
 */
export type ScoreMeterVariant = "battery" | "ring" | "signal";

export const DEFAULT_SCORE_METER_VARIANT: ScoreMeterVariant = "battery";

const BATTERY_IMG = [batteryNotAtAll, batteryPartially, batteryMostly, batteryFully];

type Props = {
  level: LevelKey;
  /** Optional 0-100 value; falls back to the level midpoint. */
  pct?: number;
  variant?: ScoreMeterVariant;
  className?: string;
};

const LEVEL_PCT: Record<LevelKey, number> = { 0: 12, 1: 40, 2: 65, 3: 100 };

export function ScoreMeter({ level, pct, variant = DEFAULT_SCORE_METER_VARIANT, className }: Props) {
  const value = Math.max(0, Math.min(100, pct ?? LEVEL_PCT[level]));
  const label = `Performance level: ${LEVELS[level].label}`;
  const color = LEVELS[level].color;
  const soft = LEVELS[level].soft;

  if (variant === "ring") {
    const r = 15;
    const c = 2 * Math.PI * r;
    return (
      <svg
        viewBox="0 0 36 36"
        role="img"
        aria-label={label}
        className={`w-auto shrink-0 ${className ?? "h-[38px]"}`}
      >
        <circle cx="18" cy="18" r={r} fill="none" stroke={soft} strokeWidth="5" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          transform="rotate(-90 18 18)"
        />
      </svg>
    );
  }

  if (variant === "signal") {
    const bars = [0, 1, 2, 3];
    return (
      <svg
        viewBox="0 0 44 28"
        role="img"
        aria-label={label}
        className={`w-auto shrink-0 ${className ?? "h-[38px]"}`}
      >
        {bars.map((i) => {
          const h = 7 + i * 6;
          return (
            <rect
              key={i}
              x={2 + i * 11}
              y={26 - h}
              width="8"
              height={h}
              rx="3"
              fill={i <= level ? color : soft}
            />
          );
        })}
      </svg>
    );
  }

  return (
    <img
      src={BATTERY_IMG[level].url}
      alt={label}
      className={`w-auto shrink-0 ${className ?? "h-[38px]"}`}
    />
  );
}

export default ScoreMeter;
