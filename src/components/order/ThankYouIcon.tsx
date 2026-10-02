type ThankYouIconProps = {
  className?: string;
};

export const ThankYouIcon = ({ className }: ThankYouIconProps) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {/* Aba traseira do envelope */}
    <path d="M8 26 L32 8 L56 26" />

    {/* Cartão saindo do envelope */}
    <rect x="15" y="10" width="34" height="30" rx="2" className="fill-card" />
    <text
      x="32"
      y="23"
      textAnchor="middle"
      fontSize="7"
      fontWeight="700"
      fill="currentColor"
      stroke="none"
    >
      THANK
    </text>
    <text
      x="32"
      y="33"
      textAnchor="middle"
      fontSize="7"
      fontWeight="700"
      fill="currentColor"
      stroke="none"
    >
      YOU
    </text>

    {/* Frente do envelope */}
    <path d="M8 26 L8 58 Q8 60 10 60 L54 60 Q56 60 56 58 L56 26" />
    <path d="M8 26 L32 46 L56 26" />
  </svg>
);