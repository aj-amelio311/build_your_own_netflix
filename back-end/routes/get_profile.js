const express = require("express");
const dbString = require("../config.json");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;
let db;
let profiles;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  profiles = db.collection("users")
})

let api = express.Router();

api.get("/get_profile/:userId", (req, resp) => {
    const userId = req.params.userId;
    try {
      profiles.find({"user_id": userId}).toArray().then((results) => {
        resp.send(results)
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
