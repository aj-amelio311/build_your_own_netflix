const express = require("express");
const fs = require("fs");

let api = express.Router();

api.get("/get_files/:path", (req, resp) => {
    const filepath = decodeURIComponent(req.params.path);
    const fileExtensions = ["mp4", "divx", "avi", "mkv", "m4v", "mpg", "mpeg"];
    let searches = [];
    if (fs.existsSync(filepath)) {
      const files = fs.readdirSync(filepath)
      files.forEach((item) => {
        const movieClean = encodeURI(item.replace(/\.[^/.]+$/, "").replace("&", "and").replace("'", ""));
        const movieRaw= encodeURI(item.replace(/\.[^/.]+$/, "").replace("&", "%26").replace(/'/g, "&#39;").replace("-", "&#45;"));
        let searchPath = `https://api.themoviedb.org/3/search/movie?query=${movieClean}&api_key=b6ff109edfbb695e5769846611d26bb7`;
        const search = {
          "searchPath": searchPath,
          "rawTitle": decodeURI(movieRaw)
        }
        searches.push(search)
      })
      resp.send({
        "status": 200,
        "data": searches
      })
    } else {
      resp.send({
        "status": 404,
        "data": "files not found"
      })
    }

})

module.exports = api;
