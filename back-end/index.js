const express = require("express");
const config = require("./config.json");
const cors = require("cors");

var app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const dbUri = config.connectionString;

let getInventory = require("./routes/get_inventory");
let addInventory = require("./routes/add_inventory");
let getQueue = require("./routes/get_queue");
let checkQueue = require("./routes/check_queue");
let getHistory = require("./routes/get_history");
let getMovie = require("./routes/get_movie");
let getProfile = require("./routes/get_profile");
let search = require("./routes/search");
let searchQueue = require("./routes/search_queue");
let removeFromQueue = require("./routes/remove_from_queue");
let addToQueue = require("./routes/add_to_queue");
let addToHistory = require("./routes/add_to_history");
let clearInventory = require("./routes/clear_inventory");
let clearHistory = require("./routes/clear_history");
let genres = require("./routes/genres");
let login = require("./routes/login");
let createAccount = require("./routes/create_account");
let updateInventory = require("./routes/update_inventory");

app.use(cors({origin: '*'}))
app.use(getInventory);
app.use(addInventory);
app.use(getQueue);
app.use(checkQueue);
app.use(getHistory);
app.use(getMovie);
app.use(getProfile);
app.use(clearInventory);
app.use(clearHistory);
app.use(search);
app.use(searchQueue);
app.use(removeFromQueue);
app.use(addToQueue);
app.use(addToHistory);
app.use(genres);
app.use(login);
app.use(createAccount);
app.use(updateInventory);

app.get("/", (req, resp) => {
  resp.send("up and running")
})

app.listen(8080, () => {
  console.log("running...")
})
