#!/bin/bash
sudo modprobe vcan
sudo ip link add name vcan0 type vcan
sudo ip link set up vcan0

# set initital values/constants
rpm=1000
soc=92.0
motortemp=30
mctemp=95

while :
do
    sleep .1

    # rpm overflow
    if [ $rpm -ge 12000 ]; 
    then
        rpm=1000
    fi

    # send rpm value
    if [ $rpm -ge 10000 ];
    then
        cansend vcan0 0a5#000$rpm
    else
        cansend vcan0 0a5#0000$rpm
    fi

    # increment rpm
    ((rpm+=100))

done