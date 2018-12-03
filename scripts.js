// Had to comment these out, hangs vvvvvvv

//var can = require("socketcan");

//var channel = can.createRawChannel("vcan0", true);
var spawn = require("child_process").spawn;

// Had to comment these out, hangs ^^^^^^^

/* The command below spawns an instance of CanInterface
which outputs CAN data 
--------Used for production--------*/
// processSOC = spawn("./CanInterface", [], {
//   shell: true
// });

/* Spawns an instance of dataReader.py, which writes to stdout 
test rpm and soc data 
--------Used for testing-------*/
processInputs = spawn("python", ["dataReader.py"], {
 shell: true
});

//Creates JS object of HTML element.
var rpm = document.getElementById("rpm");
var maxMCTemp = document.getElementById("maxMCTemp");
var motorTemp = document.getElementById("motorTemp");
var maxMotorTemp = document.getElementById("maxMotorTemp");
var maxCellTemp = document.getElementById("maxCellTemp");
var minCellTemp = document.getElementById("minCellTemp");

//Loading bar object imported from loading-bar.*
var b1 = document.querySelector(".ldBar");
var b = new ldBar(b1);

// DONT THINK THESE ARE NEEDED
let curr_soc = 0;
let curr_rpm = 1000;
let curr_mctemp = 98.0;
let curr_motortemp = 30;

//Reads in stdout, processes data to display on screen.
processInputs.stdout.on("data", data => {
 var str = data.toString();
 let buf = str.split(":");
 if (buf[0] == "soc") {                     // SOC
   b.set(parseInt(buf[1]));
   // Don't know how to do the SOC loading bar

 } else if (buf[0] == "rpm") {              // RPM
   let newbuf = buf[1].split("\n");
   if (newbuf[0].trim().length != 0) {
     curr_rpm = newbuf[0];
   }
   console.log("RPM:" + curr_rpm);
   rpm.textContent = "RPM: " + curr_rpm;
 } else if (buf[0] == "mctemp") {           // MC Temp
  let newbuf = buf[1].split("\n");
  if (newbuf[0].trim().length != 0) {
    curr_mctemp = newbuf[0];
  }
  console.log("MC Temp:" + curr_mctemp);
  maxMCTemp.textContent = "Highest MC Temp: " + curr_mctemp;   
 } else if (buf[0] == "motortemp") {        // Motor Temp
  let newbuf = buf[1].split("\n");
  if (newbuf[0].trim().length != 0) {
    curr_motortemp = newbuf[0];
  }
  console.log("Motor Temp:" + curr_motortemp);
  motorTemp.textContent = "Motor Temp: " + curr_motortemp; 
 }
});

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
