import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  CallContent,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import { requestCallPermissions } from '../utils/mediaPermissions';

type PermissionState = 'checking' | 'granted' | 'denied';

/**
 * Gates the call UI behind a "Calling…" waiting screen for the counsellor
 * until the client actually joins — otherwise the counsellor lands straight
 * in the live call view (their own camera) with nobody else there yet.
 * The client has no such gate: getting here already means the counsellor
 * started the call, so there's nothing to wait for on their side.
 */
function CallGate({
  role,
  otherUserName,
  onHangup,
}: {
  role: 'counsellor' | 'client';
  otherUserName: string;
  onHangup: () => void;
}) {
  const { useRemoteParticipants } = useCallStateHooks();
  const remoteParticipants = useRemoteParticipants();
  const isWaiting = role === 'counsellor' && remoteParticipants.length === 0;

  if (isWaiting) {
    return (
      <SafeAreaView style={styles.waitingContainer}>
        <View style={styles.waitingAvatar}>
          <Text style={styles.waitingAvatarText}>{(otherUserName || '?').charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.waitingTitle}>Calling {otherUserName}…</Text>
        <Text style={styles.waitingSubtitle}>Waiting for them to join</Text>
        <TouchableOpacity style={styles.endCallButton} onPress={onHangup} activeOpacity={0.85}>
          <Text style={styles.endCallButtonText}>End Call</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return <CallContent onHangupCallHandler={onHangup} />;
}

export default function VideoCallScreen({ route, navigation }: any) {
  const { bookingId, callToken, onCallEnd, role = 'client', otherUserName = 'the other person' } = route.params;
  const [permissionState, setPermissionState] = useState<PermissionState>('checking');

  useEffect(() => {
    let cancelled = false;
    requestCallPermissions().then((granted) => {
      if (!cancelled) setPermissionState(granted ? 'granted' : 'denied');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const client = useMemo(() => {
    if (permissionState !== 'granted') return null;
    return new StreamVideoClient({
      apiKey: callToken.apiKey,
      user: { id: callToken.userId, name: callToken.userName },
      token: callToken.token,
    });
  }, [permissionState, callToken]);

  const call = useMemo(() => {
    if (!client) return null;
    return client.call('default', callToken.callId);
  }, [client, callToken.callId]);

  useEffect(() => {
    if (!call) return;
    call.join({ create: true }).catch((err) => {
      console.error('Failed to join call:', err);
    });
    return () => {
      call.leave().catch(() => {});
    };
  }, [call]);

  const handleHangup = () => {
    onCallEnd?.(bookingId);
    navigation.goBack();
  };

  if (permissionState === 'checking') {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    );
  }

  if (permissionState === 'denied') {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.message}>
          Camera and microphone access are required to join this call.
        </Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => Linking.openSettings()}>
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!client || !call) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallGate role={role} otherUserName={otherUserName} onHangup={handleHangup} />
        </StreamCall>
      </StreamVideo>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: '#0F9D8C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  settingsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#9CA3AF',
  },
  waitingContainer: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  waitingAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0F9D8C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  waitingAvatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  waitingTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  waitingSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 48,
  },
  endCallButton: {
    backgroundColor: '#E11D48',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  endCallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
