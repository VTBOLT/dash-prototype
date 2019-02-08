const { remote } = require('electron');
const { Menu, MenuItem } = remote;

//Get document elements
var modal = document.getElementById('myModal');

var menu = Menu.buildFromTemplate([
    {   label: 'Debug',
        submenu: [{
            label:'Open Debug Menu',
            click(){modal.style.display = "block"}},
                {   label:'Close Debug Menu',
                    click(){modal.style.display = "none"}},]},
    {   label: 'Analyze',
        submenu: [{
            label:'Graph RPM',
            click(){dialog.showMessageBox(win,{message:'graph rpm'})}},
                {   label:'Graph SOC',
                    click(){dialog.showMessageBox(win,{message:'graph soc'})}},]},
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