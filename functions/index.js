require("dotenv").config();
const functions = require("firebase-functions");
const app = require("express")();

const { verifyAuth } = require("./middlewares/auth");

const { getAllEntries, createEntry } = require("./handlers/entries");
const {
  signUp,
  signIn,
  updateUserDetails,
  uploadAvatar,
} = require("./handlers/users");

//Entries routes
app.get("/entries", getAllEntries);
app.post("/entry", verifyAuth, createEntry);

//Users routes
app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/user/details", verifyAuth, updateUserDetails);
app.post("/user/avatar", verifyAuth, uploadAvatar);

exports.api = functions.https.onRequest(app);
