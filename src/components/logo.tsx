export default function IntelliVaultLogo({ size = 24 }: { size?: number }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left bar — I */}
      <rect x="3" y="4" width="3.5" height="16" rx="1" fill="#5e6ad2" />
      {/* Right bar — V outer stroke */}
      <path
        d="M13 4 L17.5 16 L22 4"
        stroke="#5e6ad2"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Bridge — connecting I to V, acts as vault lock bar */}
      <rect
        x="3"
        y="10.25"
        width="9"
        height="2"
        rx="1"
        fill="#5e6ad2"
        opacity="0.5"
      />
    </svg>
  );
}
