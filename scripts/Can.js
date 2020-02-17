if (process.env.can) {
    can_test();
}
  
function can_test() {
    // 3 hexdigit address, 5 hexdigit value
    // set can addresses
    let mtrTempFrontAddr = 0x0a2; // bytes 4 and 5 with .1 scale
  
    let rpmAddr = 0x0a5;
    let dclAddr = 0x6b1;
    let socAddr = 0x6b2;
    let mcTempsAddr = 0x0a0;
    let bmsTempsAddr = 0x6b4;
    let mcInternalAddr = 0x0aa;
    let mcErrorAddr = 0x0ab;
    let dcBusVAddr = 0x0a7;
  
  
    let can = require('socketcan');
    rpm.textContent = 'yup';
    rpmBar.set(0);
    let channel = can.createRawChannel("can0", true);
  
    // declare vars not already at the top of this script
    let moduleA;
    let moduleB;
    let moduleC;
    let gateDrvrBrd;
    let dcl;
    let OBVSM_state;
    let inverter_state;
    let relay_state;
    let inverter_run_state;
    let inverter_cmd_state;
    let inverter_enable_state;
    let direction_state;
    let post_lo_fault;
    let post_hi_fault;
    let run_lo_fault;
    let run_hi_fault;
    let curr_maxmotortemp = 0;
  
    channel.addListener("onMessage", function(msg) {
      switch (msg["id"]) {
  
        case dcBusVAddr:
          // dc bus voltage calculation: bytes 0 and 1, 0.1 scale factor
          curr_dcbusv = (msg["data"][1] << 8 + msg["data"][0]) * 0.1;
          if (curr_dcbusv < 800 && curr_dcbusv > 450) {
            debugdcbus.textContent = curr_dcbusv.toString().substring(0, 3);
  
          }
  
          break;
        case mcTempsAddr:
          // relevant mc temps can messages
          moduleA = ((msg["data"][1] << 8) + msg["data"][0]) * 0.1;
          moduleB = ((msg["data"][3] << 8) + msg["data"][2]) * 0.1;
          moduleC = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;
          gateDrvrBrd = ((msg["data"][7] << 8) + msg["data"][6]) * 0.1;
  
          // calculate current mc temp from the messages
          curr_mctemp = (moduleA + moduleB + moduleC) / 3.0; //average
  
          // set mc temp element on debug screen and dash
          debugmctemp.textContent = curr_mctemp.toString().substring(0, 2);
          MCTemp.textContent = curr_mctemp.toString().substring(0, 2);
          break;
  
        case mtrTempFrontAddr:
          // motor temp value can message
          curr_motortemp = ((msg["data"][5] << 8) + msg["data"][4]) * 0.1;
  
          // set motor temp element on dash and debug screen
          motorTemp.textContent = curr_motortemp.toString().substring(0, 2);
          debugmotortemp.textContent = curr_motortemp.toString().substring(0, 2);
  
          // if necessary, set max motor temp element on dash and debug screen
          if (curr_motortemp > curr_maxmotortemp) {
            curr_maxmotortemp = curr_motortemp;
            maxMotorTemp.textContent = curr_maxmotortemp.toString().substring(0, 2);
            debughmtrtemp.textContent = curr_maxmotortemp.toString().substring(0, 2);
          }
          break;
  
        case rpmAddr:
          // rpm value can message
          curr_rpm = (msg["data"][3] << 8) + msg["data"][2];
  
          // set rpm (text) element on dash and debug screen
          if (curr_rpm < 8050 && curr_rpm > 90) {
            rpm.textContent = curr_rpm.toString();
            debugrpm.textContent = curr_rpm.toString();
  
            // update rpm bar on dash
            if (curr_rpm < RPM_PACE) {
              rpmBar.set((1.0 / 3.0) * (curr_rpm / RPM_PACE));
            } else {
              rpmBar.set((1.0 / 3.0) + ((2.0 / 3.0) * (curr_rpm - RPM_PACE) / (MAX_RPM - RPM_PACE)));
            }
  
            //update debug mph value
            debugmph.textContent = Math.round(rpmToMph(curr_rpm)).toString();
          } else {
            rpmBar.set(0);
            rpm.textContent = '0';
            debugrpm.textContent = '0';
          }
  
          break;
  
        case bmsTempsAddr:
          // high and low cell temps can messages
          // (note "high" and "low" are current values, not a running min/max)
          curr_maxcelltemp = ((msg["data"][1] << 8) + msg["data"][0]);
          curr_mincelltemp = ((msg["data"][3] << 8) + msg["data"][2]);
  
          // update high/low cell temp elements on dash and debug screen
          maxCellTemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
          minCellTemp.textContent = curr_mincelltemp.toString().substring(0, 6);
          debughcelltemp.textContent = curr_maxcelltemp.toString().substring(0, 6);
          debuglcelltemp.textContent = curr_mincelltemp.toString().substring(0, 6);
          break;
  
        case dclAddr:
          // dcl can message
          dcl = (msg["data"][1] << 8) + msg["data"][0];
  
          // update dcl element on debug screen
          debugdcl.textContent = dcl.toString().substring(0, 6);
          break;
  
        case socAddr:
          // soc can message
          curr_soc = ((msg["data"][1] << 8) + msg["data"][0]) * 0.5;
  
          // update soc bar on dash and soc element on debug screen
          debugsoc.textContent = curr_soc.toString().substring(0, 4);
          socBar.set(curr_soc / 100.0);
          break;
  
        case mcInternalAddr:
          OBVSM_state = (msg["data"][1] << 8) + msg["data"][0];
          inverter_state = msg["data"][2];
          relay_state = msg["data"][3];
          inverter_run_state = msg["data"][4];
          inverter_cmd_state = msg["data"][5];
          inverter_enable_state = msg["data"][6];
          direction_state = msg["data"][7];
          break;
  
        case mcErrorAddr:
          post_lo_fault = (msg["data"][1] << 8) + msg["data"][0];
          post_hi_fault = (msg["data"][3] << 8) + msg["data"][2];
          run_lo_fault = (msg["data"][5] << 8) + msg["data"][4];
          run_hi_fault = (msg["data"][7] << 8) + msg["data"][6];
  
          updateFault(run_lo_fault, run_hi_fault, post_lo_fault, post_hi_fault);
          break;
  
        default:
          break;
      }
    });
  
    channel.start();
}
