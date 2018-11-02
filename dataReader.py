import time

x = 0
y = 0
while(1):
    print("rpm:", str(x))
    print("soc:", str(y))
    time.sleep(.001)
    x = x + 1
    y = (x/8000) * 100
    if x >= 8000:
        x = 0
