import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useJoinWindow } from './useJoinWindow';

interface JoinCallButtonProps {
  scheduledAt?: string | null;
  sessionType: string;
  status: string;
  loading?: boolean;
  onPress: () => void;
}

export default function JoinCallButton({
  scheduledAt,
  sessionType,
  status,
  loading,
  onPress,
}: JoinCallButtonProps) {
  const { canJoin, isPast, label } = useJoinWindow(scheduledAt);

  if (sessionType !== 'Video' || status !== 'confirmed') {
    return null;
  }

  const disabled = !canJoin || loading;

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.label}>{isPast ? 'Call ended' : label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0F9D8C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
