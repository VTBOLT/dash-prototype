# dash-prototype

Requires `node v8.12.0^`

`npm install` To install dependencies

`npm start` To start the app.

# sc-test (can data)

# sc-test vagrant initialization
Requires `vagrant v2.2.0^`

`vagrant init msku/ruby-canutils` to initialize can utilities
`vagrant up` to create linux virtual machine with vagrant
`vagrant ssh` to ssh into linux virtual machine

# sc-test can setup
In /vagrant dir within linux virtual machine
run `sudo modprobe vcan`
run `Sudo ip link add name vcan0 type vcan` 
run `sudo ip link set up vcan0`

open another command prompt and `vagrant ssh`
run `candump vcan0` in one terminal
run `./can_sim.sh` in the other terminal
The candump terminal should receive data
