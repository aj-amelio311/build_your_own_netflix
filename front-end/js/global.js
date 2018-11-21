const axios = require("axios")
const fs = require("fs");
const opn = require("opn");
const functions = require("./functions")
const session = require('electron').remote.session;
const ses = session.fromPartition('persist:name')
const config = require("./../config.json")

let userId;

window.filter = (e) => {
  const title = e.srcElement.value
  document.getElementById("info").innerHTML = "";
  let tile = "";
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    if (title != "") {
      axios.get(`${config.apiBase}/search/${title}/${userId}`).then((resp) => {
        if (resp.data.status_code === 200) {
          resp.data.inventory.forEach((movie) => {
            tile += tileComponent(movie)
          })
        } else {
          tile += "<h6>No Results Found</h6>";
        }
        document.getElementById("movie-container").innerHTML = tile;
      })
    } else {
      axios.get(`${config.apiBase}/get_inventory/${userId}`).then((resp) => {
        const content = resp.data.inventory;
        content.forEach((movie) => {
          tile += tileComponent(movie)
        })
        document.getElementById("movie-container").innerHTML = tile;
      })
    }

  })
}

window.filterQueue = (e) => {
  const title = e.srcElement.value
  document.getElementById("info").innerHTML = "";
  let tile = "";
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    if (title != "") {
      axios.get(`${config.apiBase}/searchQueue/${title}/${userId}`).then((resp) => {
        resp.data.inventory.forEach((movie) => {
          tile += tileComponent(movie)
        })
        document.getElementById("movie-container").innerHTML = tile;
      })
    } else {
      axios.get(`${config.apiBase}/get_queue/${userId}`).then((resp) => {
        const content = resp.data.queue;
        content.forEach((movie) => {
          tile += tileComponent(movie)
        })
        document.getElementById("movie-container").innerHTML = tile;
      })
    }

  })
}

function addToHistory(title) {
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    axios.get(`${config.apiBase}/get_movie/${userId}/${title}`).then((resp) => {
      if (resp.data.status_code === 200) {
        const movie = {
          "movie_title": encode(resp.data.movie_title),
          "movie_poster": resp.data.movie_poster.replace(":", "%3A").replace("'", "&#39;"),
          "movie_overview": encode(resp.data.movie_overview),
          "raw_title": resp.data.raw_title,
          "user_id": resp.data.user_id
        }
        axios.post(`${config.apiBase}/add_to_history`, movie).then((resp) => {
          console.log(resp)
        })
      }
    })
  });
}

window.playMovie = (element) => {
  const title = element.getAttribute("raw")
  let file_path;
  let catchNoFile = 0;
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    axios.get(`${config.apiBase}/get_profile/${userId}`).then((resp) => {
      file_path = resp.data[0].file_path;
        const fileExtensions = ["mp4", "divx", "avi", "mkv", "m4v", "mpg", "mpeg"];
        fileExtensions.forEach((ext) => {
          let moviePath;
          if (fs.existsSync(`${file_path}/${decode(title).replace(":", "-").replace("#39;", "'")}.${ext}`)) {
            catchNoFile++;
            moviePath = `${file_path}/${decode(title).replace(":", "-").replace("#39;", "'")}.${ext}`;
            opn(moviePath).then((data) => {
                addToHistory(title)
            });
          }
        })
        if (catchNoFile === 0) {
          alert("Something went wrong")
        }
    })
  });
}

window.details = (title) => {
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    let info = "";
    const infoBody = document.getElementById("info");
    const movieTitle = title
    const url = `${config.apiBase}/get_movie/${userId}/${movieTitle}`;
    const rtTitle = decodeURI(movieTitle).replace(/'/g, "").replace(/-/g, "").replace(/,/g, "").replace(/ /g, "_").replace("%26", "and").replace(/[!@#$%^&*]/g, "_").replace(/__/g, "_").replace(/__/g, "_").toLowerCase();
    axios.get(url).then((resp) => {
      if (resp.data.status_code === 200) {
        let summary;
        let title;
        if (decode(resp.data.movie_overview).length > 200) {
            summary = `${decode(resp.data.movie_overview).substring(0, 200)}...`
        } else {
            summary = decode(resp.data.movie_overview);
        }
        if (decode(resp.data.movie_title).length > 30) {
            title = `${decode(resp.data.movie_title).substring(0, 30)}...`
        } else {
            title = decode(resp.data.movie_title);
        }
        const movieData = {
          "status_code": 200,
          "movie_title": title,
          "movie_poster": decodeURIComponent(resp.data.movie_poster).replace("%3A", ":"),
          "movie_overview": summary.replace("&amp;", "and").replace("&#39;", "'").replace("#39;", "'"),
          "raw_title": resp.data.raw_title.replace("&#45;", "-"),
          "in_queue": resp.data.in_queue
        }
          info += "<div>";
          info += `<h4>${movieData.movie_title}</h4>`;
          info += `<p>${movieData.movie_overview}</p>`;
          info += "<div class='buttons'>";
          info += `<div class='button-class' raw='${movieData.raw_title}' title='${movieData.movie_title}' onclick='playMovie(this);'><i class='fas fa-play-circle fa-3x'></i></div>`;
          if (movieData.in_queue == "0") {
            info += `<div class='button-class' id='add' title='${movieData.raw_title}' onclick='addtoQueue(this);'><i class='fas fa-plus-circle fa-3x'></i></div>`;
          } else {
            info += `<div class='button-class' id='remove' title='${movieData.raw_title}' onclick='removeFromQueue(this);'><i class='fas fa-minus-circle fa-3x'></i></div>`;
          }
          info += "<div id='rating'>";
          info += "</div>";
          info += "</div>"
          info += "</div>"
          infoBody.innerHTML = info;
          axios.get(`${config.rtApi}/${rtTitle}`).then((resp) => {
            if(resp.data.status == "200" && resp.data.hasOwnProperty("critic_score")) {
              document.getElementById("rating").innerHTML = `<img class='rt-logo' src='../assets/rt-logo.png' /><h5 class="rt-score">${resp.data.critic_score}</h5>`;
            } else {
              document.getElementById("rating").innerHTML = ""
            }
          })
      }
    })
  });
}

window.addtoQueue = (element) => {
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    const dbTitle = encode(element.title).replace("&#39;", "'");
    const  tile = document.getElementById((element.title))
    axios.get(`${config.apiBase}/add_to_queue/${userId}/${dbTitle}`).then((resp) => {
      if (resp.data.status_code === 200) {
        element.innerHTML = "<h6>Added</h6>";
        const nodes = element.parentElement.childNodes;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === "add") {
            nodes[i].onclick = null;
          }
        }
        tile.remove();
      } else {
        alert("Something's not right")
      }
    })
  });
}

window.removeFromQueue = (element) => {
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    const dbTitle = encode(element.title).replace("&#39;", "'");
    const tile = document.getElementById((element.title))
    axios.get(`${config.apiBase}/remove_from_queue/${userId}/${dbTitle}`).then((resp) => {
      if (resp.data.status_code === 200) {
        element.innerHTML = "<h6>Removed</h6>";
        const nodes = element.parentElement.childNodes;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === "add") {
            nodes[i].onclick = null;
          }
        }
        tile.remove();
      } else {
        alert("Something's not right")
      }
    })
  });
}
