const { db } = require("../utils/admin");
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
          .catch((err) =>
            err.code === "auth/user-not-found" ||
            err.code === "auth/wrong-password"
              ? res
                  .status(403)
                  .json({ general: "Wrong credentials, please try again...." })
              : res.status(500).json({ code: err.code, message: err.message })
          )
  );
};

exports.signUp = function (req, res) {
  let credentials;
  const { username, email, password } = req.body;
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
              createdAt: new Date().toISOString(),
            })
          )
          .then(() => res.status(201).json({ token: credentials.token.i }))
          .catch((err) =>
            err.code === "auth/email-already-in-use"
              ? res.status(400).json({ email: "This email is already in use." })
              : err.message === "username-already-in-use"
              ? res
                  .status(400)
                  .json({ username: "This username is already taken." })
              : res.status(500).json({ code: err.code, message: err.message })
          )
  );
};
