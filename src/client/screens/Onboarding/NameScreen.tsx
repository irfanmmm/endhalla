import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import CustomInput from '../../../shared/components/CustomInput';
import CustomButton from '../../../shared/components/CustomButton';
import { validateName } from '../../../shared/utils/validation';

export default function NameScreen({ route, navigation }: any) {
  const phone = route?.params?.phone || '';
  const [name, setName] = useState('');
  const isValid = validateName(name);

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
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>This is how your counsellor will address you.</Text>

            <CustomInput
              containerStyle={styles.inputContainer}
              placeholder="Sara"
              placeholderTextColor={colors.textSecondary}
              inputType="name"
              maxLength={30}
              value={name}
              onChangeText={setName}
              helperText="You can use a nickname — whatever feels comfortable."
            />
          </View>

          <View style={styles.footer}>
            <CustomButton
              title="Continue"
              disabled={!isValid}
              onPress={() => navigation.navigate('Gender', { phone, name })}
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
  inputContainer: {
    marginBottom: px(24),
  },
  textInput: {
    backgroundColor: colors.inputLight,
    height: px(56),
    borderRadius: px(16),
    paddingHorizontal: px(16),
    fontSize: px(16),
    fontFamily: fonts.sans.regular,
    color: colors.text,
    marginBottom: px(12),
  },
  helperText: {
    fontSize: px(13),
    color: colors.textSecondary,
    fontFamily: fonts.sans.regular,
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
