const { app, BrowserWindow, Menu} = require("electron");

function createWindow() {
  // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 420});

    var menu = Menu.buildFromTemplate([
        {
            label: 'Debug',
            submenu: [
                {
                    label:'Open Debug Menu',
                    click(){}
                },
                {
                    label:'Close Debug Menu',
                    click(){}
                },
            ]

        },

        {
            label: 'Analyze',
            submenu: [
                {
                    label:'Graph RPM',
                    click(){}
                },
                {
                    label:'Graph SOC',
                    click(){}
                },
            ]

        },

        {
            label: 'Temp',
            click(){}
        },

        {
            label: 'Settings',
            submenu: [
                { 
                    label:'Open Temp Display',
                    click(){}
                },
                {  
                    label:'Close Temp Display',
                    click(){}
                },
            ]

        },
    ])
    Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadFile("index.html");
}

app.on("ready", createWindow);
