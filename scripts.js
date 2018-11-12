var can = require('socketcan');

var channel = can.createRawChannel("vcan0",true);
//var spawn = require("child_process").spawn;

/* The command below spawns an instance of CanInterface
which outputs CAN data 
--------Used for production--------*/
// processSOC = spawn("./CanInterface", [], {
//   shell: true
// });

/* Spawns an instance of dataReader.py, which writes to stdout 
test rpm and soc data 
--------Used for testing-------*/
//processInputs = spawn("python", ["dataReader.py"], {
//  shell: true
//});

//Creates JS object of HTML element.
var rpm = document.getElementById("rpm");

//Loading bar object imported from loading-bar.*
var b1 = document.querySelector(".ldBar");
var b = new ldBar(b1);

let curr_rpm = 0;
//Reads in stdout, processes data to display on screen.
//processInputs.stdout.on("data", data => {
//  var str = data.toString();
//  let buf = str.split(":");
//  if (buf[0] == "soc") {
//    b.set(parseInt(buf[1]));
//  } else if (buf[0] == "rpm") {
//    let newbuf = buf[1].split("\n");
//    if (newbuf[0].trim().length != 0) {
//      curr_rpm = newbuf[0];
//    }
//    console.log(curr_rpm);
//    rpm.textContent = "RPM: " + curr_rpm;
//  }
//});
channel.addListener("onMessage", function(msg) {
    switch(msg['id']) {
        case 0xA0:
            moduleA         = ((msg['data'][1] << 8 ) + ( msg['data'][0] )) * 0.1;
    	    moduleB         = ((msg['data'][3] << 8 ) + ( msg['data'][2] )) * 0.1;
    	    moduleC         = (( msg['data'][5] << 8 ) + ( msg['data'][4] )) * 0.1;
    	    gateDrvrBrd     = (( msg['data'][7] << 8 ) + ( msg['data'][6] )) * 0.1; 
       		
    		break; 
        case 0xA2:
    		mtrTemp = (( msg['data'][5] << 8 ) + ( msg['data'][4] )) * 0.1;

            break;
        case 0xA5:
            RPM = (( msg['data'][3] << 8 ) + ( msg['data'][2] ));

            break;
        case 0x181:
			highCellTemp = (( msg['data'][2] << 8 ) + ( msg['data'][1] )) * 0.1;
	    	lowCellTemp = (( msg['data'][5] << 8 ) + (msg['data'][4] )) * 0.1;
			break;
		case 0x111:
		    DCL = (( msg['data'][1] << 8 ) + ( msg['data'][0] ));
			break;
		case 0x183:
		    SOC = (( msg['data'][5] << 8 ) + ( msg['data'][4] )) * 0.5;
            b.set(SOC)
			break;
		case 0xAA:
			OBVSM_state = (( msg['data'][1] << 8 ) + ( msg['data'][0] ));
	    	inverter_state = (( msg['data'][2] ));
	    	relay_state = (( msg['data'][3] ));
	    	inverter_run_state = (( msg['data'][4] ));
	    	inverter_cmd_state = (( msg['data'][5] ));
	    	inverter_enable_state = (( msg['data'][6] ));
	    	direction_state = (( msg['data'][7] ));
			break;
		case 0xAB:
			post_lo_fault = (( msg['data'][1] << 8 ) + ( msg['data'][0] ));
	    	post_hi_fault = (( msg['data'][3] << 8 ) + ( msg['data'][2] ));
	    	run_lo_fault = (( msg['data'][5] << 8 ) + ( msg['data'][4] ));
	    	run_hi_fault = (( msg['data'][7] << 8 ) + ( msg['data'][6] ));
			break;
		default:
			break;
    }
});

channel.start()
