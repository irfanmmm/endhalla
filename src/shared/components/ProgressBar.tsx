import React from 'react';
import { View, StyleSheet } from 'react-native';
import { px } from '../utils/responsive';
import { colors } from '../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  steps?: number; 
}

export default function ProgressBar({ progress, steps = 10 }: ProgressBarProps) {
  const currentStep = Math.round(progress * steps);
  return (
    <View style={styles.segmentedContainer}>
      {Array.from({ length: steps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < currentStep ? colors.primary : '#E5E9F0' } 
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: px(16),
  },
  segment: {
    height: px(4),
    flex: 1,
    marginHorizontal: px(2),
    borderRadius: px(2),
  },
});
