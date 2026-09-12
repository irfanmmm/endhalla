const { initializeApp, cert, getApps } = require('firebase-admin/app');

let firebaseApp;

function getFirebaseApp() {
  if (!firebaseApp) {
    if (getApps().length) {
      firebaseApp = getApps()[0];
      return firebaseApp;
    }
    const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!encoded) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 not configured');
    }
    const serviceAccount = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return firebaseApp;
}

module.exports = { getFirebaseApp };
