#!/bin/bash
sudo modprobe vcan
sudo ip link add name vcan0 type vcan
sudo ip link set up vcan0
for number in {100..999}
do 
cansend vcan0 123#00000$number
done
