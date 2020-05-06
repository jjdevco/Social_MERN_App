const { db } = require("../utils/admin");

exports.getAllEntries = function (req, res) {
  return db
    .collection("entries")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let entries = [];
      data.forEach((entry) => entries.push({ id: entry.id, ...entry.data() }));
      res.json(entries);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ message: "something went wrong, try again later..." });
    });
};

exports.getEntry = function (req, res) {
  const { id } = req.params;
  let entry = {};
  return db
    .doc(`/entries/${id}`)
    .get()
    .then((entryData) => {
      if (entryData.exists) {
        entry = entryData.data();
        entry.id = entryData.id;
        return db
          .collection("comments")
          .orderBy("createdAt", "desc")
          .where("entryId", "==", id)
          .get();
      } else throw new Error("invalid-entry");
    })
    .then((comments) => {
      entry.comments = [];
      comments.forEach((comment) => entry.comments.push(comment.data()));
      return res.json(entry);
    })
    .catch((err) => {
      console.error(err);
      return err.message == "invalid-entry"
        ? res.status(404).json({ error: "Entry not found." })
        : res
            .status(500)
            .json({ message: "something went wrong, try again later..." });
    });
};

exports.createEntry = function (req, res) {
  const { body } = req.body;
  const { user } = req;

  const newEntry = {
    owner: user.username,
    body,
    userAvatar: user.avatarUrl,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
  };

  return db
    .collection("entries")
    .add(newEntry)
    .then((entry) => {
      return res.json({ id: entry.id, ...newEntry });
    })
    .catch((err) => {
      console.error(err);
      return res
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
    .then((entryData) => {
      if (entryData.exists) return db.collection("comments").add(comment);
      else throw new Error("invalid-entry");
    })
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

exports.likeEntry = function (req, res) {
  const { id } = req.params;
  const { user } = req;

  const entryDocument = db.doc(`/entries/${id}`);
  const likeDocument = db
    .collection("likes")
    .where("username", "==", user.username)
    .where("entryId", "==", id)
    .limit(1);

  let entryData;
  let likeNotExists;

  return entryDocument
    .get()
    .then((entry) => {
      if (entry.exists) {
        entryData = entry.data();
        entryData.id = entry.id;
        return likeDocument.get();
      } else throw new Error("invalid-entry");
    })
    .then((likes) => {
      likeNotExists = likes.empty;
      if (likeNotExists) {
        return db.collection("likes").add({
          entryId: id,
          username: user.username,
        });
      } else throw new Error("already-liked");
    })
    .then(() => {
      if (likeNotExists) {
        entryData.likesCount++;
        return entryDocument.update({ likesCount: entryData.likesCount });
      }
    })
    .then(() => res.json(entryData))
    .catch((err) => {
      console.error(err);
      return err.message == "invalid-entry"
        ? res.status(404).json({ error: "Entry not found." })
        : err.message == "already-liked"
        ? res.status(400).json({ error: "Entry already liked." })
        : res
            .status(500)
            .json({ message: "something went wrong, try again later..." });
    });
};

exports.unlikeEntry = function (req, res) {
  const { id } = req.params;
  const { user } = req;

  const entryDocument = db.doc(`/entries/${id}`);
  const likeDocument = db
    .collection("likes")
    .where("username", "==", user.username)
    .where("entryId", "==", id)
    .limit(1);

  let entryData;
  let likeNotExists;

  return entryDocument
    .get()
    .then((entry) => {
      if (entry.exists) {
        entryData = entry.data();
        entryData.id = entry.id;
        return likeDocument.get();
      } else throw new Error("invalid-entry");
    })
    .then((likes) => {
      likeNotExists = likes.empty;
      if (likeNotExists) throw new Error("not-liked");
      else {
        return db.doc(`/likes/${likes.docs[0].id}`).delete();
      }
    })
    .then(() => {
      if (!likeNotExists) {
        entryData.likesCount--;
        return entryDocument.update({ likesCount: entryData.likesCount });
      }
    })
    .then(() => res.json(entryData))
    .catch((err) => {
      console.error(err);
      return err.message == "invalid-entry"
        ? res.status(404).json({ error: "Entry not found." })
        : err.message == "not-liked"
        ? res.status(400).json({ error: "Entry not liked." })
        : res
            .status(500)
            .json({ message: "something went wrong, try again later..." });
    });
};
