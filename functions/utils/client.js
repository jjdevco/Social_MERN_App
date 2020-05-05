const firebase = require("firebase");
const config = require("./db-config");

firebase.initializeApp(config);

exports.auth = firebase.auth();
