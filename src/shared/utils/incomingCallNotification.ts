import { Platform } from 'react-native';
import notifee, { AndroidCategory, AndroidImportance, AndroidVisibility, Event, EventType } from '@notifee/react-native';
import { CALLS_CHANNEL_ID } from './notificationChannels';

export interface IncomingCallData {
  bookingId: string;
  callerName: string;
}

/**
 * Shows a real incoming-call-style notification: heads-up with sound while
 * unlocked, and a full-screen Accept/Decline UI over the lock screen when
 * locked — the same mechanism WhatsApp/Signal use (AndroidCategory.CALL +
 * fullScreenAction on a HIGH-importance channel). Works from any JS context
 * that can run notifee, including the background message handler while the
 * app is fully killed.
 */
export async function displayIncomingCallNotification({ bookingId, callerName }: IncomingCallData): Promise<void> {
  if (Platform.OS !== 'android') return;

  await notifee.displayNotification({
    title: 'Incoming video call',
    body: `${callerName} is calling you now`,
    data: { type: 'incoming_call', bookingId },
    android: {
      channelId: CALLS_CHANNEL_ID,
      category: AndroidCategory.CALL,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      ongoing: true,
      autoCancel: true,
      timeoutAfter: 45000,
      fullScreenAction: { id: 'default' },
      pressAction: { id: 'default' },
      actions: [
        { title: 'Decline', pressAction: { id: 'decline' } },
        // Only 'default' auto-launches the app — any other action id needs
        // launchActivity set explicitly, or the tap fires the event and
        // does nothing visible (silently closes a transparent bridge
        // activity without ever opening MainActivity).
        { title: 'Answer', pressAction: { id: 'answer', launchActivity: 'default' } },
      ],
    },
  });
}

export async function clearIncomingCallNotifications(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await notifee.cancelDisplayedNotifications();
}

/**
 * Handles a Decline tap on an incoming-call notification — the one action
 * that must work headless, with no app UI involved, while the app is
 * backgrounded or fully killed.
 */
export async function handleIncomingCallDecline({ type, detail }: Event): Promise<void> {
  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'decline' && detail.notification?.id) {
    await notifee.cancelNotification(detail.notification.id);
  }
}
