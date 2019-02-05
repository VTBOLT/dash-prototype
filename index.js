const {app, BrowserWindow, Menu, dialog} = require("electron");

const options = {message:'button working!'};

function createWindow() {
  // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 420});

    var menu = Menu.buildFromTemplate([
        {
            label: 'Debug',
            submenu: [
                {
                    label:'Open Debug Menu',
                    click(){dialog.showMessageBox(win,{message:'open debug'})}
                },
                {
                    label:'Close Debug Menu',
                    click(){dialog.showMessageBox(win,{message:'close debug'})}
                },
            ]

        },

        {
            label: 'Analyze',
            submenu: [
                {
                    label:'Graph RPM',
                    click(){dialog.showMessageBox(win,{message:'graph rpm'})}
                },
                {
                    label:'Graph SOC',
                    click(){dialog.showMessageBox(win,{message:'graph soc'})}
                },
            ]

        },

        {
            label: 'Temp',
            click(){dialog.showMessageBox(win,{message:'temp'})}
        },

        {
            label: 'Settings',
            submenu: [
                { 
                    label:'Open Temp Display',
                    click(){dialog.showMessageBox(win,{message:'open temp'})}
                },
                {  
                    label:'Close Temp Display',
                    click(){dialog.showMessageBox(win,{message:'close temp'})}
                },
            ]

        },
    ])
    Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadFile("index.html");
}

app.on("ready", createWindow);
