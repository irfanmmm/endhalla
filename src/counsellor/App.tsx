import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '../shared/store';
import AppNavigator from './navigation/AppNavigator';
import { setupNotificationChannels } from '../shared/utils/notificationChannels';

export default function App() {
  useEffect(() => {
    // Not called from index.counsellor.js's top level — that file also
    // runs for a pure background push (a headless JS task with no
    // Activity/UI attached), so this only needs to run once the app is
    // actually open.
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
