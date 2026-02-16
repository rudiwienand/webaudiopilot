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
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const watermarkCanvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const loadLogo = () => {
    const logoImage = new Image();
    logoImage.crossOrigin = 'anonymous';
    logoImage.src = '/TTF_Logo.png';
    logoImage.onload = () => {
      logoImageRef.current = logoImage;
      console.log('✅ Logo loaded successfully', logoImage.width, 'x', logoImage.height);
      
      // Pre-render watermark at high quality
      createHighQualityWatermark();
    };
    logoImage.onerror = () => {
      console.error('Failed to load logo from /TTF_Logo.png');
    };
  };

  const createHighQualityWatermark = () => {
    if (!logoImageRef.current) return;
    
    const scale = 3; // Render at 3x resolution for ultra-sharp quality
    const logoSize = 84 * scale;
    const text = 'SoundMeditationPilot';
    const textRadius = logoSize / 2 + 32 * scale;
    const containerSize = textRadius * 2 + 30 * scale;
    
    // Create offscreen canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = containerSize;
    offCanvas.height = containerSize;
    const offCtx = offCanvas.getContext('2d', { alpha: true })!;
    
    // Enable best quality
    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = 'high';
    
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    
    // Background circle
    offCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    offCtx.beginPath();
    offCtx.arc(centerX, centerY, containerSize / 2 - 5 * scale, 0, Math.PI * 2);
    offCtx.fill();
    
    // Draw logo at center
    const logoX = centerX - logoSize / 2;
    const logoY = centerY - logoSize / 2;
    
    offCtx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    offCtx.shadowBlur = 12 * scale;
    offCtx.shadowOffsetX = 3 * scale;
    offCtx.shadowOffsetY = 3 * scale;
    
    offCtx.drawImage(
      logoImageRef.current,
      logoX,
      logoY,
      logoSize,
      logoSize
    );
    
    // Draw curved text
    offCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    offCtx.shadowBlur = 8 * scale;
    offCtx.shadowOffsetX = 2 * scale;
    offCtx.shadowOffsetY = 2 * scale;
    offCtx.fillStyle = '#ffffff';
    offCtx.font = `bold ${13 * scale}px Arial, sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    
    const angleStep = (Math.PI * 2) / text.length;
    const startAngle = -Math.PI / 2;
    
    for (let i = 0; i < text.length; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + Math.cos(angle) * textRadius;
      const y = centerY + Math.sin(angle) * textRadius;
      
      offCtx.save();
      offCtx.translate(x, y);
      offCtx.rotate(angle + Math.PI / 2);
      offCtx.fillText(text[i], 0, 0);
      offCtx.restore();
    }
    
    watermarkCanvasRef.current = offCanvas;
    console.log('✅ High-quality watermark pre-rendered at', containerSize, 'x', containerSize);
  };

  const drawCompositeFrame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width; // 1080
    const height = canvas.height; // 1920
    const halfHeight = height / 2; // 960

    // Clear entire canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Top half: Camera feed (with proper aspect ratio fitting)
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const video = videoRef.current;
      const videoAspect = video.videoWidth / video.videoHeight;
      const targetAspect = width / halfHeight;
      
      let sourceX = 0, sourceY = 0, sourceWidth = video.videoWidth, sourceHeight = video.videoHeight;
      
      // Crop video to fill the top half (cover mode)
      if (videoAspect > targetAspect) {
        // Video is wider - crop sides
        sourceWidth = video.videoHeight * targetAspect;
        sourceX = (video.videoWidth - sourceWidth) / 2;
      } else {
        // Video is taller - crop top/bottom
        sourceHeight = video.videoWidth / targetAspect;
        sourceY = (video.videoHeight - sourceHeight) / 2;
      }
      
      // Mirror the video when using front camera
      if (facingMode === 'user') {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, -width, 0, width, halfHeight);
        ctx.restore();
      } else {
        ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, halfHeight);
      }
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, halfHeight);
    }

    // Bottom half: Mandala (centered and scaled to fit)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, halfHeight, width, halfHeight);
    
    const mandalaContainer = document.querySelector('[data-video-recorder-mandala="true"]');
    const mandalaCanvas = mandalaContainer?.querySelector('[data-mandala-controller]') as HTMLCanvasElement;
    
    if (mandalaCanvas) {
      try {
        // The mandala is square, so we fit it centered in the bottom half
        const mandalaSize = Math.min(width, halfHeight) * 0.95; // 95% to leave some padding
        const offsetX = (width - mandalaSize) / 2;
        const offsetY = halfHeight + (halfHeight - mandalaSize) / 2;
        
        ctx.drawImage(mandalaCanvas, offsetX, offsetY, mandalaSize, mandalaSize);
      } catch (err) {
        console.error('Error drawing mandala:', err);
      }
    }

    // Dividing line between camera and mandala
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, halfHeight);
    ctx.lineTo(width, halfHeight);
    ctx.stroke();

    // Watermark (bottom right corner) - Clean text watermark
    ctx.save();
    
    const text = 'Sound Meditation Pilot';
    const wmPadding = 20;
    
    // Use system font similar to app
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    
    // Measure text
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 20;
    const bgPadding = 10;
    
    // Position at bottom right corner
    const bgX = width - textWidth - bgPadding * 2 - wmPadding;
    const bgY = height - textHeight - bgPadding * 2 - wmPadding;
    
    // Background with chakra color accent
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.roundRect(
      bgX,
      bgY,
      textWidth + bgPadding * 2,
      textHeight + bgPadding * 2,
      6
    );
    ctx.fill();
    
    // Subtle chakra-colored border
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 2;
    ctx.roundRect(
      bgX,
      bgY,
      textWidth + bgPadding * 2,
      textHeight + bgPadding * 2,
      6
    );
    ctx.stroke();
    
    // Text with subtle chakra-colored glow
    ctx.shadowColor = chakraColor;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, width - bgPadding - wmPadding, height - bgPadding - wmPadding);
    
    ctx.restore();

    // Recording timer (on the dividing line, centered)
    if (recordingState === 'recording') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(width / 2 - 70, halfHeight - 35, 140, 70);
      
      // Red dot
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(width / 2 - 45, halfHeight, 7, 0, Math.PI * 2);
      ctx.fill();
      
      // Timer text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${countdown}s`, width / 2 + 5, halfHeight + 10);
    }
  };

  const startRecording = async () => {
    console.log('=== START RECORDING ===');
    
    if (!canvasRef.current || !cameraReady) {
      console.error('Not ready:', { canvas: !!canvasRef.current, cameraReady });
      setCameraError('Camera not ready');
      return;
    }

    // Auto-start audio
    if (onStartPlayback && !isChakraPlaying) {
      console.log('Starting audio playback...');
      onStartPlayback();
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (audioContext && audioContext.state === 'suspended') {
      console.log('Resuming audio context...');
      await audioContext.resume();
    }

    try {
      const canvas = canvasRef.current;
      
      // Try smaller resolution first for better compatibility
      canvas.width = 720;
      canvas.height = 1280;
      console.log('Canvas size:', canvas.width, 'x', canvas.height);
      
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        console.error('Failed to get canvas context');
        throw new Error('Canvas context failed');
      }

      console.log('Capturing canvas stream...');
      const canvasStream = canvas.captureStream(25); // Lower frame rate for better performance
      console.log('Canvas stream tracks:', canvasStream.getTracks().length);
      
      let finalStream = canvasStream;
      if (audioContext && masterGainNode) {
        try {
          console.log('Adding audio to stream...');
          const destination = audioContext.createMediaStreamDestination();
          masterGainNode.connect(destination);
          finalStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...destination.stream.getAudioTracks()
          ]);
          console.log('Final stream tracks:', finalStream.getTracks().length);
        } catch (err) {
          console.warn('Audio capture failed:', err);
        }
      }

      // Test multiple codecs - prioritize MP4 for WhatsApp/Instagram compatibility
      const codecs = [
        'video/mp4',                    // MP4 (best for social media) - Safari support
        'video/webm;codecs=vp8,opus',  // VP8 video + Opus audio
        'video/webm;codecs=vp9,opus',  // VP9 video + Opus audio  
        'video/webm',                   // Let browser choose
        '' // default
      ];
      
      let selectedCodec = '';
      for (const codec of codecs) {
        const supported = codec === '' || MediaRecorder.isTypeSupported(codec);
        console.log(`Codec "${codec || 'default'}": ${supported ? '✅' : '❌'}`);
        if (supported && !selectedCodec) {
          selectedCodec = codec;
        }
      }
      
      if (!selectedCodec && selectedCodec !== '') {
        throw new Error('No supported video codec found');
      }
      
      console.log('Using codec:', selectedCodec || 'default');
      
      const options: any = {
        videoBitsPerSecond: 1500000 // Lower bitrate for stability
      };
      if (selectedCodec) options.mimeType = selectedCodec;
      
      console.log('Creating MediaRecorder with options:', options);
      const mediaRecorder = new MediaRecorder(finalStream, options);

      chunksRef.current = [];
      let chunkCount = 0;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          chunkCount++;
          console.log(`Chunk ${chunkCount}: ${e.data.size} bytes`);
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        setCameraError('Recording error occurred');
      };

      mediaRecorder.onstop = () => {
        console.log('=== RECORDING STOPPED ===');
        console.log('Total chunks:', chunksRef.current.length);
        
        if (chunksRef.current.length === 0) {
          console.error('No chunks collected!');
          setCameraError('Recording failed - no data captured');
          setRecordingState('setup');
          return;
        }
        
        const totalSize = chunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log('Total size:', totalSize, 'bytes');
        
        const blob = new Blob(chunksRef.current, { type: selectedCodec || 'video/webm' });
        console.log('Final blob:', blob.size, 'bytes');
        
        if (blob.size === 0) {
          console.error('Empty blob!');
          setCameraError('Recording failed - empty video');
          setRecordingState('setup');
          return;
        }
        
        setVideoBlob(blob);
        setRecordingState('complete');
        
        // Setup preview
        setTimeout(() => {
          if (previewVideoRef.current) {
            const url = URL.createObjectURL(blob);
            console.log('Preview URL:', url);
            previewVideoRef.current.src = url;
          }
        }, 100);
      };

      mediaRecorderRef.current = mediaRecorder;
      
      console.log('Starting MediaRecorder...');
      mediaRecorder.start(200); // Larger chunks for stability
      console.log('MediaRecorder state:', mediaRecorder.state);
      
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
        try {
          drawCompositeFrame(ctx, canvas);
        } catch (err) {
          console.error('Draw error:', err);
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
      
      console.log('Recording started successfully!');

    } catch (err: any) {
      console.error('=== RECORDING FAILED ===');
      console.error('Error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setCameraError(`Failed to start recording: ${err.message}`);
      setRecordingState('setup');
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
    
    // Always use .mp4 extension for better compatibility with social media
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chakra-meditation-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!videoBlob) return;
    
    const file = new File([videoBlob], `chakra-meditation-${Date.now()}.mp4`, { type: 'video/mp4' });
    
    // Directly try Web Share API (works on mobile and can share files)
    if (navigator.share) {
      try {
        // Check if we can share files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          console.log('✅ Sharing video file via Web Share API');
          await navigator.share({
            files: [file],
            title: 'My Meditation Session',
            text: 'Check out my meditation session from Sound Meditation Pilot!'
          });
          return;
        } else {
          console.log('❌ Cannot share files via Web Share API');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User cancelled the share, do nothing
          console.log('User cancelled share');
          return;
        }
        console.log('Web Share API failed:', err);
      }
    }
    
    // Fallback: Download the video if Web Share doesn't work
    console.log('Fallback: Downloading video');
    handleSave();
    alert('Video downloaded! You can now share it from your gallery.');
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
          className="absolute top-4 left-4 z-[100] bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-full flex items-center gap-2"
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
            <button onClick={handleShare} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
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
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
            
            {/* Loading overlay */}
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="text-white text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading camera...</p>
                </div>
              </div>
            )}
            
            {/* Record button */}
            {recordingState === 'setup' && cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center z-[100]">
                <div>
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
              <div className="absolute inset-0 flex items-center justify-center z-[100]">
                <div className="bg-black/70 px-8 py-4 rounded-2xl">
                  <p className="text-red-500 text-6xl font-bold font-mono tabular-nums">{countdown}</p>
                  <p className="text-white/70 text-center text-sm mt-2">Recording...</p>
                </div>
              </div>
            )}
          </div>

          {/* Stop button */}
          {recordingState === 'recording' && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-50">
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-2xl"
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