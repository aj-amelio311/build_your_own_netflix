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

api.post("/update_inventory", (req, resp) => {
  let userId = req.body.userId
  let inventory = req.body.inventory;
    try {
      movies.deleteMany({"user_id": userId}).then((results) => {
          movies.insertMany(inventory, (err2, result2) => {
            if (!err2) {
              resp.send({
                "status": 200,
                "message": "inventory added"
              })
            } else {
              resp.send({
                "status": 404,
                "message": "unable to add"
              })
            }
          })

      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
