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
      movies.deleteMany({"user_id": userId}, (err, result) => {
        if (!err) {
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
        } else {
          resp.send({
            "status": 404,
            "message": "unable to update"
          })
        }
      })
      /*
      movies.update({"user_id": userId}, {$set: inventory}, {upsert: true}, (err, result) => {
        if (err) {
          resp.send({
            "status": 404,
            "message": "no good",
            "result": result
          })
        } else {
            resp.send({
                "status": 200,
                "message": "updated",
                "result": result
              })
        }
      })
      */
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
