import { useRef, useState, useCallback } from 'react';
import { AudioMixSettings } from '../types/audio';

export function useVoiceRecorder(audioContext: AudioContext | null) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBuffer, setRecordedBuffer] = useState<AudioBuffer | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startRecording = useCallback(async () => {
    if (!audioContext) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        setRecordedBuffer(buffer);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [audioContext]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const playRecording = useCallback((mixSettings: AudioMixSettings, loop: boolean = true) => {
    if (!audioContext || !recordedBuffer) return;

    // Stop any existing playback
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
    }

    // Create new source and gain nodes
    const sourceNode = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    sourceNode.buffer = recordedBuffer;
    sourceNode.loop = loop;
    
    gainNode.gain.value = mixSettings.recordingVolume;
    
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    sourceNodeRef.current = sourceNode;
    gainNodeRef.current = gainNode;
    
    sourceNode.start(0);
  }, [audioContext, recordedBuffer]);

  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
  }, []);

  const updateVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, []);

  return {
    isRecording,
    recordedBuffer,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    updateVolume,
  };
}
