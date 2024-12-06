import { useRef, useEffect, useCallback } from 'react';
import { Track } from '../types/audio';

interface AudioNode {
  audio?: HTMLAudioElement;
  gainNode: GainNode;
  oscillatorLeft?: OscillatorNode;
  oscillatorRight?: OscillatorNode;
  stereoPanner?: StereoPannerNode;
  isStarted?: boolean;
}

export function useAudioContext(
  audioContext: AudioContext | null,
  track: Track | null,
  volume: number,
  isPlaying: boolean
) {
  const nodeRef = useRef<AudioNode | null>(null);
  const loadedRef = useRef<boolean>(false);

  const initializeAudio = useCallback(async () => {
    if (!track || !audioContext || loadedRef.current) return;

    try {
      console.log(`Initializing ${track.type} track:`, track.name);

      // Create gain node
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.connect(audioContext.destination);

      if (track.type === 'binaural' && track.frequency) {
        console.log(`Creating binaural beat at ${track.frequency}Hz`);
        
        // Create stereo oscillators for binaural beats
        const baseFreq = 200; // Lower base frequency for better audibility
        const oscillatorLeft = audioContext.createOscillator();
        const oscillatorRight = audioContext.createOscillator();
        
        // Create stereo panners
        const stereoPannerLeft = audioContext.createStereoPanner();
        const stereoPannerRight = audioContext.createStereoPanner();

        // Set frequencies
        oscillatorLeft.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        oscillatorRight.frequency.setValueAtTime(baseFreq + track.frequency, audioContext.currentTime);
        
        // Set oscillator types for better audibility
        oscillatorLeft.type = 'sine';
        oscillatorRight.type = 'sine';

        // Pan left and right
        stereoPannerLeft.pan.setValueAtTime(-1, audioContext.currentTime);
        stereoPannerRight.pan.setValueAtTime(1, audioContext.currentTime);

        // Connect nodes
        oscillatorLeft.connect(stereoPannerLeft);
        oscillatorRight.connect(stereoPannerRight);
        stereoPannerLeft.connect(gainNode);
        stereoPannerRight.connect(gainNode);

        nodeRef.current = {
          gainNode,
          oscillatorLeft,
          oscillatorRight,
          stereoPanner: stereoPannerLeft,
          isStarted: false
        };

      } else if (track.url) {
        console.log(`Loading music track from URL: ${track.url}`);
        
        // Handle music tracks
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = track.url;
        audio.loop = true;

        // Wait for the audio to be loaded
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve);
          audio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            reject(e);
          });
          audio.load();
        });

        console.log('Audio loaded successfully');
        
        const source = audioContext.createMediaElementSource(audio);
        source.connect(gainNode);

        nodeRef.current = {
          audio,
          gainNode,
          isStarted: false
        };
      }

      loadedRef.current = true;
    } catch (error) {
      console.error(`Error initializing ${track.type} audio:`, error);
      loadedRef.current = false;
    }
  }, [audioContext, track, volume]);

  // Handle cleanup
  useEffect(() => {
    return () => {
      if (nodeRef.current) {
        try {
          if (nodeRef.current.audio) {
            nodeRef.current.audio.pause();
            nodeRef.current.audio.src = '';
          }
          if (nodeRef.current.oscillatorLeft && nodeRef.current.isStarted) {
            nodeRef.current.oscillatorLeft.stop();
          }
          if (nodeRef.current.oscillatorRight && nodeRef.current.isStarted) {
            nodeRef.current.oscillatorRight.stop();
          }
          nodeRef.current.gainNode.disconnect();
          loadedRef.current = false;
          console.log('Cleaned up audio nodes');
        } catch (error) {
          console.error('Error cleaning up audio nodes:', error);
        }
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (nodeRef.current && audioContext) {
      nodeRef.current.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      console.log(`Updated volume for ${track?.type} to ${volume}`);
    }
  }, [volume, audioContext, track]);

  // Handle playback state
  useEffect(() => {
    if (!nodeRef.current || !audioContext) return;

    try {
      if (isPlaying) {
        console.log(`Starting playback for ${track?.type}`);
        
        if (nodeRef.current.audio) {
          const playPromise = nodeRef.current.audio.play();
          if (playPromise) {
            playPromise.catch((error) => {
              console.error('Error playing audio:', error);
            });
          }
        } else if (nodeRef.current.oscillatorLeft && nodeRef.current.oscillatorRight) {
          if (!nodeRef.current.isStarted) {
            nodeRef.current.oscillatorLeft.start();
            nodeRef.current.oscillatorRight.start();
            nodeRef.current.isStarted = true;
            console.log('Started binaural oscillators');
          }
        }
      } else {
        console.log(`Stopping playback for ${track?.type}`);
        
        if (nodeRef.current.audio) {
          nodeRef.current.audio.pause();
        }
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
    }
  }, [isPlaying, audioContext, track]);

  // Initialize on mount or track change
  useEffect(() => {
    if (audioContext) {
      console.log('Initializing audio nodes');
      initializeAudio();
    }
  }, [initializeAudio, audioContext]);

  return nodeRef.current;
}