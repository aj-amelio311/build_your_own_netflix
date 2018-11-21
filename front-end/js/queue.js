const config = require("./../config.json")
const axios = require("axios")
const session = require('electron').remote.session;
const ses = session.fromPartition('persist:name')

let userId;

ses.cookies.get({}, (error, cookies) => {
  userId = cookies[0].value;
  render()
});

function render() {
  let tile = "";
  axios.get(`${config.apiBase}/get_queue/${userId}`).then((resp) => {
    const content = resp.data.queue;
    content.forEach((movie) => {
      tile += tileComponent(movie);
    })
    document.getElementById("movie-container").innerHTML = tile;
  })
}

document.getElementById("queue-filter").addEventListener("keyup", filterQueue);
