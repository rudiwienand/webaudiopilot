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
  controllerPosition?: { x: number; y: number };
  onControllerMove?: (x: number, y: number) => void;
  isAutoMixing: boolean;
}

export function MandalaController({
  tracks,
  onVolumeChange,
  chakraColor,
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

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
    ctx.strokeStyle = `${chakraColor}20`;
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
    ctx.strokeStyle = `${chakraColor}15`;
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
    ctx.strokeStyle = `${chakraColor}25`; // Reduced from 50 to 25
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
    ctx.strokeStyle = `${chakraColor}20`; // Reduced from 30 to 20
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
    starPoints.forEach((point, i) => {
      const volume = volumes[i].volume;
      const intensity = volume / 100;

      // Draw point with volume-based glow
      const pointGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 20);
      pointGradient.addColorStop(0, `${chakraColor}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`);
      pointGradient.addColorStop(1, `${chakraColor}00`);
      
      ctx.fillStyle = pointGradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw point circle
      ctx.strokeStyle = chakraColor;
      ctx.fillStyle = `${chakraColor}${Math.round(intensity * 100 + 50).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw controller point
    const controllerX = centerX + (currentPos.x - 0.5) * outerRadius * 2;
    const controllerY = centerY + (currentPos.y - 0.5) * outerRadius * 2;

    // Controller glow
    const controllerGradient = ctx.createRadialGradient(
      controllerX, controllerY, 0,
      controllerX, controllerY, 30
    );
    controllerGradient.addColorStop(0, `${chakraColor}80`);
    controllerGradient.addColorStop(1, `${chakraColor}00`);
    
    ctx.fillStyle = controllerGradient;
    ctx.beginPath();
    ctx.arc(controllerX, controllerY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Controller outer ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(controllerX, controllerY, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Controller inner circle
    ctx.fillStyle = chakraColor;
    ctx.beginPath();
    ctx.arc(controllerX, controllerY, 10, 0, Math.PI * 2);
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