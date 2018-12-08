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

/* Spawns an instance of dataReader.py, which writes to stdout 
test rpm and soc data 
--------Used for testing-------*/
//processInputs = spawn("python", ["dataReader.py"], {
// shell: true
//});


//Creates JS object of HTML element.
let rpm = document.getElementById("rpm");
let maxMCTemp = document.getElementById("maxMCTemp");
let motorTemp = document.getElementById("motorTemp");
let maxMotorTemp = document.getElementById("maxMotorTemp");
let maxCellTemp = document.getElementById("maxCellTemp");
let minCellTemp = document.getElementById("minCellTemp");
let socText = document.getElementById("soc");
let temps = document.getElementById("temps");
let firstElem = document.getElementById("firstElem");

//Loading bar object imported from loading-bar.*
let b1 = document.querySelector(".ldBar");
let b = new ldBar(b1);

// Set initial values for data
let curr_soc = 92.0;
let curr_rpm = 1000;
let curr_maxmctemp = 98.0;
let curr_motortemp = 30.0;
let curr_maxmotortemp = 30.0;
let curr_maxcelltemp = 120.0
let curr_mincelltemp = 102.0
let counter = 51; // analagous to "temp" on BOLT_3_Dash

// Long-press show/hide functionality for temps div
//DOES NOT WORK YET
temps.addEventListener("mousedown", tempsPressed);
firstElem.addEventListener("mousedown", tempsPressed);
function tempsPressed() {
  if (temps.style.visibilty = "visible") {
    temps.style.visibility = "hidden";
    firstElem.style.visibility = "visible";
    firstElem.textContent = "Temps Hidden";
  } else {
    temps.style.visibility = "visible";
  }
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
    b.set(curr_soc);
    socText.textContent = "SOC: " + curr_soc.toString().substring(0, 4);
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
  b.set(curr_soc); // start up soc bar
  write_data();
}


//Reads in stdout, processes data to display on screen.
// processInputs.stdout.on("data", data => {
//  var str = data.toString();
//  let buf = str.split(":");
//  if (buf[0] == "soc") {                     // SOC
//    b.set(parseInt(buf[1]));
//    // Don't know how to do the SOC loading bar

//  } else if (buf[0] == "rpm") {              // RPM
//    let newbuf = buf[1].split("\n");
//    if (newbuf[0].trim().length != 0) {
//      curr_rpm = newbuf[0];
//    }
//    console.log("RPM:" + curr_rpm);
//    rpm.textContent = "RPM: " + curr_rpm;
//  } else if (buf[0] == "mctemp") {           // MC Temp
//   let newbuf = buf[1].split("\n");
//   if (newbuf[0].trim().length != 0) {
//     curr_mctemp = newbuf[0];
//   }
//   console.log("MC Temp:" + curr_mctemp);
//   maxMCTemp.textContent = "Highest MC Temp: " + curr_mctemp;   
//  } else if (buf[0] == "motortemp") {        // Motor Temp
//   let newbuf = buf[1].split("\n");
//   if (newbuf[0].trim().length != 0) {
//     curr_motortemp = newbuf[0];
//   }
//   console.log("Motor Temp:" + curr_motortemp);
//   motorTemp.textContent = "Motor Temp: " + curr_motortemp; 
//  }
// });

channel.addListener("onMessage", function(msg) {
  switch (msg["id"]) {
    case 0xa0:
      moduleA = ((msg["data"][1] << 8) + msg["data"][0]) * 0.1;
      moduleB = ((msg["data"][3] << 8) + msg["data"][2]) * 0.1;
      moduleC = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;
      gateDrvrBrd = ((msg["data"][7] << 8) + msg["data"][6]) * 0.1;

      break;
    case 0xa2:
      mtrTemp = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;

      break;
    case 0xa5:
      RPM = (msg["data"][3] << 8) + msg["data"][2];

      break;
    case 0x181:
      highCellTemp = ((msg["data"][2] << 8) + msg["data"][1]) * 0.1;
      lowCellTemp = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;
      break;
    case 0x111:
      DCL = (msg["data"][1] << 8) + msg["data"][0];
      break;
    case 0x183:
      SOC = ((msg["data"][5] << 8) + msg["data"][4]) * 0.5;
      b.set(SOC);
      break;
    case 0xaa:
      OBVSM_state = (msg["data"][1] << 8) + msg["data"][0];
      inverter_state = msg["data"][2];
      relay_state = msg["data"][3];
      inverter_run_state = msg["data"][4];
      inverter_cmd_state = msg["data"][5];
      inverter_enable_state = msg["data"][6];
      direction_state = msg["data"][7];
      break;
    case 0xab:
      post_lo_fault = (msg["data"][1] << 8) + msg["data"][0];
      post_hi_fault = (msg["data"][3] << 8) + msg["data"][2];
      run_lo_fault = (msg["data"][5] << 8) + msg["data"][4];
      run_hi_fault = (msg["data"][7] << 8) + msg["data"][6];
      break;
    default:
      break;
  }
});

channel.start();
