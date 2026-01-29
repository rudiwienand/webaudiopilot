 { useState, useRef, useEffect } from 'react';
 { Video, X, Download, Share2, Trash2, Circle } from 'lucide-react';

interface VideoRecorderProps {
  chakraColor: string;
  audioContext: AudioContext | null;
  masterGainNode: GainNode | null;
  onClose: () => void;
}

export function VideoRecorder({ chakraColor, audioContext, masterGainNode, onClose }: VideoRecorderProps) {
  const RECORDING_DURATION = 50; // in seconds
  const [recordingState, setRecordingState] = useState<'setup' | 'recording' | 'complete'>('setup');
  const [countdown, setCountdown] = useState(RECORDING_DURATION);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera on mount
  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, []);

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
          facingMode: 'user',
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

    // Draw chakra controller on bottom half - CAPTURE ACTUAL CANVAS
    const mandalaCanvas = document.querySelector('[data-mandala-controller]') as HTMLCanvasElement;
    if (mandalaCanvas && mandalaCanvas instanceof HTMLCanvasElement) {
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

    // Draw watermark (bottom right)
    const watermarkHeight = 60;
    const watermarkPadding = 20;
    
    // Semi-transparent background for watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(
      width - 280 - watermarkPadding,
      height - watermarkHeight - watermarkPadding,
      280,
      watermarkHeight
    );

    // Watermark text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(
      'SoundMeditationPilot',
      width - watermarkPadding - 10,
      height - watermarkPadding - 20
    );

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

  const startRecording = async () => {
    if (!canvasRef.current || !audioContext) {
      setCameraError('Recording setup failed. Please try again.');
      return;
    }

    try {
      const canvas = canvasRef.current;
      canvas.width = 1280;
      canvas.height = 1440; // Taller to fit both sections
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Capture canvas stream
      const canvasStream = canvas.captureStream(30); // 30 FPS

      // Capture audio from Web Audio API
      let finalStream = canvasStream;
      if (audioContext && audioContext.state === 'running' && masterGainNode) {
        try {
          const destination = audioContext.createMediaStreamDestination();
          // Connect the audio context to the destination
          masterGainNode.connect(destination);
          finalStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...destination.stream.getAudioTracks()
          ]);
        } catch (audioErr) {
          console.warn('Could not capture audio:', audioErr);
          // Continue with video only
        }
      }

      // Start MediaRecorder
      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setRecordingState('complete');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
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

  // Preview mode
  useEffect(() => {
    if (recordingState === 'complete' && videoBlob && previewVideoRef.current) {
      const url = URL.createObjectURL(videoBlob);
      previewVideoRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [recordingState, videoBlob]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Debug info - temporary */}
      <div className="absolute top-4 left-4 z-50 bg-black/80 text-white p-3 rounded text-xs max-w-xs">
        <p>Stream: {streamRef.current ? '✅' : '❌'}</p>
        <p>Video ready: {videoRef.current?.readyState || 'N/A'}</p>
        <p>State: {recordingState}</p>
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
        <div className="flex-1 flex flex-col">
          {/* Camera feed - top half */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Record button - center */}
          {recordingState === 'setup' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
              <button
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all hover:scale-110"
                style={{ boxShadow: `0 0 40px ${chakraColor}80` }}
              >
                <Circle className="w-16 h-16 text-white fill-white" />
              </button>
              <p className="text-white text-center mt-4 text-sm">Tap to Record (50s)</p>
            </div>
          )}

          {/* Countdown timer */}
          {recordingState === 'recording' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-black/70 px-8 py-4 rounded-2xl">
              <p className="text-red-500 text-6xl font-bold font-mono tabular-nums">
                {countdown}
              </p>
              <p className="text-white/70 text-center text-sm mt-2">Recording...</p>
            </div>
          )}

          {/* Chakra controller - bottom half */}
          <div 
            className="flex-1 bg-slate-900 flex items-center justify-center overflow-hidden"
            data-mandala-controller
          >
            <div className="text-white/50 text-center p-8">
              <p className="text-2xl mb-2">🧘‍♀️</p>
              <p>Chakra Controller View</p>
              <p className="text-sm mt-2 text-white/30">
                (Your mandala controller will appear here)
              </p>
            </div>
          </div>

          {/* Hidden canvas for recording */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}