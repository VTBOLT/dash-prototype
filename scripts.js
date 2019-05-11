const { remote } = require('electron');
const shell = require('shelljs');
const exec = require('child_process').exec;
function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
};

document.addEventListener("keydown", function(e) {
  if (e.which === 81) {
    remote.getCurrentWindow().toggleDevTools();
  }
});

// listener to toggle fullscreen with the escape key
// this makes the toggling work....but with F11, not
// the escape key...????
// const { BrowserWindow } = remote;
// document.addEventListener("keypress", event => {
//   if (event.key == "Escape") {
//     if (window.fullscreen) {
//       window.fullscreen = false;
//     } else {
//       window.fullscreen = true;
//     }
//   }
// });
// have to build menu here for some reason to work
// with fullscreen
const { Menu, MenuItem, BrowserWindow } = remote;
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
            label:'Fullscreen',
            submenu:[{
                        label:'go fullscreen',
                        click(){window.fullscreen = true;},},
                    {
                        label:'go windowed',
                        click(){window.fullscreen = false;}}],},
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

// Get JS objects of the HTML elements
let rpm = document.getElementById("rpm");
let MCTemp = document.getElementById("MCTemp");
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

// Get JS objects of debug screen elements
let debugrpm = document.getElementById("debugrpm");
let debugsoc = document.getElementById("debugsoc");
let debugmctemp = document.getElementById("debugmctemp");
let debugmotortemp = document.getElementById("debugmotortemp");
let debughcelltemp = document.getElementById("debughcelltemp");
let debuglcelltemp = document.getElementById("debuglcelltemp");
let debughmtrtemp = document.getElementById("debughmtrtemp");
let debugdcl = document.getElementById("debugdcl");
let debugmph = document.getElementById("debugmph");
let debugdcbus = document.getElementById("debugdcbus");
let debugError = document.getElementById("debugError");


// Set initial values for data
let curr_soc = 92.0;
let curr_rpm = 1000;
let curr_mctemp = 98.0;
let curr_motortemp = 30.0;
let curr_maxmotortemp = 30.0;
let curr_maxcelltemp = 120.0
let curr_mincelltemp = 102.0
let curr_dcbusv = 0;
let counter = 51; // analagous to "temp" on BOLT_3_Dash

let RPM_PACE = 4700.0;
let MAX_RPM = 12000.0;
let INCH_TO_MILE = 60.0 / 63360.0;
let PI = 3.14159265358979;
let GEAR_RATIO = 14.0 / 55.0 ;
let WHEEL_DIAMETER = 25.66;

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
      top: '374px',
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

// Calculates mph given rpm
function rpmToMph(rpm) {
  let mph = INCH_TO_MILE * PI * WHEEL_DIAMETER * rpm * GEAR_RATIO;
  return mph;
}

