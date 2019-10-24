// press "Q" to get the Chrome-style developer menu
document.addEventListener("keydown", function(e) {
    if (e.which === 81) {
      remote.getCurrentWindow().toggleDevTools();
    }
});