interface DroneSvgProps {
  className?: string
  animateRotors?: boolean
}

/**
 * Stylised agricultural quad drone, side-on, with tank and spray booms.
 * Rotor discs blur-spin via CSS when animateRotors is true.
 */
export default function DroneSvg({ className, animateRotors = true }: DroneSvgProps) {
  return (
    <svg
      viewBox="0 0 320 140"
      className={className}
      role="img"
      aria-label="AVR agricultural spray drone"
    >
      <defs>
        <linearGradient id="droneBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d3524" />
          <stop offset="1" stopColor="#072317" />
        </linearGradient>
      </defs>

      {/* rotor discs */}
      {[52, 268].map((cx) => (
        <g key={cx}>
          <ellipse
            cx={cx}
            cy={34}
            rx={44}
            ry={5}
            fill="#C6F135"
            opacity={0.35}
            className={animateRotors ? 'rotor-disc' : undefined}
          />
          <ellipse cx={cx} cy={34} rx={44} ry={5} fill="none" stroke="#C6F135" strokeOpacity={0.5} strokeWidth={1} />
          {/* mast */}
          <rect x={cx - 2.5} y={36} width={5} height={16} rx={2} fill="#0b2e1f" />
        </g>
      ))}

      {/* arms */}
      <path d="M52 52 L136 72 L184 72 L268 52" fill="none" stroke="#0b2e1f" strokeWidth={9} strokeLinecap="round" />

      {/* body */}
      <rect x={120} y={58} width={80} height={30} rx={12} fill="url(#droneBody)" />
      {/* accent light */}
      <circle cx={160} cy={73} r={4} fill="#C6F135" />

      {/* tank */}
      <rect x={134} y={86} width={52} height={24} rx={9} fill="#082718" stroke="#0d3524" strokeWidth={2} />

      {/* spray boom */}
      <path d="M96 112 L224 112" stroke="#0b2e1f" strokeWidth={5} strokeLinecap="round" />
      <path d="M160 110 L160 100" stroke="#0b2e1f" strokeWidth={4} />
      {/* nozzles */}
      {[104, 160, 216].map((x) => (
        <rect key={x} x={x - 3} y={112} width={6} height={8} rx={2} fill="#C6F135" opacity={0.9} />
      ))}
    </svg>
  )
}
