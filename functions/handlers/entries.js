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

exports.createEntry = function (req, res) {
  const { body } = req.body;
  return db
    .collection("entries")
    .add({
      owner: req.user.username,
      body,
      createdAt: new Date().toISOString(),
    })
    .then((entry) =>
      res.json({ message: `Entry ${entry.id} created successfully...` })
    )
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ message: "something went wrong, try again later..." });
    });
};
