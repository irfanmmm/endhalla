import { Platform } from 'react-native';
import notifee, { AndroidCategory, AndroidImportance, AndroidVisibility, Event, EventType } from '@notifee/react-native';
import { CALLS_CHANNEL_ID, setupNotificationChannels } from './notificationChannels';
import { startIncomingCallRingtone, stopIncomingCallRingtone } from './incomingCallRingtone';

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
 * app is fully killed. Also starts a continuous looping ringtone, since a
 * plain notification sound only plays once — call
 * stopIncomingCallRingtone()/handleIncomingCallNotificationEvent to stop it.
 */
export async function displayIncomingCallNotification({ bookingId, callerName }: IncomingCallData): Promise<void> {
  if (Platform.OS !== 'android') return;

  // Usually already created by App.tsx's mount effect, but this can run
  // from a pure background/headless boot (no Activity/UI ever mounted) —
  // createChannel is idempotent, so ensure it here too rather than assume.
  await setupNotificationChannels();

  startIncomingCallRingtone();

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
      timeoutAfter: 120000,
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
 * Stops the ringtone for any event that means the call is no longer
 * "incoming and unanswered": Decline, Answer, the user tapping the
 * notification body, swiping it away, or it auto-timing out. Must work
 * headless (Decline in particular needs no app UI involved at all), and is
 * safe to call from both notifee.onForegroundEvent and onBackgroundEvent.
 */
export async function handleIncomingCallNotificationEvent({ type, detail }: Event): Promise<void> {
  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'decline' && detail.notification?.id) {
    await notifee.cancelNotification(detail.notification.id);
    stopIncomingCallRingtone();
    return;
  }
  if (
    type === EventType.DISMISSED ||
    type === EventType.PRESS ||
    (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'answer')
  ) {
    stopIncomingCallRingtone();
  }
}
