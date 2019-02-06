const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window 
  // (height and width of NHD-5.0-HDMI-N-RTXL-RTU)
  win = new BrowserWindow({ width: 800, height: 480 });

  // and load the index.html of the app.
  win.loadFile("index.html");
}

app.on("ready", createWindow);
