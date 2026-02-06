import { useState, useEffect, useRef } from "react";
import { ChakraSelector } from "./components/ChakraSelector";
import { MixerPanel } from "./components/MixerPanel";
import { useAudioEngine } from "../hooks/useAudioEngine";

interface Track {
  id: number;
  name: string;
  volume: number;
  isPlaying: boolean;
}

interface ChakraData {
  id: number;
  name: string;
  sanskrit: string;
  color: string;
  tracks: Track[];
  isPlaying: boolean;
  frequency: string;
  description: string;
  isAutoMixing: boolean;
}

export default function App() {
  const [selectedChakra, setSelectedChakra] = useState(1);
  const autoMixIntervalsRef = useRef<
    Map<number, NodeJS.Timeout>
  >(new Map());
  const trackLifecyclesRef = useRef<Map<string, any>>(
    new Map(),
  );
  const activeFades = useRef<
    Map<
      string,
      {
        startVolume: number;
        targetVolume: number;
        startTime: number;
        duration: number;
      }
    >
  >(new Map());

  // Default controller position: bottom of outer circle
  const getDefaultControllerPosition = () => {
    // Top of outer circle at the absolute edge
    // Normalized coordinates: center is 0.5, outer radius is 0.45
    // Top position: angle = -90 degrees = -π/2 radians
    return {
      x: 0.5, // Center horizontally
      y: 0.0, // Top of outer circle: ABSOLUTE ZERO (not 0.05!)
    };
  };

  const [controllerPositions, setControllerPositions] =
    useState<Map<number, { x: number; y: number }>>(() => {
      const initialMap = new Map();
      // Initialize all chakras with controller at bottom of outer circle
      for (let i = 1; i <= 7; i++) {
        initialMap.set(i, getDefaultControllerPosition());
      }
      return initialMap;
    });

  const [chakras, setChakras] = useState<ChakraData[]>([
    {
      id: 1,
      name: "Root Chakra",
      sanskrit: "Muladhara",
      color: "#C72542",
      tracks: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: `Track ${i + 1}`,
        volume: 0,
        isPlaying: true,
      })),
      isPlaying: false,
      frequency: "194.18Hz",
      description:
        "Earth's rotation - 24 hours day and night cycle",
      isAutoMixing: false,
    },
    {
      id: 2,
      name: "Sacral Chakra",
      sanskrit: "Svadhisthana",
      color: "#E36414",
      tracks: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: `Track ${i + 1}`,
        volume: 0,
        isPlaying: true,
      })),
      isPlaying: false,
      frequency: "210.42Hz",
      description: "Mooncycle - 29.53 days",
      isAutoMixing: false,
    },
    {
      id: 3,
      name: "Solar Plexus Chakra",
      sanskrit: "Manipura",
      color: "#D4C922",
      tracks: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: `Track ${i + 1}`,
        volume: 0,
        isPlaying: true,
      })),
      isPlaying: false,
      frequency: "126.22Hz",
      description:
        "Sun's gravitational length - the horizon of the physical world",
      isAutoMixing: false,
    },
    {
      id: 4,
      name: "Heart Chakra",
      sanskrit: "Anahata",
      color: "#1ABC9C",
      tracks: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: `Track ${i + 1}`,
        volume: 0,
        isPlaying: true,
      })),
      isPlaying: false,
      frequency: "136.10Hz",
      description: "Earth's orbit - 365.24 days",
      isAutoMixing: false,
    },
    {
      id: 5,
      name: "Throat Chakra",
      sanskrit: "Vishuddha",
      color: "#2196F3",
      tracks: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: `Track ${i + 1}`,
        volume: 0,
        isPlaying: true,
      })),
      isPlaying: false,
      frequency: "141.27Hz",
      description: "Mercury's orbit - 0.24 years",
      isAutoMixing: false,
    },
    {
      id: 6,
      name: "Third Eye Chakra",
      sanskrit: "Ajna",
      color: "#FFB347",
      tracks: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: `Track ${i + 1}`,
        volume: 0,
        isPlaying: true,
      })),
      isPlaying: false,
      frequency: "221.22Hz",
      description: "Venus's orbit - 0.61 years",
      isAutoMixing: false,
    },
    {
      id: 7,
      name: "Crown Chakra",
      sanskrit: "Sahasrara",
      color: "#9C27B0",
      tracks: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: `Track ${i + 1}`,
        volume: 0,
        isPlaying: true,
      })),
      isPlaying: false,
      frequency: "172.06Hz",
      description: "Earth's axial precession - 25920 years",
      isAutoMixing: false,
    },
  ]);

  const currentChakra = chakras.find(
    (c) => c.id === selectedChakra,
  );

  // Initialize audio engine for current chakra
  const { isInitialized, loadingProgress, loadError, audioContext, masterGainNode } =
    useAudioEngine(
      selectedChakra,
      currentChakra?.tracks || [],
      currentChakra?.isPlaying || false,
    );

  const handleVolumeChange = (
    trackId: number,
    volume: number,
  ) => {
    setChakras((prev) =>
      prev.map((chakra) =>
        chakra.id === selectedChakra
          ? {
              ...chakra,
              tracks: chakra.tracks.map((track) =>
                track.id === trackId
                  ? { ...track, volume }
                  : track,
              ),
            }
          : chakra,
      ),
    );
  };

  const handleTogglePlay = (trackId: number) => {
    setChakras((prev) =>
      prev.map((chakra) =>
        chakra.id === selectedChakra
          ? {
              ...chakra,
              tracks: chakra.tracks.map((track) =>
                track.id === trackId
                  ? { ...track, isPlaying: !track.isPlaying }
                  : track,
              ),
            }
          : chakra,
      ),
    );
  };

  const handleToggleChakraPlay = () => {
    setChakras((prev) =>
      prev.map((chakra) => {
        if (chakra.id === selectedChakra) {
          const newIsPlaying = !chakra.isPlaying;

          // Reset controller to zero position (top of circle) when toggling play/stop
          setControllerPositions((prevPos) => {
            const newMap = new Map(prevPos);
            newMap.set(selectedChakra, { x: 0.5, y: 0.0 }); // Absolute zero volume position
            return newMap;
          });

          return {
            ...chakra,
            isPlaying: newIsPlaying,
            tracks: chakra.tracks.map((track) => ({
              ...track,
              isPlaying: newIsPlaying,
            })),
          };
        }
        return chakra;
      }),
    );
  };

  const handleControllerMove = (x: number, y: number) => {
    setControllerPositions((prev) => {
      const newMap = new Map(prev);
      newMap.set(selectedChakra, { x, y });
      return newMap;
    });
  };

  // Reset controller position and volumes when changing chakras
  useEffect(() => {
    const defaultPos = getDefaultControllerPosition();

    // Reset controller position to top of outer circle
    setControllerPositions((prev) => {
      const newMap = new Map(prev);
      if (!newMap.has(selectedChakra)) {
        newMap.set(selectedChakra, defaultPos);
      }
      return newMap;
    });

    // Reset all volumes to 0 for the new chakra
    setChakras((prev) =>
      prev.map((chakra) =>
        chakra.id === selectedChakra
          ? {
              ...chakra,
              tracks: chakra.tracks.map((track) => ({
                ...track,
                volume: 0,
              })),
            }
          : chakra,
      ),
    );
  }, [selectedChakra]);

  const handleStartAutoMix = () => {
    const chakraId = selectedChakra;

    // Stop auto-mix if already running
    if (autoMixIntervalsRef.current.has(chakraId)) {
      const interval =
        autoMixIntervalsRef.current.get(chakraId);
      if (interval) clearInterval(interval);
      autoMixIntervalsRef.current.delete(chakraId);

      // Stop auto-mix and reset position to top of outer circle
      setChakras((prev) =>
        prev.map((chakra) =>
          chakra.id === chakraId
            ? {
                ...chakra,
                isAutoMixing: false,
                isPlaying: false,
                tracks: chakra.tracks.map((track) => ({
                  ...track,
                  volume: 0,
                  isPlaying: true,
                })),
              }
            : chakra,
        ),
      );

      // Reset controller to top of outer circle
      setControllerPositions((prev) => {
        const newMap = new Map(prev);
        newMap.set(chakraId, getDefaultControllerPosition());
        return newMap;
      });
      return;
    }

    // Start auto-mix
    setChakras((prev) =>
      prev.map((chakra) =>
        chakra.id === chakraId
          ? {
              ...chakra,
              isAutoMixing: true,
              isPlaying: true,
              tracks: chakra.tracks.map((track) => ({
                ...track,
                isPlaying: true,
                volume: 0,
              })),
            }
          : chakra,
      ),
    );

    // Initialize controller position at bottom of outer circle
    const initialAngle = -Math.PI / 2; // Top position (-90 degrees)
    const initialX = 0.5; // Center horizontally
    const initialY = 0.0; // Top of outer circle - ABSOLUTE ZERO

    // Immediately set the controller position at the top (complete silence)
    setControllerPositions((prev) => {
      const newMap = new Map(prev);
      newMap.set(chakraId, { x: initialX, y: initialY });
      return newMap;
    });

    // Smooth random movement parameters
    const startTime = Date.now();
    const duration = 15 * 60 * 1000; // 15 minutes
    const initialMoveDuration = 45000; // 45 seconds to move inward - ultra slow, deeply meditative fade-in
    const finalMoveDuration = 10000; // 10 seconds to move outward

    // Perlin-noise-like smooth random walk using multiple sine waves
    let currentX = initialX;
    let currentY = initialY;

    // Multiple sine wave frequencies for organic, never-stopping movement
    // MUCH SLOWER frequencies for deeply meditative, gentle drift
    // Add random variation to base frequencies for unique movement each time
    const freqVariation1 = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 multiplier
    const freqVariation2 = 0.7 + Math.random() * 0.6;
    const freqVariation3 = 0.7 + Math.random() * 0.6;

    const freq1 = 0.00008 * freqVariation1; // Ultra slow base frequency with variation
    const freq2 = 0.00015 * freqVariation2; // Slow medium frequency with variation
    const freq3 = 0.00025 * freqVariation3; // Gentle detail frequency with variation

    // Random phase offsets for unique movement each time
    const phaseX1 = Math.random() * Math.PI * 2;
    const phaseY1 = Math.random() * Math.PI * 2;
    const phaseX2 = Math.random() * Math.PI * 2;
    const phaseY2 = Math.random() * Math.PI * 2;
    const phaseX3 = Math.random() * Math.PI * 2;
    const phaseY3 = Math.random() * Math.PI * 2;

    // Random amplitude variations for each sine wave
    const amp1X = 0.7 + Math.random() * 0.3; // 0.7 to 1.0
    const amp1Y = 0.7 + Math.random() * 0.3;
    const amp2X = 0.4 + Math.random() * 0.2; // 0.4 to 0.6
    const amp2Y = 0.4 + Math.random() * 0.2;
    const amp3X = 0.2 + Math.random() * 0.2; // 0.2 to 0.4
    const amp3Y = 0.2 + Math.random() * 0.2;

    // Random movement radius for this session
    const baseMovementRadius = 0.25 + Math.random() * 0.1; // 0.25 to 0.35

    // RANDOMIZE FADE-IN: Random starting angle on outer circle
    const randomStartAngle = Math.random() * Math.PI * 2; // Any angle 0 to 360 degrees

    // RANDOMIZE FADE-IN: Random target angle for spiral movement
    const spiralRotation =
      (Math.random() - 0.5) * Math.PI * 1.5; // -135 to +135 degrees rotation

    // RANDOMIZE FADE-IN: Random target radius in the active zone
    const fadeInTargetRadius = 0.2 + Math.random() * 0.15; // 0.20 to 0.35

    // RANDOMIZE FADE-OUT: Random exit angle on outer circle
    const randomExitAngle = Math.random() * Math.PI * 2; // Any angle 0 to 360 degrees

    console.log(
      `Auto-mix started: 45sec fade-in → ultra-slow meditative drift → 10sec fade-out`,
    );

    // Animation loop - update controller position smoothly
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;

      // Stop after 15 minutes
      if (elapsed >= duration) {
        const currentInterval =
          autoMixIntervalsRef.current.get(chakraId);
        if (currentInterval) clearInterval(currentInterval);
        autoMixIntervalsRef.current.delete(chakraId);

        setChakras((prev) =>
          prev.map((chakra) =>
            chakra.id === chakraId
              ? { ...chakra, isAutoMixing: false }
              : chakra,
          ),
        );
        return;
      }

      // Progress from 0 to 1 over 15 minutes
      const progress = elapsed / duration;

      // Phase 1: First 5 seconds - move from outer to inner
      if (elapsed < initialMoveDuration) {
        const phase1Progress = elapsed / initialMoveDuration; // 0 to 1
        // Extra smooth easing for gentle fade-in from silence
        const easedProgress =
          phase1Progress *
          phase1Progress *
          phase1Progress *
          (phase1Progress * (phase1Progress * 6 - 15) + 10); // Smootherstep

        // Move from outer (0.45) to inner active zone (0.20-0.30)
        const startRadius = 0.45;
        const targetRadius = fadeInTargetRadius;
        const currentRadius =
          startRadius -
          (startRadius - targetRadius) * easedProgress;

        const angle =
          randomStartAngle + spiralRotation * easedProgress; // Spiral inward
        const targetX = 0.5 + Math.cos(angle) * currentRadius;
        const targetY = 0.5 + Math.sin(angle) * currentRadius;

        // Ultra gentle interpolation for extremely slow, peaceful fade-in
        const smoothing = 0.006; // Ultra slow drift like a feather (was 0.03)
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;
      }
      // Phase 3: Last 5 seconds - move from inner to outer
      else if (elapsed > duration - finalMoveDuration) {
        const phase3Progress =
          (elapsed - (duration - finalMoveDuration)) /
          finalMoveDuration; // 0 to 1
        // Extra smooth easing for gentle fade-out to silence
        const easedProgress =
          phase3Progress *
          phase3Progress *
          phase3Progress *
          (phase3Progress * (phase3Progress * 6 - 15) + 10); // Smootherstep

        // Move from current position to outer circle top (complete silence)
        const targetAngle = randomExitAngle; // Top position for fade-out
        const currentRadius = Math.sqrt(
          (currentX - 0.5) ** 2 + (currentY - 0.5) ** 2,
        );
        const targetRadius = 0.45;

        const newRadius =
          currentRadius +
          (targetRadius - currentRadius) * easedProgress;

        // Smoothly transition angle to top position as well
        const dx = currentX - 0.5;
        const dy = currentY - 0.5;
        const currentAngle = Math.atan2(dy, dx);
        const angleDiff = targetAngle - currentAngle;
        const normalizedAngleDiff = Math.atan2(
          Math.sin(angleDiff),
          Math.cos(angleDiff),
        );
        const newAngle =
          currentAngle + normalizedAngleDiff * easedProgress;

        const targetX = 0.5 + Math.cos(newAngle) * newRadius;
        const targetY = 0.5 + Math.sin(newAngle) * newRadius;

        // Very smooth interpolation for gradual fade-out
        const smoothing = 0.08;
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;
      }
      // Phase 2: Middle phase - continuous organic movement using sine waves
      else {
        // Perlin-noise-like smooth random walk using multiple overlapping sine waves
        // This creates continuous, never-stopping, organic movement
        const noiseX =
          Math.sin(freq1 * elapsed + phaseX1) * amp1X +
          Math.sin(freq2 * elapsed + phaseX2) * amp2X +
          Math.sin(freq3 * elapsed + phaseX3) * amp3X;
        const noiseY =
          Math.sin(freq1 * elapsed + phaseY1) * amp1Y +
          Math.sin(freq2 * elapsed + phaseY2) * amp2Y +
          Math.sin(freq3 * elapsed + phaseY3) * amp3Y;

        // Normalize to range [-1, 1] using actual random amplitude sums
        const maxAmplitudeX = amp1X + amp2X + amp3X;
        const maxAmplitudeY = amp1Y + amp2Y + amp3Y;
        const normX = noiseX / maxAmplitudeX;
        const normY = noiseY / maxAmplitudeY;

        // Scale to movement range (stay within inner zone for good volume levels)
        const movementRadius = baseMovementRadius; // Maximum distance from center
        const targetX = 0.5 + normX * movementRadius;
        const targetY = 0.5 + normY * movementRadius;

        // Ultra smooth interpolation for deeply meditative, slow but constant movement
        const smoothing = 0.008; // Very slow, ultra-soft, deeply meditative drift (was 0.015)
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;
      }

      // Update controller position
      setControllerPositions((prev) => {
        const newMap = new Map(prev);
        newMap.set(chakraId, { x: currentX, y: currentY });
        return newMap;
      });
    }, 50); // Update every 50ms for smooth movement

    autoMixIntervalsRef.current.set(chakraId, interval);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      autoMixIntervalsRef.current.forEach((interval) =>
        clearInterval(interval),
      );
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-2 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white/95 mb-2">
            Chakra Sound Meditation
          </h1>
          <p className="text-white/60">
            Balance your energy centers through sound healing
          </p>
        </div>

        {/* Chakra Selector */}
        <ChakraSelector
          selectedChakra={selectedChakra}
          onSelectChakra={setSelectedChakra}
        />

        {/* Mixer Panel */}
        {currentChakra && (
          <MixerPanel
            chakraId={currentChakra.id}
            chakraName={currentChakra.name}
            chakraColor={currentChakra.color}
            tracks={currentChakra.tracks}
            onVolumeChange={handleVolumeChange}
            onTogglePlay={handleTogglePlay}
            isChakraPlaying={currentChakra.isPlaying}
            onToggleChakraPlay={handleToggleChakraPlay}
            frequency={currentChakra.frequency}
            description={currentChakra.description}
            onStartAutoMix={handleStartAutoMix}
            isAutoMixing={currentChakra.isAutoMixing}
            isInitialized={isInitialized}
            loadingProgress={loadingProgress}
            loadError={loadError}
            controllerPosition={controllerPositions.get(
              selectedChakra,
            )}
            onControllerMove={handleControllerMove}
            audioContext={audioContext}
            masterGainNode={masterGainNode}
          />
        )}

        {/* Footer Info */}
        <div className="text-center text-white/40 text-sm mt-8 space-y-4">
          <p>
            🧘 Find your inner peace through chakra sound
            meditation
          </p>

          {/* Chakra Information Section - Show only selected chakra */}
          <div className="max-w-4xl mx-auto mt-8">
            {selectedChakra === 1 && (
              /* Root Chakra */
              <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-xl p-6 text-left">
                <h3 className="text-red-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Root Chakra (Muladhara)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>
                    <p className="text-red-300/80 font-medium mb-1">
                      Cosmic Properties:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Cycle: 24 hours (Earth's rotation)
                      </li>
                      <li>• Octave: 24th</li>
                      <li>• Frequency: 194.18Hz</li>
                      <li>• Color: Red</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-300/80 font-medium mb-1">
                      Physical:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Energy enhancer</li>
                      <li>• Regenerative</li>
                      <li>• Cellular activator</li>
                      <li>• Sexual strength</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-300/80 font-medium mb-1">
                      Psychological:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Awareness</li>
                      <li>• Courage</li>
                      <li>• Willpower</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-300/80 font-medium mb-1">
                      Spiritual:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Grounding</li>
                      <li>
                        • Strengthens bond to physical world
                      </li>
                      <li>• Present moment awareness</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedChakra === 2 && (
              /* Sacral Chakra */
              <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-500/30 rounded-xl p-6 text-left">
                <h3 className="text-orange-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  Sacral Chakra (Svadhisthana)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>
                    <p className="text-orange-300/80 font-medium mb-1">
                      Cosmic Properties:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Cycle: Synodic Moon (29.53 days)
                      </li>
                      <li>• Octave: 29th</li>
                      <li>• Frequency: 210.42Hz</li>
                      <li>• Color: Orange</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-orange-300/80 font-medium mb-1">
                      Physical:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Enhances sensuality and perception
                      </li>
                      <li>• Soothes menstrual pains</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-orange-300/80 font-medium mb-1">
                      Psychological:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Activates creativity</li>
                      <li>• Enhances sensuality</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-orange-300/80 font-medium mb-1">
                      Spiritual:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Connects sexual energy</li>
                      <li>
                        • Links to subtle emotions and love
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedChakra === 3 && (
              /* Solar Plexus Chakra */
              <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 rounded-xl p-6 text-left">
                <h3 className="text-yellow-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  Solar Plexus Chakra (Manipura)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>
                    <p className="text-yellow-300/80 font-medium mb-1">
                      Cosmic Properties:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Cycle: Sun's gravitational length
                      </li>
                      <li>• Octave: -8</li>
                      <li>• Frequency: 126.22Hz</li>
                      <li>• Color: Yellow-Greenish</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-yellow-300/80 font-medium mb-1">
                      Physical:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Energy booster</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-yellow-300/80 font-medium mb-1">
                      Psychological:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Transcendence of mind's limits</li>
                      <li>• Self-esteem enhancer</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-yellow-300/80 font-medium mb-1">
                      Spiritual:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Dissolves linear time perception
                      </li>
                      <li>
                        • Strengthens awareness of the self
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedChakra === 4 && (
              /* Heart Chakra */
              <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl p-6 text-left">
                <h3 className="text-green-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Heart Chakra (Anahata)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>
                    <p className="text-green-300/80 font-medium mb-1">
                      Cosmic Properties:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Cycle: Earth's orbit (365.24 days)
                      </li>
                      <li>• Octave: 32nd</li>
                      <li>• Frequency: 136.10Hz</li>
                      <li>• Color: Turquoise</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-green-300/80 font-medium mb-1">
                      Physical:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Deep relaxation</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-green-300/80 font-medium mb-1">
                      Psychological:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Reassurance</li>
                      <li>• Dissolves fears</li>
                      <li>• Enhances feeling safe and sound</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-green-300/80 font-medium mb-1">
                      Spiritual:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Connects physical and mental in heart
                      </li>
                      <li>• Love and compassion</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedChakra === 5 && (
              /* Throat Chakra */
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-xl p-6 text-left">
                <h3 className="text-blue-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Throat Chakra (Vishuddha)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>
                    <p className="text-blue-300/80 font-medium mb-1">
                      Cosmic Properties:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Cycle: Mercury's orbit (87.696 days)
                      </li>
                      <li>• Octave: 30th</li>
                      <li>• Frequency: 141.27Hz</li>
                      <li>• Color: Blue-Greenish</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-blue-300/80 font-medium mb-1">
                      Physical:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Positive effects on respiratory system
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-blue-300/80 font-medium mb-1">
                      Psychological:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Enhances communication skills</li>
                      <li>• Verbal and non-verbal</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-blue-300/80 font-medium mb-1">
                      Spiritual:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Intuition</li>
                      <li>• Discernment</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedChakra === 6 && (
              /* Third Eye Chakra */
              <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 border border-indigo-500/30 rounded-xl p-6 text-left">
                <h3 className="text-indigo-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  Third Eye Chakra (Ajna)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>
                    <p className="text-indigo-300/80 font-medium mb-1">
                      Cosmic Properties:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Cycle: Venus's orbit (224.7 days)
                      </li>
                      <li>• Octave: 32nd</li>
                      <li>• Frequency: 221.23Hz</li>
                      <li>• Color: Orange-Yellow</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-indigo-300/80 font-medium mb-1">
                      Physical:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Insulin regulating</li>
                      <li>• Bodily fluids regulating</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-indigo-300/80 font-medium mb-1">
                      Psychological:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Sweet and unconditional acceptance
                      </li>
                      <li>• Surrender</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-indigo-300/80 font-medium mb-1">
                      Spiritual:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Higher love</li>
                      <li>• Acceptance</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedChakra === 7 && (
              /* Crown Chakra */
              <div className="bg-gradient-to-br from-violet-900/20 to-violet-800/10 border border-violet-500/30 rounded-xl p-6 text-left">
                <h3 className="text-violet-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                  Crown Chakra (Sahasrara)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>
                    <p className="text-violet-300/80 font-medium mb-1">
                      Cosmic Properties:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • Cycle: Platonic year (axial
                        precession)
                      </li>
                      <li>• Octave: 47th</li>
                      <li>• Frequency: 172.06Hz</li>
                      <li>• Color: Violet</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-violet-300/80 font-medium mb-1">
                      Physical:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Natural painkiller</li>
                      <li>• Calming on nervous system</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-violet-300/80 font-medium mb-1">
                      Psychological:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Serenity</li>
                      <li>• Stillness</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-violet-300/80 font-medium mb-1">
                      Spiritual:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Connection to higher self</li>
                      <li>• Beyond human existence</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* More Sound Meditations Link */}
          <a
            href="https://www.thetuningfork.life/music"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 font-medium"
          >
            More Sound Meditations
          </a>
        </div>
      </div>
    </div>
  );
}