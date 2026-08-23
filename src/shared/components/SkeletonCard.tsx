import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { px } from '../utils/responsive';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonItem({ width = '100%', height = px(16), borderRadius = px(8), style }: SkeletonProps) {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E8E5DF',
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

export function CounsellorCardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      {/* Top Meta Skeleton */}
      <View style={styles.rowBetween}>
        <SkeletonItem width={px(130)} height={px(24)} borderRadius={px(12)} />
        <SkeletonItem width={px(40)} height={px(18)} borderRadius={px(8)} />
      </View>

      {/* Profile Row Skeleton */}
      <View style={styles.profileRow}>
        <SkeletonItem width={px(48)} height={px(48)} borderRadius={px(16)} />
        <View style={styles.flexColumn}>
          <SkeletonItem width="60%" height={px(18)} borderRadius={px(6)} style={{ marginBottom: px(6) }} />
          <SkeletonItem width="40%" height={px(14)} borderRadius={px(6)} />
        </View>
      </View>

      {/* Audio Player Skeleton */}
      <SkeletonItem width="100%" height={px(46)} borderRadius={px(16)} style={{ marginBottom: px(14) }} />

      {/* Quote Skeleton */}
      <SkeletonItem width="90%" height={px(14)} borderRadius={px(6)} style={{ marginBottom: px(6) }} />
      <SkeletonItem width="70%" height={px(14)} borderRadius={px(6)} style={{ marginBottom: px(14) }} />

      {/* Tags Skeleton */}
      <View style={styles.tagRow}>
        <SkeletonItem width={px(70)} height={px(28)} borderRadius={px(12)} />
        <SkeletonItem width={px(90)} height={px(28)} borderRadius={px(12)} />
        <SkeletonItem width={px(80)} height={px(28)} borderRadius={px(12)} />
      </View>

      {/* Action Buttons Skeleton */}
      <View style={styles.actionRow}>
        <SkeletonItem width="70%" height={px(46)} borderRadius={px(14)} />
        <SkeletonItem width="26%" height={px(46)} borderRadius={px(14)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: px(24),
    padding: px(18),
    marginBottom: px(20),
    borderWidth: 1,
    borderColor: '#E8E6DF',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(14),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(14),
  },
  flexColumn: {
    flex: 1,
    marginLeft: px(12),
  },
  tagRow: {
    flexDirection: 'row',
    gap: px(8),
    marginBottom: px(18),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
