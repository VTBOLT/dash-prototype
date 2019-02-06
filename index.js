const {app, BrowserWindow, Menu, dialog} = require("electron");

const options = {message:'button working!'};

function createWindow() {
  // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 420});

    var menu = Menu.buildFromTemplate([
        {   label: 'Debug',
            submenu: [{
                label:'Open Debug Menu',
                click(){dialog.showMessageBox(win,{message:'open debug'})}},
                    {   label:'Close Debug Menu',
                        click(){dialog.showMessageBox(win,{message:'close debug'})}},]},
        {   label: 'Analyze',
            submenu: [{
                label:'Graph RPM',
                click(){dialog.showMessageBox(win,{message:'graph rpm'})}},
                    {   label:'Graph SOC',
                        click(){dialog.showMessageBox(win,{message:'graph soc'})}},]},
        {   label: 'Temp',
            click(){dialog.showMessageBox(win,{message:'temp'})}},
        {   label: 'Settings',
            submenu: [{ 
                label:'Open Temp Display',
                click(){dialog.showMessageBox(win,{message:'open temp'})}},
                    {  
                        label:'Close Temp Display',
                        click(){dialog.showMessageBox(win,{message:'close temp'})}},]},
        {   label: 'Widgets',
            submenu:[{
                label:'RPM Gauge',
                submenu:[{
                            label:'show',
                            click(){dialog.showMessageBox(win,{message:'show RPM'})},},
                        {
                            label:'hide',
                            click(){dialog.showMessageBox(win,{message:'hide RPM'})}}],},
            {
                label:'SOC Gauge',
                submenu:[{
                            label:'show',
                            click(){dialog.showMessageBox(win,{message:'show SOC'})},},
                        {
                            label:'hide',
                            click(){dialog.showMessageBox(win,{message:'hide SOC'})}}],},
            {  
                label:'Speedometer',
                submenu:[{
                            label:'show',
                            click(){dialog.showMessageBox(win,{message:'show Speed'})},},
                        {
                            label:'hide',
                            click(){dialog.showMessageBox(win,{message:'hide Speed'})}}],},
            {            
                label:'Temp Gauge',
                submenu:[{
                            label:'show',
                            click(){dialog.showMessageBox(win,{message:'show temp'})},},
                        {
                            label:'hide',
                            click(){dialog.showMessageBox(win,{message:'hide Temp'})}}],},
            {
                label:'Timer',
                submenu:[{
                            label:'show',
                            click(){dialog.showMessageBox(win,{message:'show Time'})},},
                        {
                            label:'hide',
                            click(){dialog.showMessageBox(win,{message:'hide '})}}],}],}  
    ])
    Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadFile("index.html");
}

app.on("ready", createWindow);
