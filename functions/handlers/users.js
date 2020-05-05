const config = require("../utils/db-config");
const { admin, db } = require("../utils/admin");
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
            return err.code === "auth/user-not-found" ||
              err.code === "auth/wrong-password"
              ? res
                  .status(403)
                  .json({ general: "Wrong credentials, please try again...." })
              : res.status(500).json({ code: err.code, message: err.message });
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
              : res.status(500).json({ code: err.code, message: err.message });
          })
  );
};

exports.updateUserDetails = function (req, res) {
  const fields = validator.userDetails(req.body);
  return db
    .doc(`/users/${req.user.username}`)
    .update(fields)
    .then(() => res.json({ message: "User details updated successfully..." }))
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ code: err.code, message: err.message });
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
      .then((imgUrl) =>
        db.doc(`/users/${req.user.username}`).update({
          avatarUrl: imgUrl,
        })
      )
      .then(() => res.json({ message: "Image upload successfully..." }))
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ code: err.code, message: err.message });
      });
  });

  busboy.end(req.rawBody);
};
