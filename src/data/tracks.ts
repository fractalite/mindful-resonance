import { Track } from '../types/audio';

export const musicTracks: Track[] = [
  {
    id: 'ambient-1',
    name: 'Cosmic Flow',
    // "Ambient Meditation" by SergePavkinMusic - Peaceful, cosmic ambient
    url: '/audio/cosmic-flow.mp3',
    type: 'music'
  },
  {
    id: 'ambient-2',
    name: 'Deep Ocean',
    // "Calm Ocean Waves" by Relaxing Nature Sounds - Perfect ocean ambience
    url: '/audio/deep-ocean.mp3',
    type: 'music'
  },
  {
    id: 'ambient-3',
    name: 'Forest Night',
    // "Night Forest Ambience" by SoundsForYou - Crickets and gentle wind
    url: '/audio/forest-night.mp3',
    type: 'music'
  }
];

export const binauralTracks: Track[] = [
  {
    id: 'delta',
    name: 'Delta Waves (Deep Sleep)',
    type: 'binaural',
    frequency: 2.5 // 2.5 Hz - optimal for deep sleep
  },
  {
    id: 'theta',
    name: 'Theta Waves (Deep Relaxation)',
    type: 'binaural',
    frequency: 6.0 // 6.0 Hz - optimal for deep relaxation
  },
  {
    id: 'alpha',
    name: 'Alpha Waves (Light Relaxation)',
    type: 'binaural',
    frequency: 10.0 // 10.0 Hz - optimal for light relaxation
  }
];