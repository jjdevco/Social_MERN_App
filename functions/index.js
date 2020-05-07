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
  onEntryDeleted,
} = require("./handlers/entries");

const {
  signUp,
  signIn,
  getUserInfo,
  getUserDetails,
  updateUserDetails,
  uploadAvatar,
  onAvatarChange,
} = require("./handlers/users");

const {
  createNotificationOnLike,
  createNotificationOnComment,
  deleteNotificationOnUnlike,
  markNotificationsRead,
} = require("./handlers/notifications");

// Entries routes
app.get("/entries", getAllEntries);
app.get("/entry/:id", getEntry);
app.post("/entry", verifyAuth, createEntry);
app.post("/entry/:id/comment", verifyAuth, commentOnEntry);
app.post("/entry/:id/like", verifyAuth, likeEntry);
app.post("/entry/:id/unlike", verifyAuth, unlikeEntry);
app.delete("/entry/:id", verifyAuth, deleteEntry);

// Users routes
app.get("/user", verifyAuth, getUserInfo);
app.get("/user/:username", getUserDetails);
app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/user/details", verifyAuth, updateUserDetails);
app.post("/user/avatar", verifyAuth, uploadAvatar);

// Notifications routes
app.post("/notifications", verifyAuth, markNotificationsRead);

// Server functions
exports.onEntryDeleted = onEntryDeleted;
exports.onAvatarChange = onAvatarChange;
exports.createNotificationOnLike = createNotificationOnLike;
exports.deleteNotificationOnUnlike = deleteNotificationOnUnlike;
exports.createNotificationOnComment = createNotificationOnComment;

exports.api = functions.https.onRequest(app);
