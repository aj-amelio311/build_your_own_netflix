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

api.get("/get_movie/:movieTitle/:userId", (req, resp) => {
    const movieTitle = req.params.movieTitle
    const userId = req.params.userId;
    try {
      movies.find({$and: [{"raw_title": movieTitle}, {"user_id": userId}]}).toArray().then((results) => {
        resp.send(results)
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
