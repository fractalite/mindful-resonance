import { musicTracks, binauralTracks } from '../data/tracks';
import { Track } from '../types/audio';
import AudioPlayer from './AudioPlayer';
import TrackSelector from './TrackSelector';
import Timer from './Timer';
import Recorder from './Recorder';

interface AudioControlsProps {
  state: {
    musicVolume: number;
    binauralVolume: number;
    selectedMusic: Track;
    selectedBinaural: Track;
    isPlaying: boolean;
    duration: number;
  };
  onVolumeChange: (type: 'music' | 'binaural', value: number) => void;
  onTrackSelect: (type: 'music' | 'binaural', track: Track) => void;
  onRecordingComplete: (blob: Blob) => void;
  onDurationChange: (duration: number) => void;
}

export default function AudioControls({
  state,
  onVolumeChange,
  onTrackSelect,
  onRecordingComplete,
  onDurationChange
}: AudioControlsProps) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <TrackSelector
          tracks={musicTracks}
          selectedTrack={state.selectedMusic}
          onSelect={(track) => onTrackSelect('music', track)}
          type="music"
        />
        <TrackSelector
          tracks={binauralTracks}
          selectedTrack={state.selectedBinaural}
          onSelect={(track) => onTrackSelect('binaural', track)}
          type="binaural"
        />
      </div>

      <div className="space-y-6">
        <AudioPlayer
          musicTrack={state.selectedMusic}
          binauralTrack={state.selectedBinaural}
          musicVolume={state.musicVolume}
          binauralVolume={state.binauralVolume}
          isPlaying={state.isPlaying}
          onVolumeChange={onVolumeChange}
        />
        <Timer
          duration={state.duration}
          onDurationChange={onDurationChange}
        />
        <Recorder
          isPlaying={state.isPlaying}
          onRecordingComplete={onRecordingComplete}
        />
      </div>
    </main>
  );
}