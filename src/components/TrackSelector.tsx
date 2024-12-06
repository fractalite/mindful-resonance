import React from 'react';
import { Track } from '../types/audio';
import { Music, Waves } from 'lucide-react';

interface TrackSelectorProps {
  tracks: Track[];
  selectedTrack: Track | null;
  onSelect: (track: Track) => void;
  type: 'music' | 'binaural';
}

export default function TrackSelector({
  tracks,
  selectedTrack,
  onSelect,
  type
}: TrackSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {type === 'music' ? (
          <Music className="w-5 h-5 text-purple-400" />
        ) : (
          <Waves className="w-5 h-5 text-indigo-400" />
        )}
        <h3 className="text-lg font-medium text-gray-200">
          {type === 'music' ? 'Ambient Tracks' : 'Binaural Frequencies'}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => onSelect(track)}
            className={`p-3 rounded-lg text-left transition-colors ${
              selectedTrack?.id === track.id
                ? 'bg-purple-500 bg-opacity-20 border border-purple-500'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="text-sm font-medium text-gray-200">
              {track.name}
            </div>
            {track.frequency && (
              <div className="text-xs text-gray-400">
                {track.frequency} Hz
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}