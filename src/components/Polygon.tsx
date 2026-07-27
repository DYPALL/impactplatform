export function Polygon({
  size = 60,
  color = "rgba(255,255,255,0.15)",
  rotate = 0,
  style,
}: {
  size?: number;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="50,5 95,80 5,80" fill={color} />
      </svg>
    </div>
  );
}
