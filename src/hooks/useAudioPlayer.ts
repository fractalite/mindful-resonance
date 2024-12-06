import { useRef, useEffect, useCallback } from 'react';
import { Track } from '../types/audio';

interface AudioState {
  audio: HTMLAudioElement;
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  gain: GainNode;
}

export function useAudioPlayer(
  track: Track | null,
  volume: number,
  isPlaying: boolean
) {
  const stateRef = useRef<AudioState | null>(null);
  const initializingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.audio.pause();
      stateRef.current.audio.src = '';
      stateRef.current.gain.disconnect();
      stateRef.current.source.disconnect();
    }
    stateRef.current = null;
  }, []);

  const initialize = useCallback(async () => {
    if (!track || initializingRef.current) return;
    
    try {
      initializingRef.current = true;
      cleanup();

      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = track.url;
      audio.loop = true;
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaElementSource(audio);
      const gain = context.createGain();
      
      source.connect(gain);
      gain.connect(context.destination);
      gain.gain.setValueAtTime(volume, context.currentTime);
      
      await audio.load();
      
      stateRef.current = { audio, context, source, gain };
    } catch (error) {
      console.error('Error initializing audio:', error);
    } finally {
      initializingRef.current = false;
    }
  }, [track, volume, cleanup]);

  // Initialize audio when track changes
  useEffect(() => {
    void initialize();
    return cleanup;
  }, [track, initialize, cleanup]);

  // Handle volume changes
  useEffect(() => {
    if (stateRef.current) {
      stateRef.current.gain.gain.setValueAtTime(
        volume,
        stateRef.current.context.currentTime
      );
    }
  }, [volume]);

  // Handle playback state
  useEffect(() => {
    const playAudio = async () => {
      if (!stateRef.current) return;

      try {
        if (isPlaying) {
          if (stateRef.current.context.state === 'suspended') {
            await stateRef.current.context.resume();
          }
          await stateRef.current.audio.play();
        } else {
          stateRef.current.audio.pause();
        }
      } catch (error) {
        console.error('Error controlling playback:', error);
      }
    };

    void playAudio();
  }, [isPlaying]);

  return stateRef.current?.audio || null;
}