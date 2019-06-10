const express = require("express");
const dbString = require("../config.json");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;

let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("inventory")
})

let api = express.Router();

api.get("/get_inventory/:userId", (req, resp) => {
    const userId = req.params.userId;
    try {
      movies.find({"user_id": userId}).collation({locale: "en" }).sort({"raw_title": 1}).toArray().then((results) => {
        resp.send(results)
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
