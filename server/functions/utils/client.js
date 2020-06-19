const firebase = require("firebase");
const { config } = require("./admin");

firebase.initializeApp(config);

exports.auth = firebase.auth();
