interface ChakraSymbolProps {
  color: string;
  isSelected: boolean;
}

// Root Chakra - 4-petaled lotus with square
export function RootSymbol({ color, isSelected }: ChakraSymbolProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 4 petals */}
      <circle cx="50" cy="20" r="12" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
      <circle cx="80" cy="50" r="12" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
      <circle cx="50" cy="80" r="12" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
      <circle cx="20" cy="50" r="12" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
      {/* Center square */}
      <rect x="35" y="35" width="30" height="30" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="25" fill="none" stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
    </svg>
  );
}

// Sacral Chakra - 6-petaled lotus with crescent moon
export function SacralSymbol({ color, isSelected }: ChakraSymbolProps) {
  const petals = 6;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 6 petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * 360) / petals - 90;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * 30;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * 30;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="10"
            fill={isSelected ? color : 'transparent'}
            stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Crescent moon */}
      <path
        d="M 50 35 A 15 15 0 1 1 50 65 A 12 12 0 1 0 50 35"
        fill={isSelected ? color : 'transparent'}
        stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="25" fill="none" stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
    </svg>
  );
}

// Solar Plexus Chakra - 10-petaled lotus with downward triangle
export function SolarPlexusSymbol({ color, isSelected }: ChakraSymbolProps) {
  const petals = 10;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 10 petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * 360) / petals - 90;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * 32;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * 32;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="8"
            fill={isSelected ? color : 'transparent'}
            stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Downward triangle */}
      <path
        d="M 50 35 L 65 60 L 35 60 Z"
        fill={isSelected ? color : 'transparent'}
        stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
        strokeWidth="2.5"
      />
      <circle cx="50" cy="50" r="28" fill="none" stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
    </svg>
  );
}

// Heart Chakra - 12-petaled lotus with Star of David (two triangles)
export function HeartSymbol({ color, isSelected }: ChakraSymbolProps) {
  const petals = 12;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 12 petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * 360) / petals - 90;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * 32;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * 32;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="7"
            fill={isSelected ? color : 'transparent'}
            stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Star of David */}
      <path
        d="M 50 35 L 65 60 L 35 60 Z"
        fill={isSelected ? color : 'transparent'}
        stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
        strokeWidth="2"
      />
      <path
        d="M 50 65 L 35 40 L 65 40 Z"
        fill={isSelected ? color : 'transparent'}
        stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="28" fill="none" stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
    </svg>
  );
}

// Throat Chakra - 16-petaled lotus with circle
export function ThroatSymbol({ color, isSelected }: ChakraSymbolProps) {
  const petals = 16;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 16 petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * 360) / petals - 90;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * 33;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * 33;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="6"
            fill={isSelected ? color : 'transparent'}
            stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Circle with downward triangle */}
      <circle cx="50" cy="50" r="18" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
      <path
        d="M 50 40 L 58 55 L 42 55 Z"
        fill={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
        strokeWidth="0"
      />
      <circle cx="50" cy="50" r="30" fill="none" stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
    </svg>
  );
}

// Third Eye Chakra - 2-petaled lotus with Om symbol (simplified as circle with arc)
export function ThirdEyeSymbol({ color, isSelected }: ChakraSymbolProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 2 petals (left and right) */}
      <circle cx="25" cy="50" r="15" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
      <circle cx="75" cy="50" r="15" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
      {/* Om symbol simplified */}
      <circle cx="50" cy="50" r="20" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" />
      <circle cx="50" cy="45" r="8" fill={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} />
      <path
        d="M 50 53 Q 58 58 58 65"
        fill="none"
        stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Crown Chakra - 1000-petaled lotus (simplified as many small circles in concentric pattern)
export function CrownSymbol({ color, isSelected }: ChakraSymbolProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Multiple concentric circles representing 1000 petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12 - 90;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * 35;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * 35;
        return (
          <circle
            key={`outer-${i}`}
            cx={x}
            cy={y}
            r="5"
            fill={isSelected ? color : 'transparent'}
            stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
            strokeWidth="1.5"
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8 - 90;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * 22;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * 22;
        return (
          <circle
            key={`middle-${i}`}
            cx={x}
            cy={y}
            r="4"
            fill={isSelected ? color : 'transparent'}
            stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Center lotus */}
      <circle cx="50" cy="50" r="12" fill={isSelected ? color : 'transparent'} stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="32" fill="none" stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
    </svg>
  );
}
