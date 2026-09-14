import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface JoinCallButtonProps {
  sessionType: string;
  status: string;
  callStatus?: 'not_started' | 'ongoing' | 'ended';
  role: 'counsellor' | 'client';
  loading?: boolean;
  onPress: () => void;
}

export default function JoinCallButton({
  sessionType,
  status,
  callStatus = 'not_started',
  role,
  loading,
  onPress,
}: JoinCallButtonProps) {
  if (sessionType !== 'Video' || status !== 'confirmed') {
    return null;
  }

  if (callStatus === 'ended') {
    return (
      <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled activeOpacity={1}>
        <Text style={styles.label}>Call ended</Text>
      </TouchableOpacity>
    );
  }

  // The counsellor can start the call whenever they like. The client can
  // only join once the counsellor has actually started it.
  if (role === 'client' && callStatus === 'not_started') {
    return (
      <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled activeOpacity={1}>
        <Text style={styles.label}>Waiting for counsellor to start…</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.label}>
          {role === 'counsellor' && callStatus === 'not_started' ? 'Start Call' : 'Join Call'}
        </Text>
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
