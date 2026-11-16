import { useLayoutEffect, useRef } from "react";

export type PolygonDirection = "right" | "left" | "up" | "down";

export function Polygon({
  size = 60,
  color = "rgba(255,255,255,0.15)",
  rotate = 0,
  depth = 1,
  floatDuration,
  floatDelay,
  style,
  className,
  direction,
  spin,
}: {
  size?: number;
  color?: string;
  rotate?: number;
  /** how strongly this shape reacts to the pointer (0 = static, 2 = very reactive) */
  depth?: number;
  floatDuration?: number;
  floatDelay?: number;
  style?: React.CSSProperties;
  className?: string;
  /** drift all the way across the section this way instead of bobbing in place */
  direction?: PolygonDirection;
  /** full turns per crossing; negative spins the other way */
  spin?: number;
}) {
  const crossing = Boolean(direction);
  const duration = floatDuration ?? (crossing ? 26 : 5 + (size % 4));
  const delay =
    floatDelay ??
    (crossing ? -duration * ((size % 13) / 13) : (size % 7) * -0.5);
  const ref = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const vertical = direction === "up" || direction === "down";
  const turnTime = spin ? duration / Math.abs(spin) : 0;

  // Sync the drift phase to a global clock so shapes continue where they were across page changes.
  // The drift is a slow decorative movement, so it runs even with the OS "Reduce motion" setting
  // (same choice as the carousel arrows and page fade).
  useLayoutEffect(() => {
    if (!direction || !ref.current) return;
    const phase = (Date.now() / 1000) % duration;
    ref.current.style.animationDelay = `${delay - phase}s`;
  }, [duration, delay, direction]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: size,
        willChange: vertical ? "top" : "transform",
        transform: "translate3d(0, 0, 0)",
        ...(direction
          ? vertical
            ? {
                animation: `polygon-flow-y ${duration}s linear ${delay}s infinite`,
                animationDirection: direction === "up" ? "reverse" : "normal",
              }
            : {
                left: 0,
                animation: `polygon-flow-x ${duration}s linear ${delay}s infinite`,
                animationDirection: direction === "left" ? "reverse" : "normal",
              }
          : {}),
        ...style,
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: "100%",
          height: "100%",
          rotate: `${rotate}deg`,
          ...(spin
            ? {
                animation: `polygon-spin ${turnTime}s linear ${delay}s infinite`,
                animationDirection: spin < 0 ? "reverse" : "normal",
              }
            : direction
              ? {}
              : {
                  animation: `polygon-float ${duration}s ease-in-out ${delay}s infinite`,
                }),
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,5 95,80 5,80" fill={color} />
        </svg>
      </div>
    </div>
  );
}
