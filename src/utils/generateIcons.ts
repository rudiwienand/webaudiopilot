// Generate PNG icons from SVG for PWA installation
export async function generateAppIcons() {
  const sizes = [192, 512];
  
  const svgContent = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="256" cy="256" r="200" stroke="white" stroke-width="3" fill="none" opacity="0.3"/>
      <circle cx="256" cy="256" r="180" stroke="white" stroke-width="2" fill="none" opacity="0.2"/>
      <circle cx="256" cy="106" r="12" fill="#E53E3E" filter="url(#glow)"/>
      <circle cx="370" cy="162" r="12" fill="#DD6B20" filter="url(#glow)"/>
      <circle cx="398" cy="286" r="12" fill="#D69E2E" filter="url(#glow)"/>
      <circle cx="340" cy="390" r="12" fill="#38A169" filter="url(#glow)"/>
      <circle cx="172" cy="390" r="12" fill="#3182CE" filter="url(#glow)"/>
      <circle cx="114" cy="286" r="12" fill="#5A67D8" filter="url(#glow)"/>
      <circle cx="142" cy="162" r="12" fill="#805AD5" filter="url(#glow)"/>
      <g transform="translate(256, 256)">
        <path d="M 0,-60 L 14,-20 L 54,-35 L 20,-5 L 42,28 L 0,8 L -42,28 L -20,-5 L -54,-35 L -14,-20 Z" 
              fill="white" opacity="0.9" filter="url(#glow)"/>
        <circle cx="0" cy="0" r="18" fill="white" opacity="0.95"/>
        <circle cx="0" cy="0" r="12" fill="#7c3aed" opacity="0.8"/>
      </g>
      <circle cx="256" cy="256" r="100" stroke="white" stroke-width="1" fill="none" opacity="0.15" stroke-dasharray="5,5"/>
      <circle cx="256" cy="256" r="140" stroke="white" stroke-width="1" fill="none" opacity="0.1" stroke-dasharray="8,8"/>
    </svg>
  `;

  for (const size of sizes) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) continue;

      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      await new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(url);
          
          // Convert to blob and create download link
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.download = `icon-${size}.png`;
              link.href = URL.createObjectURL(blob);
              console.log(`✅ Generated icon-${size}.png - Download ready`);
            }
            resolve(null);
          }, 'image/png');
        };
        img.onerror = reject;
        img.src = url;
      });
    } catch (error) {
      console.error(`Failed to generate ${size}x${size} icon:`, error);
    }
  }
}

// Auto-generate icons on app load in development
if (import.meta.env.DEV) {
  generateAppIcons();
}
