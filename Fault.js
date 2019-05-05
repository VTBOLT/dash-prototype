  function changeFaultNum(num) {
    var body = document.getElementById('body');
    var text = document.getElementById('rpm');
    var text2 = document.getElementById('soc');
    var text3 = document.getElementById('error');
    //high error: screen turns red
    if (num == 2) {
        body.style.backgroundColor = "red"; 
        text.style.color = "white";
        text2.style.color = "white";
        text3.style.color = "yellow";
        text3.style.display = "block";
    //medium error: screen turns yellow    
    }else if (num == 1) {
        body.style.backgroundColor = "#ffff99"; //yellow
        text.style.color = "black";
        text2.style.color = "black";
        text3.style.color = "red";
        text3.style.display = "block";
    //low error: screen turns blue    
    }else if (num == 0) {
        body.style.backgroundColor = "#ADD8E6"; //blue
        text.style.color = "black";
        text2.style.color = "black";
        text3.style.color = "red";
        text3.style.display = "block";
    //no error: screen turns regular    
    }else if (num == 3) {
        body.style.backgroundColor = "#ebebeb6c";  //very light grey
        text.style.color = "black";
        text2.style.color = "black";
        text3.style.display = "none";
    }
    //screen changes back to loading screen
    else if (num == 4) {
        document.location.replace("stateMachine.html");        
    }
  }
  //add function to change display
  function changeFault(key) {
    var body = document.getElementById('body');
    var text = document.getElementById('rpm');
    var text2 = document.getElementById('soc');
    var text3 = document.getElementById('error');
    if (key == "h") {        
        updateFault(2, 16, 16, 16); //high
    }else if (key == "m") {
        updateFault(16, 16, 16, 16); //medium
    }else if (key == "l") {
        updateFault(1, 1, 1, 1); //low
    }else if (key == "n") {
        updateFault(0, 0, 0, 0); //none
    }
    else if (key == "c") {
        document.location.replace("stateMachine.html");        
    }
  }