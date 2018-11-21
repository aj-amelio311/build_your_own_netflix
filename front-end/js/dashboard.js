const config = require("./../config.json")
const session = require('electron').remote.session;
const ses = session.fromPartition('persist:name')
const axios = require("axios");

ses.cookies.get({}, (error, cookies) => {
  userId = cookies[0].value;
  renderLibrary();
});

function renderLibrary() {
    let tile = "";
    axios.get(`${config.apiBase}/get_inventory/${userId}`).then((resp) => {
      const content = resp.data.inventory;
      content.forEach((movie) => {
        tile += tileComponent(movie)
      })
      document.getElementById("movie-container").innerHTML = tile;
    })
}

function genres() {
  let tile = "";
  const genre = document.getElementById("genreMenu").value;
  if (genre !== "9999") {
    axios.get(`${config.apiBase}/genres/${genre}/${userId}`).then((resp) => {
        const content = resp.data.inventory;
        content.forEach((movie) => {
          tile += tileComponent(movie)
        })
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
}

document.getElementById("dashboard-filter").addEventListener("keyup", filter);

document.getElementById("genreMenu").addEventListener("change", genres)
