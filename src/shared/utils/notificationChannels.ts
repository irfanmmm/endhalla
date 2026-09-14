import { Platform } from 'react-native';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

export const CALLS_CHANNEL_ID = 'calls';

/**
 * @react-native-firebase/messaging auto-displays background/killed
 * notification messages using whatever Android channel they name, but it
 * never creates that channel itself — an unknown channel silently falls
 * back to default importance (no heads-up, no screen wake). This must run
 * before any push notification can arrive, so call it at app startup.
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: CALLS_CHANNEL_ID,
    name: 'Incoming calls',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
    vibration: true,
  });
}
