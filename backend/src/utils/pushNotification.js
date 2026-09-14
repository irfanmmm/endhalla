const { getMessaging } = require('firebase-admin/messaging');
const { getFirebaseApp } = require('../config/firebase');

/**
 * Sends a push notification via Firebase Cloud Messaging. Non-fatal by
 * design — a failed or missing token must never break the booking/approval/
 * payment flow it's attached to, so errors are logged and swallowed.
 */
async function sendPushNotification({ token, title, body, data, androidChannelId }) {
  if (!token) return;

  try {
    await getMessaging(getFirebaseApp()).send({
      token,
      notification: { title, body },
      data: data ? stringifyData(data) : undefined,
      // Default (normal) priority is throttled by Android Doze/App Standby and
      // can arrive minutes late or not at all while the device is idle — every
      // notification here is a time-sensitive, user-triggered alert (new
      // booking, payment, incoming call), so always request immediate delivery.
      // androidChannelId routes to a channel the app created client-side
      // (see src/shared/utils/notificationChannels.ts) — an unrecognized
      // channel id falls back to default (quiet, no heads-up) importance.
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          defaultVibrateTimings: true,
          ...(androidChannelId ? { channelId: androidChannelId } : {}),
        },
      },
      apns: {
        headers: { 'apns-priority': '10' },
        payload: { aps: { sound: 'default', contentAvailable: true } },
      },
    });
  } catch (error) {
    console.error('Failed to send push notification:', error.message);
  }
}

function stringifyData(data) {
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = String(value);
  }
  return result;
}

module.exports = { sendPushNotification };
