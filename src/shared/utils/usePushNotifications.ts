import { useEffect, useRef } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  requestPermission as requestMessagingPermission,
  getToken,
  onMessage,
  onTokenRefresh,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { connectChatUser } from '../chat/streamChatClient';

interface ChatTokenData {
  apiKey: string;
  token: string;
  userId: string;
  userName: string;
}

interface UsePushNotificationsArgs {
  /** Only start once the user is actually logged in. */
  enabled: boolean;
  /** Sends the FCM token to our backend for this user's account. */
  registerToken: (fcmToken: string) => Promise<unknown>;
  /** Fetches a Stream Chat identity token — used only to register this device for chat push. */
  getChatToken?: () => Promise<ChatTokenData>;
  /** Called when the user taps a notification (backgrounded or from killed state). */
  onNotificationTap?: (data: Record<string, string>) => void;
}

async function requestPermission(messagingInstance: ReturnType<typeof getMessaging>): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) return false;
  }
  const authStatus = await requestMessagingPermission(messagingInstance);
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

export function usePushNotifications({
  enabled,
  registerToken,
  getChatToken,
  onNotificationTap,
}: UsePushNotificationsArgs) {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!enabled || registeredRef.current) return;
    registeredRef.current = true;

    const messagingInstance = getMessaging();

    (async () => {
      const granted = await requestPermission(messagingInstance);
      if (!granted) return;

      const fcmToken = await getToken(messagingInstance);
      await registerToken(fcmToken).catch((err) =>
        console.error('Failed to register push token:', err),
      );

      if (getChatToken) {
        try {
          const chatToken = await getChatToken();
          const chatClient = await connectChatUser(chatToken);
          await chatClient.addDevice(fcmToken, 'firebase');
        } catch (err) {
          console.error('Failed to register device for chat push:', err);
        }
      }
    })();

    const unsubscribeRefresh = onTokenRefresh(messagingInstance, async (newToken) => {
      await registerToken(newToken).catch((err) =>
        console.error('Failed to re-register refreshed push token:', err),
      );
    });

    const unsubscribeForeground = onMessage(messagingInstance, async (remoteMessage) => {
      const title = remoteMessage.notification?.title || 'Endhalla';
      const body = remoteMessage.notification?.body || '';
      if (body) Alert.alert(title, body);
    });

    const unsubscribeOpened = onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
      if (remoteMessage.data) onNotificationTap?.(remoteMessage.data as Record<string, string>);
    });

    getInitialNotification(messagingInstance).then((remoteMessage) => {
      if (remoteMessage?.data) {
        onNotificationTap?.(remoteMessage.data as Record<string, string>);
      }
    });

    return () => {
      unsubscribeRefresh();
      unsubscribeForeground();
      unsubscribeOpened();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
