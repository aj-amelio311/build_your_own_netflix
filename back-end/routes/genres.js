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

api.get("/genres/:userId/:genreId", (req, resp) => {
    const userId = req.params.userId;
    const genreId = req.params.genreId;
    try {
      movies.find({$and: [{"genre_ids": parseInt(genreId)}, {"user_id": userId}]}).toArray().then((results) => {
        resp.send(results)
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
