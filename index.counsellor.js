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
LogBox.ignoreAllLogs(true);
setBackgroundMessageHandler(getMessaging(), async () => { });

AppRegistry.registerComponent(appName, () => App);
