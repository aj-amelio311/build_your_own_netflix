const express = require("express");
const {MongoClient} = require("mongodb");
const connectionString = 'mongodb+srv://ajamelio:Fondoooo42@cluster0-9v8bh.mongodb.net/test?retryWrites=true';

let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("inventory")
})

let api = express.Router();

api.get("/get_movie/:movieId/:userId", (req, resp) => {
    const movieId = parseInt(req.params.movieId);
    const userId = req.params.userId;
    try {
      movies.find({$and: [{"id": movieId}, {"user_id": userId}]}).toArray().then((results) => {
        resp.send(results)
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
