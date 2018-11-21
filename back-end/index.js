const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const config = require("./config.json")

var app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(cors({origin: '*'}))

const con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
});

con.connect(function(err) {
  if (err) {
      throw err;
  }
  console.log("connected to db")
});

global.db = con;

app.get("/", (req, resp) => {
  resp.send("it works")
})

app.post("/login", (req, resp) => {
  const loginUser = {
    "username" :req.body.username,
    "pword": req.body.pword
  }
  if (req.body.username && req.body.pword) {
    let query = `SELECT * FROM users WHERE username = ? AND pword = ?;`;
    function setQuery(callback) {
      db.query(query, [loginUser.username, loginUser.pword], (err, result) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, result)
        }
      })
    }
    setQuery((err, content) => {
      if (content.length > 0) {
        resp.send({
          "status_code": 200,
          "userId": content[0].user_id
        })
      } else {
        resp.send({
          "status_code": 404,
          "message": "login failed"
        })
      }
    })
  } else {
    resp.send({
      "status_code": 404,
      "message": "fields not set"
    })
  }
})

app.post("/create_account", (req, resp) => {
  let user = {
    "username": req.body.username,
    "pword": req.body.pword,
    "user_id": req.body.user_id,
    "file_path": req.body.file_path
  }
    let query = `INSERT INTO users SET ?;`;
    function setQuery(callback) {
      db.query(query, [user], (err, result) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, result)
        }
      })
    }
    setQuery((err, content) => {
      if (err) {
        resp.send({
          "status_code": 404,
          "message": "fields not set"
        })
      } else {
        resp.send({
          "status_code": 200,
          "message": "account created"
        })
      }
    })
})

app.get("/get_inventory/:userId", (req, resp) => {
  const userId = req.params.userId;
  function setQuery(callback) {
    let query = `SELECT * FROM inventory WHERE user_id = ? AND in_queue = '0' ORDER BY LOWER(movie_title) ASC`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": "something went wrong"
      })
    } else {
      resp.send({
        "status_code": 200,
        "inventory": content
      })
    }
  })
})

app.get("/clear_inventory/:userId", (req, resp) => {
  const userId = req.params.userId;
  function setQuery(callback) {
    let query = `DELETE FROM inventory WHERE user_id = ?;`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": err
      })
    } else {
      resp.send({
        "status_code": 200,
        "message": "inventory cleared"
      })
    }
  })
})

app.get("/get_queue/:userId", (req, resp) => {
  const userId = req.params.userId;
  function setQuery(callback) {
    let query = `SELECT * FROM inventory WHERE user_id = ? AND in_queue = '1' ORDER BY LOWER(movie_title) ASC`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": err
      })
    } else {
      resp.send({
        "status_code": 200,
        "queue": content
      })
    }
  })
})

app.get("/get_movie/:userId/:movieTitle", (req, resp) => {
  const body = {
    "user_id": req.params.userId,
    "raw_title": encodeURI(req.params.movieTitle).replace(/'/g, "&#39;").replace(/-/g, "&#45;")
  }
  function setQuery(callback) {
    let query = `SELECT * FROM inventory WHERE user_id = ? AND raw_title = ?;`;
    db.query(query, [body.user_id, body.raw_title], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": "movie not found"
      })
    } else {
      if (content.length > 0) {
        resp.send({
            "status_code": 200,
            "movie_title": decodeURIComponent(content[0].movie_title),
            "movie_poster": decodeURIComponent(content[0].movie_poster).replace("%3A", ":"),
            "movie_overview": decodeURIComponent(content[0].movie_overview).replace("&amp;", "and").replace("&#39;", "'"),
            "raw_title": body.raw_title,
            "user_id": body.user_id,
            "in_queue": content[0].in_queue
          })
      } else {
        resp.send({
          "status_code": 404,
          "message": "movie not found"
        })
      }
    }
  })
})

app.get("/get_history/:userId", (req, resp) => {
  const userId = req.params.userId;
  function setQuery(callback) {
    let query = `SELECT * FROM history WHERE user_id = ? ORDER BY date_added DESC LIMIT 8;`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": err
      })
    } else {
      resp.send({
        "status_code": 200,
        "history": content
      })
    }
  })
})

app.get("/recently_added/:userId", (req, resp) => {
  var userId = req.params.userId;
  function setQuery(callback) {
    let query = `SELECT * FROM inventory WHERE user_id = ? ORDER BY date_added DESC LIMIT 8;`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send(err)
    } else {
      resp.send(content)
    }
  })
})

app.get("/get_profile/:userId", (req, resp) => {
  const userId = req.params.userId;
  function setQuery(callback) {
    let query = `SELECT * FROM users WHERE user_id = ?;`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send(err)
    } else {
      resp.send(content)
    }
  })
})

app.post("/add_to_history", (req, resp) => {
  const body = {
    "movie_title": req.body.movie_title,
    "movie_poster": req.body.movie_poster,
    "movie_overview": req.body.movie_overview,
    "raw_title": req.body.raw_title,
    "user_id": req.body.user_id
  }
  function setQuery(callback) {
    let query = `INSERT INTO history SET ?`;
    db.query(query, [body], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": err
      })
    } else {
      resp.send({
        "status_code": 200,
        "message": "added to history"
      })
    }
  })
})

