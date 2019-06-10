const express = require("express");
const dbString = require("../config.json");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;
let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("queue");
})

let api = express.Router();

api.get("/search_queue/:movieTitle/:userId", (req, resp) => {
    const movieTitle = req.params.movieTitle;
    const userId = req.params.userId;
    try {
      movies.find({$and: [{"title":{'$regex': movieTitle, '$options' : 'i'}}, {"user_id": userId}]}).toArray().then((results) => {
        resp.send(results)
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
