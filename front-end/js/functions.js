const fs = require("fs");
const config = require("./../config.json")
const axios = require("axios")
const functions = require("./functions.js");
const session = require('electron').remote.session;
const ses = session.fromPartition('persist:name')

window.decode = (title) => {
  return decodeURIComponent(title.replace(/'/g, "#39;")).replace("%26", "&").replace("%2C", ",").replace("%3A", ":");
}

window.encode = (title) => {
  return encodeURIComponent(title).replace(":", "%3A").replace(/'/g, "&#39;");
}

window.encodeMatch = (title) => {
  return title.replace("&", "%2526").replace(/'/g, "&#39;").replace("-", "&#45;").replace(/ /g , "%20").replace(/"/g, '%22');
}

let inventory = []

function searchMovies(user_id, filepath) {
  const fileExtensions = ["mp4", "divx", "avi", "mkv", "m4v", "mpg", "mpeg"];
  let searches = [];
  if (fs.existsSync(filepath)) {
    const files = fs.readdirSync(filepath)
    files.forEach((item) => {
      const extension = item.replace(/.*\./, '').toLowerCase();
      if (fileExtensions.includes(extension)) {
        if (!item.includes("._")) {
          const movieClean = encodeURI(item.replace(/\.[^/.]+$/, "").replace("&", "and").replace("'", ""));
          const movieRaw= encodeURI(item.replace(/\.[^/.]+$/, "").replace("&", "%26").replace(/'/g, "&#39;").replace("-", "&#45;"));
          searchPath = `https://api.themoviedb.org/3/search/movie?query=${movieClean}&api_key=b6ff109edfbb695e5769846611d26bb7`;
          const search = {
            "searchPath": searchPath,
            "rawTitle": movieRaw
          }
          searches.push(search)
        }
      }
    })
  }
  return searches
}


function addInventoryToDB() {
  axios.post(`${config.apiBase}/add_to_inventory`, {
    "movies": inventory
  }).then((resp) => {
    if (resp.data.status_code === 200) {
        window.location.href = "dashboard.html"
    } else {
      alert("Something went wrong!")
    }
  }).catch((e) => {
  })
}

exports.createLibrary = (userId, filePath) => {
  const body = {
    userId: userId,
    filePath: filePath
  }
  const searches = searchMovies(body.userId, body.filePath);
  if (searches.length > 0) {
    global.inc = 0;
    global.end = searches.length;
    global.counter = 0;
    function getData(callback) {
      let movieHolder = [];
      movieHolder.push(searches.slice(inc, inc + 10))
      if (counter < end) {
        if (movieHolder.length > 0) {
          movieHolder[0].forEach((movie) => {
            counter++;
            function getResponse(callback) {
              axios.get(movie.searchPath).then((result) => {
                if (result.data.total_results >= 1) {
                  const percentLoading = parseInt((inc / end) * 100);
                  if (percentLoading < 100) {
                    const percentDisplay = `${percentLoading.toString()}%`;
                    document.getElementById("loading").innerHTML = `<p>Loading<br>${percentDisplay}</p>`;
                  } else {
                    document.getElementById("loading").innerHTML = "";
                  }
                  let movie_poster;
                  const movie_title = encodeURIComponent(result.data.results[0].title).replace(":", "%3A").replace(/'/g, "&#39;");
                  if (result.data.results[0].poster_path == null) {
                    movie_poster = "https://s3.us-east-2.amazonaws.com/aj-website-file-storage/other/cover.png";
                  } else {
                    movie_poster = `http://image.tmdb.org/t/p/w185/${result.data.results[0].poster_path}`.replace(":", "%3A").replace("'", "&#39;");
                  }
                  const movie_overview = encodeURIComponent(result.data.results[0].overview).replace(/'/g, "&#39;")
                  const movie_genres = decodeURI(result.data.results[0].genre_ids.join().replace(/,/g, "%2C"));
                  const raw_title = movie.rawTitle;
                  const movieBody = {
                    "movie_title": movie_title,
                    "movie_poster": movie_poster,
                    "movie_overview": movie_overview,
                    "movie_genres": movie_genres,
                    "raw_title": raw_title,
                    "user_id": userId
                  }
                  callback(movieBody)
                }
              }).catch((e) => {
              })
            }
            getResponse((movie) => {
              inventory.push(movie)
            })
          })
        }
    }
  }

function countercheck(counter, inc, end) {
  if (inc < end) {
    return true
  } else {
    return false
  }
}

  const myTimer = setInterval(() => {
    if (countercheck(counter, inc, end) === true) {
      getData()
      inc += 10
    } else {
      inc += 1000
      counter += 1000
      addInventoryToDB();
      clearInterval(myTimer);
    }
  },4000)
} else {
   alert("Something went wrong")
  }
}

window.tileComponent = (movie) => {
  let tile = "";
  const poster = movie.movie_poster.replace("%3A", ":")
  const movieTitle = movie.movie_title.replace("%24", "$").replace("%26", "&").replace("%3A", ":").replace("%23", "").replace("%2C", ",");
  const rawTitle = movie.raw_title;
  tile += `<div class='movie-tile' id='${rawTitle}' title='${decodeURI(movieTitle)}' onclick='details(this.id)'>`;
  tile += `<img src='${movie.movie_poster.replace("%3A", ":")}'>`;
  tile += "</div>";
  return tile
}
