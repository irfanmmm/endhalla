import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import OTPInput from '../../../shared/components/OTPInput';
import CustomButton from '../../../shared/components/CustomButton';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';

import { useAppDispatch } from '../../../shared/store';
import { loginUser } from '../../../shared/store/authSlice';

export default function VerifyCodeScreen({ route, navigation }: any) {
  const dispatch = useAppDispatch();
  const phone = route?.params?.phone || '';
  const existingUser = route?.params?.existingUser || null;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (val: string) => {
    setCode(val);
    if (error) setError('');
  };

  const handleVerify = () => {
    // Validation check
    if (code !== '123456' && code.length === 6) {
      setError('Invalid verification code. Please try again.');
      setCode(''); // Clear the OTP box values on error!
      return;
    }

    if (existingUser) {
      // Existing user: Directly log in and redirect to Home
      dispatch(
        loginUser({
          token: `token_${Date.now()}`,
          user: existingUser,
        })
      );
    } else {
      // New user: Continue onboarding flow to enter Name & Gender
      navigation.navigate('Name', { phone });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeftIcon width={px(22)} height={px(22)} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Enter the code</Text>
            <Text style={styles.subtitle}>Sent to your number via SMS.</Text>

            <OTPInput value={code} onChange={handleCodeChange} hasError={!!error} />

            {!!error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive it? </Text>
              <TouchableOpacity>
                <Text style={styles.resendAction}>Resend in 0:42</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <CustomButton
              title="Verify"
              disabled={code.length !== 6}
              onPress={handleVerify}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: px(24),
    paddingTop: px(12),
    paddingBottom: px(32),
  },
  backButton: {
    width: px(38),
    height: px(38),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: px(24),
  },
  title: {
    fontSize: px(24),
    fontFamily: fonts.sans.bold,
    color: colors.text,
    marginBottom: px(4),
  },
  subtitle: {
    fontSize: px(14),
    color: colors.textSecondary,
    marginBottom: px(32),
    fontFamily: fonts.sans.regular,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    textAlign: 'left',
    marginBottom: px(16),
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: px(14),
    color: colors.textSecondary,
    fontFamily: fonts.sans.regular,
  },
  resendAction: {
    fontSize: px(14),
    color: colors.primary,
    fontFamily: fonts.sans.medium,
  },
  footer: {
    paddingHorizontal: px(24),
    paddingBottom: px(24),
  },
  submitButton: {
    backgroundColor: colors.primary,
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
