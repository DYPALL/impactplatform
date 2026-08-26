import { useEffect, useRef } from "react";

const KICK_RADIUS = 120;
const KICK_STRENGTH = 70;

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let kicked = false;

    function onMove(e: PointerEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy) || 1;

        if (dist < KICK_RADIUS + rect.width / 2) {
          const force = (1 - dist / (KICK_RADIUS + rect.width / 2)) * KICK_STRENGTH;
          node.style.transitionDuration = "220ms";
          node.style.setProperty("--kx", `${((dx / dist) * force).toFixed(1)}px`);
          node.style.setProperty("--ky", `${((dy / dist) * force).toFixed(1)}px`);
          node.style.setProperty("--kr", `${((dx / dist) * force * 0.4).toFixed(1)}deg`);
          kicked = true;
        } else if (kicked) {
          kicked = false;
          node.style.transitionDuration = "1100ms";
          node.style.setProperty("--kx", "0px");
          node.style.setProperty("--ky", "0px");
          node.style.setProperty("--kr", "0deg");
        }
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

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
          `translate3d(calc(var(--px, 0px) * ${depth} + var(--kx, 0px)), ` +
          `calc(var(--py, 0px) * ${depth} + var(--ky, 0px)), 0) ` +
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
