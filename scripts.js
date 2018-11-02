var spawn = require("child_process").spawn;

/* The command below spawns an instance of CanInterface
which outputs CAN data 
--------Used for production--------*/
// processSOC = spawn("./CanInterface", [], {
//   shell: true
// });

/* Spawns an instance of dataReader.py, which writes to stdout 
test rpm and soc data 
--------Used for testing-------*/
processInputs = spawn("python", ["-u", "dataReader.py"], {
  shell: true
});

//Creates JS object of HTML element.
var rpm = document.getElementById("rpm");

//Loading bar object imported from loading-bar.*
var b1 = document.querySelector(".ldBar");
var b = new ldBar(b1);

let curr_rpm = 0;
//Reads in stdout, processes data to display on screen.
processInputs.stdout.on("data", data => {
  var str = data.toString();
  let buf = str.split(":");
  if (buf[0] == "soc") {
    b.set(parseInt(buf[1]));
  } else if (buf[0] == "rpm") {
    let newbuf = buf[1].split("\n");
    if (newbuf[0].trim().length != 0) {
      curr_rpm = newbuf[0];
    }
    console.log(curr_rpm);
    rpm.textContent = "RPM: " + curr_rpm;
  }
});
