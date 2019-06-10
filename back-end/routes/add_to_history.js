const express = require("express");
const dbString = require("../config.json");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;

let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("history");
})

let api = express.Router();

api.post("/add_to_history", (req, resp) => {
    let body = req.body
    try {
      movies.insertOne(body, (err, result) => {
        if (!err) {
          resp.send({
            "status": 200,
            "message": "movie added to history"
          })
        }
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
