"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs = require("fs");
var win;
electron_1.app.on("ready", createWindow);
electron_1.app.on("activate", function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({
        fullscreen: true,
        webPreferences: { nodeIntegration: true }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../../dist/movie/index.html"),
        protocol: "file:",
        slashes: true
    }));
  //  win.webContents.openDevTools();
    win.on("closed", function () {
        win = null;
    });
}
electron_1.ipcMain.on("getFiles", function (event, arg) {
    var files = fs.readdirSync(__dirname);
    win.webContents.send("getFilesResponse", files);
});
//# sourceMappingURL=main.js.map
