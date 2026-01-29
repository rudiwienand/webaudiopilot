import { TrackFader } from "./TrackFader";
import { MandalaController } from "./MandalaController";
import { Play, Pause, Sparkles, Video } from "lucide-react";
import { useState } from "react";
import { VideoRecorder } from "./VideoRecorder";

interface Track {
  id: number;
  name: string;
  volume: number;
  isPlaying: boolean;
}

interface MixerPanelProps {
  chakraId: number;
  chakraName: string;
  chakraColor: string;
  tracks: Track[];
  onVolumeChange: (trackId: number, volume: number) => void;
  onTogglePlay: (trackId: number) => void;
  isChakraPlaying: boolean;
  onToggleChakraPlay: () => void;
  frequency: string;
  description: string;
  onStartAutoMix: () => void;
  isAutoMixing: boolean;
  isInitialized: boolean;
  loadingProgress: number;
  loadError: string | null;
  controllerPosition?: { x: number; y: number };
  onControllerMove?: (x: number, y: number) => void;
  audioContext?: AudioContext | null;
  masterGainNode?: GainNode | null;
}

export function MixerPanel({ 
  chakraId, 
  chakraName, 
  chakraColor, 
  tracks, 
  onVolumeChange,
  onTogglePlay,
  isChakraPlaying,
  onToggleChakraPlay,
  frequency,
  description,
  onStartAutoMix,
  isAutoMixing,
  isInitialized,
  loadingProgress,
  loadError,
  controllerPosition,
  onControllerMove,
  audioContext,
  masterGainNode
}: MixerPanelProps) {
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  
  const trackNames = [
    "Ambient Pad",
    "Singing Bowl",
    "Nature Sounds",
    "Binaural Beat",
    "Chimes",
    "Drone",
    "Rain",
    "Wind",
    "Ocean Waves"
  ];

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
              onClick={onToggleChakraPlay}
              className="w-20 h-20 mb-3 rounded-full border-4 border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 relative group"
              style={{ 
                backgroundColor: chakraColor,
                boxShadow: `0 0 30px ${chakraColor}60`
              }}
            >
              {isChakraPlaying ? (
                <Pause className="w-8 h-8 text-white drop-shadow-lg" />
              ) : (
                <Play className="w-8 h-8 text-white drop-shadow-lg ml-1" />
              )}
            </button>
            <h2 className="text-white/90 mb-2">{chakraName}</h2>
            <p className="text-white/50 text-sm">{frequency} - {description}</p>
          </div>
        </div>

        {/* Auto Mix Button */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <button
            onClick={onStartAutoMix}
            className={`
              px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2
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
            <span>{isAutoMixing ? 'Stop Auto Pilot' : 'Start 15-Min Auto Pilot'}</span>
          </button>
        </div>
      </div>

      {/* Mandala Controller - Sacred Geometry Mixer */}
      <MandalaController
        tracks={tracks}
        onVolumeChange={onVolumeChange}
        chakraColor={chakraColor}
        controllerPosition={controllerPosition}
        onControllerMove={onControllerMove}
        isAutoMixing={isAutoMixing}
      />

      {/* Video Record Button - Works on Desktop & Mobile */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowVideoRecorder(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
          style={{ boxShadow: `0 0 20px ${chakraColor}60` }}
        >
          <Video className="w-5 h-5" />
          <span>🎥 Record Video (50s)</span>
        </button>
      </div>

      {/* Video Recorder Modal */}
      {showVideoRecorder && (
        <VideoRecorder
          chakraColor={chakraColor}
          audioContext={audioContext || null}
          masterGainNode={masterGainNode || null}
          onClose={() => setShowVideoRecorder(false)}
        />
      )}
    </div>
  );
}