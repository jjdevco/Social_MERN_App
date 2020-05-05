require("dotenv").config();
const functions = require("firebase-functions");
const app = require("express")();

const { verifyAuth } = require("./middlewares/auth");

const { getAllEntries, createEntry } = require("./handlers/entries");
const { signUp, signIn } = require("./handlers/users");

app.get("/entries", getAllEntries);
app.post("/entry", verifyAuth, createEntry);

app.post("/signup", signUp);
app.post("/signin", signIn);

exports.api = functions.https.onRequest(app);
