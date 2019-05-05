//https://github.com/jperkin/node-rpio
//uses node-rpio
//npm install rpio

/*
GPIO 29: BMS Discharge Enable
GPIO 31: Pump Indicator
GPIO 33: ACC Switch
GPIO 35: IGN Switch
GPIO 37: Isolation Fault Signal
*/
var rpio = require('rpio');
//BMS Discharge Enable (Start Button)
rpio.open(29, rpio.INPUT);
//Pump Indicator
rpio.open(31, rpio.INPUT);
//ACC Switch
rpio.open(33, rpio.INPUT);
//IGN Switch
rpio.open(35, rpio.INPUT);
//Isolation Fault Signal
rpio.open(37, rpio.INPUT);
if (rpio.read(29)) {
    
}
if (rpio.read(31)) {

}
if (rpio.read(33)) {

}
if (rpio.read(35)) {

}
if (rpio.read(37)) {

}