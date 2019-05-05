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
    var message = "Waiting on accessory..."; 
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
        document.location.replace("index.html"); 
    } 
    else if (rpio.read(37)) {
        message = "ISOLATION FAULT DETECTED!";
    }
    else if (rpio.read(35)) {
        message = "Press the start button!"; 
    }
    else if (rpio.read(31)) {
        message = "Waiting on ignition...";
    }
    else if (rpio.read(33)) {
        message ="Pump is on!";
    }    
    document.getElementById("startUpText").innerHTML = message;
}