#sudo ip link add name vcan0 type vcan
#sudo ip link set up vcan0
#sudo ifconfig can0 up

sudo ip link set can0 type can bitrate 500000
sudo ip link set up can0