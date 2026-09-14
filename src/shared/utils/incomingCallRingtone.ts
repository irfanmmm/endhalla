import Sound from 'react-native-sound';
import { getClientBaseUrl } from './config';

// A plain Android/iOS notification sound plays once — it cannot loop like a
// real incoming call. This plays a dedicated ringtone file on a continuous
// loop for as long as a call is incoming, independent of the notification
// itself. Safe to call from the background push handler too: unlike Fabric
// UI work (see notificationChannels.ts's history), audio playback via
// react-native-sound doesn't touch a rendered surface.
let ringtoneSound: Sound | null = null;

function ringtoneUrl(): string {
  const base = getClientBaseUrl().replace(/\/api\/?$/, '');
  return `${base}/public/ringtone.wav`;
}

export function startIncomingCallRingtone(): void {
  stopIncomingCallRingtone();

  const sound = new Sound(ringtoneUrl(), '', (error) => {
    if (error) {
      console.error('Failed to load ringtone:', error);
      return;
    }
    if (ringtoneSound !== sound) {
      // stopIncomingCallRingtone() already ran again before this loaded
      sound.release();
      return;
    }
    sound.setNumberOfLoops(-1);
    sound.play((success) => {
      if (!success) console.error('Ringtone playback failed');
    });
  });
  ringtoneSound = sound;
}

export function stopIncomingCallRingtone(): void {
  const sound = ringtoneSound;
  ringtoneSound = null;
  if (!sound) return;
  try {
    sound.stop(() => sound.release());
  } catch (e) {
    // already released/invalid — nothing to clean up
  }
}
