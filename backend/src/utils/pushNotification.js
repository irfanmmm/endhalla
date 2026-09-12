const { getMessaging } = require('firebase-admin/messaging');
const { getFirebaseApp } = require('../config/firebase');

/**
 * Sends a push notification via Firebase Cloud Messaging. Non-fatal by
 * design — a failed or missing token must never break the booking/approval/
 * payment flow it's attached to, so errors are logged and swallowed.
 */
async function sendPushNotification({ token, title, body, data }) {
  if (!token) return;

  try {
    await getMessaging(getFirebaseApp()).send({
      token,
      notification: { title, body },
      data: data ? stringifyData(data) : undefined,
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
