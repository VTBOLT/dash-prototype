var spawn = require("child_process").spawn;
process = spawn("python3", ["-u", "dataReader.py"], {
  shell: true
});
process.unref();
var countdown = document.getElementById("rpm");
process.stdout.setEncoding("utf8");
process.stdout.on("data", data => {
  var str = data.toString();
  var buf = str.split(":");
  if (buf[0] == "rpm") {
    countdown.textContent = "RPM: " + buf[1];
  }
});
// var countItDown = function() {
//   //   var currentTime = parseFloat(countdown.textContent);
//   //   if (currentTime < 97) {
//   //     countdown.textContent = currentTime + 1;
//   //   } else {
//   //     countdown.textContent = 56;
//   //   }

//   });
// };
// call interval
// countItDown();
