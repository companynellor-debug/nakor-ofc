import logoAsset from '../../assets/nakor-logo.png';

interface NakorLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export function NakorLogo({ className = '', size = 32 }: NakorLogoProps) {
  return (
    <img
      src={logoAsset}
      alt="Nakor"
      width={size}
      height={size}
      className={`${className} transition-transform duration-300 hover:scale-105 object-contain`}
      style={{ width: size, height: size }}
    />
  );
}
