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
let modal = document.getElementById('myModal');
let rpmGauge = document.getElementById('rpmGauge');

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
let debugdcbusa = document.getElementById("debugdcbusa");
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
let curr_dcbusa = 0;
let counter = 51; // analagous to "temp" on BOLT_3_Dash

let RPM_PACE = 4700.0;
let MAX_RPM = 12000.0;
let INCH_TO_MILE = 60.0 / 63360.0;
let PI = 3.14159265358979;
let GEAR_RATIO = 14.0 / 55.0 ;
let WHEEL_DIAMETER = 25.66;