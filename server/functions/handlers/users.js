const functions = require("firebase-functions");
const { admin, db, config } = require("../utils/admin");
const { auth } = require("../utils/client");
const validator = require("../utils/validator");

exports.signIn = function (req, res) {
  const { email, password } = req.body;
  return validator.user(req.body, "signin").then((errors) =>
    Object.keys(errors).length > 0
      ? res.status(400).json(errors)
      : auth
          .signInWithEmailAndPassword(email, password)
          .then((data) => data.user.getIdToken())
          .then((token) => res.json({ token: token }))
          .catch((err) => {
            console.error(err);
            return err.code === "auth/user-not-found"
              ? res
                  .status(403)
                  .json({ email: "This email doesn't match our records." })
              : err.code === "auth/wrong-password"
              ? res.status(403).json({ password: "This password is invalid." })
              : res.status(500).json({ error: err.code });
          })
  );
};

exports.signUp = function (req, res) {
  let credentials;
  const { username, email, password } = req.body;
  const defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/default_avatar.png?alt=media`;
  return validator.user(req.body, "signup").then((errors) =>
    Object.keys(errors).length > 0
      ? res.status(400).json(errors)
      : db
          .doc(`/users/${username}`)
          .get()
          .then((user) =>
            user.exists
              ? (() => {
                  throw new Error("username-already-in-use");
                })()
              : auth.createUserWithEmailAndPassword(email, password)
          )
          .then(
            (data) =>
              (credentials = {
                token: data.user.getIdToken(),
                id: data.user.uid,
              })
          )
          .then(() =>
            db.doc(`/users/${username}`).set({
              id: credentials.id,
              username: username,
              email: email,
              avatarUrl: defaultAvatar,
              createdAt: new Date().toISOString(),
            })
          )
          .then(() => res.status(201).json({ token: credentials.token.i }))
          .catch((err) => {
            console.error(err);
            return err.code === "auth/email-already-in-use"
              ? res.status(400).json({ email: "This email is already in use." })
              : err.message === "username-already-in-use"
              ? res
                  .status(400)
                  .json({ username: "This username is already taken." })
              : res.status(500).json({ error: err.code });
          })
  );
};

exports.getUserProfile = function (req, res) {
  const { username } = req.params;
  return db
    .doc(`/users/${username}`)
    .get()
    .then((user) => {
      if (user.exists) res.json({ ...user.data() });
      else res.status(404).json({ error: "User not found." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getUserInfo = function (req, res) {
  const user = {};
  return db
    .doc(`/users/${req.user.username}`)
    .get()
    .then((userData) => {
      if (userData.exists) {
        user.credentials = userData.data();
        return db
          .collection("likes")
          .where("username", "==", req.user.username)
          .get();
      } else res.status(404).json({ error: "User not found." });
    })
    .then((likes) => {
      user.likes = [];
      likes.forEach((like) => user.likes.push(like.data()));
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.username)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then((notifications) => {
      user.notifications = [];
      notifications.forEach((notification) =>
        user.notifications.push({
          id: notification.id,
          ...notification.data(),
        })
      );
      return res.json(user);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getUsersInfo = function (req, res) {
  const { search } = req.params;
  return db
    .collection("users")
    .orderBy("createdAt", "desc")
    .limit(15)
    .get()
    .then((data) => {
      let users = [];
      data.forEach((user) => {
        if (user.data().username.includes(search))
          users.push({
            avatar: user.data().avatarUrl,
            username: user.data().username,
          });
      });
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ message: "something went wrong, try again later..." });
    });
};

exports.updateUserDetails = function (req, res) {
  const fields = validator.userDetails(req.body);
  return db
    .doc(`/users/${req.user.username}`)
    .update(fields)
    .then(() => res.json({ message: "User details updated successfully..." }))
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.uploadAvatar = function (req, res) {
  const os = require("os");
  const fs = require("fs");
  const path = require("path");
  const BusBoy = require("busboy");

  const busboy = new BusBoy({ headers: req.headers });

  let img = {};

  busboy.on("file", (fieldName, file, fileName, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Invalid file type submited." });
    }

    const extension = fileName.split(".")[fileName.split(".").length - 1];
    img.fileName = `${Math.round(Math.random() * 100000000000)}.${extension}`;
    img.filePath = path.join(os.tmpdir(), img.fileName);
    img.mimetype = mimetype;

    file.pipe(fs.createWriteStream(img.filePath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(img.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: img.mimetype,
          },
        },
      })
      .then(
        () =>
          `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${img.fileName}?alt=media`
      )
      .then(async (imgUrl) => {
        await db.doc(`/users/${req.user.username}`).update({
          avatarUrl: imgUrl,
        });
        return res.send(imgUrl);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

exports.onAvatarChange = functions.firestore
  .document("/users/{id}")
  .onUpdate((change) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    let batch = db.batch();

    if (beforeData.avatarUrl !== afterData.avatarUrl)
      return db
        .collection("entries")
        .where("username", "==", beforeData.username)
        .get()
        .then((entries) => {
          entries.forEach((entry) => {
            const entryDocument = db.doc(`/entries/${entry.id}`);
            batch.update(entryDocument, { userAvatar: afterData.avatarUrl });
          });

          return db
            .collection("comments")
            .where("username", "==", beforeData.username)
            .get();
        })
        .then((comments) => {
          comments.forEach((comment) => {
            const commentDocument = db.doc(`/comments/${comment.id}`);
            batch.update(commentDocument, {
              userAvatar: afterData.avatarUrl,
            });
          });

          return batch.commit();
        })
        .then(() => {
          const bucket = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/`;
          const imgFileName = beforeData.avatarUrl
            .split("?")[0]
            .split(bucket)[1];

          if (imgFileName !== "default_avatar.png") {
            console.log(`Deleted ${imgFileName}`);
            return admin
              .storage()
              .bucket(config.storageBucket)
              .file(imgFileName)
              .delete();
          } else return;
        })
        .catch((err) => {
          console.error(err);
          return;
        });
    else return;
  });
