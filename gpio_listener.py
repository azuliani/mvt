import RPi.GPIO as GPIO
import time
import requests

current_milli_time = lambda: int(round(time.time() * 1000))

def my_callback(a):
    print ("yup!",a)
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)
GPIO.setup(26 , GPIO.IN, pull_up_down=GPIO.PUD_UP)

cnt = 0
def fire():
    global cnt
    cnt += 1
    print ("Yup!",cnt)
    try:
        requests.get("http://localhost:3000/push")
    except:
        print("Request failed")

debouncing = False
debounceval = 1
while True:
    val = GPIO.input(26)
    now = current_milli_time()
    if debouncing and now - debouncing >= 20 and val != debounceval:
        debouncing = False
    
    if not debouncing:
        debouncing = now
        debounceval = val
        if val == 0:
            fire()
