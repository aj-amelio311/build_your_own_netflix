const express = require("express");
const dbString = require("../config.json");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;

let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("inventory");
})

let api = express.Router();

api.post("/add_inventory", (req, resp) => {
  let inventory = req.body.inventory;
    try {
      movies.insertMany(inventory, (err, result) => {
        if (!err) {
          resp.send({
            "status": 200,
            "message": "inventory added"
          })
        }
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
