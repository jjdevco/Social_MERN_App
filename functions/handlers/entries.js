const functions = require("firebase-functions");
const config = require("../utils/db-config");
const { db, admin } = require("../utils/admin");

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
  const { user } = req;

  const os = require("os");
  const fs = require("fs");
  const path = require("path");
  const BusBoy = require("busboy");

  const busboy = new BusBoy({ headers: req.headers });

  let media = {};

  let newEntry = {
    username: user.username,
    userAvatar: user.avatarUrl,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
  };

  busboy.on("file", (fieldName, file, fileName, encoding, mimetype) => {
    const validsFormatMedia = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/webm",
      "video/ogg",
      "video/mp4",
      "video/3gp",
    ];

    if (validsFormatMedia.indexOf(mimetype) == -1) {
      return res.status(400).json({ error: "Invalid file type submited." });
    }

    const extension = fileName.split(".")[fileName.split(".").length - 1];
    media.fileName = `${Math.round(Math.random() * 100000000000)}.${extension}`;
    media.filePath = path.join(os.tmpdir(), media.fileName);
    media.mimetype = mimetype;

    file.pipe(fs.createWriteStream(media.filePath));
  });

  busboy.on("field", (fieldname, val) => (newEntry[fieldname] = val));

  busboy.on("finish", async () => {
    if (!!media.fileName) {
      await admin
        .storage()
        .bucket()
        .upload(media.filePath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: media.mimetype,
            },
          },
        })
        .then(() => {
          if (!!media.fileName)
            newEntry[
              "media"
            ] = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${media.fileName}?alt=media`;
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    }

    return db
      .collection("entries")
      .add(newEntry)
      .then((entry) => {
        return res.json({ id: entry.id, ...newEntry });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

exports.deleteEntry = function (req, res) {
  const { id } = req.params;
  const { user } = req;

  const entryDocument = db.doc(`/entries/${id}`);

  return entryDocument
    .get()
    .then((entry) => {
      if (!entry.exists) throw new Error("invalid-entry");
      else if (entry.data().username !== user.username)
        throw new Error("unauthorized");
      else return entryDocument.delete();
    })
    .then(() => res.json({ message: "Entry deleted successfully..." }))
    .catch((err) => {
      console.error(err);
      return err.message == "invalid-entry"
        ? res.status(404).json({ error: "Entry not found." })
        : err.message == "unauthorized"
        ? res.status(403).json({ error: "Unauthorized action..." })
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

exports.onEntryDeleted = functions.firestore
  .document("entries/{id}")
  .onDelete((entry, context) => {
    const id = context.params.id;
    return db
      .collection("comments")
      .where("entryId", "==", id)
      .get()
      .then((comments) =>
        comments.docs.forEach((comment) => {
          console.log(`Deleted comment ${comment.id}`);
          return comment.ref.delete();
        })
      )
      .then(() => db.collection("likes").where("entryId", "==", id).get())
      .then((likes) =>
        likes.docs.forEach((like) => {
          console.log(`Deleted like ${like.id}`);
          return like.ref.delete();
        })
      )
      .then(() => {
        if (!!entry.data().media) {
          const bucket = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/`;
          const mediaFileName = entry
            .data()
            .media.split("?")[0]
            .split(bucket)[1];

          console.log(`Deleted ${mediaFileName}`);
          return admin
            .storage()
            .bucket(config.storageBucket)
            .file(mediaFileName)
            .delete();
        } else return;
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
