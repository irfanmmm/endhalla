import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { colors } from '../theme';
import { px } from '../utils/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
  dismissKeyboardOnTap?: boolean;
}

export default function ScreenContainer({
  children,
  style,
  noPadding = false,
  dismissKeyboardOnTap = true,
}: ScreenContainerProps) {
  const content = (
    <SafeAreaView style={[styles.container, !noPadding && styles.padding, style]}>
      {children}
    </SafeAreaView>
  );

  if (dismissKeyboardOnTap) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.flex}>{content}</View>
      </TouchableWithoutFeedback>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padding: {
    paddingHorizontal: px(24),
  },
});
