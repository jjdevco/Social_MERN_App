const admin = require("firebase-admin");

const SERVER_CONFIG = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_id: process.env.CLIENT_ID,
  client_email: process.env.CLIENT_EMAIL,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
};

const CLIENT_CONFIG = {
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.CLIENT_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(SERVER_CONFIG),
  ...CLIENT_CONFIG,
});

const db = admin.firestore();

module.exports = {
  admin,
  db,
  config: { apiKey: process.env.API_KEY, ...CLIENT_CONFIG },
};
