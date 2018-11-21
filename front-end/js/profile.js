const config = require("./../config.json")
const axios = require("axios")
const functions = require("./functions.js");
const session = require('electron').remote.session;
const ses = session.fromPartition('persist:name')
const fs = require("fs")

let userId;

ses.cookies.get({}, (error, cookies) => {
  userId = cookies[0].value;
  getHistory();
});

function updateInventory() {
  ses.cookies.get({}, (error, cookies) => {
    userId = cookies[0].value;
    axios.get(`${config.apiBase}/clear_inventory/${userId}`).then((resp) => {
      axios.get(`${config.apiBase}/get_profile/${userId}`).then((user) => {
        const filePath = user.data[0].file_path;
        if (fs.existsSync(filePath)) {
          functions.createLibrary(userId, filePath)
        } else {
            alert("Something went wrong")
        }
      })
    })
  });
}

function getHistory() {
   const container = document.getElementById("history-container");
   let tile = ""
   axios.get(`${config.apiBase}/get_history/${userId}`).then((resp) => {
     if (resp) {
       resp.data.history.forEach((movie) => {
         tile += tileComponent(movie)
       })
       container.innerHTML = tile;
     }
   })
}

function logout() {
  ses.clearStorageData()
  window.location.href = "login.html";
}


function clearHistory() {
  axios.get(`${config.apiBase}/clear_history/${userId}`).then((resp) => {
    if (resp) {
      document.getElementById("history-container").innerHTML = "";
    }
  })
}

document.getElementById("update-button").addEventListener("click", updateInventory)

document.getElementById("clear-history").addEventListener("click", clearHistory)

document.getElementById("logout").addEventListener("click", logout);
