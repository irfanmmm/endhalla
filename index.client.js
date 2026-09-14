/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './src/client/App';
import { name as appName } from './app.json';
import { displayIncomingCallNotification, handleIncomingCallDecline } from './src/shared/utils/incomingCallNotification';

// Must be registered at the top level, outside any component — handles
// data-only messages while the app is backgrounded/killed. Incoming calls
// are sent data-only (see backend/src/utils/callToken.js) so they land
// here instead of being auto-displayed, letting us show a real
// full-screen-capable incoming-call notification instead of a plain one.
//
// Deliberately NOT calling setupNotificationChannels() here — this file
// also runs for a pure background push handled via a headless JS task with
// no Activity/UI attached (confirmed: a Fabric native crash was traced to
// exactly that path). displayIncomingCallNotification ensures the channel
// exists itself; anything not strictly required for background push
// handling belongs in App.tsx's mount effect instead.
LogBox.ignoreAllLogs(true);
setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  if (remoteMessage.data?.type === 'incoming_call') {
    await displayIncomingCallNotification({
      bookingId: remoteMessage.data.bookingId,
      callerName: remoteMessage.data.callerName || 'Your counsellor',
    });
  }
});

// Also top-level: the Decline action must dismiss the call notification
// even while the app is backgrounded or fully killed, with no UI involved.
notifee.onBackgroundEvent(handleIncomingCallDecline);

AppRegistry.registerComponent(appName, () => App);
