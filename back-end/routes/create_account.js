const express = require("express");
const dbString = require("../config.json");
const crypto = require("crypto");

const {MongoClient} = require("mongodb");
const connectionString = dbString.connectionString;
let db;
let movies;
MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  db = client.db("movie_app");
  movies = db.collection("users");
})

let api = express.Router();

api.post("/create_account", (req, resp) => {
  let pwEncrypt = crypto.createHash('md5').update(req.body.password).digest('hex');
  let body = {
    "username": req.body.username,
    "password": pwEncrypt,
    "user_id": req.body.user_id,
    "file_path": decodeURIComponent(req.body.file_path)
  }
    try {
      movies.update({"username": req.body.username}, {$set: body}, {upsert: true}, (err, result) => {
        if (err) {
          resp.send({
            "status": 404,
            "message": "no good",
            "result": result
          })
        } else {
            resp.send({
                "status": 200,
                "message": "account created",
                "result": result
              })
        }
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
