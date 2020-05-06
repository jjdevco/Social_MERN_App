require("dotenv").config();
const functions = require("firebase-functions");
const app = require("express")();

const { verifyAuth } = require("./middlewares/auth");

const {
  getAllEntries,
  getEntry,
  createEntry,
  commentOnEntry,
  likeEntry,
  unlikeEntry,
  deleteEntry,
} = require("./handlers/entries");

const {
  signUp,
  signIn,
  getUserInfo,
  updateUserDetails,
  uploadAvatar,
} = require("./handlers/users");

//Entries routes
app.get("/entries", getAllEntries);
app.get("/entry/:id", getEntry);
app.post("/entry", verifyAuth, createEntry);
app.post("/entry/:id/comment", verifyAuth, commentOnEntry);
app.post("/entry/:id/like", verifyAuth, likeEntry);
app.post("/entry/:id/unlike", verifyAuth, unlikeEntry);
app.delete("/entry/:id", verifyAuth, deleteEntry);

//Users routes
app.post("/signup", signUp);
app.post("/signin", signIn);
app.get("/user", verifyAuth, getUserInfo);
app.post("/user/details", verifyAuth, updateUserDetails);
app.post("/user/avatar", verifyAuth, uploadAvatar);

exports.api = functions.https.onRequest(app);
