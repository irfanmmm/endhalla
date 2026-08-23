import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
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

import { useAppDispatch, useAppSelector } from "../../shared/store";
import { restoreSession } from "../../shared/store/authSlice";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator key={isAuthenticated ? 'user-authenticated' : 'user-guest'} screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="BookSession" component={BookSessionScreen} />
            <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
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
