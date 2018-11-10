#!/bin/bash

for number in {100..999}
do 
cansend vcan0 123#00000$number
done
