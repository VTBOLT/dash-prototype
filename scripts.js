var spawn = require("child_process").spawn;
processRPM = spawn("python3", ["-u", "dataReader.py"], {
  shell: true
});
processSOC = spawn("./a.out", [], {
  shell: true
});
processRPM.unref();
var rpm = document.getElementById("rpm");
var soc = document.getElementById("soc");

var b1 = document.querySelector(".ldBar");
var b = new ldBar(b1);

processRPM.stdout.setEncoding("utf8");
processRPM.stdout.on("data", data => {
  var str = data.toString();
  var buf = str.split(":");
  if (buf[0] == "rpm") {
    rpm.textContent = "RPM: " + buf[1];
  }
});
processSOC.stdout.on("data", data => {
  var str = data.toString();
  var buf = str.split(":");
  if (buf[0] == "soc") {
    b.set(parseInt(buf[1]));
  }
});
