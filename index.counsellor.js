/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './src/counsellor/App';
import { name as appName } from './app.json';

// Must be registered at the top level, outside any component — handles
// data-only messages while the app is backgrounded/killed. Messages with a
// `notification` payload are shown by the OS automatically without this.
//
// Deliberately NOT calling setupNotificationChannels() here — this file
// also runs for a pure background push handled via a headless JS task with
// no Activity/UI attached (a Fabric native crash was traced to exactly
// that path on the client app's equivalent entry file). It's created in
// App.tsx's mount effect instead, since the counsellor app never displays
// an incoming-call notification of its own.
LogBox.ignoreAllLogs(true);
setBackgroundMessageHandler(getMessaging(), async () => { });

AppRegistry.registerComponent(appName, () => App);
