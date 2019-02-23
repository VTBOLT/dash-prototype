const { remote } = require('electron');
const { Menu, MenuItem } = remote;


var modal = document.getElementById('myModal')
var RPM = document.getElementById('rpm')
let rpmGauge = document.getElementById("rpmGauge");


//Get document elements
var modal = document.getElementById('myModal');
var close = document.getElementsByClassName("close")[0];

var menu = Menu.buildFromTemplate([
    {   label: 'Debug',
        submenu: [{
            label:'Open Debug Menu',
            click(){modal.style.display = "block"}},

                {   label:'Close Debug Menu',
                    click(){modal.style.display = "none"}}]},
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
                        click(){RPM.style.display = "block";
                                rpmGauge.style.display = "block";},},
                    {
                        label:'hide',
                        click(){RPM.style.display = "none";
                                rpmGauge.style.display = "none";}}],},
        {
            label:'SOC Gauge',
            submenu:[{
                        label:'show',
                        click(){document.getElementById("soc").style.display="block";
                                document.getElementById("socBG").style.display="block"},},
                    {
                        label:'hide',
                        click(){document.getElementById("soc").style.display="none";
                                document.getElementById("socBG").style.display="none"}}],},
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
                        click(){document.getElementById("temps").style.display="block"},},
                    {
                        label:'hide',
                        click(){document.getElementById("temps").style.display="none"}}],},
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