// Continuous loop writing new values to the screen
function write_data() {    
  // update other things less often
  if (counter > 50) {
    curr_soc -= 1.1;
    curr_mctemp += 0.01;
    curr_motortemp += 1.0;
    curr_maxcelltemp += 0.01;
    curr_mincelltemp += 0.01;
    //test for new max motor temp
    if (curr_motortemp > curr_maxmotortemp) {
      curr_maxmotortemp = curr_motortemp;
      maxMotorTemp.textContent = curr_maxmotortemp.toString();
      debughmtrtemp.textContent = curr_maxmotortemp.toString();
    }
    counter = 0;
    // Set dash elements
    MCTemp.textContent = curr_mctemp.toString().substring(0, 5);
    motorTemp.textContent = curr_motortemp.toString();
    maxCellTemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
    minCellTemp.textContent = curr_mincelltemp.toString().substring(0, 6);
    socBar.set(curr_soc / 100.0);

    // Set debug elements
    debugsoc.textContent = curr_soc.toString().substring(0, 4);
    debughcelltemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
    debuglcelltemp.textContent = curr_mincelltemp.toString().substring(0, 6);
    debugmotortemp.textContent = curr_motortemp.toString();
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
  if (curr_rpm < RPM_PACE) {
    // 4k now appears where 2k used to be
    rpmBar.set((1.0/3.0) * (curr_rpm / RPM_PACE));
  } else {
    rpmBar.set((1.0/3.0) + ((2.0 / 3.0) * (curr_rpm - RPM_PACE) / (MAX_RPM - RPM_PACE)));
  }
  rpm.textContent = curr_rpm.toString();
  // debug rpm and mph
  debugrpm.textContent = curr_rpm.toString();

  debugmph.textContent = Math.round(rpmToMph(curr_rpm)).toString();

  curr_rpm += 100;
  counter++;
  
  setTimeout(write_data, 100);
}

// Only use test data if "dev" Node env var is present
// Examples: dev=1 npm start, dev=0 npm start, dev=lsjdkl npm start
//process.env.dev = 1;
if (process.env.dev) {
  write_data();
}

//takes in "2 byte" parameters from CAN
function updateFault(runLO, runHI, postLO, postHI) {

  //enum for faults
  const FaultLevel = {
    LOW: 1,
    MID: 2,
    HIGH: 3
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
  changeFaultNum(highestError[1]);  
  console.log(highestError[0]);
  debugError.textContent = 'Error: ' + highestError[0];
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
    return ["no error", 0];
  }
  let max = 0;
  let message = "";
  for (let item of set) {
    if (item[1] > max) {
      max = item[1];
      message = item[0];
    }
  }
  return [message, max];
}
if (process.env.can) {
  //execute('sudo ./vcanStart.sh', (output) => {
  //  console.log(output);
  //});
  can_test();
}

function can_test() {
  // 3 hexdigit address, 5 hexdigit value
  // set can addresses
  let mtrTempFrontAddr = 0x0a2; // bytes 4 and 5 with .1 scale

  let rpmAddr = 0x0a5;
  let dclAddr = 0x6b1;
  let socAddr = 0x6b2;
  let mcTempsAddr = 0x0a0;
  let bmsTempsAddr = 0x6b4;
  let mcInternalAddr = 0x0aa;
  let mcErrorAddr = 0x0ab;
  let dcBusVAddr = 0x0a7;


  let can = require('socketcan');
  rpm.textContent = 'yup';
  rpmBar.set(0);
  let channel = can.createRawChannel("can0", true);
  
  // declare vars not already at the top of this script
  let moduleA;
  let moduleB;
  let moduleC;
  let gateDrvrBrd;
  let dcl;
  let OBVSM_state;
  let inverter_state;
  let relay_state;
  let inverter_run_state;
  let inverter_cmd_state;
  let inverter_enable_state;
  let direction_state;
  let post_lo_fault;
  let post_hi_fault;
  let run_lo_fault;
  let run_hi_fault;
  let curr_maxmotortemp = 0;

  channel.addListener("onMessage", function(msg) {
    switch (msg["id"]) {

      case dcBusVAddr:
        // dc bus voltage calculation: bytes 0 and 1, 0.1 scale factor
        curr_dcbusv = (msg["data"][1] << 8 + msg["data"][0]) * 0.1;
        if (curr_dcbusv < 800 && curr_dcbusv > 200) {
          debugdcbus.textContent = curr_dcbusv.toString().substring(0,3);

        }

        break;
      case mcTempsAddr:
        // relevant mc temps can messages
        moduleA = ((msg["data"][1] << 8) + msg["data"][0]) * 0.1;
        moduleB = ((msg["data"][3] << 8) + msg["data"][2]) * 0.1;
        moduleC = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;
        gateDrvrBrd = ((msg["data"][7] << 8) + msg["data"][6]) * 0.1;
        
        // calculate current mc temp from the messages
        curr_mctemp = (moduleA + moduleB + moduleC) / 3.0; //average
        
        // set mc temp element on debug screen and dash
        debugmctemp.textContent = curr_mctemp.toString().substring(0, 2);
        MCTemp.textContent = curr_mctemp.toString().substring(0, 2);
        break;

      case mtrTempFrontAddr:
        // motor temp value can message
        curr_motortemp = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;

        // set motor temp element on dash and debug screen
        motorTemp.textContent = curr_motortemp.toString().substring(0,2);
        debugmotortemp.textContent = curr_motortemp.toString().substring(0,2);

        // if necessary, set max motor temp element on dash and debug screen
        if (curr_motortemp > curr_maxmotortemp) {
          curr_maxmotortemp = curr_motortemp;
          maxMotorTemp.textContent = curr_maxmotortemp.toString().substring(0,2);
          debughmtrtemp.textContent = curr_maxmotortemp.toString().substring(0,2);
        }
        break;

      case rpmAddr:
        // rpm value can message
        curr_rpm = (msg["data"][3] << 8) + msg["data"][2];

        // set rpm (text) element on dash and debug screen
        if (curr_rpm < 12050 && curr_rpm > 50) {
          rpm.textContent = curr_rpm.toString();
          debugrpm.textContent = curr_rpm.toString();

          // update rpm bar on dash
          if (curr_rpm < RPM_PACE) {
            rpmBar.set((1.0/3.0) * (curr_rpm / RPM_PACE));
          } else {
            rpmBar.set((1.0/3.0) + ((2.0 / 3.0) * (curr_rpm - RPM_PACE) / (MAX_RPM - RPM_PACE)));
          }

          //update debug mph value
          debugmph.textContent = Math.round(rpmToMph(curr_rpm)).toString();
        } else {
          rpmBar.set(0);
          rpm.textContent = '0';
          debugrpm.textContent = '0';
        }
        
        break;

      case bmsTempsAddr:
        // high and low cell temps can messages
        // (note "high" and "low" are current values, not a running min/max)
        curr_maxcelltemp = ((msg["data"][1] << 8) + msg["data"][0]);
        curr_mincelltemp = ((msg["data"][3] << 8) + msg["data"][2]);

        // update high/low cell temp elements on dash and debug screen
        maxCellTemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
        minCellTemp.textContent = curr_mincelltemp.toString().substring(0, 6);
        debughcelltemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
        debuglcelltemp.textContent = curr_mincelltemp.toString().substring(0, 6);
        break;

      case dclAddr:
        // dcl can message
        dcl = (msg["data"][1] << 8) + msg["data"][0];

        // update dcl element on debug screen
        debugdcl.textContent = dcl.toString().substring(0,6);
        break;

      case socAddr:
        // soc can message
        curr_soc = ((msg["data"][1] << 8) + msg["data"][0]) * 0.5;
        
        // update soc bar on dash and soc element on debug screen
        debugsoc.textContent = curr_soc.toString().substring(0, 4);
        socBar.set(curr_soc / 100.0);
        break;

      case mcInternalAddr:
        OBVSM_state = (msg["data"][1] << 8) + msg["data"][0];
        inverter_state = msg["data"][2];
        relay_state = msg["data"][3];
        inverter_run_state = msg["data"][4];
        inverter_cmd_state = msg["data"][5];
        inverter_enable_state = msg["data"][6];
        direction_state = msg["data"][7];
        break;

      case mcErrorAddr:
        post_lo_fault = (msg["data"][1] << 8) + msg["data"][0];
        post_hi_fault = (msg["data"][3] << 8) + msg["data"][2];
        run_lo_fault = (msg["data"][5] << 8) + msg["data"][4];
        run_hi_fault = (msg["data"][7] << 8) + msg["data"][6];

        updateFault(run_lo_fault, run_hi_fault, post_lo_fault, post_hi_fault);
        break;

      default:
        break;
    }
  });

  channel.start();
}

