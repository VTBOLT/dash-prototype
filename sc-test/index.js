var can = require('socketcan');
 
var channel = can.createRawChannel("vcan0", true);
 
// Log any message
channel.addListener("onMessage", function(msg) { console.log(msg); } );
 
// Reply any message
channel.addListener("onMessage", channel.send, channel);
 
channel.start();

