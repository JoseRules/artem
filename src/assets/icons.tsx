export const ArtemIcon = ({ color, size, className }: { color: string, size: number, className: string }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg"
      width={size} height={size} viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet">
      <g transform="rotate(45 512 512)">
        <rect x="152" y="152" width={size * 18} height={size * 18} rx="80" ry="80"
          fill="none" stroke={color} strokeWidth="5" />
      </g>
      <text x="512" y="570" textAnchor="middle"
        fontFamily="Montserrat, Arial, Helvetica, sans-serif"
        fontWeight="600" fontSize="180" letterSpacing="10"
        fill={color}>
        ARTEM
      </text>
    </svg>
  );
};

export const MagnifyingGlassIcon = ({ color, size, className }: { color: string, size: number, className: string }) => {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const RightArrowIcon = ({ size, className }: { size: number, className: string }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}