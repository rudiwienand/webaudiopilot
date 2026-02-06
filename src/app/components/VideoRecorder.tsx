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
  const RECORDING_DURATION = 50; // in seconds
  const [recordingState, setRecordingState] = useState<'setup' | 'recording' | 'complete'>('setup');
  const [countdown, setCountdown] = useState(RECORDING_DURATION);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // Front or back camera
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure tracks always exists (create default if needed)
  const safeTracks = tracks && tracks.length > 0 ? tracks : Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: `Track ${i + 1}`,
    volume: 0.5,
    isPlaying: false
  }));

  // Debug: Log props on mount
  useEffect(() => {
    console.log('VideoRecorder mounted with props:', {
      tracksLength: tracks?.length,
      tracks: tracks,
      safeTracksLength: safeTracks.length,
      audioContext: audioContext,
      masterGainNode: masterGainNode,
      controllerPosition: controllerPosition
    });
  }, []);

  // Initialize camera on mount
  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, []);

  // Reinitialize camera when facingMode changes
  useEffect(() => {
    if (streamRef.current) {
      // Stop current stream
      streamRef.current.getTracks().forEach(track => track.stop());
      // Reinitialize with new facing mode
      initializeCamera();
    }
  }, [facingMode]);

  // Live preview of mandala in setup mode
  useEffect(() => {
    if (recordingState !== 'setup') return;

    const previewInterval = setInterval(() => {
      // Force a re-render to show live mandala preview
      const mandalaCanvas = document.querySelector('[data-mandala-controller]') as HTMLCanvasElement;
      if (mandalaCanvas) {
        // The mandala is already updating in the background, we just need React to know
      }
    }, 100);

    return () => clearInterval(previewInterval);
  }, [recordingState]);

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const initializeCamera = async () => {
    try {
      setCameraError(null);
      setPermissionDenied(false);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported on this device/browser');
        return;
      }

      // Request camera access (front camera for selfie-style recording)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // We'll capture audio from the Web Audio API
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(resolve).catch((err) => {
                console.error('Video play error:', err);
                resolve(undefined);
              });
            };
          }
        });
      }
      
      console.log('Camera initialized successfully');
    } catch (err: any) {
      console.error('Camera access error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionDenied(true);
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found on this device');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraError('Camera is already in use by another app');
        } else {
          setCameraError(`Camera error: ${err.message}`);
        }
      } else {
        setCameraError('Unable to access camera. Please check browser settings.');
      }
    }
  };

  const captureChakraController = (): HTMLElement | null => {
    // Find the mandala controller element in the DOM
    const mandalaElement = document.querySelector('[data-mandala-controller]') as HTMLElement;
    return mandalaElement;
  };

  const drawCompositeFrame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const halfHeight = height / 2;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw camera feed on top half
    if (videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, width, halfHeight);
    }

    // Draw chakra controller on bottom half - CAPTURE ONLY VIDEO RECORDER CANVAS
    const videoRecorderContainer = document.querySelector('[data-video-recorder-mandala="true"]');
    const mandalaCanvas = videoRecorderContainer?.querySelector('[data-mandala-controller]') as HTMLCanvasElement;
    console.log('🔍 Looking for video recorder mandala canvas...', mandalaCanvas);
    
    if (mandalaCanvas && mandalaCanvas instanceof HTMLCanvasElement) {
      console.log('✅ Found mandala canvas:', mandalaCanvas.width, 'x', mandalaCanvas.height);
      // Draw the actual mandala canvas scaled to fit bottom half
      try {
        ctx.save();
        
        // Fill background for bottom half
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, halfHeight, width, halfHeight);
        
        // Calculate scaling to fit mandala in bottom half while maintaining aspect ratio
        const mandalaAspect = mandalaCanvas.width / mandalaCanvas.height;
        const targetAspect = width / halfHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (mandalaAspect > targetAspect) {
          // Mandala is wider - fit to width
          drawWidth = width;
          drawHeight = width / mandalaAspect;
          offsetX = 0;
          offsetY = halfHeight + (halfHeight - drawHeight) / 2;
        } else {
          // Mandala is taller or square - fit to height
          drawHeight = halfHeight;
          drawWidth = halfHeight * mandalaAspect;
          offsetX = (width - drawWidth) / 2;
          offsetY = halfHeight;
        }
        
        // Draw mandala canvas centered in bottom half
        ctx.drawImage(mandalaCanvas, offsetX, offsetY, drawWidth, drawHeight);
        
        ctx.restore();
      } catch (err) {
        console.error('Error drawing mandala:', err);
        // Fallback to placeholder
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, halfHeight, width, halfHeight);
      }
    } else {
      // Fallback: dark background for bottom half
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, halfHeight, width, halfHeight);
      ctx.fillStyle = '#ffffff80';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Move controller to see it here', width / 2, halfHeight + 100);
    }

    // Draw dividing line
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, halfHeight);
    ctx.lineTo(width, halfHeight);
    ctx.stroke();

    // Draw watermark (bottom right) - ENHANCED with gradient and glow
    const watermarkHeight = 70;
    const watermarkPadding = 15;
    const watermarkWidth = 320;
    
    // Gradient background for watermark
    const gradient = ctx.createLinearGradient(
      width - watermarkWidth - watermarkPadding,
      height - watermarkHeight - watermarkPadding,
      width - watermarkPadding,
      height - watermarkPadding
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // Blue
    gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.8)'); // Purple
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.8)'); // Pink
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      width - watermarkWidth - watermarkPadding,
      height - watermarkHeight - watermarkPadding,
      watermarkWidth,
      watermarkHeight
    );

    // Border glow
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      width - watermarkWidth - watermarkPadding,
      height - watermarkHeight - watermarkPadding,
      watermarkWidth,
      watermarkHeight
    );

    // Watermark text with shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(
      'SoundMeditationPilot',
      width - watermarkPadding - 15,
      height - watermarkPadding - 35
    );
    
    // Subtitle
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffffcc';
    ctx.fillText(
      '🧘 Chakra Sound Mixing',
      width - watermarkPadding - 15,
      height - watermarkPadding - 12
    );
    ctx.restore();

    // If recording, show timer
    if (recordingState === 'recording') {
      // Timer background (semi-transparent, centered over dividing line)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(width / 2 - 80, halfHeight - 40, 160, 80);
      
      // Red recording dot
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(width / 2 - 50, halfHeight, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Timer text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${countdown}s`, width / 2 + 10, halfHeight + 12);
    }
  };

  // Fixed codec fallback - tries multiple codecs until one works
  const startRecording = async () => {
    console.log('=== STARTING RECORDING ===');
    console.log('Canvas ref:', canvasRef.current);
    console.log('Audio context:', audioContext);
    console.log('Audio context state:', audioContext?.state);
    
    if (!canvasRef.current) {
      setCameraError('Canvas not ready. Please try again.');
      return;
    }

    // Auto-start audio playback
    if (onStartPlayback) {
      console.log('Auto-starting audio playback...');
      onStartPlayback();
      
      // Wait a bit for audio context to start
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Resume audio context if it's suspended
    if (audioContext && audioContext.state === 'suspended') {
      console.log('Resuming audio context...');
      await audioContext.resume();
    }

    try {
      const canvas = canvasRef.current;
      canvas.width = 1280;
      canvas.height = 1440; // Taller to fit both sections
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCameraError('Canvas failed to initialize');
        return;
      }

      // Capture canvas stream
      const canvasStream = canvas.captureStream(30); // 30 FPS
      console.log('Canvas stream created');

      // Capture audio from Web Audio API
      let finalStream = canvasStream;
      if (audioContext && audioContext.state === 'running' && masterGainNode) {
        try {
          const destination = audioContext.createMediaStreamDestination();
          masterGainNode.connect(destination);
          finalStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...destination.stream.getAudioTracks()
          ]);
          console.log('Audio added to stream');
        } catch (audioErr) {
          console.warn('Could not capture audio:', audioErr);
        }
      }

      // Try different codecs until one works - TEST FIRST, THEN USE
      const codecsToTry = [
        'video/webm', // Let browser choose (most compatible)
        'video/webm;codecs=vp8,opus', // VP8 video + Opus audio
        'video/webm;codecs=vp9,opus', // VP9 video + Opus audio  
        '' // Browser default
      ];

      let mediaRecorder: MediaRecorder | null = null;
      let workingCodec = '';

      for (const mimeType of codecsToTry) {
        // First, check if this codec is supported
        const isSupported = mimeType === '' || MediaRecorder.isTypeSupported(mimeType);
        console.log(`Testing codec: "${mimeType || 'default'}" - Supported: ${isSupported}`);
        
        if (!isSupported) {
          console.warn(`❌ Skipped: ${mimeType} - not supported`);
          continue;
        }

        try {
          const options: any = { videoBitsPerSecond: 2500000 };
          if (mimeType) {
            options.mimeType = mimeType;
          }

          // Try to create MediaRecorder
          const testRecorder = new MediaRecorder(finalStream, options);
          
          // Try to start it immediately to catch codec errors early
          testRecorder.start();
          testRecorder.stop();
          
          // If we got here, it works!
          mediaRecorder = new MediaRecorder(finalStream, options);
          workingCodec = mimeType || 'default';
          console.log('✅ Success! Using:', workingCodec);
          break;
        } catch (err) {
          console.warn('❌ Failed to use:', mimeType, err);
          continue;
        }
      }

      if (!mediaRecorder) {
        throw new Error('No supported video codec found. Browser may not support video recording.');
      }

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          console.log('Chunk:', e.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording complete');
        console.log('Chunks collected:', chunksRef.current.length);
        console.log('Total size:', chunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0), 'bytes');
        
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        console.log('Final blob size:', blob.size);
        
        setVideoBlob(blob);
        setRecordingState('complete');
        
        // Immediately set up preview
        if (previewVideoRef.current) {
          const url = URL.createObjectURL(blob);
          console.log('Preview URL created:', url);
          previewVideoRef.current.src = url;
          previewVideoRef.current.load(); // Force load
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        setCameraError('Recording error occurred');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Request data every 100ms for smoother recording
      console.log('Recording started!');
      setRecordingState('recording');
      setCountdown(RECORDING_DURATION);

      // Countdown timer
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Animation loop to draw composite frame
      const animate = () => {
        drawCompositeFrame(ctx, canvas);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

    } catch (err) {
      console.error('Recording error:', err);
      console.error('Details:', err instanceof Error ? err.message : err);
      setCameraError('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop audio playback when recording stops
    if (onStopPlayback) {
      onStopPlayback(); // Toggle to stop
    }
  };

  const handleSaveLocally = () => {
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

  const handleShareToInstagram = async () => {
    if (!videoBlob) return;

    try {
      const file = new File([videoBlob], `chakra-meditation-${Date.now()}.webm`, {
        type: 'video/webm'
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Chakra Sound Meditation',
          text: 'Check out my meditation session! 🧘‍♀️✨'
        });
      } else {
        // Fallback: just download
        setCameraError('Sharing not supported. Video will be downloaded instead.');
        handleSaveLocally();
      }
    } catch (err) {
      console.error('Share error:', err);
      setCameraError('Failed to share. You can download the video instead.');
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
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Camera Switch Button - PROMINENTLY VISIBLE IN TOP LEFT */}
      {recordingState === 'setup' && (
        <button
          onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
          className="absolute top-4 left-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-3 rounded-full flex items-center gap-2 transition-all shadow-2xl hover:scale-105"
          style={{ boxShadow: `0 0 20px ${chakraColor}60` }}
        >
          <Video className="w-5 h-5" />
          <span className="text-sm font-bold">
            {facingMode === 'user' ? '🤳 Front' : '📸 Back'}
          </span>
        </button>
      )}

      {/* Debug info - temporary - MOVED DOWN */}
      <div className="absolute top-20 left-4 z-50 bg-black/80 text-white p-3 rounded text-xs max-w-xs">
        <p>Stream: {streamRef.current ? '✅' : '❌'}</p>
        <p>Video ready: {videoRef.current?.readyState || 'N/A'}</p>
        <p>State: {recordingState}</p>
        <p>Camera: {facingMode}</p>
        <p>Mandala container: {document.querySelector('[data-video-recorder-mandala="true"]') ? '✅' : '❌'}</p>
      </div>

      {/* Error message */}
      {cameraError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg max-w-md text-center">
          {cameraError}
        </div>
      )}

      {/* Permission denied message */}
      {permissionDenied && (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <Video className="w-10 h-10 text-red-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white">Camera Permission Needed</h3>
            
            <p className="text-white/80 text-sm leading-relaxed">
              To record videos, you need to enable camera access for this website.
            </p>

            <div className="bg-slate-800/50 rounded-xl p-6 text-left space-y-3">
              <p className="text-white font-semibold text-sm">📱 How to Enable:</p>
              <ol className="text-white/70 text-sm space-y-2 list-decimal list-inside">
                <li>Tap the <strong className="text-white">aA</strong> icon in the Safari address bar</li>
                <li>Select <strong className="text-white">"Website Settings"</strong></li>
                <li>Find <strong className="text-white">"Camera"</strong> and set to <strong className="text-white">"Allow"</strong></li>
                <li>Reload this page and try again</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPermissionDenied(false);
                  setCameraError(null);
                  initializeCamera();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
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
              autoPlay
              loop
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 p-6 bg-slate-900">
            <button
              onClick={handleSaveLocally}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Save</span>
            </button>
            <button
              onClick={handleShareToInstagram}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
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
            
            {/* Record button - MOVED INSIDE CAMERA VIEW FOR MOBILE VISIBILITY */}
            {recordingState === 'setup' && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                  <button
                    onClick={startRecording}
                    className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all hover:scale-110"
                    style={{ boxShadow: `0 0 40px ${chakraColor}80` }}
                  >
                    <Circle className="w-16 h-16 text-white fill-white" />
                  </button>
                  <p className="text-white text-center mt-4 text-sm font-semibold drop-shadow-lg">Tap to Record (50s)</p>
                </div>
              </div>
            )}

            {/* Countdown timer - ALSO IN CAMERA VIEW */}
            {recordingState === 'recording' && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-black/70 px-8 py-4 rounded-2xl">
                  <p className="text-red-500 text-6xl font-bold font-mono tabular-nums">
                    {countdown}
                  </p>
                  <p className="text-white/70 text-center text-sm mt-2">Recording...</p>
                </div>
              </div>
            )}
          </div>

          {/* Stop button - ON THE DIVIDING LINE */}
          {recordingState === 'recording' && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-50 pointer-events-none">
              <button
                onClick={stopRecording}
                className="pointer-events-auto w-20 h-20 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-2xl transition-all hover:scale-110"
                style={{ boxShadow: `0 0 30px ${chakraColor}` }}
              >
                <Square className="w-10 h-10 text-red-600 fill-red-600" />
              </button>
            </div>
          )}

          {/* Chakra controller - bottom half - ISOLATED */}
          <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-hidden p-4 relative">
            {/* Single mandala controller - UNIQUE ID FOR VIDEO RECORDING */}
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

          {/* Hidden canvas for recording */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}