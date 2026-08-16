import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { px } from '../../../shared/utils/responsive';
import { colors, fonts } from '../../theme';
import ArrowLeftIcon from '../../../shared/assets/icons/back-icon.svg';
import ProgressBar from '../../../shared/components/ProgressBar';
import CustomButton from '../../../shared/components/CustomButton';

export default function AreasOfFocusScreen({ navigation }: any) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const areas = [
    'Stress', 'Anxiety', 'Depression', 'Relationship', 'Trauma',
    'Career', 'Sleep', 'Self Esteem', 'Parenting', 'OCD',
    'Bipolar', 'Anger', 'Grief', 'Eating Disorder', 'Phobia'
  ];

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <ProgressBar progress={0.8} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeftIcon width={px(22)} height={px(22)} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Your areas of focus</Text>
          <Text style={styles.subtitle}>Choose domains you've experience in treating your clients.</Text>

          <View style={styles.chipsContainer}>
            {areas.map((area) => {
              const isSelected = selectedAreas.includes(area);
              return (
                <TouchableOpacity
                  key={area}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleArea(area)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {area}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton 
            title="Continue" 
            onPress={() => navigation.navigate('Certificates')} 
            disabled={selectedAreas.length === 0}
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
