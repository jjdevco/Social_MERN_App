const functions = require("firebase-functions");
const { db } = require("../utils/admin");

exports.markNotificationsRead = function (req, res) {
  let batch = db.batch();

  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });

  return batch
    .commit()
    .then(() => res.json({ message: "Notifications marked read." }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((like) => {
    return db
      .doc(`/entries/${like.data().entryId}`)
      .get()
      .then((entry) => {
        if (entry.exists) {
          return db.doc(`/notifications/${like.id}`).set({
            entryId: entry.id,
            recipient: entry.data().username,
            sender: like.data().username,
            type: "like",
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete((like) => {
    return db
      .doc(`/notifications/${like.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((comment) => {
    return db
      .doc(`/entries/${comment.data().entryId}`)
      .get()
      .then((entry) => {
        if (entry.exists) {
          return db.doc(`/notifications/${comment.id}`).set({
            entryId: entry.id,
            recipient: entry.data().username,
            sender: comment.data().username,
            type: "comment",
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