app.get("/clear_history/:userId", (req, resp) => {
  const userId = req.params.userId;
  function setQuery(callback) {
    let query = `DELETE FROM history WHERE user_id = ?;`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": err
      })
    } else {
      resp.send({
        "status_code": 200,
        "message": "History cleared successfully."
      })
    }
  })
})

app.get("/add_to_queue/:userId/:movieTitle", (req, resp) => {
  const body = {
    "user_id": req.params.userId,
    "raw_title": req.params.movieTitle.replace(/'/g, "&#39;").replace(/-/g, "&#45;")
  }
  function setQuery(callback) {
    let query = `UPDATE inventory SET in_queue = '1' WHERE user_id = ? AND raw_title = ?;`;
    db.query(query, [body.user_id, body.raw_title], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      console.log(err)
    } else {
      if (content.affectedRows > 0) {
        resp.send({
          "status_code": 200,
          "message": "Added"
        })
      } else {
        resp.send({
          "status_code": 404,
          "message": "Something went wrong"
        })
      }
    }
  })
})

app.get("/remove_from_queue/:userId/:movieTitle", (req, resp) => {
  const body = {
    "user_id": req.params.userId,
    "raw_title": req.params.movieTitle.replace(/'/g, "&#39;").replace(/-/g, "&#45;")
  }
  function setQuery(callback) {
    let query = `UPDATE inventory SET in_queue = '0' WHERE user_id = ? AND raw_title = ?;`;
    db.query(query, [body.user_id, body.raw_title],(err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      console.log(err)
    } else {
      if (content.affectedRows > 0) {
        resp.send({
          "status_code": 200,
          "message": "Added"
        })
      } else {
        resp.send({
          "status_code": 404,
          "message": "Something went wrong"
        })
      }
    }
  })
})

app.get("/genres/:genreId/:userId", (req, resp) => {
  const genreId = req.params.genreId;
  const userId = req.params.userId;
  function setQuery(callback) {
    let query = `SELECT * FROM inventory WHERE movie_genres LIKE '%${genreId}%' AND user_id = ? AND in_queue = '0' ORDER BY LOWER(movie_title) ASC;`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": "something went wrong"
      })
    } else {
      if (content.length > 0) {
        resp.send({
          "status_code": 200,
          "inventory": content
        })
      } else {
        resp.send({
          "status_code": 404,
          "message": "no good"
        })
      }

    }
  })
})

app.get("/search/:movieTitle/:userId", (req, resp) => {
  const body = {
    "user_id": req.params.userId,
    "raw_title": req.params.movieTitle
  }
  function setQuery(callback) {
    let query = `SELECT * FROM inventory WHERE raw_title LIKE '%${body.raw_title}%' AND user_id = ? AND in_queue = '0' ORDER BY LOWER(movie_title) ASC;`;
    db.query(query, [body.user_id], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": "something went wrong"
      })
    } else {
      if (content.length > 0) {
        resp.send({
          "status_code": 200,
          "inventory": content
        })
      } else {
        resp.send({
          "status_code": 404,
          "message": "no good"
        })
      }

    }
  })
})

app.get("/searchQueue/:movieTitle/:userId", (req, resp) => {
  const body = {
    "user_id": req.params.userId,
    "raw_title": req.params.movieTitle
  }
  function setQuery(callback) {
    let query = `SELECT * FROM inventory WHERE raw_title LIKE '%${body.raw_title}%' AND user_id = ? AND in_queue = '1' ORDER BY LOWER(movie_title) ASC;`;
    db.query(query, [body.user_id], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": "something went wrong"
      })
    } else {
      if (content.length > 0) {
        resp.send({
          "status_code": 200,
          "inventory": content
        })
      } else {
        resp.send({
          "status_code": 404,
          "message": "no good"
        })
      }

    }
  })
})

app.post("/add_to_inventory", (req, resp) => {
  let movies = req.body.movies;
  let counter = 0;
  function checker() {
    if (counter == movies.length) {
      resp.send({
        "status_code": 200
      })
    }
  }
  movies.forEach((movie) => {
    counter++;
    function setQuery(callback) {
      let query = `INSERT INTO inventory SET movie_title = '${movie.movie_title}', raw_title = '${movie.raw_title}', movie_poster = '${movie.movie_poster}', movie_overview = '${movie.movie_overview}', movie_genres = '${movie.movie_genres}', user_id = '${movie.user_id}', in_queue = '0';`;
      db.query(query, (err, result) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, result)
        }
      })
    }
    setQuery((err, content) => {
      if (err) {
        resp.send({
          "status_code": 404
        })
      }
    })
    checker()
  })
})

app.get("/DELETE_IT_ALL", (req, resp) => {
  function setQuery(callback) {
    let query = `DELETE FROM queue;`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  setQuery((err, content) => {
    if (err) {
      resp.send({
        "status_code": 404,
        "message": err
      })
    } else {
      resp.send({
        "status_code": 200,
        "queue": "done"
      })
    }
  })
})

app.listen(8080, () => {
  console.log("running...")
})
