import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';

export default function GenderScreen({ route, navigation }: any) {
  const phone = route?.params?.phone || '';
  const name = route?.params?.name || '';
  const [selectedGender, setSelectedGender] = useState<string | null>('Female');

  const options = [
    { id: 'Female', label: 'Female', emoji: '🌸' },
    { id: 'Male', label: 'Male', emoji: '🌿' },
  ];

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.title}>How do you identify?</Text>
          <Text style={styles.subtitle}>You'll be matched only with counsellors of the same gender.</Text>

          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedGender === option.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedGender(option.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => navigation.navigate('Success', { phone, name, gender: selectedGender })}
          >
            <Text style={styles.submitButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    lineHeight: px(22),
  },
  optionsContainer: {
    marginTop: px(8),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: px(72),
    borderRadius: px(16),
    paddingHorizontal: px(24),
    marginBottom: px(16),
    borderWidth: px(1.5),
    borderColor: '#E8E6DF',
    backgroundColor: colors.white,
  },
  optionCardSelected: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.primary,
  },
  optionEmoji: {
    fontSize: px(24),
    marginRight: px(16),
  },
  optionText: {
    fontSize: px(16),
    fontFamily: fonts.sans.medium,
    color: colors.text,
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
