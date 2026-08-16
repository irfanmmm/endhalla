import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import ProgressBar from '../../../shared/components/ProgressBar';
import CustomButton from '../../../shared/components/CustomButton';

export default function LanguagesScreen({ navigation }: any) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const languages = [
    'Malayalam', 'English', 'Hindi', 
    'Arabic', 'Tamil', 'Urdu'
  ];

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <ProgressBar progress={0.7} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeftIcon width={px(22)} height={px(22)} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Languages you speak</Text>
          <Text style={styles.subtitle}>Clients will be matched based on language preference.</Text>

          <View style={styles.chipsContainer}>
            {languages.map((lang) => {
              const isSelected = selectedLanguages.includes(lang);
              return (
                <TouchableOpacity
                  key={lang}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleLanguage(lang)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton 
            title="Continue" 
            onPress={() => navigation.navigate('AreasOfFocus')} 
            disabled={selectedLanguages.length === 0}
          />
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: px(12),
  },
  chip: {
    paddingHorizontal: px(20),
    paddingVertical: px(12),
    borderRadius: px(16),
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF0FF',
  },
  chipText: {
    fontSize: px(14),
    fontFamily: fonts.sans.medium,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: px(24),
    paddingBottom: px(24),
  },
});
