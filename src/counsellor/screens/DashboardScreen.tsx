import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counsellor Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to the Counsellor App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontFamily: fonts.serif.regular,
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.sans.regular,
    fontSize: 16,
  },
});
