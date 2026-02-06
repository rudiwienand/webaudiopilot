import { useEffect, useRef, useState } from 'react';
import { getAudioUrl } from '../config/audioConfig';

interface Track {
  id: number;
  name: string;
  volume: number;
  isPlaying: boolean;
}

interface AudioTrackNode {
  audioElement: HTMLAudioElement;
  gainNode: GainNode;
  source: MediaElementAudioSourceNode;
  isLoaded: boolean;
}

export function useAudioEngine(
  chakraId: number,
  tracks: Track[],
  isChakraPlaying: boolean
) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioTracksRef = useRef<Map<number, AudioTrackNode>>(new Map());
  const masterGainNodeRef = useRef<GainNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        // Create master gain node
        masterGainNodeRef.current = audioContextRef.current.createGain();
        masterGainNodeRef.current.connect(audioContextRef.current.destination);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
        setLoadError('Audio not supported in this browser');
      }
    };

    initAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Load audio files for the current chakra using HTML5 Audio (works with CORS-restricted URLs)
  useEffect(() => {
    if (!audioContextRef.current || !isInitialized) return;

    const loadAudioFiles = async () => {
      setLoadError(null);
      let loadedCount = 0;
      const totalTracks = tracks.length;
      let hasAnyError = false;
      let errorMessage = '';

      for (const track of tracks) {
        try {
          const audioPath = getAudioUrl(chakraId, track.id);
          
          if (!audioPath || audioPath.includes('your-cdn.com')) {
            // Silently skip placeholder URLs - this is expected for demo
            continue;
          }

          // Create HTML5 Audio element (works better with CORS-restricted sources)
          const audioElement = new Audio();
          audioElement.crossOrigin = 'anonymous';
          audioElement.loop = true;
          audioElement.preload = 'auto';
          
          // Create promise to wait for audio to load
          const loadPromise = new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Audio load timeout'));
            }, 15000); // 15 second timeout

            audioElement.addEventListener('canplaythrough', () => {
              clearTimeout(timeout);
              resolve();
            }, { once: true });

            audioElement.addEventListener('error', (e) => {
              clearTimeout(timeout);
              // Only log errors for non-demo chakras to reduce console noise
              const errorDetails = audioElement.error ? {
                code: audioElement.error.code,
                message: audioElement.error.message,
                MEDIA_ERR_ABORTED: audioElement.error.code === 1,
                MEDIA_ERR_NETWORK: audioElement.error.code === 2,
                MEDIA_ERR_DECODE: audioElement.error.code === 3,
                MEDIA_ERR_SRC_NOT_SUPPORTED: audioElement.error.code === 4
              } : 'Unknown error';
              
              console.error(`Audio error for chakra ${chakraId}, track ${track.id}:`, errorDetails);
              console.error(`Failed URL: ${audioPath}`);
              reject(audioElement.error || new Error('Unknown audio error'));
            }, { once: true });

            audioElement.src = audioPath;
            audioElement.load();
          });

          await loadPromise;

          // Create Web Audio nodes
          const source = audioContextRef.current!.createMediaElementSource(audioElement);
          const gainNode = audioContextRef.current!.createGain();
          
          // Connect: source -> gainNode -> masterGainNode -> destination
          source.connect(gainNode);
          gainNode.connect(masterGainNodeRef.current!);
          gainNode.gain.value = track.volume / 100;

          // Store the audio track node
          audioTracksRef.current.set(track.id, {
            audioElement,
            gainNode,
            source,
            isLoaded: true
          });

          loadedCount++;
          setLoadingProgress((loadedCount / totalTracks) * 100);
        } catch (error: any) {
          // Only log errors for chakra 1 (which has real audio files)
          if (chakraId === 1) {
            console.error(`Error loading track ${track.id}:`, error);
          }
          hasAnyError = true;
          
          // Detect CORS error
          if (error?.message?.includes('CORS') || error?.code === 18 || error?.name === 'NetworkError') {
            errorMessage = 'CORS';
          }
        }
      }

      // Show error only if no tracks were loaded
      if (loadedCount === 0 && hasAnyError) {
        if (errorMessage === 'CORS') {
          setLoadError('CORS');
        } else {
          setLoadError(`No audio files found. Please add your MP3 files.`);
        }
      } else if (loadedCount < totalTracks) {
        console.warn(`Loaded ${loadedCount} out of ${totalTracks} tracks for chakra ${chakraId}`);
      }
    };

    loadAudioFiles();

    // Cleanup function
    return () => {
      audioTracksRef.current.forEach((trackNode) => {
        trackNode.audioElement.pause();
        trackNode.audioElement.src = '';
        trackNode.source.disconnect();
        trackNode.gainNode.disconnect();
      });
      audioTracksRef.current.clear();
      setLoadingProgress(0);
    };
  }, [chakraId, isInitialized]);

  // Play/Stop individual tracks
  useEffect(() => {
    if (!audioContextRef.current || !isInitialized) return;

    // Resume audio context if suspended (required by browser autoplay policies)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    tracks.forEach((track) => {
      const trackNode = audioTracksRef.current.get(track.id);
      if (!trackNode || !trackNode.isLoaded) return;

      const shouldPlay = track.isPlaying && isChakraPlaying;

      // Control playback
      if (shouldPlay && trackNode.audioElement.paused) {
        trackNode.audioElement.play().catch(err => {
          console.warn(`Failed to play track ${track.id}:`, err);
        });
      } else if (!shouldPlay && !trackNode.audioElement.paused) {
        trackNode.audioElement.pause();
      }
    });
  }, [tracks, isChakraPlaying, isInitialized]);

  // Update volume for all tracks
  useEffect(() => {
    if (!audioContextRef.current || !isInitialized) return;

    tracks.forEach((track) => {
      const trackNode = audioTracksRef.current.get(track.id);
      if (trackNode) {
        // Smooth volume transition
        const currentTime = audioContextRef.current!.currentTime;
        trackNode.gainNode.gain.cancelScheduledValues(currentTime);
        trackNode.gainNode.gain.setValueAtTime(trackNode.gainNode.gain.value, currentTime);
        trackNode.gainNode.gain.linearRampToValueAtTime(track.volume / 100, currentTime + 0.1);
      }
    });
  }, [tracks, isInitialized]);

  return {
    isInitialized,
    loadingProgress,
    loadError,
    audioContext: audioContextRef.current,
    masterGainNode: masterGainNodeRef.current
  };
}