import { useLayoutEffect, useRef } from "react";

export function Polygon({
  size = 60,
  color = "rgba(255,255,255,0.15)",
  rotate = 0,
  depth = 1,
  floatDuration,
  floatDelay,
  style,
  className,
  flow = false,
  reverse = false,
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
  /** drift all the way across the section instead of bobbing in place */
  flow?: boolean;
  /** travel right-to-left rather than left-to-right */
  reverse?: boolean;
}) {
  const duration = floatDuration ?? (flow ? 26 : 5 + (size % 4));
  const delay =
    floatDelay ??
    (flow ? -duration * ((size % 13) / 13) : (size % 7) * -0.5);
  const ref = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Sync the drift phase to a global clock so shapes continue where they were across page changes.
  // The drift is a slow decorative movement, so it runs even with the OS "Reduce motion" setting
  // (same choice as the carousel arrows and page fade).
  useLayoutEffect(() => {
    const el = flow ? ref.current : innerRef.current;
    if (!el) return;
    const phase = (Date.now() / 1000) % duration;
    el.style.animationDelay = `${delay - phase}s`;
  }, [duration, delay, flow]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: size,
        willChange: "transform",
        transform: "translate3d(0, 0, 0)",
        ...(flow
          ? {
              left: 0,
              animation: `polygon-flow ${duration}s linear ${delay}s infinite`,
              animationDirection: reverse ? "reverse" : "normal",
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
          transform: `rotate(${rotate}deg)`,
          ...(flow
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
