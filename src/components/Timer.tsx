import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

export default function Timer({ duration, onDurationChange }: TimerProps) {
  const durations = [5, 10, 15, 30, 45, 60];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-teal-400" />
        <h3 className="text-lg font-medium text-gray-200">Session Duration</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {durations.map((mins) => (
          <button
            key={mins}
            onClick={() => onDurationChange(mins)}
            className={`p-2 rounded-lg text-center transition-colors ${
              duration === mins
                ? 'bg-teal-500 bg-opacity-20 border border-teal-500'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span className="text-sm text-gray-200">{mins} min</span>
          </button>
        ))}
      </div>
    </div>
  );
}