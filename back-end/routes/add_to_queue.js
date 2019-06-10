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

api.post("/add_to_queue", (req, resp) => {
  let body = req.body
    try {
      movies.insertOne(body, (err, result) => {
        if (!err) {
          resp.send({
            "status": 200,
            "message": "movie added to queue"
          })
        }
      })
    } catch(error) {
      resp.send({
        "status": 404,
        "message": error
      })
    }
})

module.exports = api;
