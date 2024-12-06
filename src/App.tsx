import React, { useState, useRef, useCallback } from 'react';
import { Track, AudioMixSettings } from './types/audio';
import { musicTracks, binauralTracks } from './data/tracks';
import { useAudioContext } from './hooks/useAudioContext';
import { VoiceRecorder } from './components/VoiceRecorder';

function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Track>(musicTracks[0]);
  const [selectedBinaural, setSelectedBinaural] = useState<Track>(binauralTracks[0]);
  const [mixSettings, setMixSettings] = useState<AudioMixSettings>({
    musicVolume: 0.4,
    binauralVolume: 0.3,
    recordingVolume: 0.5
  });
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const [recordedBuffer, setRecordedBuffer] = useState<AudioBuffer | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleStartSession = useCallback(async () => {
    try {
      // Create AudioContext only on user interaction
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Resume the context if it's suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      setIsSessionActive(true);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Please click again to start the audio session');
    }
  }, []);

  const handleStopSession = useCallback(() => {
    setIsSessionActive(false);
    // Don't close the AudioContext, just stop playback
  }, []);

  const musicNode = useAudioContext(
    audioContextRef.current,
    selectedMusic,
    mixSettings.musicVolume,
    isSessionActive
  );

  const binauralNode = useAudioContext(
    audioContextRef.current,
    selectedBinaural,
    mixSettings.binauralVolume,
    isSessionActive
  );

  const handleVolumeChange = useCallback((type: keyof AudioMixSettings, value: number) => {
    setMixSettings(prev => ({ ...prev, [type]: value }));
  }, []);

  const handleRecordingComplete = useCallback((buffer: AudioBuffer) => {
    setRecordedBuffer(buffer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="material-icons text-purple-400">nightlight</span>
          <h1 className="text-2xl font-semibold text-purple-400">Mindful Resonance</h1>
        </div>
        <button
          onClick={isSessionActive ? handleStopSession : handleStartSession}
          className={`px-6 py-2 rounded-lg ${
            isSessionActive
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isSessionActive ? 'End Session' : 'Start Session'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        {/* Ambient Tracks */}
        <section>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="material-icons">music_note</span>
            Ambient Tracks
          </h2>
          <div className="space-y-2">
            {musicTracks.map(track => (
              <button
                key={track.id}
                onClick={() => setSelectedMusic(track)}
                className={`w-full p-4 rounded-lg text-left ${
                  selectedMusic.id === track.id
                    ? 'bg-purple-900 border border-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>
        </section>

        {/* Binaural Frequencies */}
        <section>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="material-icons">waves</span>
            Binaural Frequencies
          </h2>
          <div className="space-y-2">
            {binauralTracks.map(track => (
              <button
                key={track.id}
                onClick={() => setSelectedBinaural(track)}
                className={`w-full p-4 rounded-lg text-left ${
                  selectedBinaural.id === track.id
                    ? 'bg-purple-900 border border-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div>{track.name}</div>
                <div className="text-sm text-gray-400">{track.frequency} Hz</div>
              </button>
            ))}
          </div>
        </section>

        {/* Volume Controls */}
        <section className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span>Music Volume</span>
              <span>{Math.round(mixSettings.musicVolume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={mixSettings.musicVolume}
              onChange={(e) => handleVolumeChange('musicVolume', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span>Binaural Volume</span>
              <span>{Math.round(mixSettings.binauralVolume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={mixSettings.binauralVolume}
              onChange={(e) => handleVolumeChange('binauralVolume', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {recordedBuffer && (
            <div>
              <label className="flex items-center justify-between mb-2">
                <span>Recording Volume</span>
                <span>{Math.round(mixSettings.recordingVolume * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mixSettings.recordingVolume}
                onChange={(e) => handleVolumeChange('recordingVolume', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </section>

        {/* Session Duration */}
        <section>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="material-icons">timer</span>
            Session Duration
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[5, 10, 15, 30, 45, 60].map(duration => (
              <button
                key={duration}
                onClick={() => setSessionDuration(duration)}
                className={`p-3 rounded-lg ${
                  sessionDuration === duration
                    ? 'bg-purple-900 border border-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {duration} min
              </button>
            ))}
          </div>
        </section>

        {/* Voice Recording */}
        <section>
          <VoiceRecorder
            audioContext={audioContextRef.current}
            isSessionActive={isSessionActive}
            mixSettings={mixSettings}
            onRecordingComplete={handleRecordingComplete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;