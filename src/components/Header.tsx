import React from 'react';
import { Moon } from 'lucide-react';

interface HeaderProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
}

export default function Header({ isPlaying, onTogglePlayback }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Moon className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Mindful Resonance
        </h1>
      </div>
      <button
        onClick={onTogglePlayback}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          isPlaying
            ? 'bg-purple-500 hover:bg-purple-600'
            : 'bg-indigo-500 hover:bg-indigo-600'
        }`}
      >
        {isPlaying ? 'Stop Session' : 'Start Session'}
      </button>
    </header>
  );
}