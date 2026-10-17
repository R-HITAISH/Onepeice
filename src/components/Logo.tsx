type LogoProps = {
  className?: string;
  variant?: 'full' | 'mark';
  height?: number;
};

export function Logo({ className = '', variant = 'full', height = 50 }: LogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 180 180"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ height, width: 'auto' }}
      >
        <g transform="translate(90, 90)">
          <circle cx="0" cy="0" r="40" fill="none" stroke="#a67c34" strokeWidth="3" pathLength={1} className="draw" />
          <path
            d="M 0 -40 L 34 -20 L 34 20 L 0 40 L -34 20 L -34 -20 Z"
            fill="none"
            stroke="#a67c34"
            strokeWidth="2.5"
            pathLength={1}
            className="draw"
          />
          <circle cx="0" cy="0" r="6" fill="#a67c34" className="dot" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 500 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height, width: 'auto' }}
    >
      <circle cx="50" cy="80" r="35" fill="none" stroke="#a67c34" strokeWidth="2.5" />
      <path
        d="M 50 50 L 70 62 L 70 98 L 50 110 L 30 98 L 30 62 Z"
        fill="none"
        stroke="#a67c34"
        strokeWidth="2"
      />
      <circle cx="50" cy="80" r="5" fill="#a67c34" />
      <text
        x="130"
        y="95"
        fontFamily="Impact, sans-serif"
        fontSize="62"
        fontWeight="900"
        fill="#f5f3f0"
        letterSpacing="2"
      >
        ONEPEICE
      </text>
    </svg>
  );
}
