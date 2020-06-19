const { db } = require("../utils/admin");

exports.getEntryComments = function (req, res) {
  const { id } = req.params;

  let comments = [];
  return db
    .collection("comments")
    .where("entryId", "==", id)
    .orderBy("createdAt", "desc")
    .get()
    .then((commentsData) => {
      if (!commentsData.empty)
        commentsData.docs.forEach((comment) => comments.push(comment.data()));
      else throw new Error("not-comments");
    })
    .then(() => res.json(comments))
    .catch((err) => {
      console.error(err);
      return err.message == "not-comments"
        ? res.status(404).json({ error: "Comments not found." })
        : res
            .status(500)
            .json({ message: "something went wrong, try again later..." });
    });
};

exports.commentOnEntry = function (req, res) {
  const { id } = req.params;
  const { body } = req.body;
  const { user } = req;

  if (!body.trim())
    return res.status(400).json({ error: "Must not be empty." });

  const comment = {
    entryId: id,
    body,
    username: user.username,
    createdAt: new Date().toISOString(),
    userAvatar: user.avatarUrl,
  };

  return db
    .doc(`/entries/${id}`)
    .get()
    .then((entry) => {
      if (entry.exists)
        return entry.ref.update({
          commentsCount: entry.data().commentsCount + 1,
        });
      else throw new Error("invalid-entry");
    })
    .then(() => db.collection("comments").add(comment))
    .then(() => res.status(201).json(comment))
    .catch((err) => {
      console.error(err);
      return err.message == "invalid-entry"
        ? res.status(404).json({ error: "Entry not found." })
        : res
            .status(500)
            .json({ message: "something went wrong, try again later..." });
    });
};
