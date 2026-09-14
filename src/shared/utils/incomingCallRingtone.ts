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

  // Sound.setCategory is global/static, not per-instance — 'Ring' routes
  // playback through Android's STREAM_RING (the actual ringer volume a
  // real incoming call uses) instead of the default STREAM_MUSIC (the
  // media volume slider, which has nothing to do with calls and may be
  // turned down independently). Restored to 'Playback' on stop so it
  // doesn't leak into unrelated sound playback elsewhere in the app (e.g.
  // counsellor voice notes).
  try {
    // 'Ring' is an Android-only category (maps to STREAM_RING natively —
    // see node_modules/react-native-sound's Sound.kt) that the library's
    // TS types don't declare, since they're modeled on iOS's
    // AVAudioSessionCategory. This module is Android-only (see the
    // Platform.OS guard in incomingCallNotification.ts's caller).
    Sound.setCategory('Ring' as Parameters<typeof Sound.setCategory>[0]);
  } catch (e) {
    console.error('Sound.setCategory(Ring) failed:', e);
  }

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
  try {
    Sound.setCategory('Playback');
  } catch (e) {
    console.error('Sound.setCategory(Playback) restore failed:', e);
  }
}
