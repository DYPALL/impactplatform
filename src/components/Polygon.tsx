import { useRef } from "react";

export function Polygon({
  size = 60,
  color = "rgba(255,255,255,0.15)",
  rotate = 0,
  depth = 1,
  floatDuration,
  floatDelay,
  style,
}: {
  size?: number;
  color?: string;
  rotate?: number;
  /** how strongly this shape reacts to the pointer (0 = static, 2 = very reactive) */
  depth?: number;
  floatDuration?: number;
  floatDelay?: number;
  style?: React.CSSProperties;
}) {
  const duration = floatDuration ?? 7 + (size % 5);
  const delay = floatDelay ?? (size % 7) * -0.6;
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        willChange: "transform",
        transition: "transform 600ms cubic-bezier(0.18, 1.5, 0.4, 1)",
        transform:
          `translate3d(calc(var(--px, 0px) * ${depth}), ` +
          `calc(var(--py, 0px) * ${depth}), 0) ` +
          `rotate(var(--kr, 0deg))`,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `rotate(${rotate}deg)`,
          animation: `polygon-float ${duration}s ease-in-out ${delay}s infinite`,
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,5 95,80 5,80" fill={color} />
        </svg>
      </div>
    </div>
  );
}
