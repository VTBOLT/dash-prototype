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