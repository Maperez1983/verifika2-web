export default function HeroIllustration({
  className = "w-full h-auto",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 840 520"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="v2g" x1="96" y1="64" x2="744" y2="456" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B1D33" stopOpacity="0.08" />
          <stop offset="0.55" stopColor="#F2C14E" stopOpacity="0.22" />
          <stop offset="1" stopColor="#0B1D33" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id="v2glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(606 168) rotate(125) scale(210 220)">
          <stop stopColor="#F2C14E" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F2C14E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="v2glow2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(252 376) rotate(25) scale(260 240)">
          <stop stopColor="#0B1D33" stopOpacity="0.22" />
          <stop offset="1" stopColor="#0B1D33" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect x="62" y="54" width="716" height="412" rx="54" fill="url(#v2g)" />
      <circle cx="608" cy="170" r="178" fill="url(#v2glow)" filter="url(#soft)" />
      <circle cx="260" cy="380" r="206" fill="url(#v2glow2)" filter="url(#soft)" />

      <g opacity="0.95">
        <path
          d="M236 358V220c0-8.8 7.2-16 16-16h86c8.8 0 16 7.2 16 16v138"
          stroke="#0B1D33"
          strokeOpacity="0.38"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M210 358h220c10.5 0 19 8.5 19 19v8c0 10.5-8.5 19-19 19H210c-10.5 0-19-8.5-19-19v-8c0-10.5 8.5-19 19-19Z"
          fill="#ffffff"
          fillOpacity="0.62"
          stroke="#0B1D33"
          strokeOpacity="0.18"
        />
        <path
          d="M286 250h54M286 286h54M286 322h54"
          stroke="#0B1D33"
          strokeOpacity="0.28"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <g>
        <path
          d="M564 238c0-37.6 30.4-68 68-68h32c37.6 0 68 30.4 68 68v28c0 79.5-51.2 122-84 139.8a31.8 31.8 0 0 1-30 0C585.2 388 534 345.5 534 266v-28Z"
          fill="#ffffff"
          fillOpacity="0.72"
        />
        <path
          d="M564 238c0-37.6 30.4-68 68-68h32c37.6 0 68 30.4 68 68v28c0 79.5-51.2 122-84 139.8a31.8 31.8 0 0 1-30 0C585.2 388 534 345.5 534 266v-28Z"
          stroke="#0B1D33"
          strokeOpacity="0.22"
          strokeWidth="10"
        />
        <path
          d="M600 280l30 30 68-78"
          stroke="#0B1D33"
          strokeOpacity="0.62"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M608 176h80"
          stroke="#F2C14E"
          strokeOpacity="0.95"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <g opacity="0.45">
        <path
          d="M128 152h168M128 196h124M128 240h92"
          stroke="#0B1D33"
          strokeOpacity="0.22"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M476 404h200M476 360h140"
          stroke="#0B1D33"
          strokeOpacity="0.22"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

