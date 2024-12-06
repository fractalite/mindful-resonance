import React from 'react';
import { Volume2, Volume1 } from 'lucide-react';
import { Track } from '../types/audio';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AudioPlayerProps {
  musicTrack: Track | null;
  binauralTrack: Track | null;
  musicVolume: number;
  binauralVolume: number;
  isPlaying: boolean;
  onVolumeChange: (type: 'music' | 'binaural', value: number) => void;
}

export default function AudioPlayer({
  musicTrack,
  binauralTrack,
  musicVolume,
  binauralVolume,
  isPlaying,
  onVolumeChange,
}: AudioPlayerProps) {
  useAudioPlayer(musicTrack, musicVolume, isPlaying);
  useAudioPlayer(binauralTrack, binauralVolume, isPlaying);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-4">
        <Volume2 className="w-6 h-6 text-purple-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={musicVolume}
          onChange={(e) => onVolumeChange('music', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-400">
          {Math.round(musicVolume * 100)}%
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <Volume1 className="w-6 h-6 text-indigo-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={binauralVolume}
          onChange={(e) => onVolumeChange('binaural', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-400">
          {Math.round(binauralVolume * 100)}%
        </span>
      </div>
    </div>
  );
}