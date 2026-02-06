import { CustomSlider } from "./CustomSlider";
import { Volume2, VolumeX } from "lucide-react";

interface TrackFaderProps {
  trackNumber: number;
  trackName: string;
  value: number;
  onChange: (value: number) => void;
  accentColor: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function TrackFader({ 
  trackNumber, 
  trackName, 
  value, 
  onChange, 
  accentColor,
  isPlaying,
  onTogglePlay
}: TrackFaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-slate-800/30 rounded-xl backdrop-blur-sm">
      {/* Track Name */}
      <div className="text-center w-full">
        <p className="text-white/70 text-xs mb-1">Track {trackNumber}</p>
        <p className="text-white/90 text-sm">{trackName}</p>
      </div>

      {/* Vertical Slider */}
      <div className="h-48 flex items-center justify-center py-4">
        <CustomSlider
          orientation="vertical"
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          max={100}
          step={1}
          className="h-full"
          accentColor={accentColor}
        />
      </div>

      {/* Volume Display */}
      <div className="w-full">
        <div 
          className="h-1.5 rounded-full bg-slate-700 overflow-hidden"
        >
          <div 
            className="h-full transition-all duration-150 rounded-full"
            style={{ 
              width: `${value}%`,
              backgroundColor: accentColor
            }}
          />
        </div>
        <p className="text-white/50 text-xs text-center mt-2">{value}%</p>
      </div>

      {/* Play/Mute Toggle */}
      <button
        onClick={onTogglePlay}
        className={`
          w-full py-2 rounded-lg transition-all duration-200
          ${isPlaying 
            ? 'bg-slate-700 hover:bg-slate-600' 
            : 'bg-slate-800 hover:bg-slate-700'
          }
        `}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 mx-auto text-white/70" />
        ) : (
          <VolumeX className="w-4 h-4 mx-auto text-white/40" />
        )}
      </button>
    </div>
  );
}