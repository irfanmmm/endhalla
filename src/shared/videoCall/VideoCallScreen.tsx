import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  CallContent,
} from '@stream-io/video-react-native-sdk';
import { requestCallPermissions } from '../utils/mediaPermissions';

type PermissionState = 'checking' | 'granted' | 'denied';

export default function VideoCallScreen({ route, navigation }: any) {
  const { bookingId, callToken, onCallEnd } = route.params;
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
          <CallContent onHangupCallHandler={handleHangup} />
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
});
