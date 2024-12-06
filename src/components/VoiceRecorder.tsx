import React, { useEffect } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { AudioMixSettings } from '../types/audio';

interface VoiceRecorderProps {
  audioContext: AudioContext | null;
  isSessionActive: boolean;
  mixSettings: AudioMixSettings;
  onRecordingComplete: (buffer: AudioBuffer) => void;
}

export function VoiceRecorder({ 
  audioContext, 
  isSessionActive,
  mixSettings,
  onRecordingComplete 
}: VoiceRecorderProps) {
  const {
    isRecording,
    recordedBuffer,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
  } = useVoiceRecorder(audioContext);

  useEffect(() => {
    if (recordedBuffer) {
      onRecordingComplete(recordedBuffer);
    }
  }, [recordedBuffer, onRecordingComplete]);

  useEffect(() => {
    if (!isSessionActive) {
      stopPlayback();
    }
  }, [isSessionActive, stopPlayback]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl text-white mb-2">Voice Recording</h2>
      <div className="flex items-center gap-4">
        {!isRecording && !recordedBuffer && (
          <button
            onClick={startRecording}
            disabled={!isSessionActive || !audioContext}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg 
              ${(isSessionActive && audioContext)
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
          >
            <span className="material-icons">mic</span>
            Record Mantra
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            <span className="material-icons">stop</span>
            Stop Recording
          </button>
        )}

        {recordedBuffer && !isRecording && (
          <button
            onClick={() => playRecording(mixSettings, true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          >
            <span className="material-icons">play_arrow</span>
            Play Mantra
          </button>
        )}

        {recordedBuffer && (
          <button
            onClick={stopPlayback}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
          >
            <span className="material-icons">stop</span>
            Stop Playback
          </button>
        )}
      </div>

      {!isSessionActive && (
        <p className="text-gray-400 text-sm">
          Start a session to record your mantras
        </p>
      )}
    </div>
  );
}
