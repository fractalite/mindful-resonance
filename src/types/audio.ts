export interface Track {
  id: string;
  name: string;
  url?: string;
  type: 'music' | 'binaural' | 'recording';
  frequency?: number;
}

export interface AudioState {
  musicVolume: number;
  binauralVolume: number;
  recordingVolume: number;
  selectedMusic: Track | null;
  selectedBinaural: Track | null;
  isPlaying: boolean;
  isRecording: boolean;
  recordedAudio: Blob | null;
  recordingBuffer: AudioBuffer | null;
  timer: number;
}

export interface AudioMixSettings {
  musicVolume: number;
  binauralVolume: number;
  recordingVolume: number;
}