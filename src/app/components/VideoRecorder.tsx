import { useState, useRef, useEffect } from 'react';
import { Video, X, Download, Share2, Trash2, Circle, Square } from 'lucide-react';
import { MandalaController } from './MandalaController';

interface Track {
  id: number;
  name: string;
  volume: number;
  isPlaying: boolean;
}

interface VideoRecorderProps {
  chakraColor: string;
  audioContext: AudioContext | null;
  masterGainNode: GainNode | null;
  onClose: () => void;
  onStartPlayback?: () => void;
  onStopPlayback?: () => void;
  isChakraPlaying: boolean;
  tracks: Track[];
  onVolumeChange: (trackId: number, volume: number) => void;
  controllerPosition?: { x: number; y: number };
  onControllerMove?: (x: number, y: number) => void;
  isAutoMixing: boolean;
}

export function VideoRecorder({ 
  chakraColor, 
  audioContext, 
  masterGainNode, 
  onClose, 
  onStartPlayback,
  onStopPlayback,
  isChakraPlaying,
  tracks,
  onVolumeChange,
  controllerPosition,
  onControllerMove,
  isAutoMixing
}: VideoRecorderProps) {
  const RECORDING_DURATION = 50;
  const [recordingState, setRecordingState] = useState<'setup' | 'recording' | 'complete'>('setup');
  const [countdown, setCountdown] = useState(RECORDING_DURATION);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraReady, setCameraReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const safeTracks = tracks && tracks.length > 0 ? tracks : Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: `Track ${i + 1}`,
    volume: 0.5,
    isPlaying: false
  }));

  // Initialize camera on mount
  useEffect(() => {
    initializeCamera();
    return cleanup;
  }, []);

  // Reinitialize when facing mode changes
  useEffect(() => {
    if (streamRef.current) {
      cleanup();
      setTimeout(() => initializeCamera(), 100);
    }
  }, [facingMode]);

  const cleanup = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setCameraReady(false);
  };

  const initializeCamera = async () => {
    setCameraError(null);
    setCameraReady(false);
    
    try {
      if (!navigator.mediaDevices) {
        setCameraError('Camera not supported');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => {
              console.log('✅ Camera preview playing');
              setCameraReady(true);
            })
            .catch(err => console.error('Play error:', err));
        };
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please enable camera access.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found');
      } else {
        setCameraError('Cannot access camera: ' + err.message);
      }
    }
  };

  const drawCompositeFrame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const halfHeight = height / 2;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Top: Camera feed
    if (videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, width, halfHeight);
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, halfHeight);
    }

    // Bottom: Mandala
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, halfHeight, width, halfHeight);
    
    const mandalaContainer = document.querySelector('[data-video-recorder-mandala="true"]');
    const mandalaCanvas = mandalaContainer?.querySelector('[data-mandala-controller]') as HTMLCanvasElement;
    
    if (mandalaCanvas) {
      try {
        const mandalaAspect = mandalaCanvas.width / mandalaCanvas.height;
        const targetAspect = width / halfHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        if (mandalaAspect > targetAspect) {
          drawWidth = width;
          drawHeight = width / mandalaAspect;
          offsetX = 0;
          offsetY = halfHeight + (halfHeight - drawHeight) / 2;
        } else {
          drawHeight = halfHeight;
          drawWidth = halfHeight * mandalaAspect;
          offsetX = (width - drawWidth) / 2;
          offsetY = halfHeight;
        }
        
        ctx.drawImage(mandalaCanvas, offsetX, offsetY, drawWidth, drawHeight);
      } catch (err) {
        console.error('Error drawing mandala:', err);
      }
    }

    // Dividing line
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, halfHeight);
    ctx.lineTo(width, halfHeight);
    ctx.stroke();

    // Watermark
    const wmHeight = 70, wmPadding = 15, wmWidth = 320;
    const gradient = ctx.createLinearGradient(
      width - wmWidth - wmPadding, height - wmHeight - wmPadding,
      width - wmPadding, height - wmPadding
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.8)');
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(width - wmWidth - wmPadding, height - wmHeight - wmPadding, wmWidth, wmHeight);
    
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(width - wmWidth - wmPadding, height - wmHeight - wmPadding, wmWidth, wmHeight);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('SoundMeditationPilot', width - wmPadding - 15, height - wmPadding - 35);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffffcc';
    ctx.fillText('🧘 Chakra Sound Mixing', width - wmPadding - 15, height - wmPadding - 12);
    ctx.restore();

    // Recording indicator
    if (recordingState === 'recording') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(width / 2 - 80, halfHeight - 40, 160, 80);
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(width / 2 - 50, halfHeight, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${countdown}s`, width / 2 + 10, halfHeight + 12);
    }
  };

  const startRecording = async () => {
    if (!canvasRef.current || !cameraReady) {
      setCameraError('Camera not ready');
      return;
    }

    // Auto-start audio
    if (onStartPlayback && !isChakraPlaying) {
      onStartPlayback();
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    try {
      const canvas = canvasRef.current;
      canvas.width = 1280;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas failed');

      const canvasStream = canvas.captureStream(30);
      
      let finalStream = canvasStream;
      if (audioContext && masterGainNode) {
        try {
          const destination = audioContext.createMediaStreamDestination();
          masterGainNode.connect(destination);
          finalStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...destination.stream.getAudioTracks()
          ]);
        } catch (err) {
          console.warn('No audio capture:', err);
        }
      }

      // Try simple codec
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') 
        ? 'video/webm;codecs=vp8'
        : 'video/webm';
      
      const mediaRecorder = new MediaRecorder(finalStream, { 
        mimeType,
        videoBitsPerSecond: 2500000 
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length === 0) {
          setCameraError('Recording failed');
          setRecordingState('setup');
          return;
        }
        
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setRecordingState('complete');
        
        // Setup preview
        setTimeout(() => {
          if (previewVideoRef.current) {
            previewVideoRef.current.src = URL.createObjectURL(blob);
          }
        }, 100);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setRecordingState('recording');
      setCountdown(RECORDING_DURATION);

      // Countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Animation loop
      const animate = () => {
        drawCompositeFrame(ctx, canvas);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

    } catch (err) {
      console.error('Recording error:', err);
      setCameraError('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (onStopPlayback && isChakraPlaying) onStopPlayback();
  };

  const handleSave = () => {
    if (!videoBlob) return;
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chakra-meditation-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!videoBlob) return;
    try {
      const file = new File([videoBlob], `chakra-${Date.now()}.webm`, { type: 'video/webm' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        handleSave();
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const handleDelete = () => {
    setVideoBlob(null);
    setRecordingState('setup');
    setCountdown(RECORDING_DURATION);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Close button */}
      <button onClick={onClose} className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20">
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Camera switch */}
      {recordingState === 'setup' && (
        <button
          onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
          className="absolute top-4 left-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-full flex items-center gap-2"
        >
          <Video className="w-5 h-5" />
          <span className="text-sm font-bold">{facingMode === 'user' ? '🤳 Front' : '📸 Back'}</span>
        </button>
      )}

      {/* Error */}
      {cameraError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg max-w-md text-center">
          {cameraError}
        </div>
      )}

      {/* Preview mode */}
      {recordingState === 'complete' && videoBlob && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-black">
            <video
              ref={previewVideoRef}
              controls
              className="max-w-full max-h-full"
              loop
              playsInline
            />
          </div>
          <div className="flex gap-4 p-6 bg-slate-900">
            <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-4 rounded-xl flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              <span>Save</span>
            </button>
            <button onClick={handleShare} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Recording mode */}
      {(recordingState === 'setup' || recordingState === 'recording') && (
        <div className="flex-1 flex flex-col relative">
          {/* Camera feed - top half */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Loading overlay */}
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-white text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading camera...</p>
                </div>
              </div>
            )}
            
            {/* Record button */}
            {recordingState === 'setup' && cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                  <button
                    onClick={startRecording}
                    className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all hover:scale-110"
                    style={{ boxShadow: `0 0 40px ${chakraColor}80` }}
                  >
                    <Circle className="w-16 h-16 text-white fill-white" />
                  </button>
                  <p className="text-white text-center mt-4 text-sm font-semibold drop-shadow-lg">
                    Tap to Record (50s)
                  </p>
                </div>
              </div>
            )}

            {/* Countdown */}
            {recordingState === 'recording' && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-black/70 px-8 py-4 rounded-2xl">
                  <p className="text-red-500 text-6xl font-bold font-mono tabular-nums">{countdown}</p>
                  <p className="text-white/70 text-center text-sm mt-2">Recording...</p>
                </div>
              </div>
            )}
          </div>

          {/* Stop button */}
          {recordingState === 'recording' && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-50 pointer-events-none">
              <button
                onClick={stopRecording}
                className="pointer-events-auto w-20 h-20 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-2xl"
                style={{ boxShadow: `0 0 30px ${chakraColor}` }}
              >
                <Square className="w-10 h-10 text-red-600 fill-red-600" />
              </button>
            </div>
          )}

          {/* Chakra controller - bottom half */}
          <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-hidden p-4">
            <div className="w-full h-full max-w-md max-h-full flex items-center justify-center">
              <div data-video-recorder-mandala="true">
                <MandalaController
                  tracks={safeTracks}
                  onVolumeChange={onVolumeChange}
                  chakraColor={chakraColor}
                  controllerPosition={controllerPosition}
                  onControllerMove={onControllerMove}
                  isAutoMixing={isAutoMixing}
                />
              </div>
            </div>
          </div>

          {/* Hidden canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
