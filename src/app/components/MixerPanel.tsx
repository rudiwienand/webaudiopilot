import { useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { MandalaController } from "./MandalaController";

interface Track {
  id: number;
  name: string;
  volume: number;
  isPlaying: boolean;
}

interface MixerPanelProps {
  tracks: Track[];
  onVolumeChange: (trackId: number, volume: number) => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
  chakraId: number;
  chakraName: string;
  chakraColor: string;
  frequency: string;
  description: string;
  onStartAutoMix: (duration: number, chakraSequence?: number[]) => void;
  isAutoMixing: boolean;
  isInitialized: boolean;
  loadingProgress: number;
  loadError: boolean;
  isLoadingTracks: boolean;
  controllerPosition?: { x: number; y: number };
  onControllerMove?: (x: number, y: number) => void;
  audioContext: AudioContext | null;
  masterGainNode: GainNode | null;
}

const CHAKRA_LIST = [
  { id: 1, name: "Root", color: "#C72542" },
  { id: 2, name: "Sacral", color: "#E97730" },
  { id: 3, name: "Solar Plexus", color: "#F7B924" },
  { id: 4, name: "Heart", color: "#00A878" },
  { id: 5, name: "Throat", color: "#3A9EEA" },
  { id: 6, name: "Third Eye", color: "#5B4B8A" },
  { id: 7, name: "Crown", color: "#8B5A99" },
];

export function MixerPanel({
  tracks,
  onVolumeChange,
  onTogglePlay,
  isPlaying,
  chakraId,
  chakraName,
  chakraColor,
  frequency,
  description,
  onStartAutoMix,
  isAutoMixing,
  isInitialized,
  loadingProgress,
  loadError,
  isLoadingTracks,
  controllerPosition,
  onControllerMove,
  audioContext,
  masterGainNode
}: MixerPanelProps) {
  const [showTimerSelection, setShowTimerSelection] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [selectedChakras, setSelectedChakras] = useState<number[]>([]);

  const trackNames = [
    "Ambient Pad",
    "Singing Bowl"
  ];

  const handleAutoPilotClick = () => {
    if (isAutoMixing) {
      // If already running, stop it
      onStartAutoMix(0);
    } else {
      // Show timer selection
      setShowTimerSelection(true);
    }
  };

  const handleStartWithDuration = () => {
    setShowTimerSelection(false);
    const chakraSequence = selectedChakras.length > 0 ? selectedChakras : undefined;
    onStartAutoMix(selectedMinutes * 60, chakraSequence); // Convert to seconds
  };

  const handleCancelTimer = () => {
    setShowTimerSelection(false);
    setSelectedChakras([]);
  };

  const toggleChakraSelection = (id: number) => {
    setSelectedChakras(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      } else {
        // Keep the array sorted
        return [...prev, id].sort((a, b) => a - b);
      }
    });
  };

  const selectAllChakras = () => {
    setSelectedChakras([1, 2, 3, 4, 5, 6, 7]);
  };

  const clearAllChakras = () => {
    setSelectedChakras([]);
  };

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-3 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        {/* Audio Status */}
        {loadError && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
            <p className="font-semibold mb-2">⚠️ Cannot Load Audio - CORS Blocked</p>
            <p className="mb-3 text-red-100">Dropbox's new sharing links are also blocking cross-origin audio access.</p>
            
            <div className="bg-slate-900/50 p-4 rounded space-y-4">
              <div className="border-l-4 border-green-400 pl-3 bg-green-900/20 p-3 rounded">
                <p className="text-green-200 font-bold mb-2">✅ SOLUTION: Use GitHub (Free & Easy)</p>
                <ol className="text-white/80 text-xs space-y-2 ml-4 list-decimal">
                  <li>Go to <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">GitHub.com</a> and create a free account</li>
                  <li>Create a new <strong>public</strong> repository (e.g., "chakra-audio")</li>
                  <li>Upload your MP3 files to the repository</li>
                  <li>For each file, click it and then click "Raw" button</li>
                  <li>Copy the raw URL - it will look like:<br/>
                    <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300 text-[10px] block mt-1">
                      https://raw.githubusercontent.com/yourname/chakra-audio/main/track1.mp3
                    </code>
                  </li>
                  <li>Paste these URLs in <code className="bg-slate-800 px-1 rounded text-cyan-300">/src/config/audioConfig.ts</code></li>
                </ol>
                <p className="mt-2 text-green-300/80 text-xs">💡 GitHub raw URLs have proper CORS headers and work perfectly!</p>
              </div>

              <div className="border-l-4 border-blue-400 pl-3 bg-blue-900/20 p-3 rounded">
                <p className="text-blue-200 font-bold mb-2">📦 Alternative: Other CORS-Friendly Services</p>
                <ul className="text-white/70 text-xs space-y-1 ml-4 list-disc">
                  <li><strong>Cloudflare R2</strong>: Free tier, excellent for media</li>
                  <li><strong>AWS S3</strong>: Enable CORS in bucket settings</li>
                  <li><strong>Netlify/Vercel</strong>: Deploy this app with audio in /public</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-400 pl-3 bg-purple-900/20 p-3 rounded">
                <p className="text-purple-200 font-bold mb-2">💻 Best Option: Download & Run Locally</p>
                <ol className="text-white/70 text-xs space-y-1 ml-4 list-decimal">
                  <li>Download this project</li>
                  <li>Place MP3s in <code className="bg-slate-800 px-1 rounded text-cyan-300">/public/audio/chakra-{chakraId}/track-1.mp3</code> etc.</li>
                  <li>Run <code className="bg-slate-800 px-1 rounded text-cyan-300">npm install && npm run dev</code></li>
                  <li>Set <code className="bg-slate-800 px-1 rounded text-cyan-300">USE_EXTERNAL_URLS = false</code> in config</li>
                </ol>
              </div>
            </div>

            <div className="mt-3 p-3 bg-yellow-900/30 border-l-4 border-yellow-500 rounded">
              <p className="text-yellow-200 font-semibold text-xs mb-1">🔒 Why This Happens:</p>
              <p className="text-yellow-100/80 text-xs">
                Both Google Drive and Dropbox block CORS (Cross-Origin Resource Sharing) to prevent web apps from accessing files directly. 
                You need a hosting service that allows CORS, like GitHub raw URLs or self-hosting.
              </p>
            </div>
          </div>
        )}
        {!loadError && !isInitialized && (
          <div className="mb-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-200 text-sm">
            <p>Initializing audio engine...</p>
          </div>
        )}
        {!loadError && isInitialized && loadingProgress < 100 && (
          <div className="mb-4 p-4 bg-slate-800/50 border border-slate-600/50 rounded-lg">
            <p className="text-white/70 text-sm mb-2">Loading audio tracks...</p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${loadingProgress}%`,
                  backgroundColor: chakraColor
                }}
              />
            </div>
            <p className="text-white/50 text-xs mt-2">{Math.round(loadingProgress)}%</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center flex-1">
            <button
              onClick={onTogglePlay}
              disabled={isLoadingTracks}
              className={`w-20 h-20 mb-3 rounded-full border-4 border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 relative group ${isLoadingTracks ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                backgroundColor: chakraColor,
                boxShadow: `0 0 30px ${chakraColor}60`
              }}
            >
              {isPlaying ? (
                <VolumeX className="w-8 h-8 text-white drop-shadow-lg" />
              ) : (
                <Volume2 className="w-8 h-8 text-white drop-shadow-lg ml-1" />
              )}
            </button>
            <h2 className="text-white/90 mb-2">{chakraName}</h2>
            <p 
              className="text-sm"
              style={{ color: chakraId === 6 ? chakraColor : 'rgba(255, 255, 255, 0.5)' }}
            >
              {frequency} - {description}
            </p>
          </div>
        </div>

        {/* Auto Mix Button */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <button
            onClick={handleAutoPilotClick}
            disabled={isLoadingTracks}
            className={`
              px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2
              ${isLoadingTracks ? 'opacity-50 cursor-not-allowed' : ''}
              ${isAutoMixing 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'bg-slate-700/80 hover:bg-slate-600/80 text-white/90'
              }
            `}
            style={{
              boxShadow: isAutoMixing ? `0 0 20px ${chakraColor}60` : 'none'
            }}
          >
            <Sparkles className={`w-5 h-5 ${isAutoMixing ? 'animate-pulse' : ''}`} />
            <span>{isAutoMixing ? 'Stop Auto Pilot' : 'Start Auto Pilot'}</span>
          </button>
        </div>
      </div>

      {/* Mandala Controller - Sacred Geometry Mixer */}
      <div className="relative">
        <MandalaController
          tracks={tracks}
          onVolumeChange={onVolumeChange}
          chakraColor={chakraColor}
          chakraId={chakraId}
          controllerPosition={controllerPosition}
          onControllerMove={onControllerMove}
          isAutoMixing={isAutoMixing}
        />

        {/* Timer Selection Overlay */}
        {showTimerSelection && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm rounded-2xl">
            <div className="bg-slate-800/95 p-8 rounded-2xl shadow-2xl border-2 max-w-2xl w-full mx-4" style={{ borderColor: chakraColor }}>
              <h3 className="text-white/90 text-xl font-semibold mb-6 text-center">Configure Auto Pilot</h3>
              <div className="flex flex-col items-center gap-6">
                {/* Duration Selection */}
                <div className="w-full">
                  <p className="text-white/70 text-sm mb-3 text-center">Duration</p>
                  <div className="flex items-center gap-4 justify-center">
                    <input
                      type="number"
                      min="3"
                      max="90"
                      value={selectedMinutes}
                      onChange={(e) => {
                        const value = Math.max(3, Math.min(90, Number(e.target.value)));
                        setSelectedMinutes(value);
                      }}
                      className="w-24 px-4 py-3 bg-slate-700/80 rounded-lg text-white/90 text-center text-2xl font-semibold focus:outline-none focus:ring-2"
                      style={{ focusRingColor: chakraColor }}
                    />
                    <span className="text-white/80 text-lg font-medium">minutes</span>
                  </div>
                  
                  {/* Range Slider */}
                  <input
                    type="range"
                    min="3"
                    max="90"
                    value={selectedMinutes}
                    onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                    className="w-full max-w-md mx-auto block mt-4 h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${chakraColor} 0%, ${chakraColor} ${((selectedMinutes - 3) / 87) * 100}%, #334155 ${((selectedMinutes - 3) / 87) * 100}%, #334155 100%)`
                    }}
                  />
                </div>

                {/* Chakra Sequence Selection */}
                <div className="w-full border-t border-slate-600 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white/70 text-sm">Chakra Sequence (Optional)</p>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllChakras}
                        className="text-xs px-3 py-1 bg-slate-600/60 hover:bg-slate-500/60 text-white/80 rounded-lg transition-colors"
                      >
                        All
                      </button>
                      <button
                        onClick={clearAllChakras}
                        className="text-xs px-3 py-1 bg-slate-600/60 hover:bg-slate-500/60 text-white/80 rounded-lg transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs mb-4 text-center">
                    {selectedChakras.length === 0 
                      ? "Current chakra only" 
                      : `${selectedChakras.length} chakra${selectedChakras.length > 1 ? 's' : ''} selected • ${(selectedMinutes / selectedChakras.length).toFixed(1)} min each`
                    }
                  </p>
                  
                  {/* Chakra Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {CHAKRA_LIST.map(chakra => (
                      <button
                        key={chakra.id}
                        onClick={() => toggleChakraSelection(chakra.id)}
                        className={`
                          flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                          ${selectedChakras.includes(chakra.id)
                            ? 'bg-white/20 ring-2 scale-105'
                            : 'bg-slate-700/40 hover:bg-slate-600/40'
                          }
                        `}
                        style={{
                          ringColor: selectedChakras.includes(chakra.id) ? chakra.color : 'transparent'
                        }}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full transition-all ${selectedChakras.includes(chakra.id) ? 'shadow-lg' : ''}`}
                          style={{ 
                            backgroundColor: chakra.color,
                            boxShadow: selectedChakras.includes(chakra.id) ? `0 0 15px ${chakra.color}` : 'none'
                          }}
                        />
                        <span className="text-white/70 text-[10px] text-center leading-tight">{chakra.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={handleStartWithDuration}
                    className="px-8 py-3 rounded-xl text-white/90 font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ 
                      backgroundColor: chakraColor,
                      boxShadow: `0 4px 20px ${chakraColor}60`
                    }}
                  >
                    Start
                  </button>
                  <button
                    onClick={handleCancelTimer}
                    className="px-8 py-3 bg-slate-600/80 hover:bg-slate-500/80 text-white/90 rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}