// Had to comment these out, hangs vvvvvvv
//var can = require("socketcan");
//var channel = can.createRawChannel("vcan0", true);
// Had to comment these out, hangs ^^^^^^^

//var spawn = require("child_process").spawn;

/* The command below spawns an instance of CanInterface
which outputs CAN data 
--------Used for production--------*/
// processSOC = spawn("./CanInterface", [], {
//   shell: true
// });

// Get JS objects of the HTML elements
let rpm = document.getElementById("rpm");
let maxMCTemp = document.getElementById("maxMCTemp");
let motorTemp = document.getElementById("motorTemp");
let maxMotorTemp = document.getElementById("maxMotorTemp");
let maxCellTemp = document.getElementById("maxCellTemp");
let minCellTemp = document.getElementById("minCellTemp");
//let soc = document.getElementById("soc");
let tempTable = document.getElementById("tempTable");
let showTemps = document.getElementById("showTemps");


// Set initial values for data
let curr_soc = 92.0;
let curr_rpm = 1000;
let curr_maxmctemp = 98.0;
let curr_motortemp = 30.0;
let curr_maxmotortemp = 30.0;
let curr_maxcelltemp = 120.0
let curr_mincelltemp = 102.0
let counter = 51; // analagous to "temp" on BOLT_3_Dash

// Initialize SOC ProgressBar
var socBar = new ProgressBar.Line("#soc", {
  strokeWidth: 23,
  easing: 'easeInOut',
  duration: 1000,
  color: '#ff0000',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: {width: '80%', height: '100%'},
  text: {
    style: {
      // text sits directly to right of bar
      color: '#000000',
      fontFamily: 'tahoma',
      fontSize: '25px',
      display: 'inline-block',
      verticalAlign: '55%',
      padding: 0,
      margin: 0,
      transform: 'translate(5px, -5px)',
    },
    autoStyleContainer: false
  },
  // color gradient: low-red, high-green, with sharp change around 20%
  from: {color: '#ff0000', a:0},
  to: {color: '#3c643c', a:20},
  step: (state, socBar) => {
   socBar.path.setAttribute('stroke', state.color);
   // display nearest tenth of a percent
   socBar.setText((100 * socBar.value()).toString().substring(0, 4));
  }
});
socBar.animate(1.0);


// Double tap functionality for temps visibility
tempTable.addEventListener("click", tempsClickTimer);
showTemps.addEventListener("click", tempsClickTimer);
tempTable.addEventListener("click", tempsClickCounter);
showTemps.addEventListener("click", tempsClickCounter);
let taps = 0;
let timeoutID;
let maxTime = 500; // have to double click/tap in half a second

// Start waiting to toggle the visibility
function tempsClickTimer() {
  if (timeoutID == null) {
    timeoutID = setTimeout(doubleClicked, maxTime);
  }
}

// Count the mouse clicks
function tempsClickCounter() {
  taps += 1;
}

// Toggle the visibility
function doubleClicked() {
  if (taps == 2) {
    if (tempTable.style.visibility == "visible") {
      tempTable.style.visibility = "hidden";
      showTemps.style.display = "initial";
    } else {
      tempTable.style.visibility = "visible";
      showTemps.style.display = "none";
    }
  }
  taps = 0;
  timeoutID = null;
}

// Continuous loop writing new values to the screen
function write_data() {    
  // update other things less often
  if (counter > 50) {
    curr_soc -= 0.1;
    curr_maxmctemp += 0.01;
    curr_motortemp += 1.0;
    curr_maxcelltemp += 0.01;
    curr_mincelltemp += 0.01;
    //test for new max motor temp
    if (curr_motortemp > curr_maxmotortemp) {
      curr_maxmotortemp = curr_motortemp;
      maxMotorTemp.textContent = curr_maxmotortemp.toString();
    }
    counter = 0;
    maxMCTemp.textContent = curr_maxmctemp.toString().substring(0, 5);
    motorTemp.textContent = curr_motortemp.toString();
    maxCellTemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
    minCellTemp.textContent = curr_mincelltemp.toString().substring(0, 6);
    socBar.animate(curr_soc / 100.0);
  }
  
  // soc overflow
  if (curr_soc <= 0) {
    curr_soc = 99.0;
  }

  // rpm overflow
  if (curr_rpm > 8500) {
    curr_rpm = 0;
  }
  
  // motor temp overflow
  if (curr_motortemp > 40) {
    curr_motortemp = 10;
  }

  // update rpm every pass
  rpm.textContent = "RPM: " + curr_rpm.toString();
  curr_rpm += 100;
  counter++;
  
  setTimeout(write_data, 100);
}

// Only use test data if "dev" Node env var is present
// Examples: dev=1 npm start, dev=0 npm start, dev=lsjdkl npm start
if (process.env.dev) {
  write_data();
}



// channel.addListener("onMessage", function(msg) {
//   switch (msg["id"]) {
//     case 0xa0:
//       moduleA = ((msg["data"][1] << 8) + msg["data"][0]) * 0.1;
//       moduleB = ((msg["data"][3] << 8) + msg["data"][2]) * 0.1;
//       moduleC = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;
//       gateDrvrBrd = ((msg["data"][7] << 8) + msg["data"][6]) * 0.1;

//       break;
//     case 0xa2:
//       mtrTemp = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;

//       break;
//     case 0xa5:
//       RPM = (msg["data"][3] << 8) + msg["data"][2];

//       break;
//     case 0x181:
//       highCellTemp = ((msg["data"][2] << 8) + msg["data"][1]) * 0.1;
//       lowCellTemp = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;
//       break;
//     case 0x111:
//       DCL = (msg["data"][1] << 8) + msg["data"][0];
//       break;
//     case 0x183:
//       SOC = ((msg["data"][5] << 8) + msg["data"][4]) * 0.5;
//       b.set(SOC);
//       break;
//     case 0xaa:
//       OBVSM_state = (msg["data"][1] << 8) + msg["data"][0];
//       inverter_state = msg["data"][2];
//       relay_state = msg["data"][3];
//       inverter_run_state = msg["data"][4];
//       inverter_cmd_state = msg["data"][5];
//       inverter_enable_state = msg["data"][6];
//       direction_state = msg["data"][7];
//       break;
//     case 0xab:
//       post_lo_fault = (msg["data"][1] << 8) + msg["data"][0];
//       post_hi_fault = (msg["data"][3] << 8) + msg["data"][2];
//       run_lo_fault = (msg["data"][5] << 8) + msg["data"][4];
//       run_hi_fault = (msg["data"][7] << 8) + msg["data"][6];
//       break;
//     default:
//       break;
//   }
// });

// channel.start();
