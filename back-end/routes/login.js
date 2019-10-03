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

api.post("/login", (req, resp) => {
  let pwEncrypt = crypto.createHash('md5').update(req.body.password).digest('hex');
  let body = {
    "username": req.body.username,
    "password": pwEncrypt
  }
    try {
      movies.find({$and: [{"username": body.username}, {"password": body.password}]}).toArray().then((results) => {
        if (results.length > 0) {
          resp.send({
            "status": 200,
            "message": "logged in",
            "user_id": results[0].user_id,
            "file_path": results[0].file_path
          })
        } else {
          resp.send({
            "status": 404,
            "message": "invalid login"
          })
        }
      })
    } catch(error) {
      resp.send(error)
    }
})

module.exports = api;
