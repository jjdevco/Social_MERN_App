require("dotenv").config();
const functions = require("firebase-functions");
const app = require("express")();

const { verifyAuth } = require("./middlewares/auth");

const {
  signUp,
  signIn,
  getUserInfo,
  getUserProfile,
  updateUserDetails,
  uploadAvatar,
  onAvatarChange,
} = require("./handlers/users");

const {
  getAllEntries,
  getEntry,
  getEntriesByUser,
  createEntry,
  likeEntry,
  unlikeEntry,
  deleteEntry,
  onEntryDeleted,
} = require("./handlers/entries");

const { getEntryComments, commentOnEntry } = require("./handlers/comments");

const {
  createNotificationOnLike,
  createNotificationOnComment,
  deleteNotificationOnUnlike,
  markNotificationsRead,
  deleteNotifications,
} = require("./handlers/notifications");

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept"
  );
  next();
});

// Users routes
app.get("/user", verifyAuth, getUserInfo);
app.get("/user/profile/:username", getUserProfile);
app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/user/details", verifyAuth, updateUserDetails);
app.post("/user/avatar", verifyAuth, uploadAvatar);

// Entries routes
app.get("/entries", getAllEntries);
app.get("/entry/:id", getEntry);
app.get("/entries/user/:username", getEntriesByUser);
app.post("/entry", verifyAuth, createEntry);
app.post("/entry/:id/like", verifyAuth, likeEntry);
app.post("/entry/:id/unlike", verifyAuth, unlikeEntry);
app.delete("/entry/:id", verifyAuth, deleteEntry);

// Comments routes
app.get("/entry/:id/comments", getEntryComments);
app.post("/entry/:id/comment", verifyAuth, commentOnEntry);

// Notifications routes
app.post("/notifications/read", verifyAuth, markNotificationsRead);
app.post("/notifications/delete", verifyAuth, deleteNotifications);

// Server functions
exports.onEntryDeleted = onEntryDeleted;
exports.onAvatarChange = onAvatarChange;
exports.createNotificationOnLike = createNotificationOnLike;
exports.deleteNotificationOnUnlike = deleteNotificationOnUnlike;
exports.createNotificationOnComment = createNotificationOnComment;

exports.api = functions.https.onRequest(app);
