import { useEffect, useRef, useState } from 'react';

interface Track {
  id: number;
  name: string;
  volume: number;
  isPlaying: boolean;
}

interface MandalaControllerProps {
  tracks: Track[];
  onVolumeChange: (trackId: number, volume: number) => void;
  chakraColor: string;
  chakraId?: number;
  controllerPosition?: { x: number; y: number };
  onControllerMove?: (x: number, y: number) => void;
  isAutoMixing: boolean;
}

export function MandalaController({
  tracks,
  onVolumeChange,
  chakraColor,
  chakraId,
  controllerPosition,
  onControllerMove,
  isAutoMixing
}: MandalaControllerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Default position: top of outer circle (absolute zero volume)
  const getDefaultPosition = () => ({
    x: 0.5,
    y: 0.0 // Top of outer circle at absolute edge - MUST BE 0.0 for complete silence
  });
  
  const [localControllerPos, setLocalControllerPos] = useState(getDefaultPosition);
  const prevVolumesRef = useRef<Map<number, number>>(new Map());
  
  const size = 600; // Canvas size
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.45; // Outer boundary circle
  const innerRadius = size * 0.38; // Inner active zone
  const starRadius = innerRadius * 0.85; // Star points radius

  // Function to draw chakra symbol at controller position
  const drawChakraSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, id?: number) => {
    ctx.save();
    ctx.translate(x, y);
    
    const symbolSize = size;
    const chakraId = id || 1;

    // Draw colored background circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, symbolSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw white outline circle
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, symbolSize, 0, Math.PI * 2);
    ctx.stroke();

    // Draw chakra-specific symbol in white
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 2;

    switch(chakraId) {
      case 1: // Root - 4 petals with square
        // 4 petals
        [-90, 0, 90, 180].forEach(angle => {
          const rad = angle * Math.PI / 180;
          const px = Math.cos(rad) * symbolSize * 0.6;
          const py = Math.sin(rad) * symbolSize * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, symbolSize * 0.3, 0, Math.PI * 2);
          ctx.stroke();
        });
        // Center square
        const squareSize = symbolSize * 0.5;
        ctx.strokeRect(-squareSize/2, -squareSize/2, squareSize, squareSize);
        break;

      case 2: // Sacral - 6 petals with crescent
        // 6 petals
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60 - 90) * Math.PI / 180;
          const px = Math.cos(angle) * symbolSize * 0.6;
          const py = Math.sin(angle) * symbolSize * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, symbolSize * 0.25, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Crescent moon
        ctx.beginPath();
        ctx.arc(0, 0, symbolSize * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(symbolSize * 0.1, 0, symbolSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        break;

      case 3: // Solar Plexus - 10 petals with triangle
        // 10 petals
        for (let i = 0; i < 10; i++) {
          const angle = (i * 36 - 90) * Math.PI / 180;
          const px = Math.cos(angle) * symbolSize * 0.65;
          const py = Math.sin(angle) * symbolSize * 0.65;
          ctx.beginPath();
          ctx.arc(px, py, symbolSize * 0.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Downward triangle
        ctx.beginPath();
        ctx.moveTo(0, -symbolSize * 0.3);
        ctx.lineTo(symbolSize * 0.3, symbolSize * 0.2);
        ctx.lineTo(-symbolSize * 0.3, symbolSize * 0.2);
        ctx.closePath();
        ctx.stroke();
        break;

      case 4: // Heart - 12 petals with Star of David
        // 12 petals
        for (let i = 0; i < 12; i++) {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const px = Math.cos(angle) * symbolSize * 0.65;
          const py = Math.sin(angle) * symbolSize * 0.65;
          ctx.beginPath();
          ctx.arc(px, py, symbolSize * 0.18, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Star of David - upward triangle
        ctx.beginPath();
        ctx.moveTo(0, -symbolSize * 0.3);
        ctx.lineTo(symbolSize * 0.3, symbolSize * 0.2);
        ctx.lineTo(-symbolSize * 0.3, symbolSize * 0.2);
        ctx.closePath();
        ctx.stroke();
        // Downward triangle
        ctx.beginPath();
        ctx.moveTo(0, symbolSize * 0.3);
        ctx.lineTo(symbolSize * 0.3, -symbolSize * 0.2);
        ctx.lineTo(-symbolSize * 0.3, -symbolSize * 0.2);
        ctx.closePath();
        ctx.stroke();
        break;

      case 5: // Throat - 16 petals with circle
        // 16 petals
        for (let i = 0; i < 16; i++) {
          const angle = (i * 22.5 - 90) * Math.PI / 180;
          const px = Math.cos(angle) * symbolSize * 0.7;
          const py = Math.sin(angle) * symbolSize * 0.7;
          ctx.beginPath();
          ctx.arc(px, py, symbolSize * 0.15, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Inner circle with triangle
        ctx.beginPath();
        ctx.arc(0, 0, symbolSize * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -symbolSize * 0.2);
        ctx.lineTo(symbolSize * 0.15, symbolSize * 0.1);
        ctx.lineTo(-symbolSize * 0.15, symbolSize * 0.1);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        break;

      case 6: // Third Eye - 2 petals with Om
        // 2 large petals
        ctx.beginPath();
        ctx.arc(-symbolSize * 0.5, 0, symbolSize * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(symbolSize * 0.5, 0, symbolSize * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        // Om symbol simplified - circle
        ctx.beginPath();
        ctx.arc(0, 0, symbolSize * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -symbolSize * 0.1, symbolSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 7: // Crown - 1000 petals (simplified concentric)
        // Outer ring of petals
        for (let i = 0; i < 12; i++) {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const px = Math.cos(angle) * symbolSize * 0.7;
          const py = Math.sin(angle) * symbolSize * 0.7;
          ctx.beginPath();
          ctx.arc(px, py, symbolSize * 0.13, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Middle ring
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45 - 90) * Math.PI / 180;
          const px = Math.cos(angle) * symbolSize * 0.45;
          const py = Math.sin(angle) * symbolSize * 0.45;
          ctx.beginPath();
          ctx.arc(px, py, symbolSize * 0.1, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Center lotus
        ctx.beginPath();
        ctx.arc(0, 0, symbolSize * 0.25, 0, Math.PI * 2);
        ctx.stroke();
        break;

      default:
        // Default - simple circle
        ctx.beginPath();
        ctx.arc(0, 0, symbolSize * 0.5, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
  };

  // Use external position if provided (for auto-mix), otherwise use local
  const currentPos = controllerPosition || localControllerPos;

  // Calculate 9 points of the star (evenly distributed)
  const getStarPoints = () => {
    const points: { x: number; y: number; trackId: number; name: string }[] = [];
    for (let i = 0; i < 9; i++) {
      const angle = (i * (360 / 9) - 90) * (Math.PI / 180); // Start from top
      points.push({
        x: centerX + starRadius * Math.cos(angle),
        y: centerY + starRadius * Math.sin(angle),
        trackId: i + 1,
        name: `Track ${i + 1}`
      });
    }
    return points;
  };

  const starPoints = getStarPoints();

  // Calculate distance and volume for each track
  const calculateVolumes = () => {
    const controllerX = centerX + (currentPos.x - 0.5) * outerRadius * 2;
    const controllerY = centerY + (currentPos.y - 0.5) * outerRadius * 2;

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(
      Math.pow(controllerX - centerX, 2) + Math.pow(controllerY - centerY, 2)
    );

    // At or beyond outer circle = 0 volume for ALL tracks
    if (distanceFromCenter >= outerRadius) {
      return starPoints.map(point => ({
        trackId: point.trackId,
        volume: 0
      }));
    }

    // Calculate distances to all star points
    const distances = starPoints.map(point => {
      const dx = controllerX - point.x;
      const dy = controllerY - point.y;
      return {
        trackId: point.trackId,
        distance: Math.sqrt(dx * dx + dy * dy)
      };
    });

    // PURE DISTANCE-BASED CALCULATION - NO THRESHOLDS, COMPLETELY SMOOTH
    
    // Step 1: Calculate inverse distances (closer = higher value)
    const inverseDistances = distances.map(d => ({
      trackId: d.trackId,
      // Use power of 3 for stronger proximity effect
      inverseDistance: 1 / Math.pow(d.distance + 5, 3)
    }));
    
    // Step 2: Calculate sum of all inverse distances
    const sumInverseDistances = inverseDistances.reduce((sum, item) => sum + item.inverseDistance, 0);
    
    // Step 3: Calculate "total available volume" based on distance from outer edge
    // This creates smooth fade to 0 at the outer edge and reaches max volume near star points
    const edgeProximity = 1 - (distanceFromCenter / outerRadius); // 0 at edge, 1 at center
    const baseAvailableVolume = 80 * edgeProximity; // Smoothly scales from 0 to 80
    
    // Step 4: Distribute volume to each track based on proximity
    const rawVolumes = inverseDistances.map(item => {
      // Each track gets a weighted share based on inverse distance
      const weightedShare = item.inverseDistance / sumInverseDistances;
      return {
        trackId: item.trackId,
        rawVolume: baseAvailableVolume * weightedShare,
        weight: weightedShare
      };
    });
    
    // Step 5: Apply "solo boost" when very close to a star point
    // This smoothly transitions to 80% on exact star point
    const closestDistance = Math.min(...distances.map(d => d.distance));
    const closestTrack = distances.find(d => d.distance === closestDistance);
    
    return rawVolumes.map(item => {
      let finalVolume = item.rawVolume;
      
      // If this is the closest track and we're very close to it
      if (closestTrack && item.trackId === closestTrack.trackId && closestDistance < 30) {
        // Smooth blend factor: 0 at 30px away, 1 at 0px (on the point)
        const soloBlend = 1 - (closestDistance / 30);
        
        // Blend between weighted volume and 80% solo
        const soloVolume = 80;
        finalVolume = item.rawVolume * (1 - soloBlend) + soloVolume * soloBlend;
        
        // Apply solo suppression to other tracks
        const otherTracksSuppression = soloBlend * 0.9; // 90% suppression at star point
        if (item.trackId !== closestTrack.trackId) {
          finalVolume = item.rawVolume * (1 - otherTracksSuppression);
        }
      }
      
      return {
        trackId: item.trackId,
        volume: Math.round(Math.max(0, Math.min(80, finalVolume)))
      };
    });
  };

  // Update volumes whenever controller position changes
  useEffect(() => {
    const volumes = calculateVolumes();
    volumes.forEach(({ trackId, volume }) => {
      const track = tracks.find(t => t.id === trackId);
      if (track && track.volume !== volume) {
        onVolumeChange(trackId, volume);
      }
    });
  }, [currentPos.x, currentPos.y]);

  // Draw the mandala
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: false,
      desynchronized: false // Ensure synchronized rendering
    });
    if (!ctx) return;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas completely - no artifacts
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, size, size);

    // Draw outer circle with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
    gradient.addColorStop(0, `${chakraColor}15`);
    gradient.addColorStop(1, `${chakraColor}05`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw outer circle border
    ctx.strokeStyle = `${chakraColor}80`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw outer glow
    ctx.strokeStyle = `${chakraColor}30`;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // Draw inner circle border (more prominent)
    ctx.strokeStyle = `${chakraColor}A0`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle glow
    ctx.strokeStyle = `${chakraColor}40`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 3, 0, Math.PI * 2);
    ctx.stroke();

    // Draw inner sacred geometry circles
    ctx.strokeStyle = `${chakraColor}40`;
    ctx.lineWidth = 2;
    [0.3, 0.5, 0.7].forEach(ratio => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw trippy sacred geometry patterns
    // 1. Flower of Life pattern - circles at each star point
    ctx.strokeStyle = `${chakraColor}30`;
    ctx.lineWidth = 1.5;
    starPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, innerRadius * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 2. Metatron's Cube - connect all points to all other points
    ctx.strokeStyle = `${chakraColor}13`; // Reduced by 40% (was 20)
    ctx.lineWidth = 1;
    starPoints.forEach((point1, i) => {
      starPoints.forEach((point2, j) => {
        if (i < j) {
          ctx.beginPath();
          ctx.moveTo(point1.x, point1.y);
          ctx.lineTo(point2.x, point2.y);
          ctx.stroke();
        }
      });
    });

    // 3. Spiral patterns from center
    ctx.strokeStyle = `${chakraColor}12`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 9; i++) {
      const angle = (i * (360 / 9)) * (Math.PI / 180);
      ctx.beginPath();
      for (let r = 0; r <= innerRadius; r += 10) {
        const spiralAngle = angle + (r / innerRadius) * Math.PI * 2;
        const x = centerX + r * Math.cos(spiralAngle);
        const y = centerY + r * Math.sin(spiralAngle);
        if (r === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // 4. Inner star - smaller version
    const innerStarRadius = starRadius * 0.5;
    const innerStarPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const angle = (i * (360 / 9) - 90) * (Math.PI / 180);
      innerStarPoints.push({
        x: centerX + innerStarRadius * Math.cos(angle),
        y: centerY + innerStarRadius * Math.sin(angle)
      });
    }
    ctx.strokeStyle = `${chakraColor}40`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    innerStarPoints.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.stroke();

    // 5. Connect inner star to outer star
    ctx.strokeStyle = `${chakraColor}0D`; // Reduced by 40% (was 15)
    ctx.lineWidth = 0.5;
    innerStarPoints.forEach((innerPoint, i) => {
      const outerPoint = starPoints[i];
      ctx.beginPath();
      ctx.moveTo(innerPoint.x, innerPoint.y);
      ctx.lineTo(outerPoint.x, outerPoint.y);
      ctx.stroke();
    });

    // Draw 9-pointed star
    ctx.strokeStyle = `${chakraColor}40`; // Reduced from 60 to 40
    ctx.lineWidth = 2;
    ctx.beginPath();
    starPoints.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.stroke();

    // ALWAYS connect all star points to each other (permanent connections)
    ctx.strokeStyle = `${chakraColor}16`; // Reduced by 40% (was 25)
    ctx.lineWidth = 1;
    starPoints.forEach((point1, i) => {
      starPoints.forEach((point2, j) => {
        if (i < j) {
          ctx.beginPath();
          ctx.moveTo(point1.x, point1.y);
          ctx.lineTo(point2.x, point2.y);
          ctx.stroke();
        }
      });
    });

    // Draw star inner connections (sacred geometry) - secondary pattern
    ctx.strokeStyle = `${chakraColor}13`; // Reduced by 40% (was 20)
    ctx.lineWidth = 0.8;
    starPoints.forEach((point, i) => {
      const nextPoint = starPoints[(i + 3) % 9]; // Connect every 3rd point
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();
    });

    // Draw track points and labels
    const volumes = calculateVolumes();
    
    // Calculate controller position first for distance calculations
    const controllerX = centerX + (currentPos.x - 0.5) * outerRadius * 2;
    const controllerY = centerY + (currentPos.y - 0.5) * outerRadius * 2;
    
    // Calculate distance from center for global size boost
    const controllerDistanceFromCenter = Math.sqrt(
      Math.pow(controllerX - centerX, 2) + Math.pow(controllerY - centerY, 2)
    );
    const innermostCircleRadius = innerRadius * 0.3; // The innermost concentric circle
    
    // Calculate global size boost when cursor is inside innermost circle
    let globalSizeBoost = 0;
    if (controllerDistanceFromCenter < innermostCircleRadius) {
      // 0 at innermost circle edge, 1 at center
      globalSizeBoost = 1 - (controllerDistanceFromCenter / innermostCircleRadius);
    }
    
    // Calculate distances from controller to all points for proximity-based sizing
    const pointDistances = starPoints.map(point => {
      const dx = controllerX - point.x;
      const dy = controllerY - point.y;
      return Math.sqrt(dx * dx + dy * dy);
    });
    const maxDistance = Math.max(...pointDistances);
    
    starPoints.forEach((point, i) => {
      const volume = volumes[i].volume;
      const intensity = volume / 100;
      
      // Calculate proximity factor (0 = furthest, 1 = closest)
      const distance = pointDistances[i];
      const proximityFactor = 1 - (distance / maxDistance);
      
      // Size interpolation: 60% (far) to 100% (close) of base size, up to cursor size (30px) when very close
      const baseSize = 8;
      const minSize = baseSize * 0.6; // 60% of actual size
      const maxSize = 30; // Same as cursor size
      let pointSize = minSize + (maxSize - minSize) * proximityFactor;
      
      // Apply global size boost when cursor is in center area
      // This pushes all dots towards max size
      pointSize = pointSize + (maxSize - pointSize) * globalSizeBoost;
      
      // Brightness interpolation: -30% (far) to +50% (close)
      const baseBrightness = 100;
      const minBrightness = baseBrightness * 0.7; // 30% less
      const maxBrightness = baseBrightness * 1.5; // 50% more
      const brightness = minBrightness + (maxBrightness - minBrightness) * proximityFactor;
      
      // Glow size based on proximity
      const glowSize = 20 + proximityFactor * 30; // 20px to 50px glow radius
      
      // Draw halo glow (strongest when close)
      if (proximityFactor > 0.3) {
        const haloGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowSize * 1.5);
        haloGradient.addColorStop(0, `${chakraColor}${Math.round(Math.min(255, proximityFactor * 120)).toString(16).padStart(2, '0')}`);
        haloGradient.addColorStop(0.5, `${chakraColor}${Math.round(Math.min(255, proximityFactor * 60)).toString(16).padStart(2, '0')}`);
        haloGradient.addColorStop(1, `${chakraColor}00`);
        
        ctx.fillStyle = haloGradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, glowSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw point with volume-based glow
      const pointGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowSize);
      const glowOpacity = Math.round(Math.min(255, intensity * brightness * 2.55));
      pointGradient.addColorStop(0, `${chakraColor}${glowOpacity.toString(16).padStart(2, '0')}`);
      pointGradient.addColorStop(1, `${chakraColor}00`);
      
      ctx.fillStyle = pointGradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw point circle with dynamic size and brightness
      ctx.strokeStyle = chakraColor;
      const fillOpacity = Math.round(Math.min(255, (intensity * 100 + 50) * (brightness / 100)));
      ctx.fillStyle = `${chakraColor}${fillOpacity.toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2 + proximityFactor * 2; // Thicker stroke when close
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw controller point
    // Controller glow
    const controllerGradient = ctx.createRadialGradient(
      controllerX, controllerY, 0,
      controllerX, controllerY, 40
    );
    controllerGradient.addColorStop(0, `${chakraColor}80`);
    controllerGradient.addColorStop(1, `${chakraColor}00`);
    
    ctx.fillStyle = controllerGradient;
    ctx.beginPath();
    ctx.arc(controllerX, controllerY, 40, 0, Math.PI * 2);
    ctx.fill();

    // Draw lines from controller to each star point (ALWAYS VISIBLE WITH GLOW)
    starPoints.forEach((point, i) => {
      const vol = volumes[i];
      const intensity = vol.volume / 100;
      
      // Always draw the line with strong visibility and glow effect
      const minOpacity = 60; // Strong minimum visibility even at 0 volume
      const maxOpacity = 200; // Very bright at full volume
      const opacity = Math.round(minOpacity + intensity * (maxOpacity - minOpacity));
      
      // Draw outer glow for shiny effect (wider, more transparent)
      ctx.strokeStyle = `${chakraColor}${Math.round(opacity * 0.4).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 4 + intensity * 4; // Thicker glow
      ctx.beginPath();
      ctx.moveTo(controllerX, controllerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      
      // Draw middle glow layer
      ctx.strokeStyle = `${chakraColor}${Math.round(opacity * 0.7).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2 + intensity * 3;
      ctx.beginPath();
      ctx.moveTo(controllerX, controllerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      
      // Draw bright core line
      ctx.strokeStyle = `${chakraColor}${opacity.toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1.5 + intensity * 2;
      ctx.beginPath();
      ctx.moveTo(controllerX, controllerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      
      // Add white highlight on top for extra shine at high volumes
      if (intensity > 0.3) {
        ctx.strokeStyle = `#ffffff${Math.round(intensity * 120).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 0.5 + intensity * 1;
        ctx.beginPath();
        ctx.moveTo(controllerX, controllerY);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    });

    // Draw chakra symbol at controller position
    drawChakraSymbol(ctx, controllerX, controllerY, 30, chakraColor, chakraId);

  }, [currentPos, chakraColor, tracks]);

  // Mouse/touch handlers
  const getCanvasPosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate the actual scale factor between canvas display size and internal size
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    
    // Get position relative to canvas, accounting for scale
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Convert to normalized coordinates (0-1, centered at 0.5)
    const normalizedX = x / size;
    const normalizedY = y / size;

    // Keep within circle bounds
    const dx = normalizedX - 0.5;
    const dy = normalizedY - 0.5;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 0.5;

    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      return {
        x: 0.5 + Math.cos(angle) * maxDistance,
        y: 0.5 + Math.sin(angle) * maxDistance
      };
    }

    return { x: normalizedX, y: normalizedY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAutoMixing) return; // Don't allow manual control during auto-mix
    setIsDragging(true);
    const pos = getCanvasPosition(e.clientX, e.clientY);
    if (pos) {
      setLocalControllerPos(pos);
      onControllerMove?.(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || isAutoMixing) return;
    const pos = getCanvasPosition(e.clientX, e.clientY);
    if (pos) {
      setLocalControllerPos(pos);
      onControllerMove?.(pos.x, pos.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isAutoMixing) return;
    e.preventDefault(); // Prevent scrolling while touching
    setIsDragging(true);
    const touch = e.touches[0];
    const pos = getCanvasPosition(touch.clientX, touch.clientY);
    if (pos) {
      setLocalControllerPos(pos);
      onControllerMove?.(pos.x, pos.y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || isAutoMixing) return;
    e.preventDefault(); // Prevent scrolling while touching
    const touch = e.touches[0];
    const pos = getCanvasPosition(touch.clientX, touch.clientY);
    if (pos) {
      setLocalControllerPos(pos);
      onControllerMove?.(pos.x, pos.y);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-0">
      <div className="relative w-full md:max-w-[600px]">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="cursor-pointer touch-none w-full h-auto"
          data-mandala-controller="true"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}