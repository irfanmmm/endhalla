import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/Onboarding/LoginScreen";
import PhoneInputScreen from "../screens/Onboarding/PhoneInputScreen";
import OTPVerificationScreen from "../screens/Onboarding/OTPVerificationScreen";
import FullNameScreen from "../screens/Onboarding/FullNameScreen";
import GenderScreen from "../screens/Onboarding/GenderScreen";
import ExperienceScreen from "../screens/Onboarding/ExperienceScreen";
import SessionRatesScreen from "../screens/Onboarding/SessionRatesScreen";
import LanguagesScreen from "../screens/Onboarding/LanguagesScreen";
import AreasOfFocusScreen from "../screens/Onboarding/AreasOfFocusScreen";
import CertificatesScreen from "../screens/Onboarding/CertificatesScreen";
import SuccessScreen from "../screens/Onboarding/SuccessScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="FullName" component={FullNameScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Experience" component={ExperienceScreen} />
        <Stack.Screen name="SessionRates" component={SessionRatesScreen} />
        <Stack.Screen name="Languages" component={LanguagesScreen} />
        <Stack.Screen name="AreasOfFocus" component={AreasOfFocusScreen} />
        <Stack.Screen name="Certificates" component={CertificatesScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />

        <Stack.Screen name="CounsellorDashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
