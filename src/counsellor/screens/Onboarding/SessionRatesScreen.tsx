import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import ProgressBar from '../../../shared/components/ProgressBar';
import CustomButton from '../../../shared/components/CustomButton';

export default function SessionRatesScreen({ navigation }: any) {
  const [selectedRate, setSelectedRate] = useState<string | null>('700');
  const [offerFreeSession, setOfferFreeSession] = useState<boolean>(true);

  const options = ['600', '700', '800'];

  const handleSelect = (rate: string) => {
    setSelectedRate(rate);
  };

  const isContinueEnabled = selectedRate !== null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <ProgressBar progress={0.6} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeftIcon width={px(22)} height={px(22)} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Your session rate</Text>
          <Text style={styles.subtitle}>Choose your per-session rate. Each session is 40 minutes.</Text>

          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>0–2 years tier</Text>
          </View>

          <View style={styles.optionsContainer}>
            {options.map((option) => {
              const isSelected = selectedRate === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionPrice, isSelected && styles.optionTextSelected]}>₹{option}</Text>
                  <Text style={styles.optionSub}>per session</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Free Session Offer Card */}
          <TouchableOpacity
            style={[styles.freeOfferCard, offerFreeSession && styles.freeOfferCardActive]}
            activeOpacity={0.8}
            onPress={() => setOfferFreeSession(!offerFreeSession)}
          >
            <View style={styles.freeOfferLeft}>
              <Text style={styles.freeOfferTitle}>🎁 Offer 1st Session Free</Text>
              <Text style={styles.freeOfferSubtitle}>Attract new clients with a complimentary 40-min intro session.</Text>
            </View>
            <View style={[styles.freeOfferCheckbox, offerFreeSession && styles.freeOfferCheckboxActive]}>
              {offerFreeSession && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
          </TouchableOpacity>

          <Text style={styles.bottomInfoText}>You can update your rate and free offer later from your profile settings.</Text>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton 
            title="Continue" 
            onPress={() => navigation.navigate('Languages')} 
            disabled={!isContinueEnabled}
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
    marginBottom: px(16),
    fontFamily: fonts.sans.regular,
  },
  badgeContainer: {
    backgroundColor: '#EEF0FF',
    alignSelf: 'flex-start',
    paddingHorizontal: px(12),
    paddingVertical: px(6),
    borderRadius: px(12),
    marginBottom: px(32),
  },
  badgeText: {
    color: colors.primary,
    fontSize: px(12),
    fontFamily: fonts.sans.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: px(12),
  },
  optionCard: {
    flex: 1,
    height: px(100),
    backgroundColor: '#FFFFFF',
    borderRadius: px(16),
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: px(8),
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF0FF', // Light blue tint
  },
  optionPrice: {
    fontSize: px(22),
    fontFamily: fonts.sans.bold,
    color: '#1A1A1A',
    marginBottom: px(4),
  },
  optionSub: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.primary,
  },
  freeOfferCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: px(16),
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    padding: px(16),
    marginTop: px(20),
  },
  freeOfferCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EEF5F0',
  },
  freeOfferLeft: {
    flex: 1,
    paddingRight: px(12),
  },
  freeOfferTitle: {
    fontSize: px(15),
    fontFamily: fonts.sans.bold,
    color: '#1A1A1A',
    marginBottom: px(4),
  },
  freeOfferSubtitle: {
    fontSize: px(12),
    fontFamily: fonts.sans.regular,
    color: colors.textSecondary,
    lineHeight: px(16),
  },
  freeOfferCheckbox: {
    width: px(24),
    height: px(24),
    borderRadius: px(12),
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeOfferCheckboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: px(14),
    fontFamily: fonts.sans.bold,
  },
  bottomInfoText: {
    fontSize: px(12),
    color: colors.textSecondary,
    fontFamily: fonts.sans.regular,
    marginTop: px(24),
  },
  footer: {
    paddingHorizontal: px(24),
    paddingBottom: px(24),
  },
});
