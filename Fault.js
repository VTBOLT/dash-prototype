function changeFault(key) {
    var body = document.getElementById('body');
    var text = document.getElementById('rpm');
    var text2 = document.getElementById('soc');
    var text3 = document.getElementById('error');
    if (key == "h") {
        body.style.backgroundColor = "red"; //red
        text.style.color = "white";
        text2.style.color = "white";
        text3.style.color = "yellow";
        text3.style.display = "block";
    }else if (key == "m") {
        body.style.backgroundColor = "#ffff99"; //yellow
        text.style.color = "black";
        text2.style.color = "black";
        text3.style.color = "red";
        text3.style.display = "block";
    }else if (key == "l") {
        body.style.backgroundColor = "#ADD8E6"; //blue
        text.style.color = "black";
        text2.style.color = "black";
        text3.style.color = "red";
        text3.style.display = "block";
    }else if (key == "n") {
        body.style.backgroundColor = "#ebebeb6c";  //very light grey
        text.style.color = "black";
        text2.style.color = "black";
        text3.style.display = "none";
    }
  }