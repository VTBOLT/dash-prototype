var body = document.getElementById('body');
var text = document.getElementById('rpm');

function changeFault(event) {
    var key = event.key;
    if (key == "h") {
        body.style.backgroundColor = "red";
        text.style.color = "black";
    }else if (key == "m") {
        body.style.backgroundColor = "yellow";
        text.style.color = "black";
    }else if (key == "l") {
        body.style.backgroundColor = "white";
        text.style.color = "blue";
    }else if (key == "n") {
        body.style.backgroundColor = "white";
        text.style.color = "black";
    }
    
  }