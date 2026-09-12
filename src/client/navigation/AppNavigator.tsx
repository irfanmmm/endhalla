import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/Onboarding/WelcomeScreen";
import PhoneNumberScreen from "../screens/Onboarding/PhoneNumberScreen";
import VerifyCodeScreen from "../screens/Onboarding/VerifyCodeScreen";
import NameScreen from "../screens/Onboarding/NameScreen";
import GenderScreen from "../screens/Onboarding/GenderScreen";
import SuccessScreen from "../screens/Onboarding/SuccessScreen";
import MainTabNavigator from "./MainTabNavigator";
import BookSessionScreen from "../screens/Booking/BookSessionScreen";
import BookingConfirmedScreen from "../screens/Booking/BookingConfirmedScreen";
import MyBookingsScreen from "../screens/Bookings/MyBookingsScreen";
import BookingDetailScreen from "../screens/Bookings/BookingDetailScreen";
import VideoCallScreen from "../../shared/videoCall/VideoCallScreen";
import ChatScreen from "../../shared/chat/ChatScreen";

import { useAppDispatch, useAppSelector } from "../../shared/store";
import { restoreSession } from "../../shared/store/authSlice";
import { colors } from "../theme";
import { usePushNotifications } from "../../shared/utils/usePushNotifications";
import { useUpdatePushTokenMutation, useLazyGetChatTokenQuery } from "../../shared/store/api/clientApi";

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef<any>();

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [updatePushToken] = useUpdatePushTokenMutation();
  const [fetchChatToken] = useLazyGetChatTokenQuery();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  usePushNotifications({
    enabled: isAuthenticated,
    registerToken: (token) => updatePushToken(token).unwrap(),
    getChatToken: () => fetchChatToken().unwrap(),
    onNotificationTap: (data) => {
      if (!navigationRef.isReady()) return;
      if (data.type === 'booking' || data.type === 'payment') {
        navigationRef.navigate('BookingDetail', { bookingId: data.bookingId });
      } else if (data.type === 'chat') {
        // Full chat-token context isn't in the push payload — route to the
        // Messages inbox, which fetches its own token and lists channels.
        navigationRef.navigate('Main', { screen: 'Messages' });
      }
    },
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator key={isAuthenticated ? 'user-authenticated' : 'user-guest'} screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="BookSession" component={BookSessionScreen} />
            <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
            <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
            <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
            <Stack.Screen name="Name" component={NameScreen} />
            <Stack.Screen name="Gender" component={GenderScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
