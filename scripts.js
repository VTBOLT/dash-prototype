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
let soc = document.getElementById("soc");
let tempTable = document.getElementById("tempTable");
let showTemps = document.getElementById("showTemps");
let rpmPath = document.getElementById("rpmPath");
let showSOC = document.getElementById("showSOC");
let socBG = document.getElementById("socBG");



// Set initial values for data
let curr_soc = 92.0;
let curr_rpm = 1000;
let curr_maxmctemp = 98.0;
let curr_motortemp = 30.0;
let curr_maxmotortemp = 30.0;
let curr_maxcelltemp = 120.0
let curr_mincelltemp = 102.0
let counter = 51; // analagous to "temp" on BOLT_3_Dash

let RPM_45MPH = 2358.0;
let MAX_RPM = 12000.0;

// Initialize RPM ProgressBar
let rpmBar = new ProgressBar.Path(rpmPath, {
  easing: 'easeInOut',
  duration: 50,
});

rpmBar.set(1);

// Initialize SOC ProgressBar
let socBar = new ProgressBar.Line("#soc", {
  strokeWidth: 24,
  easing: 'easeInOut',
  duration: 1000,
  color: '#3c643c',
  trail: 'none',
  svgStyle: {width: '80%', height: '100%'},
  text: {
    style: {
      // text sits directly underneath vertical bar
      color: '#000000',
      fontFamily: 'digital-7',
      fontSize: '38px',
      position: 'fixed',
      top: '380px',
      right: '280px',
    },
    autoStyleContainer: false
  },
  step: (state, socBar) => {
    if (socBar.value() > 0.2) {
      socBar.path.setAttribute('stroke', '#2e4d2e');
    } else {
      socBar.path.setAttribute('stroke', '#ff0000');
    }
    // display nearest tenth of a percent
    socBar.setText((100.0 * socBar.value()).toFixed(1).toString());
  }
});
socBar.animate(1.0);


//////////////////////////////////////////////////////////////////////
///////////////// BEGIN DOUBLE TAP SHOW/HIDE FUNCTIONS ///////////////
//////////////////////////////////////////////////////////////////////

// Double tap functionality for temps and soc visibility
if (process.env.dev) {
  tempTable.addEventListener("click", tempsClickTimer);
  showTemps.addEventListener("click", tempsClickTimer);
  tempTable.addEventListener("click", clickCounter);
  showTemps.addEventListener("click", clickCounter);
  socBG.addEventListener("click", socClickTimer);
  socBG.addEventListener("click", clickCounter);
  showSOC.addEventListener("click", socClickTimer);
  showSOC.addEventListener("click", clickCounter);
}
let taps = 0;
let timeoutID;
let maxTime = 500; // have to double click/tap in half a second

// Wait to decide whether to toggle soc visibility
function socClickTimer() {
  if (timeoutID == null) {
    timeoutID = setTimeout(socDoubleClicked, maxTime);
  }
}

// Toggles soc visibility
function socDoubleClicked() {
  if (taps == 2) {
    if (soc.style.visibility == "visible") {
      soc.style.visibility = "hidden";
      socBG.style.visibility = "hidden";
      showSOC.style.display = "initial";
    } else {
      soc.style.visibility = "visible";
      socBG.style.visibility = "visible";
      showSOC.style.display = "none";
    }
  }

  taps = 0;
  timeoutID = null;
}

// Start waiting to toggle the visibility
function tempsClickTimer() {
  if (timeoutID == null) {
    timeoutID = setTimeout(doubleClicked, maxTime);
  }
}

