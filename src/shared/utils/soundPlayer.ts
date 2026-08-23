import Sound from 'react-native-sound';
import { getClientBaseUrl } from './config';

// Enable playback in silence mode (important for iOS)
try {
  Sound.setCategory('Playback');
} catch (e) {
  console.log('Sound setCategory info:', e);
}

let activeSound: Sound | null = null;
let currentPlayingUrl: string | null = null;

const resolveFullUrl = (rawUrl: string): string => {
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }
  const baseUrl = getClientBaseUrl();
  if (rawUrl.startsWith('/api/')) {
    const rootUrl = baseUrl.replace(/\/api\/?$/, '');
    return `${rootUrl}${rawUrl}`;
  }
  return `${baseUrl}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;
};

/**
 * Play sound clip from remote URL or local path using react-native-sound
 */
export const playAudio = (
  rawUrl: string,
  onEnd?: () => void,
  onError?: (err: any) => void
) => {
  stopAudio();

  const fullUrl = resolveFullUrl(rawUrl);
  currentPlayingUrl = fullUrl;
  console.log('🎵 Initializing Sound instance for:', fullUrl);

  const sound = new Sound(fullUrl, '', (error) => {
    if (error) {
      console.log('❌ Failed to load sound from URL:', fullUrl, error);
      if (currentPlayingUrl === fullUrl) {
        currentPlayingUrl = null;
      }
      if (onError) onError(error);
      return;
    }

    activeSound = sound;
    console.log('▶️ Playing sound. Duration:', sound.getDuration(), 'seconds');

    sound.play((success) => {
      if (success) {
        console.log('✅ Successfully finished audio playback');
      } else {
        console.log('❌ Audio playback failed due to decoding errors');
      }
      if (activeSound === sound) {
        activeSound = null;
        currentPlayingUrl = null;
      }
      sound.release();
      if (onEnd) onEnd();
    });
  });
};

export const stopAudio = () => {
  if (activeSound) {
    try {
      activeSound.stop(() => {
        activeSound?.release();
        activeSound = null;
      });
    } catch (e) {
      activeSound = null;
    }
  }
  currentPlayingUrl = null;
};

export const isAudioPlaying = (rawUrl?: string) => {
  if (!activeSound) return false;
  if (!rawUrl) return true;
  const fullUrl = resolveFullUrl(rawUrl);
  return currentPlayingUrl === fullUrl;
};
