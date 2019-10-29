// Continuous loop writing new values to the screen
function write_data() {    
    // update other things less often
    if (counter > 50) {
      curr_soc -= 1.1;
      curr_mctemp += 0.01;
      curr_motortemp += 1.0;
      curr_maxcelltemp += 0.01;
      curr_mincelltemp += 0.01;
      //test for new max motor temp
      if (curr_motortemp > curr_maxmotortemp) {
        curr_maxmotortemp = curr_motortemp;
        maxMotorTemp.textContent = curr_maxmotortemp.toString();
        debughmtrtemp.textContent = curr_maxmotortemp.toString();
      }
      counter = 0;
      // Set dash elements
      MCTemp.textContent = curr_mctemp.toString().substring(0, 5);
      motorTemp.textContent = curr_motortemp.toString();
      maxCellTemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
      minCellTemp.textContent = curr_mincelltemp.toString().substring(0, 6);
      socBar.set(curr_soc / 100.0);
  
      // Set debug elements
      debugsoc.textContent = curr_soc.toString().substring(0, 4);
      debughcelltemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
      debuglcelltemp.textContent = curr_mincelltemp.toString().substring(0, 6);
      debugmotortemp.textContent = curr_motortemp.toString();
    }
    
    // soc overflow
    if (curr_soc <= 0) {
      curr_soc = 99.0;
    }
  
    // rpm overflow
    if (curr_rpm > 12000) {
      curr_rpm = 200;
  
    }
    
    // motor temp overflow
    if (curr_motortemp > 40) {
      curr_motortemp = 10;
    }
  
    // update rpm every pass
    if (curr_rpm < RPM_PACE) {
      rpmBar.set((1.0/3.0) * (curr_rpm / RPM_PACE));
    } else {
      rpmBar.set((1.0/3.0) + ((2.0 / 3.0) * (curr_rpm - RPM_PACE) / (MAX_RPM - RPM_PACE)));
    }
    rpm.textContent = curr_rpm.toString();
    // debug rpm and mph
    debugrpm.textContent = curr_rpm.toString();
  
    debugmph.textContent = Math.round(rpmToMph(curr_rpm)).toString();
  
    curr_rpm += 100;
    counter++;
    
    setTimeout(write_data, 100);
}
  
// Only use test data if "dev" Node env var is present
// Examples: dev=1 npm start, dev=0 npm start, dev=lsjdkl npm start
if (process.env.dev) {
    write_data();
}