const { admin, db } = require("../utils/admin");

exports.verifyAuth = function (req, res, next) {
  const authorization = req.headers.authorization;

  if (authorization && authorization.includes("Bearer ")) {
    let token = authorization.split("Bearer ")[1];
    return admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => (req.user = decodedToken))
      .then(() => db.collection("users").limit(1).get())
      .then((data) => {
        req.user.username = data.docs[0].data().username;
        req.user.avatarUrl = data.docs[0].data().avatarUrl;
      })
      .then(() => next())
      .catch((err) => {
        console.error(err);
        return res.status(403).json(err);
      });
  } else {
    return res.status(403).json({ error: "Unauthorized action." });
  }
};
