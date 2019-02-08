# dash-prototype

Requires `node v8.12.0^`

`npm install` To install dependencies

`npm start` To start the app.
`npm test` To start the app with test data.

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

# fault condition testing
The dash takes keyboard inputs to test different fault conditions.
* Input lowercase 'h' for a __high__ level error.
* Input lowercase 'm' for a __medium__ level error.
* Input lowercase 'l' for a __low__ level error.
* Input lowercase 'n' to revert back to the original screen with __no__ error.
