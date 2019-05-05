const {app, BrowserWindow, Menu, dialog} = require("electron");

const options = {message:'button working!'};

function createWindow() {
    // Create the browser window 
    // (height and width of NHD-5.0-HDMI-N-RTXL-RTU)
    win = new BrowserWindow({ 
        width: 800, 
        height: 480, 
     });
     
    // set full screen (matters for the pi)
    // COMMENT THIS OUT IF RUNNING ON YOUR OWN MACHINE
    // OR USE ESCAPE TO TOGGLE BACK TO WINDOWED
    //win.setFullScreen(true);
    // and load the index.html of the app.
    win.loadFile("index.html");
}

app.on("ready", createWindow);
