var acc_on = False;
var bms_de = True;
var imd_ok = True;
var pressure_ok = True;
var ign_on = False;
var start_button_pressed = False;
var fault_occurred = False;
var motor_enabled = False;
var inverter_disabled = False;

var current_state = 'IDLE';
var next_state = 'IDLE';

function nonrace_states(event) {
    var key = event.key;
    var message = "";
    
    if (key == "a") {
        message = "Waiting on accessory...";        
    }
    else if (key == "i") {
        message = "Waiting on ignition...";
    } 
    else if (key == "s") {
        message = "Press the start button!";        
    }
    else if (key == "e") {
        document.location.replace("index.html");        
    }
    document.getElementById("startUpText").innerHTML = message;
}

function nonrace_statesGPIO() { 
    var rpio = require('rpio');
    //BMS Discharge Enable 
    rpio.open(29, rpio.INPUT, rpio.PULL_UP);
    //Pump Indicator
    rpio.open(31, rpio.INPUT, rpio.PULL_UP);
    //ACC Switch
    rpio.open(33, rpio.INPUT, rpio.PULL_UP);
    //IGN Switch
    rpio.open(35, rpio.INPUT, rpio.PULL_UP);
    //Isolation Fault Signal
    rpio.open(37, rpio.INPUT, rpio.PULL_UP);
    //poll for pin state change
    rpio.poll(29, pollDischarge, rpio.POLL_DOWN);
    rpio.poll(31, pollPump, rpio.POLL_DOWN);
    rpio.poll(33, pollACC, rpio.POLL_DOWN);
    rpio.poll(35, pollIGN, rpio.POLL_DOWN);
    rpio.poll(37, pollISO, rpio.POLL_DOWN);  
}

function pollDischarge(pin) {
    document.getElementById("startUpText").innerHTML = "BMS discharging";
}

function pollPump(pin) {
    document.getElementById("startUpText").innerHTML = "Pumping";
}

function pollACC(pin) {
    document.getElementById("startUpText").innerHTML = "Waiting on ignition...";
}

function pollIGN(pin) {
    document.getElementById("startUpText").innerHTML = "Press the start button.";
}

function pollISO(pin) {
    document.getElementById("startUpText").innerHTML = "ISOLATION FAULT!";
}

//change boolean values
/*
function pollDischarge(pin) {
    document.getElementById("startUpText").innerHTML = "BMS discharging";
}

function pollPump(pin) {
    document.getElementById("startUpText").innerHTML = "Pumping";
}

function pollACC(pin) {
    document.getElementById("startUpText").innerHTML = "Waiting on ignition...";
}

function pollIGN(pin) {
    document.getElementById("startUpText").innerHTML = "Press the start button.";
}

function pollISO(pin) {
    document.getElementById("startUpText").innerHTML = "ISOLATION FAULT!";
}
*/

//only poll 29 and 37 in code
/*
//BMS must be discharging before any other buttons work
function pollDischarge(pin) {}
    rpio.poll(31, pollPump, rpio.POLL_DOWN);
    rpio.poll(pin, null);
}

//Pump must be active in order to move on to ignition
function pollPump(pin) {
    rpio.poll(33, rpio.PULL_DOWN);
    rpio.poll(pin, null);
}

//Accessory on + pump means the bike is ready for ignition
function pollACC(pin) {
    document.getElementById("startUpText").innerHTML = "Waiting on ignition...";
    rpio.poll(35, rpio.PULL_DOWN);
    rpio.poll(pin, null);
}

//after igintion the bike is just waiting to stop
function pollIGN(pin) {
    document.getElementById("startUpText").innerHTML = "Press the start button.";
    rpio.poll(pin, null);
}
*/