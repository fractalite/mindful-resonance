import React, { useRef, useState } from 'react';
import { Mic, Square, Play, Upload } from 'lucide-react';

interface RecorderProps {
  isPlaying: boolean;
  onRecordingComplete: (blob: Blob) => void;
}

export default function Recorder({ isPlaying, onRecordingComplete }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/wav' });
        onRecordingComplete(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Mic className="w-5 h-5 text-rose-400" />
        <h3 className="text-lg font-medium text-gray-200">Voice Recording</h3>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isPlaying}
          className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          {isRecording ? (
            <Square className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}