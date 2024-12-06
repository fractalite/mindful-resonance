export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

export function createGainNode(context: AudioContext, initialVolume: number): GainNode {
  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(initialVolume, context.currentTime);
  return gainNode;
}

export function cleanupAudioNode(node: MediaElementAudioSourceNode | null) {
  if (node) {
    try {
      node.disconnect();
    } catch (error) {
      console.error('Error cleaning up audio node:', error);
    }
  }
}

export async function initializeAudioElement(audio: HTMLAudioElement, url: string): Promise<void> {
  try {
    audio.crossOrigin = 'anonymous';
    audio.src = url;
    audio.loop = true;
    await audio.load();
  } catch (error) {
    console.error('Error initializing audio element:', error);
    throw error;
  }
}