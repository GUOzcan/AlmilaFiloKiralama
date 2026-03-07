// SVG recreation of the Almila Filo Kiralama logo
// Red geometric A letters with white serif accents + "FİLO KİRALAMA" subtitle

export function AlmilaLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Letter A (left) ── */}
      {/* Red outer triangle */}
      <polygon points="52,20 10,130 94,130" fill="#CC1A1A" />
      {/* Dark inner cutout */}
      <polygon points="52,72 30,130 74,130" fill="#080808" />
      {/* White left serif */}
      <rect x="4" y="124" width="22" height="12" rx="1" fill="#E0E0E0" />
      {/* White right serif */}
      <rect x="80" y="124" width="22" height="12" rx="1" fill="#E0E0E0" />

      {/* ── Letter L ── */}
      <rect x="108" y="28" width="18" height="102" rx="2" fill="#CC1A1A" />
      <rect x="108" y="112" width="46" height="18" rx="2" fill="#CC1A1A" />

      {/* ── Letter M ── */}
      <rect x="168" y="28" width="18" height="102" rx="2" fill="#CC1A1A" />
      <rect x="246" y="28" width="18" height="102" rx="2" fill="#CC1A1A" />
      {/* M diagonals */}
      <polygon points="168,28 186,28 216,78 186,130 168,130" fill="#CC1A1A" />
      <polygon points="264,28 246,28 216,78 246,130 264,130" fill="#CC1A1A" />
      <rect x="207" y="28" width="18" height="60" rx="2" fill="#CC1A1A" />

      {/* ── Letter İ (with dot) ── */}
      <rect x="282" y="28" width="18" height="102" rx="2" fill="#CC1A1A" />
      <rect x="282" y="14" width="18" height="8" rx="4" fill="#CC1A1A" />

      {/* ── Letter L ── */}
      <rect x="314" y="28" width="18" height="102" rx="2" fill="#CC1A1A" />
      <rect x="314" y="112" width="46" height="18" rx="2" fill="#CC1A1A" />

      {/* ── Letter A (right) ── */}
      {/* Red outer triangle */}
      <polygon points="468,20 426,130 510,130" fill="#CC1A1A" />
      {/* Dark inner cutout */}
      <polygon points="468,72 446,130 490,130" fill="#080808" />
      {/* White left serif */}
      <rect x="420" y="124" width="22" height="12" rx="1" fill="#E0E0E0" />
      {/* White right serif */}
      <rect x="496" y="124" width="22" height="12" rx="1" fill="#E0E0E0" />

      {/* ── FİLO KİRALAMA subtitle ── */}
      <text
        x="260"
        y="178"
        textAnchor="middle"
        fill="#CCCCCC"
        fontSize="22"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontWeight="300"
        letterSpacing="10"
      >
        FİLO KİRALAMA
      </text>
    </svg>
  );
}
