const express = require("express");
const dbString = require("../config.json");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;
let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("queue")
})

let api = express.Router();

api.post("/remove_from_queue", (req, resp) => {
  let body = req.body;
    try {
      movies.deleteOne({"raw_title": body.raw_title}, (err, result) => {
        if (!err) {
          resp.send({
            "status": 200,
            "message": "movie removed from queue"
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
