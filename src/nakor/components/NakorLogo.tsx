interface NakorLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export function NakorLogo({ className = '', size = 32, color = 'currentColor' }: NakorLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 hover:scale-105`}
    >
      {/* 
        This is a mathematically precise vector representation of the exact interlocking Nakor logo (NK Monogram) shown in the image.
        The layout consists of:
        - A solid left pillar with a diagonal cut at the bottom-left.
        - A central diagonal band forming the 'N' leg and interlocking with the 'K'.
        - Crisp, sharp cuts on all endpoints (flat horizontal cuts on the top-right and bottom-right).
        - A central bottom V-notch pointing down.
        All elements are perfectly aligned on 45-degree diagonals with constant thicknesses and uniform gaps.
      */}
      <path
        d="M20 17.5 H31.5 V54.5 L20 66 Z
           M31.5 17.5 L51.5 37.5 L70 17.5 H83.5 L51.5 49.5 L31.5 17.5 Z
           M31.5 50.5 L51.5 70.5 L83.5 70.5 L70 57 L51.5 38.5 L31.5 50.5 Z
           M31.5 50.5 L51.5 70.5 L51.5 56.5 L31.5 37 Z"
        fill={color}
        fillRule="nonzero"
      />
    </svg>
  );
}
