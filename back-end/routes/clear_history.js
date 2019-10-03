const express = require("express");
const dbString = require("../config.json");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;
let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("history")
})



let api = express.Router();

api.get("/clear_history/:userId", (req, resp) => {
    const userId = req.params.userId;
    try {
      movies.remove({"user_id": userId}).then((results) => {
        resp.send(results)
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
