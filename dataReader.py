import time
import sys

rpm = 1000
soc = 92.0
counter = 0 # analagous to "temp" on BOLT_3_Dash
motor_temp = 30.0
mc_temp = 98.0
high_motor_temp = 0.0
sys.stdout.write("mctemp:"+ str(mc_temp)+"\n")
sys.stdout.write("motortemp:"+ str(motor_temp)+"\n")
sys.stdout.flush()

while(1):
    time.sleep(0.1)

    # handle outputs    
    if counter > 50:
        soc -= 0.1
        mc_temp += 0.01
        motor_temp += 1.0
        counter = 0  

        # sys.stdout.write("soc:"+ str(soc)+"\n")
        sys.stdout.write("mctemp:"+ str(mc_temp)+"\n")
        sys.stdout.write("motortemp:"+ str(motor_temp)+"\n")
    sys.stdout.write("rpm:"+ str(rpm)+"\n")

    # handle overflows & increment some things
    if rpm >= 8000:
        rpm = 0
    if soc <= 0:
        soc = 99.0
    if motor_temp > 40:
        motor_temp = 10

    rpm += 100
    counter += 1
    sys.stdout.flush()
