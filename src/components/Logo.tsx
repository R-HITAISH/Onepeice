type LogoProps = {
  className?: string;
  variant?: 'full' | 'mark';
  height?: number;
  isNight?: boolean;
};

export function Logo({ className = '', variant = 'full', height = 40, isNight = false }: LogoProps) {
  const stroke = '#A67C34';
  const text = isNight ? '#F6F4EF' : '#141414';
  const dotFill = '#A67C34';

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 180 180"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ height, width: 'auto' }}
      >
        <g transform="translate(90, 90)">
          <circle cx="0" cy="0" r="40" fill="none" stroke={stroke} strokeWidth="3" pathLength={1} className="draw" />
          <path
            d="M 0 -40 L 34 -20 L 34 20 L 0 40 L -34 20 L -34 -20 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
            pathLength={1}
            className="draw"
          />
          <circle cx="0" cy="0" r="6" fill={dotFill} className="dot" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 500 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height, width: 'auto' }}
    >
      <g transform="translate(30, 50)">
        <circle cx="0" cy="0" r="22" fill="none" stroke={stroke} strokeWidth="2" />
        <path
          d="M 0 -22 L 19 -11 L 19 11 L 0 22 L -19 11 L -19 -11 Z"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />
        <circle cx="0" cy="0" r="3.5" fill={dotFill} />
      </g>
      <text
        x="75"
        y="62"
        fontFamily="Fraunces, Georgia, serif"
        fontSize="48"
        fontWeight="400"
        fill={text}
        letterSpacing="1"
      >
        ONEPEICE
      </text>
    </svg>
  );
}
