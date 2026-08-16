import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import ProgressBar from '../../../shared/components/ProgressBar';
import CustomButton from '../../../shared/components/CustomButton';
import CustomInput from '../../../shared/components/CustomInput';
import { validatePhone, isSequentialPhone } from '../../../shared/utils/validation';

export default function PhoneInputScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const isValid = validatePhone(phone);
  const isSequential = phone.length === 10 && isSequentialPhone(phone);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <ProgressBar progress={0.1} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeftIcon width={px(22)} height={px(22)} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Your phone number</Text>
            <Text style={styles.subtitle}>We'll verify your identity via SMS.</Text>

            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.countryCodePicker}>
                <Text style={styles.countryCodeText}>🇮🇳  +91</Text>
              </TouchableOpacity>

              <CustomInput
                containerStyle={{ flex: 1 }}
                placeholder="Phone number"
                placeholderTextColor="#9D9D9D"
                inputType="phone"
                value={phone}
                onChangeText={setPhone}
                autoFocus={true}
                error={isSequential ? 'Please enter a valid phone number' : undefined}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <CustomButton
              title="Send Code"
              disabled={!isValid}
              onPress={() => navigation.navigate('OTPVerification')}
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
  },
  header: {
    paddingHorizontal: px(24),
    paddingTop: px(12),
  },
  backButton: {
    width: px(38),
    height: px(38),
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: px(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: px(24),
  },
  title: {
    fontSize: px(24),
    fontFamily: fonts.sans.bold,
    color: '#1A1A1A',
    marginBottom: px(8),
  },
  subtitle: {
    fontSize: px(14),
    color: colors.textSecondary,
    marginBottom: px(32),
    fontFamily: fonts.sans.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  countryCodePicker: {
    backgroundColor: colors.inputLight,
    height: px(56),
    paddingHorizontal: px(16),
    borderRadius: px(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(12),
  },
  countryCodeText: {
    fontSize: px(16),
    fontWeight: '500',
    color: '#1A1A1A',
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.inputLight,
    height: px(56),
    borderRadius: px(16),
    paddingHorizontal: px(16),
    fontSize: px(16),
    color: '#1A1A1A',
  },
  footer: {
    paddingHorizontal: px(24),
    paddingBottom: px(24),
  },
});
