const crypto = require("crypto");
const uuidv4 = require('uuid/v4');
const config = require("./../config.json");
const functions = require("./functions.js");
const axios = require("axios")
const session = require('electron').remote.session;
const ses = session.fromPartition('persist:name')

ses.clearStorageData()

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const pwscramble = crypto.createHash('md5').update(password).digest('hex');
    if (username && password) {
      axios.post(`${config.apiBase}/login`, {
        username: username,
        pword: pwscramble
      }).then((resp) => {
        if (resp.data.status_code === 200) {
          const profile = resp.data.userId;
          const cookie = {
              url: 'http://ec2-3-16-124-36.us-east-2.compute.amazonaws.com:8080',
              name: 'userInfo',
              value: profile,
              expirationDate: 2093792393999
          };
          ses.cookies.set(cookie, (error) => {
              if (error) {
                console.error(error);
              } else {
                window.location.href = "dashboard.html"
              }
          });
        } else {
          alert("Something went wrong")
        }
      }).catch((e) => {
        console.log(e)
      })
    } else {
      alert("Please fill out all fields")
    }
}

function createAccount() {
  const username = document.getElementById("create-username").value;
  const password = document.getElementById("create-password").value;
  const pwscramble = crypto.createHash('md5').update(password).digest('hex');
  const file_path = document.getElementById("create-filepath").value;
  const user = {
    "username": username,
    "pword": pwscramble,
    "user_id": uuidv4(),
    "file_path": file_path
  }
  if (username && password && file_path) {
    axios.post(`${config.apiBase}/create_account`, user).then((resp) => {
      if (resp.data.status_code === 200) {
        const profile = user.user_id;
        const cookie = {
            url: 'http://ec2-3-16-124-36.us-east-2.compute.amazonaws.com:8080',
            name: 'userInfo',
            value: profile,
            expirationDate: 2093792393999
        };
        ses.cookies.set(cookie, (error) => {
            if (error) {
              console.error(error);
            } else {
              functions.createLibrary(user.user_id, user.file_path)
            }
        });
      } else {
        alert("Something went wrong")
      }
    }).catch((e) => {
      console.log(e)
    })
  } else {
    alert("Please fill out all fields")
  }
}

document.getElementById('login').addEventListener('click', login)

document.getElementById('create-account').addEventListener('click', createAccount)
