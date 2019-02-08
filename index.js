const {app, BrowserWindow, Menu, dialog} = require("electron");

const options = {message:'button working!'};

function createWindow() {
    // Create the browser window 
    // (height and width of NHD-5.0-HDMI-N-RTXL-RTU)
    win = new BrowserWindow({ width: 800, height: 480 });

    // and load the index.html of the app.
    win.loadFile("index.html");
}

app.on("ready", createWindow);
