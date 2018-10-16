import time

x = 0
y = 0
while(1):
    print("rpm:", str(x))
    print("soc:", str(y))
    time.sleep(0.001)
    x = x + 1
    y = y + 0.001
