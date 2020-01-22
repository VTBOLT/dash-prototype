#!/bin/bash
cd ~/dash-prototype
sudo ip link set can0 type can bitrate 500000
sudo ip link set up can0
can=1 npm start
