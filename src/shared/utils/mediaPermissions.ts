import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Requests camera + mic access needed for a video call.
 * Android: explicit runtime permission request.
 * iOS: no-op here — the Stream SDK triggers the native camera/mic
 * prompts automatically on first use (Info.plist strings already set).
 */
export async function requestCallPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    return Object.values(granted).every(
      (result) => result === PermissionsAndroid.RESULTS.GRANTED,
    );
  }
  return true;
}
