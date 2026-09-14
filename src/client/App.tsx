import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '../shared/store';
import AppNavigator from './navigation/AppNavigator';
import { setupNotificationChannels } from '../shared/utils/notificationChannels';

export default function App() {
  useEffect(() => {
    // Deliberately not called from index.client.js's top level — that file
    // also runs for a pure background push (a headless JS task with no
    // Activity/UI attached), and this only needs to exist by the time the
    // app is actually open, or right before an incoming-call notification
    // is displayed (see incomingCallNotification.ts, which also ensures it).
    setupNotificationChannels();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}
