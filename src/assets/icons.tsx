export const ArtemIcon = ({color, size, className}: {color: string, size: number, className: string}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={size} height={size} viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet">
      <g transform="rotate(45 512 512)">
        <rect x="152" y="152" width={size*18} height={size*18} rx="80" ry="80"
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

export const CandleIcon = ({color, size, className}: {color: string, size: number, className: string}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 10C95 20 105 20 100 30L100 110C100 115 95 120 90 120H110C105 120 100 115 100 110L100 30Z" fill="#8bc34a" stroke="#8bc34a" strokeWidth="2"/>
      <path d="M90 120H110C120 120 125 125 125 130V140C125 145 120 150 110 150H90C80 150 75 145 75 140V130C75 125 80 120 90 120Z" fill="#8bc34a" stroke="#8bc34a" strokeWidth="2"/>
      <path d="M100 10L100 0M120 20L130 10M80 20L70 10M140 40L150 30M60 40L50 30M160 70L170 60M40 70L30 60" stroke="#8bc34a" strokeWidth="2" strokeDasharray="5 5"/>
      <path d="M20 90C30 80 40 90 50 100C40 110 30 100 20 90Z" fill="#8bc34a" stroke="#8bc34a" strokeWidth="2"/>
      <path d="M30 110C40 100 50 110 60 120C50 130 40 120 30 110Z" fill="#8bc34a" stroke="#8bc34a" strokeWidth="2"/>
      <path d="M180 90C170 80 160 90 150 100C160 110 170 100 180 90Z" fill="#8bc34a" stroke="#8bc34a" strokeWidth="2"/>
      <path d="M170 110C160 100 150 110 140 120C150 130 160 120 170 110Z" fill="#8bc34a" stroke="#8bc34a" strokeWidth="2"/>
    </svg>
  )
}

export const MagnifyingGlassIcon = ({color, size, className}: {color: string, size: number, className: string}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}