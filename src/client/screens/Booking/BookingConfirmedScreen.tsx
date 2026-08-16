import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts, borderRadius } from '../../theme';
import { useAppSelector } from '../../../shared/store';
import CheckIcon from '../../../shared/assets/icons/check.svg';

export default function BookingConfirmedScreen({ route, navigation }: any) {
  const latestBooking = useAppSelector((state) => state.booking.latestConfirmedBooking);

  const counsellorName = latestBooking?.counsellorName || route?.params?.counsellorName || 'Aisha';
  const sessionType = latestBooking?.sessionType || route?.params?.sessionType || 'Chat';
  const dateText = latestBooking?.dateText || route?.params?.dateText || 'Tue, 10 Jun';
  const timeText = latestBooking?.timeText || route?.params?.timeText || '10:00 AM';

  const handleOpenChat = () => {
    navigation.navigate('Main');
  };

  const handleBackToHome = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          {/* Circular Badge */}
          <View style={styles.badgeCircle}>
            <CheckIcon width={px(32)} height={px(32)} stroke={colors.primary} />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Booking confirmed</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {`${sessionType} session with ${counsellorName} · ${dateText} at ${timeText}`}
          </Text>

          {/* Primary Action Button */}
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={handleOpenChat}>
            <Text style={styles.primaryBtnText}>Open Chat with {counsellorName}</Text>
          </TouchableOpacity>

          {/* Secondary Action */}
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={handleBackToHome}>
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: px(24),
  },
  centerBox: {
    alignItems: 'center',
    paddingHorizontal: px(12),
  },
  badgeCircle: {
    width: px(80),
    height: px(80),
    borderRadius: px(40),
    backgroundColor: '#EEF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: px(24),
  },
  title: {
    fontSize: px(18),
    fontFamily: fonts.sans.medium,
    color: colors.black,
    marginBottom: px(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: px(32),
    lineHeight: px(18),
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    height: px(48),
    borderRadius: borderRadius.container,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: px(16),
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: px(14),
    fontFamily: fonts.sans.bold,
  },
  secondaryBtn: {
    paddingVertical: px(12),
  },
  secondaryBtnText: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.textSecondary,
  },
});
