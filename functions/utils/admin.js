const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  authDomain: "socialapp-94844.firebaseapp.com",
  databaseURL: "https://socialapp-94844.firebaseio.com",
  projectId: "socialapp-94844",
  storageBucket: "socialapp-94844.appspot.com",
  messagingSenderId: "582872066217",
  appId: "1:582872066217:web:dd0639ea8cb245787921b8",
});

const db = admin.firestore();

module.exports = {
  admin,
  db,
};
