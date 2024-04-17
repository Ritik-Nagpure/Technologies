import webbrowser

import pyautogui
import time
import random

width, height = pyautogui.size()
print(width, height)
p = pyautogui.position()
print(p)


# pyautogui.moveTo(600,400, duration = 2)
# pyautogui.displayMousePosition() ==> to get realtime mouse position
# a = random.randrange(50, 1900)  # max ==> 1920
# b = random.randrange(50, 1050)  # max ==> 1080
# print(a)
# print(b)

def getpos():
    a = pyautogui.position()
    print(a)
    pyautogui.displayMousePosition()


def runmouse():
    pyautogui.moveTo(random.randrange(635, 1874), random.randrange(283, 968), duration=1.5)
    # pyautogui.moveTo(random.randrange(635, 1874), random.randrange(283, 968), duration=1.5)
    pyautogui.click()
    time.sleep(2)


def gomouse():
    pyautogui.moveTo(635, 283, duration=1.5)
    time.sleep(1)
    pyautogui.moveTo(635, 968, duration=1)
    time.sleep(1)
    pyautogui.moveTo(1874, 968, duration=1.5)
    time.sleep(1)
    pyautogui.moveTo(1874, 283, duration=1)
    time.sleep(1)

    # pyautogui.click()
    # pyautogui.doubleClick()


def typeinto():
    var = open('text.txt')
    time.sleep(3)
    print('typing....')
    pyautogui.typewrite(var.read(), interval=0.25)
    # pyautogui.typewrite(var.read())
    return 1
    print('Done !')


webbrowser.open(r"C:\Users\RRNAGPUR\Desktop\typebox.html")
while True:
    try:
        a = typeinto()
        # getpos()
        # gomouse() # check mouse work area
    except Exception as e:
        print(e)
