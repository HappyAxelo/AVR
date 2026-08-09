interface ImagePlaceholderProps {
  className?: string
  /** Varies the terrace pattern so a gallery does not look repetitive. */
  seed?: number
  label?: string
}

/**
 * Branded stand-in shown wherever a real photo has not been uploaded yet.
 * Deliberately obvious: it must never be mistaken for a real AVR photograph.
 */
export default function ImagePlaceholder({
  className,
  seed = 0,
  label = 'Photograph to be supplied',
}: ImagePlaceholderProps) {
  const shift = (seed % 3) * 18
  const tone = ['#123a2a', '#0e2f21', '#16402e'][seed % 3]

  return (
    <div className={`relative overflow-hidden bg-terrace ${className ?? ''}`}>
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label={label}
      >
        <rect width="400" height="260" fill={tone} />
        <path
          d={`M0 ${120 + shift} C 90 ${96 + shift} 150 ${140 + shift} 230 ${118 + shift} C 300 ${
            100 + shift
          } 350 ${132 + shift} 400 ${112 + shift} L400 260 L0 260 Z`}
          fill="#0a2419"
        />
        <path
          d={`M0 ${170 + shift} C 100 ${148 + shift} 170 ${190 + shift} 250 ${168 + shift} C 320 ${
            150 + shift
          } 360 ${180 + shift} 400 ${162 + shift} L400 260 L0 260 Z`}
          fill="#071d14"
        />
        <path
          d={`M0 ${132 + shift} C 92 ${108 + shift} 152 ${152 + shift} 232 ${130 + shift}`}
          fill="none"
          stroke="#C6F135"
          strokeOpacity="0.14"
          strokeWidth="1.5"
        />
        <circle cx="330" cy={62 + shift / 2} r="3.5" fill="#C6F135" opacity="0.5" />
      </svg>
      <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] font-medium uppercase tracking-wider text-paper/60">
        {label}
      </span>
    </div>
  )
}