// Count the mouse clicks
function clickCounter() {
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

//////////////////////////////////////////////////////////////////////
///////////////// END DOUBLE TAP SHOW/HIDE FUNCTIONS /////////////////
//////////////////////////////////////////////////////////////////////


// Calls Fault.js and changes fault state depending on keypress
function fault_state(event) {
  var key = event.key;
  changeFault(key);
} 

// Continuous loop writing new values to the screen
function write_data() {    
  // update other things less often
  if (counter > 50) {
    curr_soc -= 1.1;
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
  if (curr_rpm > 12000) {
    curr_rpm = 200;

  }
  
  // motor temp overflow
  if (curr_motortemp > 40) {
    curr_motortemp = 10;
  }

  // update rpm every pass
  //rpmBar.set(curr_rpm / 12000.0);
  //curr_rpm = 1000; // FOR LOCATING TICK MARKS - REMOVE
  if (curr_rpm < RPM_45MPH) {
    // bar should be 1/3 full at 45 mph
    rpmBar.set((1.0/3.0) * (curr_rpm / RPM_45MPH));
  } else {
    rpmBar.set((1.0/3.0) + ((2.0 / 3.0) * (curr_rpm - RPM_45MPH) / (MAX_RPM - RPM_45MPH)));
  }
  rpm.textContent = curr_rpm.toString();
  curr_rpm += 100;
  counter++;
  
  setTimeout(write_data, 100);
}

// Only use test data if "dev" Node env var is present
// Examples: dev=1 npm start, dev=0 npm start, dev=lsjdkl npm start
if (process.env.dev) {
  write_data();
}

//takes in "2 byte" parameters from CAN
function updateFault(runLO, runHI, postLO, postHI) {

  //enum for faults
  const FaultLevel = {
    LOW: 0,
    MID: 1,
    HIGH: 2
  };
  //run faults (low byte) dict
  var run_lo_fault_dict = {
    0x0001: ['Motor Over-speed Fault', FaultLevel.LOW],
    0x0002: ['Over-current Fault', FaultLevel.HIGH],
    0x0004: ['Over-voltage', FaultLevel.HIGH],
    0x0008: ['Inverter Over-temperature Fault', FaultLevel.MID],
    0x0010: ['Accelerator Input Shorted Fault', FaultLevel.MID],
    0x0020: ['Accelerator Input Open Fault', FaultLevel.MID],
    0x0080: ['Inverter Response Time-out Fault', FaultLevel.LOW],
    0x0100: ['Hardware Gate/Desaturation Fault', FaultLevel.HIGH],
    0x0200: ['Hardware Over-current Fault', FaultLevel.HIGH],
    0x0400: ['Under-voltage Fault', FaultLevel.MID],
    0x0800: ['CAN Command Message Lost Fault', FaultLevel.MID],
    0x1000: ['Motor Over-temerature Fault', FaultLevel.MID]
  };
  //run faults (high byte) dict
  var run_hi_fault_dict = {
    0x0001: ['Brake Input Shorted Fault', FaultLevel.LOW],
    0x0002: ['Brake Input Open Fault', FaultLevel.LOW],
    0x0004: ['Module A Over-temperature Fault', FaultLevel.MID],
    0x0008: ['Module B Over-temperature Fualt', FaultLevel.MID],
    0x0010: ['Module C Over-temperature Fault', FaultLevel.MID],
    0x0020: ['PCB Over-temperature Fault', FaultLevel.MID],
    0x0040: ['Gate Drive Board 1 Over-temperature Fault', FaultLevel.MID],
    0x0080: ['Gate Drive Board 2 Over-temperature Fault', FaultLevel.MID],
    0x0100: ['Gate Drive Board 3 Over-temperature Fault', FaultLevel.MID],
    0x0200: ['Current Sensor Fault', FaultLevel.MID],
    0x4000: ['Resolver Not Connected', FaultLevel.MID]
  };
  //post faults (low byte) dict
  var post_lo_fault_dict = {
    0x0001: ['Hardware Gate/Desaturation Fault', FaultLevel.LOW],
    0x0002: ['HW Over-current Fault', FaultLevel.MID],
    0x0004: ['Accelerator Shorted', FaultLevel.HIGH],
    0x0008: ['Accelerator Open', FaultLevel.HIGH],
    0x0010: ['Current Sensor Low', FaultLevel.LOW],
    0x0020: ['Current Sensor High', FaultLevel.LOW],
    0x0040: ['Module Temperature Low', FaultLevel.LOW],
    0x0080: ['Module Temperature High', FaultLevel.LOW],
    0x0100: ['Control PCB Temperature Low', FaultLevel.LOW],
    0x0200: ['Control PCB Temperature High', FaultLevel.LOW],
    0x0400: ['Gate Drive PCB Temperature Low', FaultLevel.LOW],
    0x0800: ['Gate Drive PCB Temperature High', FaultLevel.LOW],
    0x1000: ['5V Sense Voltage Low', FaultLevel.LOW],
    0x2000: ['5V Sense Voltage High', FaultLevel.LOW],
    0x4000: ['12V Sense Voltage Low', FaultLevel.LOW],
    0x8000: ['12V Sense Voltage High', FaultLevel.LOW]
  };
  //post faults (low byte) dict
  var post_hi_fault_dict = {
    0x0001: ['2.5V Sense Voltage Low', FaultLevel.LOW],
    0x0002: ['2.5V Sense Voltage High', FaultLevel.LOW],
    0x0004: ['1.5V Sense Voltage Low', FaultLevel.LOW],
    0x0008: ['1.5V Sense Voltage High', FaultLevel.LOW],
    0x0010: ['DC Bus Voltage High', FaultLevel.LOW],
    0x0020: ['DC Bus Voltage Low', FaultLevel.LOW],
    0x0040: ['Pre-charge Timeout', FaultLevel.MID],
    0x0080: ['Pre-charge Voltage Failure', FaultLevel.LOW],
    0x0100: ['EEPROM Checksum Invalid', FaultLevel.LOW],
    0x0200: ['EEPROM Data Out of Range', FaultLevel.LOW],
    0x0400: ['EEPROM Update Required', FaultLevel.LOW],
    0x4000: ['Brake Shorted', FaultLevel.HIGH],
    0x8000: ['Brake Open', FaultLevel.HIGH]
  };

  var faultSet = new Set();
  var runLObits = twoBytesToBits(runLO);
  runLObits.forEach(element => {
    faultSet.add(run_lo_fault_dict[element]);
  });
  var runHIbits = twoBytesToBits(runHI);
  runHIbits.forEach(element => {
    faultSet.add(run_hi_fault_dict[element]);
  });
  var postLObits = twoBytesToBits(postLO);
  postLObits.forEach(element => {
    faultSet.add(post_lo_fault_dict[element]);
  });
  var postHIbits = twoBytesToBits(postHI);
  postHIbits.forEach(element => {
    faultSet.add(post_hi_fault_dict[element]);
  });
  var highestError = analyzeFaultSet(faultSet);
  changeFaultNum(highestError);
  /*
  //test output
  var message = "";
  for (let item of faultSet) {
    message += item[1] + ' : ' + item[0]+ '<br>';
  }
  var text = document.getElementById('rpmScale');
  text.innerHTML = highestError;
  */
}

function twoBytesToBits(bytes) {
  byteArr = [];
  for(var i = 65536; i >= 1; i/= 2) {
    if(bytes & i) {
      byteArr.push(i);
    }
  }
  return byteArr;
}

function analyzeFaultSet(set) {
  if(set.size == 0) {
    return 3;
  }
  let max = 0;
  for (let item of set) {
    if (item[1] > max) {
      max = item[1]
    }
  }
  return max;
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
