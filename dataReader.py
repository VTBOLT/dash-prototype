import time
import sys
x = 0
y = 0
while(1):
    sys.stdout.write("rpm:"+ str(x)+"\n")
    sys.stdout.write("soc:"+ str(y)+"\n")
    sys.stdout.flush()
    time.sleep(0.001)
    x = x + 1
    y = (x/8000) * 100
    if x >= 8000:
        x = 0
