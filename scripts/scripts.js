const { remote } = require('electron');
const shell = require('shelljs');
const { Menu } = remote;

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
      top: '410px',
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
  console.log("err: " + highestError[0] + "   " + highestError[1].toString());
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


