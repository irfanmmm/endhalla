import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';

import { useAppDispatch } from '../../../shared/store';
import { loginUser } from '../../../shared/store/authSlice';
import { useUpdateClientProfileMutation } from '../../../shared/store/api/clientApi';

export default function SuccessScreen({ route, navigation }: any) {
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateClientProfileMutation();
  const phone = route?.params?.phone || '+91 98765 43210';
  const name = route?.params?.name || 'Sara';
  const gender = route?.params?.gender || 'Female';

  const handleFinishOnboarding = async () => {
    try {
      await updateProfile({ phone, name, gender }).unwrap();
    } catch (e) {
      console.log('Backend profile sync fallback:', e);
    }
    dispatch(
      loginUser({
        token: `token_${Date.now()}`,
        user: {
          id: `usr_${Date.now()}`,
          name,
          phone,
          gender,
          userType: 'client',
        },
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Svg width={px(40)} height={px(40)} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6L9 17l-5-5" />
          </Svg>
        </View>

        <Text style={styles.title}>You're all set, {name}</Text>
        <Text style={styles.subtitle}>
          Your safe space is ready. Find a counsellor who truly understands.
        </Text>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleFinishOnboarding}
        >
          <Text style={styles.submitButtonText}>Find My Counsellor</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(24),
  },
  iconContainer: {
    width: px(100),
    height: px(100),
    borderRadius: px(50),
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: px(32),
  },
  title: {
    fontSize: px(28),
    fontFamily: fonts.serif.regular,
    color: colors.text,
    marginBottom: px(16),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: px(15),
    color: colors.textSecondary,
    fontFamily: fonts.sans.regular,
    textAlign: 'center',
    lineHeight: px(24),
    paddingHorizontal: px(16),
    marginBottom: px(48),
  },
  submitButton: {
    backgroundColor: colors.primary,
    width: '100%',
    height: px(56),
    borderRadius: px(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: px(16),
    fontFamily: fonts.sans.bold,
  },
});
