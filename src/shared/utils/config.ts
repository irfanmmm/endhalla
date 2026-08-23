import { NativeModules, Platform } from 'react-native';

/**
 * Your Mac's local network IP address on Wi-Fi.
 * Physical iOS/Android devices require this IP to connect to backend servers running on your Mac.
 */
export const MAC_LOCAL_IP = '192.168.1.7';

export const getApiHost = (): string => {
  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      const hostname = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
      if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return hostname;
      }
    }
  } catch (e) {
    console.warn('Could not extract host IP from Metro scriptURL:', e);
  }

  // Fallback for physical devices / simulators
  if (Platform.OS === 'ios') {
    return MAC_LOCAL_IP;
  }
  return '10.0.2.2';
};

export const getClientBaseUrl = (): string => {
  const host = getApiHost();
  return `http://${host}:5002/api`;
};

export const getCounsellorBaseUrl = (): string => {
  const host = getApiHost();
  return `http://${host}:5001/api/counsellor`;
};
