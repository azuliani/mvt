#!/usr/bin/env python3
import RPi.GPIO as GPIO
import requests
import time

BUTTON_GPIO = 26

cnt = 0
def fire():
    global cnt
    cnt += 1
    print ("Yup!",cnt)
    try:
        requests.get("http://localhost:3000/push")
    except:
        print("Request failed")

if __name__ == '__main__':
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(BUTTON_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    while True:
        time.sleep(0.02)
        GPIO.wait_for_edge(BUTTON_GPIO, GPIO.FALLING, 50)
        if not GPIO.input(BUTTON_GPIO):
            fire()
