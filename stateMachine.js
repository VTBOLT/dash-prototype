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
    if (key == "q") {
        message = "Waiting on ignition...";
    } 
    else if (key == "w") {
        message = "Waiting on accessory...";        
    }
    else if (key == "e") {
        document.location.replace("index.html");        
    }
    document.getElementById("startUpText").innerHTML = message;
}

function test_keys(event) {
    var key = event.key;
    var current_state = "";
    if (key == "i") {
        current_state = "IDLE"
    }
    else if (key == "a") {
        current_state = "ACC_ON"
    }
    else if (key == "g") {
        current_state = "IGN_ON"
    }
    else if (key == "f") {
        current_state = "FAULT"
    }
    changeStates(current_state);
}

function changeStates(current_state) {
    var state = document.getElementById('state');
    if (current_state == "IDLE") {
        state.innerHTML = "Turn on accessory switch";
        start_button_pressed = False;
        //turn on accessory switch screen 
        //show only startup widgets
        if (acc_on) {
            current_state = "ACC_ON"
            //turn on ignition screen
        }        
    }
    else if (current_state == "ACC_ON") {
        state.innerHTML = "Pump good, BMS good," + "<br />" + "Turn on Ignition Switch";
        start_button_pressed = False;
        //turn on ignition screen
        if (!acc_on) {
            ign_on = False;
            current_state = "IDLE";
            //turn on accessory switch screen
        }
        else if (ign_on) {
            current_state = "IGN_ON";
            //precharging screen
        }
    }
    else if (current_state == "IGN_ON") {
        //check if mc is on first?
        state.innerHTML = "Precharging....";
        if (!acc_on) {
            ign_on = False;
            current_state = "IDLE";
            //turn on accessory switch screen
        }
        else if (!ign_on) {
            current_state = "ACC_ON";
            //turn on ignition screen
        }
        else if (start_button_pressed) {
            current_state = "MOTOR_ENABLED";
            //show only race widgets
        }
    }
    else if (current_state == "MOTOR_ENABLED") {
        //show only race widgets
        if (!acc_on) {
            ign_on = False;
            current_state = "IDLE";
            //turn on accessory switch screen
        }
        else if (!ign_on) {
            current_state = "ACC_ON";
            //turn on ignition screen
        }
        else if (fault_occurred) {
            current_state = "FAULT";
            //fault screen    
        }
    }
    else if (current_state == "FAULT") {
        state.innerHTML = "ERROR";
        if(!fault_occurred) {
            current_state = "MOTOR_ENABLED";
            //show only race widgets
        }
        else {
            //fault screen
        }
    }
    else if (current_state == "INVERTER_DISABLED") {
        //blue screen of death
    }
}